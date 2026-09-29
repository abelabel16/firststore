import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckList } from "@/components/ui/check-list";
import { Price } from "@/components/ui/price";
import { formatUsd, site } from "@/config/site";
import { courseIncludes, vipIncludes } from "@/content/offer";

/** The course and VIP side by side. */
export function PlanCards({ vipHref }: { vipHref: string }) {
  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
      <Card className="flex flex-col p-6 sm:p-8">
        <p className="text-sm font-medium text-ink-soft">{site.course.name}</p>
        <div className="mt-4">
          <Price
            amount={site.course.price}
            referencePrice={site.course.referencePrice}
            discountLabel={site.course.discountLabel}
          />
          <p className="mt-1 text-xs text-ink-faint">One-time payment. No subscription.</p>
        </div>
        <CheckList items={courseIncludes} className="mt-6 flex-1" />
        <ButtonLink href="/checkout/course" className="mt-8 w-full">
          Get the course
        </ButtonLink>
      </Card>

      {/* A plain dark panel, not <Card>, so Card's base styles can't override it. */}
      <div className="flex flex-col rounded-2xl bg-zinc-900 p-6 text-white shadow-md sm:p-8">
        <p className="text-sm font-medium text-zinc-400">{site.mentorship.name}</p>
        <div className="mt-4">
          <span className="text-3xl font-semibold tracking-tight">
            {formatUsd(site.mentorship.price)}
          </span>
          <p className="mt-1 text-xs text-zinc-400">One-time payment. Course included.</p>
        </div>
        <CheckList items={vipIncludes} dark className="mt-6 flex-1" />
        <ButtonLink href={vipHref} variant="inverse" className="mt-8 w-full">
          Get VIP
        </ButtonLink>
      </div>
    </div>
  );
}
