import Image from "next/image";
import { Container } from "./ui";
import { Reveal } from "./reveal";
import type { Site } from "@/lib/site";

/**
 * Logo mitra dan pendukung, berjalan mendatar tanpa henti.
 *
 * Isinya dari CMS lewat getSite(). Seksinya menghilang sepenuhnya bila belum
 * ada mitra yang aktif — lebih baik tidak ada daripada pita kosong.
 *
 * Memakai kelas marquee yang sama dengan pita teks di bawah hero, jadi tanpa
 * pustaka carousel: daftar logonya digandakan dua kali supaya sambungannya
 * tidak terlihat saat animasi mengulang. Salinan kedua disembunyikan dari
 * pembaca layar agar nama mitra tidak dibacakan dua kali.
 */
export function Sponsors({ sponsors }: { sponsors: Site["sponsors"] }) {
  if (sponsors.length === 0) return null;

  return (
    <section aria-labelledby="mitra-judul" className="border-y border-line bg-surface py-14">
      <Container>
        <Reveal>
          <h2
            id="mitra-judul"
            className="text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted"
          >
            Didukung oleh
          </h2>
        </Reveal>
      </Container>

      <div className="marquee-mask mt-9 flex">
        {[0, 1].map((salinan) => (
          <ul
            key={salinan}
            aria-hidden={salinan === 1 || undefined}
            className="marquee-track flex shrink-0 items-center gap-14 pr-14"
          >
            {sponsors.map((m) => (
              <li key={`${salinan}-${m.name}`} className="shrink-0">
                <Logo mitra={m} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
}

function Logo({ mitra }: { mitra: Site["sponsors"][number] }) {
  const gambar = mitra.logo ? (
    <Image
      src={mitra.logo}
      alt={mitra.name}
      width={160}
      height={56}
      // Tinggi dikunci, lebar menyesuaikan: logo mitra rasionya bermacam-macam
      // dan menyamakan lebarnya membuat yang ramping tampak raksasa.
      className="h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-12"
      sizes="160px"
    />
  ) : (
    // Belum ada berkas logo — namanya tetap tampil supaya mitranya tidak hilang
    // begitu saja dari daftar.
    <span className="font-display text-lg font-bold text-muted">{mitra.name}</span>
  );

  if (!mitra.url) return gambar;

  return (
    <a href={mitra.url} target="_blank" rel="noopener noreferrer" className="block">
      {gambar}
    </a>
  );
}
