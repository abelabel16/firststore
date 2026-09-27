import Link from "next/link";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { site } from "@/config/site";

const columns = [
  {
    title: "Product",
    links: [
      { href: "/course", label: "The Course" },
      { href: "/mentorship", label: "VIP Accelerator" },
      { href: "/pricing", label: "Pricing" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/terms", label: "Terms of Service" },
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/refund-policy", label: "Refund Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-surface">
      <Container className="py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="max-w-xs space-y-3">
            <Logo />
            <p className="text-sm leading-relaxed text-ink-soft">
              Practical dropshipping education. Learn the process, test your ideas, and make
              decisions using real data.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-faint">
                {col.title}
              </p>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t border-line pt-6">
          <p className="text-xs leading-relaxed text-ink-faint">
            {site.name} sells education, not outcomes. Building an online store involves real
            costs and real risk, and no income level is typical or guaranteed. See our{" "}
            <Link href="/disclaimer" className="underline hover:text-ink-soft">
              disclaimer
            </Link>
            .
          </p>
          <p className="mt-3 text-xs text-ink-faint">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
