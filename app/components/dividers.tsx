import { Icon } from "./icons";

/** Eight-point star flanked by hairlines — an on-brand separator between sections. */
export function StarDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`mx-auto flex max-w-3xl items-center gap-5 px-5 sm:px-8 ${className}`}
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-line" />
      <Icon name="star8" className="h-5 w-5 shrink-0 text-gold" strokeWidth={1.4} />
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-line" />
    </div>
  );
}
