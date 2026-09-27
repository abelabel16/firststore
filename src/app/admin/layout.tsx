"use client";

import { AppHeader, type AppNavLink } from "@/components/app/app-header";
import { RequireAccess } from "@/components/app/require-access";

const links: AppNavLink[] = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/course", label: "Course" },
  { href: "/admin/vip", label: "VIP" },
  { href: "/admin/community", label: "Community" },
  { href: "/admin/support", label: "Support" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin check happens against profiles.is_admin; RLS enforces it on every
  // query regardless of this UI guard.
  return (
    <RequireAccess need="admin">
      {(auth) => (
        <div className="flex min-h-screen flex-col">
          <AppHeader email={auth.session?.user.email ?? ""} links={links} homeHref="/admin" />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
            {children}
          </main>
        </div>
      )}
    </RequireAccess>
  );
}
