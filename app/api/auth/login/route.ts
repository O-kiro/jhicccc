import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, TOKEN_COOKIE, apiPost, type ApiStudent } from "@/lib/api";

type StudentLogin = { role: "student"; token: string; student: ApiStudent };
type AdminLogin = { role: "admin"; name: string; redirect_url: string };
type LoginResponse = StudentLogin | AdminLogin;

/**
 * Gerbang masuk tunggal. Laravel menentukan peran dari bentuk identitas,
 * lalu jalurnya bercabang sesuai mekanisme sesi masing-masing:
 *
 *   siswa → token Sanctum, disimpan di cookie httpOnly di sini;
 *   admin → tautan serah-terima sekali pakai menuju sesi Filament.
 *
 * Token siswa tidak pernah dikembalikan ke browser supaya tidak terbaca
 * skrip pihak ketiga.
 */
export async function POST(request: Request) {
  let payload: { identifier?: string; password?: string; remember?: boolean };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 400 });
  }

  try {
    const data = await apiPost<LoginResponse>("/login", {
      identifier: payload.identifier,
      password: payload.password,
      device_name: "portal-web",
    });

    if (data.role === "admin") {
      // Tautan ini berumur 60 detik dan sekali pakai; tidak perlu cookie
      // apa pun di sisi Next.js karena sesinya dibuat oleh Laravel.
      return NextResponse.json({ role: "admin", redirect: data.redirect_url });
    }

    (await cookies()).set(TOKEN_COOKIE, data.token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // "Ingat saya" memperpanjang sesi ke 30 hari; selain itu cookie sesi.
      ...(payload.remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    });

    return NextResponse.json({ role: "student", student: data.student });
  } catch (error) {
    if (error instanceof ApiError) {
      // 422 = kredensial salah, 429 = terlalu sering mencoba.
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Tidak dapat menghubungi server madrasah." },
      { status: 502 },
    );
  }
}
