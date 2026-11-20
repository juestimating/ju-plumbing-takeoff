"use client";

import { useRef, type ReactNode } from "react";
import { Menu, X } from "lucide-react";

/** Mobile menu in a native <dialog>: focus trap, Escape and backdrop come from the platform. */
export function MobileNav({ logo, children }: { logo: ReactNode; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button type="button" className="hamburger" aria-label="Open menu" onClick={() => ref.current?.showModal()}>
        <Menu size={22} aria-hidden="true" />
      </button>
      <dialog
        ref={ref}
        className="mnav"
        aria-label="Site menu"
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("a")) ref.current?.close();
        }}
      >
        <div className="mnav-top">
          {logo}
          <button type="button" className="hamburger" aria-label="Close menu" onClick={() => ref.current?.close()}>
            <X size={22} aria-hidden="true" />
          </button>
        </div>
        <div className="mnav-body">{children}</div>
      </dialog>
    </>
  );
}
