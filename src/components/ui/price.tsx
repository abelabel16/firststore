import { Badge } from "@/components/ui/badge";
import { formatUsd } from "@/config/site";

/**
 * Price display with optional genuine reference price.
 * If `referencePrice` is null, only the current price is shown.
 */
export function Price({
  amount,
  referencePrice,
  discountLabel,
  size = "md",
}: {
  amount: number;
  referencePrice?: number | null;
  discountLabel?: string;
  size?: "md" | "lg";
}) {
  const priceClass =
    size === "lg"
      ? "text-5xl font-semibold tracking-tight"
      : "text-3xl font-semibold tracking-tight";
  return (
    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
      {referencePrice != null && (
        <span className="text-lg text-ink-faint line-through" aria-label={`Original price ${formatUsd(referencePrice)}`}>
          {formatUsd(referencePrice)}
        </span>
      )}
      <span className={`${priceClass} text-ink`}>{formatUsd(amount)}</span>
      {referencePrice != null && discountLabel && <Badge tone="good">{discountLabel}</Badge>}
    </div>
  );
}
