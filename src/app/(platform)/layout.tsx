import { requireEntitlement } from "@/lib/auth";
import { AppHeader, type AppNavLink } from "@/components/app/app-header";

export default async function PlatformLayout({ children }: { children: React.ReactNode }) {
  // Server-side entitlement check for the whole student area.
  const user = await requireEntitlement("course");

  const links: AppNavLink[] = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/resources", label: "Resources" },
    { href: "/profile", label: "Profile" },
    ...(user.entitlements.includes("vip") ? [{ href: "/vip", label: "VIP" }] : []),
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={user} links={links} homeHref="/dashboard" />
      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
