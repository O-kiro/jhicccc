import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/api";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

/**
 * Mencabut token di Laravel lalu menghapus cookie. Kegagalan mencabut di sisi
 * server tidak boleh menahan pengguna keluar — cookie tetap dihapus.
 */
export async function POST() {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;

  if (token) {
    await fetch(`${API_URL}/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
  }

  store.delete(TOKEN_COOKIE);

  return NextResponse.json({ message: "Berhasil keluar." });
}
