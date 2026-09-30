import Image from "next/image";
import { cn } from "@/lib/styles";

/**
 * Foto profil guru (unggahan admin, /storage/...) atau inisial nama bila
 * fotonya belum ada. Dipakai kartu modul dan catatan guru portal siswa.
 */
export function Avatar({
  name,
  photo,
  className = "h-10 w-10 text-sm",
}: {
  name: string;
  photo: string | null;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-primary font-display font-extrabold text-white",
        className,
      )}
    >
      {photo ? (
        <Image src={photo} alt={name} fill sizes="48px" className="object-cover" />
      ) : (
        // Lewati gelar di depan nama ("Dra.", "Ust.") supaya inisialnya bermakna.
        name.replace(/^((Dra?|Drs|Ust|Ustadzah|H|Hj|Prof|Ir)\.?\s+)+/i, "").charAt(0).toUpperCase()
      )}
    </span>
  );
}
