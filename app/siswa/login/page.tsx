import { redirect } from "next/navigation";

/**
 * Masuk kini terpusat di /masuk untuk siswa maupun admin. Rute lama tetap
 * dipertahankan agar tautan, bookmark, dan pengalihan lama tidak putus —
 * termasuk parameter `next` / `expired` yang dibawa proxy dan klien API.
 */
export default async function LegacyLoginRedirect({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    }
  }

  const query = params.toString();

  redirect(query ? `/masuk?${query}` : "/masuk");
}
