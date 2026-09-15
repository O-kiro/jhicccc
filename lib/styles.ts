/**
 * Helper kelas yang aman dipakai server & client component.
 * Dipisah dari app/components/ui.tsx karena file itu "use client" —
 * fungsi yang diekspor dari sana tidak bisa dipanggil saat render server.
 */

export const cn = (...c: (string | false | undefined | null)[]) =>
  c.filter(Boolean).join(" ");

export type Tone = "teal" | "blue" | "gold";

export const toneText: Record<Tone, string> = {
  teal: "text-teal",
  blue: "text-blue",
  gold: "text-gold-strong",
};

export const toneSoft: Record<Tone, string> = {
  teal: "bg-teal-soft text-teal",
  blue: "bg-blue-soft text-blue",
  gold: "bg-gold-soft text-gold-strong",
};

export const toneBar: Record<Tone, string> = {
  teal: "bg-teal",
  blue: "bg-blue",
  gold: "bg-gold",
};
