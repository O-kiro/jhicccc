import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Disalin dari lib/api.ts: modul itu memakai next/headers, yang tidak
// tersedia di proxy.
const TOKEN_COOKIE = "makoba-token";
const ROLE_COOKIE = "makoba-peran";
const LOGIN_PATH = "/masuk";

const HOME = { siswa: "/siswa", guru: "/guru", alumni: "/alumni/portal" } as const;
type Role = keyof typeof HOME;

/** Sesi lama (sebelum ada portal guru) tidak punya cookie peran: itu siswa. */
function roleOf(request: NextRequest): Role {
  const nilai = request.cookies.get(ROLE_COOKIE)?.value;

  return nilai === "guru" || nilai === "alumni" ? nilai : "siswa";
}

/**
 * Area yang sedang dibuka. Perhatikan /alumni: halaman publiknya tetap
 * terbuka untuk umum — hanya /alumni/portal yang dijaga.
 */
function areaOf(pathname: string): Role {
  if (pathname === "/guru" || pathname.startsWith("/guru/")) {
    return "guru";
  }

  if (pathname === "/alumni/portal" || pathname.startsWith("/alumni/portal/")) {
    return "alumni";
  }

  return "siswa";
}

/**
 * Menjaga portal siswa, guru, dan alumni. Di Next.js 16 berkas ini
 * bernama `proxy.ts` — konvensi `middleware.ts` sudah tidak dipakai lagi.
 *
 * Ini hanya memeriksa keberadaan cookie, bukan keabsahannya; verifikasi
 * sesungguhnya tetap dilakukan Laravel di tiap permintaan API. Cookie peran
 * pun hanya penunjuk arah: memalsukannya ke "guru" cuma berujung 401 dari
 * Laravel, lalu kembali ke halaman masuk.
 */
export function proxy(request: NextRequest) {
  const { pathname, search, searchParams } = request.nextUrl;
  const hasToken = request.cookies.has(TOKEN_COOKIE);
  const role = roleOf(request);

  if (pathname === LOGIN_PATH || pathname === "/siswa/login") {
    // Laravel menolak tokennya (dicabut, kedaluwarsa, atau sandi diganti di
    // perangkat lain). Cookie harus dibuang di sini — kalau tidak, cabang di
    // bawah memantulkan pengguna kembali ke portal, portal ke sini lagi, dan
    // seterusnya tanpa henti.
    if (searchParams.has("expired")) {
      const res = NextResponse.next();
      res.cookies.delete(TOKEN_COOKIE);
      res.cookies.delete(ROLE_COOKIE);
      return res;
    }

    // Yang sudah masuk tidak perlu melihat halaman masuk lagi.
    return hasToken ? NextResponse.redirect(new URL(HOME[role], request.url)) : NextResponse.next();
  }

  if (!hasToken) {
    const login = new URL(LOGIN_PATH, request.url);
    login.searchParams.set("next", pathname + search);

    return NextResponse.redirect(login);
  }

  // Siswa yang membuka /guru (atau sebaliknya) diantar ke portalnya sendiri.
  if (areaOf(pathname) !== role) {
    return NextResponse.redirect(new URL(HOME[role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Halaman publik /alumni sengaja tidak masuk daftar ini.
  matcher: [
    "/masuk",
    "/siswa",
    "/siswa/:path*",
    "/guru",
    "/guru/:path*",
    "/alumni/portal",
    "/alumni/portal/:path*",
  ],
};
