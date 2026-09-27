"use client";

import { AppHeader, type AppNavLink } from "@/components/app/app-header";
import { RequireAccess } from "@/components/app/require-access";

const links: AppNavLink[] = [
  { href: "/vip", label: "VIP Home" },
  { href: "/vip/book", label: "Book" },
  { href: "/vip/support", label: "Support" },
  { href: "/vip/community", label: "Community" },
  { href: "/vip/resources", label: "Resources" },
  { href: "/dashboard", label: "Course" },
  { href: "/vip/profile", label: "Profile" },
];

export default function VipLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAccess need="vip">
      {(auth) => (
        <div className="flex min-h-screen flex-col">
          <AppHeader email={auth.session?.user.email ?? ""} links={links} homeHref="/vip" />
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
        </div>
      )}
    </RequireAccess>
  );
}
