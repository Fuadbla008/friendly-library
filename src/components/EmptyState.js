import { BookOpen } from "lucide-react";

export default function EmptyState({ title, description, action, icon: Icon = BookOpen }) {
  return (
    <div className="surface relative overflow-hidden px-6 py-16 text-center">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-sage-light/60 blur-2xl" />
      <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-2xl border border-line bg-cream text-terracotta">
        <Icon className="h-7 w-7" strokeWidth={1.4} />
      </div>
      <h2 className="relative mt-6 font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
        {title}
      </h2>
      {description ? (
        <p className="relative mx-auto mt-3 max-w-md text-sm leading-7 text-ink/70">
          {description}
        </p>
      ) : null}
      {action ? <div className="relative mt-7">{action}</div> : null}
    </div>
  );
}
