import { ButtonLink } from "@/components/ui/button";
import { Price } from "@/components/ui/price";
import { site } from "@/config/site";

/** Course price, the buy button, and the one line a buyer needs before paying. */
export function BuyBlock({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <div>
      <Price
        amount={site.course.price}
        referencePrice={site.course.referencePrice}
        discountLabel={site.course.discountLabel}
        size={size}
      />
      <ButtonLink href="/checkout/course" size="lg" className="mt-5 w-full sm:w-auto">
        Get the course
      </ButtonLink>
      <p className="mt-3 text-sm text-ink-soft">
        One-time payment. Delivered to your email within 24 hours. 14-day refund.
      </p>
    </div>
  );
}
