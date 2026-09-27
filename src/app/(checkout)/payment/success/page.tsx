import type { Metadata } from "next";
import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";
import { SuccessContent } from "./success-content";

export const metadata: Metadata = { title: "Payment Successful" };

export default function PaymentSuccessPage() {
  return (
    <Narrow className="max-w-md py-12 sm:py-20">
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-good-soft" aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M4 12l5 5 9-11" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <Suspense fallback={null}>
          <SuccessContent />
        </Suspense>
      </Card>
    </Narrow>
  );
}
