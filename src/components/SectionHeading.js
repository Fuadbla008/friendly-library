import { cn } from "@/lib/utils";

export default function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  tone = "dark",
  className,
}) {
  const centered = align === "center";
  const light = tone === "light";

  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        centered && "md:flex-col md:items-center md:text-center",
        className
      )}
    >
      <div className={cn("max-w-2xl", centered && "mx-auto")}>
        {eyebrow ? (
          <p className={cn("eyebrow", light && "text-gold")}>
            <span
              className={cn(
                "h-px w-7",
                light ? "bg-gold/70" : "bg-terracotta/60"
              )}
            />
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "mt-4 font-display text-[38px] font-semibold leading-[1.02] tracking-[-0.03em] text-balance sm:text-5xl",
            light ? "text-parchment" : "text-ink"
          )}
        >
          {title}
        </h2>
        {description ? (
          <p
            className={cn(
              "mt-4 max-w-xl text-[15px] leading-7",
              centered && "mx-auto",
              light ? "text-parchment/65" : "text-ink/70"
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
