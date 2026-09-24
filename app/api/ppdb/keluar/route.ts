import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ROLE_COOKIE, TOKEN_COOKIE } from "@/lib/api";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

/** Mencabut token PPDB lalu menghapus cookie-nya. */
export async function POST() {
  const store = await cookies();
  const token = store.get(TOKEN_COOKIE)?.value;

  if (token) {
    await fetch(`${API_URL}/ppdb/logout`, {
      method: "POST",
      headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
      cache: "no-store",
    }).catch(() => null);
  }

  store.delete(TOKEN_COOKIE);
  store.delete(ROLE_COOKIE);

  return NextResponse.json({ message: "Berhasil keluar." });
}
