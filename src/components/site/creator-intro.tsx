import Link from "next/link";
import { creator } from "@/content/creator";

/** "Meet Vibrant Flacon": the short version links to the full story on /about. */
export function CreatorIntro({ variant }: { variant: "short" | "full" }) {
  const paragraphs = variant === "full" ? creator.story : [creator.short];
  return (
    <div className="mx-auto max-w-2xl">
      <div className="space-y-4 text-base leading-relaxed text-ink-soft sm:text-lg">
        {paragraphs.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>
      <p className="mt-5 text-base font-semibold text-ink">{creator.name}</p>
      {variant === "short" && (
        <Link
          href="/about"
          className="mt-3 inline-block text-sm font-medium text-accent hover:text-accent-strong"
        >
          Read my story
        </Link>
      )}
    </div>
  );
}
