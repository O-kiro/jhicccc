"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Icon } from "./icons";
import { Container, PhotoTile, SectionHeading } from "./ui";
import { Reveal } from "./reveal";
import type { Site } from "@/lib/site";

const tones = ["teal", "blue", "gold"] as const;

/**
 * Isinya dari CMS lewat getSite(); lihat lib/site.ts.
 *
 * Carousel geser mendatar dengan scroll-snap — pola yang sama dipakai slider
 * perpustakaan di portal siswa, jadi tanpa pustaka tambahan. Penjelasan tiap
 * fasilitas disembunyikan sampai kartunya disorot, lalu naik perlahan.
 *
 * Penjelasan itu TIDAK hanya bergantung pada hover: perangkat sentuh tidak
 * punya hover sama sekali, dan pengguna papan ketik tidak akan pernah
 * melihatnya. Jadi di layar kecil teksnya selalu tampil, dan di layar besar
 * ikut muncul saat kartunya menerima fokus.
 */
export function Facilities({ facilities }: { facilities: Site["facilities"] }) {
  const trek = useRef<HTMLUListElement>(null);
  const [diAwal, setDiAwal] = useState(true);
  const [diAkhir, setDiAkhir] = useState(false);

  const periksaPosisi = useCallback(() => {
    const el = trek.current;
    if (!el) return;
    // Toleransi 2px: posisi gulir bisa pecahan, dan perbandingan persis
    // membuat tombol tidak pernah nonaktif di ujung kanan.
    setDiAwal(el.scrollLeft <= 2);
    setDiAkhir(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    periksaPosisi();
    const el = trek.current;
    if (!el) return;
    const ro = new ResizeObserver(periksaPosisi);
    ro.observe(el);
    return () => ro.disconnect();
  }, [periksaPosisi]);

  const geser = (arah: 1 | -1) => {
    const el = trek.current;
    if (!el) return;
    // Sejauh satu kartu plus jaraknya, bukan satu layar penuh: di layar lebar
    // satu layar bisa memuat tiga kartu dan lompatannya terasa melompat.
    const kartu = el.firstElementChild as HTMLElement | null;
    const langkah = kartu ? kartu.offsetWidth + 20 : el.clientWidth * 0.8;
    el.scrollBy({ left: langkah * arah, behavior: "smooth" });
  };

  return (
    <section id="fasilitas" className="scroll-mt-24 bg-surface-2 py-24 sm:py-32">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            accent
            align="left"
            index="07"
            eyebrow="Sarana & Prasarana"
            title="Fasilitas Madrasah"
            desc="Sarana dan prasarana yang mendukung kenyamanan belajar siswa MAKOBA."
          />

          {/* Tombol geser disembunyikan dari pembaca layar: isinya tetap bisa
              dijangkau dengan menggulir atau Tab ke tiap kartu. */}
          <div aria-hidden className="hidden shrink-0 gap-2 sm:flex">
            {([-1, 1] as const).map((arah) => (
              <button
                key={arah}
                type="button"
                tabIndex={-1}
                onClick={() => geser(arah)}
                disabled={arah === -1 ? diAwal : diAkhir}
                className="grid h-11 w-11 place-items-center rounded-full border border-line bg-surface text-ink shadow-card transition-all hover:border-blue hover:text-blue disabled:pointer-events-none disabled:opacity-35"
              >
                <Icon name="arrow" className={`h-5 w-5 ${arah === -1 ? "rotate-180" : ""}`} />
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* Trek keluar dari Container supaya kartu bisa menyentuh tepi layar
          saat digeser, tapi padding kirinya tetap sejajar dengan judul. */}
      <Reveal>
        <ul
          ref={trek}
          onScroll={periksaPosisi}
          aria-label="Fasilitas madrasah"
          className="mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto px-[max(1.25rem,calc((100vw-80rem)/2+1.25rem))] pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {facilities.map((f, i) => (
            <li
              key={f.name}
              className="w-[78vw] shrink-0 snap-start sm:w-[22rem] lg:w-[26rem]"
            >
              <article
                tabIndex={0}
                className="group relative h-80 overflow-hidden rounded-card shadow-card outline-none transition-all duration-200 hover:-translate-y-1.5 hover:shadow-hover focus-visible:ring-2 focus-visible:ring-blue"
              >
                <PhotoTile
                  tone={tones[i % 3]}
                  icon={f.icon}
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                  glyphClassName="h-16 w-16"
                  src={f.image}
                  alt={f.name}
                  sizes="(max-width: 640px) 78vw, (max-width: 1024px) 22rem, 26rem"
                />

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/30 to-transparent"
                />

                <div className="absolute inset-x-0 bottom-0 p-6">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur">
                      <Icon name={f.icon} className="h-6 w-6" />
                    </span>
                    <h3 className="font-display text-xl font-bold text-white">{f.name}</h3>
                  </div>

                  {/* Naik perlahan saat disorot. Di layar kecil (tanpa hover)
                      teksnya langsung tampil, karena kalau tidak, isinya tidak
                      akan pernah terbaca di ponsel. */}
                  <p className="mt-3 text-sm leading-relaxed text-white/85 transition-all duration-300 sm:mt-0 sm:max-h-0 sm:translate-y-3 sm:opacity-0 sm:group-hover:mt-3 sm:group-hover:max-h-32 sm:group-hover:translate-y-0 sm:group-hover:opacity-100 sm:group-focus-within:mt-3 sm:group-focus-within:max-h-32 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100">
                    {f.desc}
                  </p>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
