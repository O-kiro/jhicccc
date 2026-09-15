import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE = "makoba-token";
const LOGIN_PATH = "/masuk";

/**
 * Menjaga area portal siswa. Di Next.js 16 berkas ini bernama `proxy.ts`
 * — konvensi `middleware.ts` sudah tidak dipakai lagi.
 *
 * Ini hanya memeriksa keberadaan cookie, bukan keabsahannya; verifikasi
 * sesungguhnya tetap dilakukan Laravel di tiap permintaan API.
 */
export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasToken = request.cookies.has(TOKEN_COOKIE);

  // Yang sudah masuk tidak perlu melihat halaman masuk lagi.
  if (pathname === LOGIN_PATH || pathname === "/siswa/login") {
    return hasToken
      ? NextResponse.redirect(new URL("/siswa", request.url))
      : NextResponse.next();
  }

  if (!hasToken) {
    const login = new URL(LOGIN_PATH, request.url);
    login.searchParams.set("next", pathname + search);

    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/masuk", "/siswa", "/siswa/:path*"],
};
