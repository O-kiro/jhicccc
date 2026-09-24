/**
 * Penerus permintaan tulis dari browser ke Laravel.
 *
 * Diperlukan karena token disimpan di cookie httpOnly: komponen klien tidak
 * bisa membacanya, jadi permintaan harus lewat server Next.js yang menyisipkan
 * header Authorization. Validasi tetap tugas Laravel — di sini badan
 * permintaan diteruskan apa adanya.
 */

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/api";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

export async function proxyPost(path: string, body: unknown): Promise<NextResponse> {
  return proxySend("POST", path, body);
}

/** Sama dengan proxyPost untuk metode lain (DELETE, PUT). */
export async function proxySend(
  method: "POST" | "PUT" | "DELETE",
  path: string,
  body?: unknown,
): Promise<NextResponse> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Sesi sudah berakhir." }, { status: 401 });
  }

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: method === "DELETE" ? undefined : JSON.stringify(body ?? {}),
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return NextResponse.json({ message: "Server tidak dapat dihubungi." }, { status: 502 });
  }

  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}

/**
 * Penerus unggahan berkas. Berbeda dari proxyPost: badan permintaan diteruskan
 * sebagai FormData, dan Content-Type sengaja tidak disetel — fetch yang
 * menuliskannya lengkap dengan boundary multipart.
 */
export async function proxyUpload(path: string, request: Request): Promise<NextResponse> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.json({ message: "Sesi sudah berakhir." }, { status: 401 });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ message: "Berkas tidak terbaca." }, { status: 400 });
  }

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { Accept: "application/json", Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  }).catch(() => null);

  if (!res) {
    return NextResponse.json({ message: "Server tidak dapat dihubungi." }, { status: 502 });
  }

  // 413 datang dari batas unggahan PHP, bukan dari validasi Laravel, jadi
  // badannya bukan JSON dan pesannya perlu dibuat sendiri.
  if (res.status === 413) {
    return NextResponse.json({ message: "Berkas terlalu besar." }, { status: 413 });
  }

  return NextResponse.json(await res.json().catch(() => ({})), { status: res.status });
}

/** Badan permintaan yang kosong atau bukan JSON diperlakukan sebagai {}. */
export async function readJson(request: Request): Promise<unknown> {
  return request.json().catch(() => ({}));
}
