export function SectionHeading({
  title,
  description,
  align = "center",
}: {
  title: string;
  description?: string;
  align?: "center" | "left";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "text-left";
  return (
    <div className={`max-w-2xl ${alignment} mb-10 sm:mb-14`}>
      <h2 className="text-2xl font-semibold tracking-tight text-ink sm:text-4xl text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">{description}</p>
      )}
    </div>
  );
}
