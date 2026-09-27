"use client";

import { AppHeader, type AppNavLink } from "@/components/app/app-header";
import { RequireAccess } from "@/components/app/require-access";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAccess need="course">
      {(auth) => {
        const links: AppNavLink[] = [
          { href: "/dashboard", label: "Dashboard" },
          { href: "/resources", label: "Resources" },
          { href: "/profile", label: "Profile" },
          ...(auth.entitlements.includes("vip") ? [{ href: "/vip", label: "VIP" }] : []),
        ];
        return (
          <div className="flex min-h-screen flex-col">
            <AppHeader
              email={auth.session?.user.email ?? ""}
              links={links}
              homeHref="/dashboard"
            />
            <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
              {children}
            </main>
          </div>
        );
      }}
    </RequireAccess>
  );
}
