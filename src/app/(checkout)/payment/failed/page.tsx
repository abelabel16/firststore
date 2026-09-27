import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Narrow } from "@/components/ui/container";

export const metadata: Metadata = { title: "Payment Failed" };

export default function PaymentFailedPage() {
  return (
    <Narrow className="max-w-md py-12 sm:py-20">
      <Card className="p-8 text-center">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft" aria-hidden="true">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight text-ink">
          Your payment wasn&rsquo;t completed.
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          No money was taken. This usually happens when a payment is cancelled or declined — you
          can safely try again.
        </p>
        <div className="mt-7 space-y-3">
          <ButtonLink href="/checkout/course" size="lg" className="w-full">
            Try Again
          </ButtonLink>
          <ButtonLink href="/contact" variant="secondary" className="w-full">
            Contact Support
          </ButtonLink>
        </div>
      </Card>
    </Narrow>
  );
}
