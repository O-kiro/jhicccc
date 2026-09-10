import type { IconName } from "@/lib/content";
import type { ReactNode } from "react";

const paths: Record<IconName, ReactNode> = {
  ppdb: <><path d="M16 18a4 4 0 0 0-8 0" /><circle cx="12" cy="9" r="3" /><path d="M19 8v4M21 10h-4" /></>,
  rdm: <><rect x="5" y="4" width="14" height="17" rx="2" /><path d="M9 3h6v3H9zM8 11h8M8 15h6" /></>,
  cbt: <><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></>,
  elearning: <><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M10 8.5l4 2-4 2zM2 21h20" /></>,
  library: <><path d="M5 4h5v16H5zM10 4h5l1 16h-5z" /><path d="M16 6l3 .5-2 14-3-.5" /></>,
  attendance: <><path d="M9 11l2 2 4-4" /><rect x="4" y="4" width="16" height="16" rx="3" /></>,
  ppid: <><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></>,
  ebook: <><path d="M12 6c-1.5-1-4-1.6-6-1.6V18c2 0 4.5.6 6 1.6 1.5-1 4-1.6 6-1.6V4.4c-2 0-4.5.6-6 1.6zM12 6v13.6" /></>,
  research: <><path d="M9 3h6M10 3v6l-4.5 8a2 2 0 0 0 1.8 3h9.4a2 2 0 0 0 1.8-3L14 9V3" /><path d="M7.5 15h9" /></>,
  olympiad: <><circle cx="12" cy="9" r="5" /><path d="M9 13l-2 8 5-3 5 3-2-8" /></>,
  tahfidz: <><path d="M5 5a2 2 0 0 1 2-2h12v16H7a2 2 0 0 0-2 2z" /><path d="M12 7v4M10 9h4" /></>,
  trophy: <><path d="M7 4h10v5a5 5 0 0 1-10 0zM7 6H4v1a3 3 0 0 0 3 3M17 6h3v1a3 3 0 0 1-3 3M9 19h6M12 14v5" /></>,
  calendar: <><rect x="4" y="5" width="16" height="16" rx="2" /><path d="M4 9h16M8 3v4M16 3v4" /></>,
  sparkle: <><path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM18 16l.7 2 .3-2zM5 17l.6 1.8z" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4 12H2M22 12h-2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19" /></>,
  moon: <><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" /></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
  close: <><path d="M6 6l12 12M18 6 6 18" /></>,
  arrow: <><path d="M5 12h14M13 6l6 6-6 6" /></>,
  chevron: <><path d="m6 9 6 6 6-6" /></>,
  pin: <><path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" /><circle cx="12" cy="10" r="2.5" /></>,
  phone: <><path d="M5 4h3l2 5-2 1a11 11 0 0 0 5 5l1-2 5 2v3a2 2 0 0 1-2 2 16 16 0 0 1-16-16 2 2 0 0 1 2-2z" /></>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  quote: <><path d="M7 7h4v6a4 4 0 0 1-4 4M13 7h4v6a4 4 0 0 1-4 4" /></>,
  star8: <><rect x="6" y="6" width="12" height="12" rx="1" /><rect x="6" y="6" width="12" height="12" rx="1" transform="rotate(45 12 12)" /></>,
  instagram: <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.5" /><path d="M17 7h.01" /></>,
  youtube: <><rect x="3" y="6" width="18" height="12" rx="4" /><path d="m11 9.5 4 2.5-4 2.5z" /></>,
  facebook: <><path d="M14 8h2V5h-2a3 3 0 0 0-3 3v2H9v3h2v6h3v-6h2.2l.8-3H14V8.5a.5.5 0 0 1 .5-.5z" /></>,
  tiktok: <><path d="M14 4v9a3.5 3.5 0 1 1-3-3.46M14 4a4 4 0 0 0 4 4" /></>,
  whatsapp: <><path d="M4 20l1.4-4A8 8 0 1 1 9 19.6zM9 9c0 4 2 6 6 6 .8 0 1-1 .5-1.6l-1.6-.8-1 .9c-1-.4-1.8-1.2-2.2-2.2l.9-1-.8-1.6C9.9 7.7 9 8 9 9z" /></>,
  external: <><path d="M14 5h5v5M19 5l-8 8M12 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-6" /></>,
  shield: <><path d="M12 3l8 3v5c0 5-3.5 8-8 10-4.5-2-8-5-8-10V6z" /><path d="m9 12 2 2 4-4" /></>,
  users: <><circle cx="9" cy="8" r="3.2" /><path d="M3.5 19a5.5 5.5 0 0 1 11 0M16 6a3 3 0 0 1 0 5.6M17 19a5 5 0 0 0-2-3.4" /></>,
  book: <><path d="M5 4h11a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2zM18 18H7a2 2 0 0 0-2 2" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" /></>,
  heart: <><path d="M12 20s-7-4.5-7-9.5A4 4 0 0 1 12 7a4 4 0 0 1 7 3.5C19 15.5 12 20 12 20z" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="m10 9 5 3-5 3z" /></>,
  check: <><path d="m5 12 4 4L19 6" /></>,
  flask: <><path d="M9 3h6M10 3v5l-4 9a2 2 0 0 0 1.8 3h8.4a2 2 0 0 0 1.8-3l-4-9V3" /><path d="M7.5 14h9" /></>,
  palette: <><path d="M12 3a9 9 0 1 0 0 18c1.5 0 2-1 2-2s-1-1.5-1-2.5 1-1.5 2-1.5h1a3 3 0 0 0 3-3c0-3.9-3.1-7-7-7z" /><circle cx="8" cy="11" r="1" /><circle cx="12" cy="8" r="1" /><circle cx="16" cy="11" r="1" /></>,
  ball: <><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M6 6c3 2 9 2 12 0M6 18c3-2 9-2 12 0" /></>,
  mic: <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M5 11a7 7 0 0 0 14 0M12 18v3" /></>,
  leaf: <><path d="M4 20C4 11 11 4 20 4c0 9-7 16-16 16zM4 20c4-7 8-9 12-11" /></>,
  camera: <><rect x="3" y="7" width="18" height="13" rx="2" /><path d="M8 7l1.5-3h5L16 7" /><circle cx="12" cy="13" r="3.2" /></>,

  /* Portal siswa */
  flame: <><path d="M12 3c.5 3-2 4-2 6a2 2 0 0 0 4 0c0-.8-.3-1.4-.3-1.4C15.6 9 17 11 17 13.5a5 5 0 0 1-10 0C7 10 10 8 12 3z" /></>,
  bell: <><path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z" /><path d="M10 18a2 2 0 0 0 4 0" /></>,
  download: <><path d="M12 4v10M8 11l4 4 4-4" /><path d="M5 18h14" /></>,
  chat: <><path d="M20 12a7 7 0 0 1-7 7H8l-4 3v-4.6A7 7 0 0 1 4 12a7 7 0 0 1 7-7h2a7 7 0 0 1 7 7z" /></>,
  logout: <><path d="M14 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 8l-4 4 4 4M6 12h9" /></>,
  help: <><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.2 2.4c-.5.2-.7.6-.7 1.1v.5M12 16.5h.01" /></>,
  flag: <><path d="M6 21V4M6 4h11l-2 3.5L17 11H6" /></>,
  chart: <><path d="M4 20V6M4 20h16" /><path d="m7 15 3.5-4 3 2.5L20 8" /></>,
  wifi: <><path d="M4 9a13 13 0 0 1 16 0M7 12.5a8 8 0 0 1 10 0M10 16a3.5 3.5 0 0 1 4 0M12 19.5h.01" /></>,
  grid: <><rect x="4" y="4" width="7" height="7" rx="1.5" /><rect x="13" y="4" width="7" height="7" rx="1.5" /><rect x="4" y="13" width="7" height="7" rx="1.5" /><rect x="13" y="13" width="7" height="7" rx="1.5" /></>,
  plus: <><path d="M12 5v14M5 12h14" /></>,
  eye: <><path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6z" /><circle cx="12" cy="12" r="2.8" /></>,
  bookmark: <><path d="M7 4h10a1 1 0 0 1 1 1v15l-6-4-6 4V5a1 1 0 0 1 1-1z" /></>,
  sigma: <><path d="M17 5H7l5 7-5 7h10" /></>,
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.6,
}: {
  name: IconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
