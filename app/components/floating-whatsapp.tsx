import { Icon } from "./icons";
import { school } from "@/lib/content";

/** wa.me hanya menerima angka: "+62 851-…" → "62851…". */
export const whatsappNumber = school.whatsapp.replace(/\D/g, "");

/**
 * Tombol WhatsApp melayang di pojok kanan bawah (Figma). Di ponsel duduk di
 * atas bilah PPDB (StickyCta); BackToTop menumpuk di atasnya lagi.
 */
export function FloatingWhatsapp() {
  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi kami lewat WhatsApp"
      title="Hubungi kami lewat WhatsApp"
      className="fixed bottom-20 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-overlay transition-transform hover:-translate-y-0.5 lg:bottom-6 lg:right-6"
    >
      <Icon name="whatsapp" className="h-7 w-7" strokeWidth={1.8} />
    </a>
  );
}
