"use client";

import { useEffect, useRef, useState, type FocusEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import s from "./nav-menu.module.css";

type Item = { id: string; label: string; href?: string; panel?: ReactNode };

/**
 * Desktop navigation. Panels are rendered on the server (links stay in the HTML for crawlers);
 * this island only handles open/close: hover (mouse), click/tap, Escape, outside-click and focus leaving a panel,
 * plus the "you are here" state. Nav labels are never headings.
 */
export function NavMenu({ items }: { items: Item[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const pathname = usePathname();
  const root = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const byHover = useRef(false); // true while the open panel was opened by hovering

  // "You are here" for the two menus: the menu link to this exact page gets aria-current, and the trigger of the menu
  // that holds it (the hub and its child pages) gets the active pill. The panels are server-rendered, so their links
  // are read after mount. Only the menu's own links count (.mega-link, .mega-all), not its quote button.
  useEffect(() => {
    root.current?.querySelectorAll<HTMLElement>(".mega").forEach((panel) => {
      let here = false;
      panel.querySelectorAll(".mega-link, .mega-all").forEach((a) => {
        const exact = a.getAttribute("href") === pathname;
        if (exact) a.setAttribute("aria-current", "page");
        else a.removeAttribute("aria-current");
        here ||= exact;
      });
      root.current?.querySelector(`[aria-controls="${panel.id}"]`)?.toggleAttribute("data-active", here);
    });
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Escape inside a panel hands focus back to its button instead of dropping it on <body>.
      if (root.current?.contains(document.activeElement)) {
        root.current.querySelector<HTMLElement>(`[aria-controls="mega-${open}"]`)?.focus();
      }
      setOpen(null);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const show = (id: string) => {
    if (timer.current) clearTimeout(timer.current);
    byHover.current = true;
    setOpen(id);
  };
  const hideSoon = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      byHover.current = false;
      setOpen(null);
    }, 160);
  };
  // Tabbing out of an open panel (or back past its button) closes it, so it cannot sit on top of the page content that gets focus next.
  // A null relatedTarget is a click on plain text or the window losing focus: leave the panel as it is.
  const closeOnFocusLeave = (id: string) => (e: FocusEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (next && !e.currentTarget.contains(next)) setOpen((cur) => (cur === id ? null : cur));
  };

  return (
    <nav ref={root} className={`nav ${s.nav}`} aria-label="Primary">
      {items.map((it) =>
        it.panel ? (
          <div
            key={it.id}
            onPointerEnter={(e) => e.pointerType === "mouse" && show(it.id)}
            onPointerLeave={(e) => e.pointerType === "mouse" && hideSoon()}
            onBlur={closeOnFocusLeave(it.id)}
          >
            <button
              type="button"
              className="nav-btn"
              aria-expanded={open === it.id}
              aria-controls={`mega-${it.id}`}
              onClick={() => {
                // After a hover the click keeps the panel open; keyboard and touch still toggle.
                const hovered = byHover.current;
                byHover.current = false;
                setOpen(open === it.id && !hovered ? null : it.id);
              }}
            >
              {it.label}
              <ChevronDown size={16} aria-hidden="true" />
            </button>
            <div
              id={`mega-${it.id}`}
              className="mega"
              hidden={open !== it.id}
              onClick={(e) => (e.target as HTMLElement).closest("a") && setOpen(null)}
            >
              <div className="container-ju">{it.panel}</div>
            </div>
          </div>
        ) : (
          <Link key={it.id} href={it.href!} className="nav-link" aria-current={pathname === it.href ? "page" : undefined}>
            {it.label}
          </Link>
        ),
      )}
    </nav>
  );
}
