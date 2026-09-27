import type { SupabaseClient } from "npm:@supabase/supabase-js@2";

/** Grant the entitlements for a paid product (VIP includes the course). */
export async function grantEntitlements(
  admin: SupabaseClient,
  email: string,
  product: "course" | "vip"
): Promise<void> {
  const rows =
    product === "vip"
      ? [
          { email, product: "vip" },
          { email, product: "course" },
        ]
      : [{ email, product: "course" }];
  await admin.from("entitlements").upsert(rows, { onConflict: "email,product" });
  if (product === "vip") {
    // If the buyer already has a profile (logged in before), switch on
    // community access; otherwise the admin grants it after first login.
    await admin.from("profiles").update({ community_access: true }).eq("email", email);
  }
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
