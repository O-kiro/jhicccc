import { Icon } from "./icons";

const pillars = [
  "Madrasah Penyelenggara Riset",
  "Kelas Riset",
  "Kelas Olimpiade",
  "Kelas Tahfidz",
  "Zona Integritas WBK / WBBM",
  "Berprestasi Nasional & Internasional",
  "Berilmu · Berakhlak · Berprestasi",
];

/** Bold tri-color ribbon of school pillars that scrolls continuously.
 *  One track holds two identical copies; translating it -50% loops seamlessly. */
export function Marquee() {
  return (
    <div className="bg-warm-gradient relative overflow-hidden py-3.5 text-white">
      <div className="marquee-mask flex">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
              {pillars.map((p) => (
                <span key={p} className="flex items-center">
                  <span className="whitespace-nowrap px-7 text-base font-semibold tracking-tight [text-shadow:0_1px_2px_rgb(0_0_0/0.18)] sm:text-lg">
                    {p}
                  </span>
                  <Icon name="star8" className="h-4 w-4 shrink-0 text-white/80" strokeWidth={1.6} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
