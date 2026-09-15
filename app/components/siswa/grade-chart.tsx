export type GradePoint = { month: string; score: number };

const W = 620;
const H = 220;
const PAD = { top: 18, right: 14, bottom: 30, left: 34 };
const MIN = 70;
const MAX = 100;

const y = (score: number) =>
  PAD.top + ((MAX - score) / (MAX - MIN)) * (H - PAD.top - PAD.bottom);

/** Grafik garis nilai bulanan. SVG inline — mewarisi warna tema lewat CSS vars. */
export function GradeChart({ data }: { data: GradePoint[] }) {
  if (data.length === 0) {
    return (
      <p className="py-10 text-center text-sm text-muted">
        Belum ada nilai yang tercatat untuk periode ini.
      </p>
    );
  }

  const x = (i: number) =>
    PAD.left + (i * (W - PAD.left - PAD.right)) / Math.max(1, data.length - 1);

  const line = data.map((d, i) => `${i === 0 ? "M" : "L"}${x(i)},${y(d.score)}`).join(" ");
  const area = `${line} L${x(data.length - 1)},${H - PAD.bottom} L${x(0)},${H - PAD.bottom} Z`;
  const ticks = [70, 80, 90, 100];

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={`Sejarah nilai bulanan: ${data.map((d) => `${d.month} ${d.score}`).join(", ")}`}
      >
        <defs>
          <linearGradient id="grade-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--blue)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--blue)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line
              x1={PAD.left}
              x2={W - PAD.right}
              y1={y(t)}
              y2={y(t)}
              stroke="var(--line)"
              strokeWidth="1"
            />
            <text x={0} y={y(t) + 4} fill="var(--muted)" fontSize="11" fontWeight="600">
              {t}
            </text>
          </g>
        ))}

        <path d={area} fill="url(#grade-fill)" />
        <path
          d={line}
          fill="none"
          stroke="var(--blue)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {data.map((d, i) => (
          <g key={d.month}>
            <circle cx={x(i)} cy={y(d.score)} r="4.5" fill="var(--surface)" stroke="var(--blue)" strokeWidth="2.5" />
            <text
              x={x(i)}
              y={H - PAD.bottom + 20}
              textAnchor="middle"
              fill="var(--muted)"
              fontSize="11"
              fontWeight="600"
            >
              {d.month}
            </text>
          </g>
        ))}
      </svg>
    </figure>
  );
}
