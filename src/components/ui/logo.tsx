import Link from "next/link";
import { site } from "@/config/site";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link
      href={href}
      className="text-lg font-bold tracking-tight text-ink"
      aria-label={`${site.name} home`}
    >
      {site.name.toLowerCase()}
      <span className="text-accent">.</span>
    </Link>
  );
}
