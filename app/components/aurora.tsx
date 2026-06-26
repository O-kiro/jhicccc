/**
 * Soft, slowly drifting brand-colored light behind a section.
 * Purely decorative; animation is disabled under prefers-reduced-motion.
 */
export function Aurora({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      <span
        className="aurora-blob animate-drift bg-teal"
        style={{ height: "32rem", width: "32rem", left: "-8rem", top: "-10rem" }}
      />
      <span
        className="aurora-blob animate-drift-slow bg-blue"
        style={{ height: "38rem", width: "38rem", right: "-10rem", top: "-6rem" }}
      />
      <span
        className="aurora-blob animate-drift bg-gold"
        style={{ height: "24rem", width: "24rem", left: "38%", bottom: "-10rem", animationDelay: "-8s" }}
      />
    </div>
  );
}
