import s from "./notfound.module.css";

/**
 * The 404 creative on drafting paper: a pipe run that ends in a test cap, tagged "404" like a fixture on a plan, and a
 * dashed re-route branching off before the cap toward the pages below. Decorative (the page text says it all); the
 * re-route draws in once, and is simply there under reduced motion.
 */
export function BrokenRun() {
  return (
    <div className={s.art} aria-hidden="true">
      <svg viewBox="0 0 480 300" fill="none" strokeLinecap="round" strokeLinejoin="round" focusable="false">
        <defs>
          <mask id="nf-route" maskUnits="userSpaceOnUse">
            <path className={s.reveal} d="M240 112C240 192 300 236 404 236" stroke="#fff" strokeWidth="12" pathLength={1} />
          </mask>
        </defs>
        {/* starts far left of the sheet, so on a wide card the run still comes in from the card's edge */}
        <path d="M-1200 112H292" stroke="#1f1b50" strokeWidth="7" strokeLinecap="butt" />
        <g fill="#fff" stroke="#1f1b50" strokeWidth="3">
          <circle cx="96" cy="112" r="8" />
          <circle cx="176" cy="112" r="8" />
        </g>
        <rect x="290" y="96" width="14" height="32" rx="4" fill="#1f1b50" />
        <path d="M297 78V94" stroke="#1f1b50" strokeWidth="1.5" />
        <circle cx="297" cy="50" r="28" fill="#fff" stroke="#f5b400" strokeWidth="2.5" />
        <text x="297" y="56" textAnchor="middle" className={s.tag}>
          404
        </text>
        <circle cx="240" cy="112" r="6" fill="#f5b400" />
        <path d="M240 112C240 192 300 236 404 236" stroke="#f5b400" strokeWidth="4" strokeDasharray="10 9" mask="url(#nf-route)" />
        <path className={s.head} d="M392 224L408 236L392 248" stroke="#f5b400" strokeWidth="4" />
      </svg>
    </div>
  );
}
