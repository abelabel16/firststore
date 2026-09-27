"use client";

import { useSearchParams } from "next/navigation";

export function SentToEmail() {
  const email = useSearchParams().get("email");
  return email ? <strong className="text-ink">{email}</strong> : <span>your email</span>;
}
