"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PageSkeleton } from "@/components/ui/skeleton";
import { useAuth, type AuthState } from "@/lib/use-auth";
import type { Product } from "@/lib/types";

/**
 * Client-side access guard for the logged-in areas.
 *
 * UI convenience only: it redirects visitors who shouldn't be here. The real
 * enforcement is Supabase Row Level Security, without the right entitlement
 * the database returns nothing, whatever the browser does.
 */
export function RequireAccess({
  need,
  children,
}: {
  need: Product | "admin";
  children: (auth: AuthState) => React.ReactNode;
}) {
  const auth = useAuth();
  const router = useRouter();

  const allowed =
    need === "admin" ? Boolean(auth.profile?.is_admin) : auth.entitlements.includes(need);

  useEffect(() => {
    if (auth.loading || !auth.configured) return;
    if (!auth.session) {
      router.replace("/login/");
    } else if (!allowed) {
      router.replace(need === "vip" ? "/mentorship/" : need === "admin" ? "/" : "/course/");
    }
  }, [auth.loading, auth.configured, auth.session, allowed, need, router]);

  if (!auth.configured) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-line bg-surface p-8 text-center">
        <p className="text-sm font-semibold text-ink">Backend not connected yet</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          This deployment has no Supabase project configured, so login and customer areas are
          inactive. Set <code className="rounded bg-paper px-1 text-xs">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
          and <code className="rounded bg-paper px-1 text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
          and redeploy.
        </p>
      </div>
    );
  }

  if (auth.loading || !auth.session || !allowed) return <PageSkeleton />;
  return <>{children(auth)}</>;
}
