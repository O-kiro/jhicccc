import { Icon } from "@/app/components/icons";
import { school } from "@/lib/content";

/**
 * Kaki halaman portal (siswa dan alumni): hak cipta dan lencana Zona
 * Integritas. `centang` menambah ✓ di depan lencana pertama (desain alumni).
 */
export function PortalFooter({ centang = false }: { centang?: boolean }) {
  return (
    <footer className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-6 text-xs text-muted sm:flex-row">
      <p>© 2026 {school.longName}. Hak cipta dilindungi.</p>
      <ul className="flex items-center gap-2" aria-label="Status madrasah">
        {["ZONA INTEGRITAS", "WBK", "WBBM"].map((b, i) => (
          <li
            key={b}
            className="inline-flex items-center gap-1 rounded-md border border-line bg-surface px-2.5 py-1 text-[11px] font-bold tracking-wide text-ink"
          >
            {centang && i === 0 && <Icon name="check" className="h-3 w-3 text-primary" strokeWidth={2.4} />}
            {b}
          </li>
        ))}
      </ul>
    </footer>
  );
}
