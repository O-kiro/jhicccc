import { Icon } from "./icons";
import { school } from "@/lib/content";

/**
 * Nomor untuk wa.me, yang hanya menerima angka berkode negara:
 * "0812-3456-7890" / "+62 812…" → "62812…". Admin di CMS biasanya menulis
 * nomor lokal berawalan 0, jadi itu diubah ke 62.
 */
export function nomorWhatsapp(mentah: string | undefined): string {
  const angka = (mentah || school.whatsapp).replace(/\D/g, "");
  return angka.startsWith("0") ? `62${angka.slice(1)}` : angka;
}

/**
 * Tombol WhatsApp melayang di pojok kanan bawah untuk chat admin. Nomornya
 * dari CMS (Profil & Sambutan). Di ponsel duduk di atas bilah PPDB
 * (StickyCta); BackToTop menumpuk di atasnya lagi.
 */
export function FloatingWhatsapp({ nomor }: { nomor: string }) {
  if (!nomor) return null;

  return (
    <a
      href={`https://wa.me/${nomor}?text=${encodeURIComponent("Assalamu'alaikum, saya ingin bertanya tentang MAN Kota Batu.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat admin lewat WhatsApp"
      title="Chat admin lewat WhatsApp"
      className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-overlay transition-transform hover:-translate-y-0.5 lg:bottom-6 lg:right-6"
    >
      <Icon name="whatsapp" className="h-7 w-7" strokeWidth={1.8} />
    </a>
  );
}
