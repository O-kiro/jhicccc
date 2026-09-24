import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, ROLE_COOKIE, TOKEN_COOKIE, apiPost, type ApiStudent } from "@/lib/api";
import type { ApiTeacher } from "@/lib/api-guru";
import type { ApiAlumni } from "@/lib/api-alumni";

type StudentLogin = { role: "student"; token: string; student: ApiStudent };
type TeacherLogin = { role: "teacher"; token: string; teacher: ApiTeacher };
type AlumniLogin = { role: "alumni"; token: string; alumni: ApiAlumni };
type AdminLogin = { role: "admin"; name: string; redirect_url: string };
type LoginResponse = StudentLogin | TeacherLogin | AlumniLogin | AdminLogin;

/** Peran dari Laravel → cookie peran dan portal tujuannya. */
const PORTAL = {
  student: { peran: "siswa", home: "/siswa" },
  teacher: { peran: "guru", home: "/guru" },
  alumni: { peran: "alumni", home: "/alumni/portal" },
} as const;

/**
 * Gerbang masuk tunggal. Laravel menentukan peran dari identitasnya, lalu
 * jalurnya bercabang sesuai mekanisme sesi masing-masing:
 *
 *   siswa, guru, alumni → token Sanctum, disimpan di cookie httpOnly di sini;
 *   admin               → tautan serah-terima sekali pakai menuju sesi Filament.
 *
 * Token tidak pernah dikembalikan ke browser supaya tidak terbaca skrip
 * pihak ketiga.
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

    const opsi = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      // "Ingat saya" memperpanjang sesi ke 30 hari; selain itu cookie sesi.
      ...(payload.remember ? { maxAge: 60 * 60 * 24 * 30 } : {}),
    } as const;

    const portal = PORTAL[data.role];

    const store = await cookies();
    store.set(TOKEN_COOKIE, data.token, opsi);
    // Dibaca proxy.ts untuk memilih portal; umurnya sama dengan token.
    store.set(ROLE_COOKIE, portal.peran, opsi);

    return NextResponse.json({ role: data.role, home: portal.home });
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
