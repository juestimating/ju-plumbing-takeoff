import Link from "next/link";
import Image from "next/image";

/** JU Estimating mark + "Plumbing Takeoff" wordmark. The link's accessible name comes from the visible text. */
export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="logo" style={light ? { color: "#fff" } : undefined}>
      <Image
        src={light ? "/logo-light.png" : "/logo.png"}
        alt="JU Estimating"
        width={1791}
        height={1180}
        priority={!light}
        sizes="66px"
      />
      <span className="logo-sep" aria-hidden="true" style={light ? { background: "rgb(255 255 255 / 0.25)" } : undefined} />
      <span className="logo-word">
        Plumbing
        <small style={light ? { color: "var(--color-onnavy-mut)" } : undefined}>Takeoff</small>
      </span>
    </Link>
  );
}
