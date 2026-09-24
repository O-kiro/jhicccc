import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ApiError, ROLE_COOKIE, TOKEN_COOKIE, apiPost } from "@/lib/api";

type PpdbLogin = {
  role: "ppdb";
  token: string;
  registrant: { name: string; registration_number: string; jalur: string };
};

/**
 * Masuk PPDB. Tokennya disimpan di cookie httpOnly seperti portal lain, dan
 * cookie peran diisi "ppdb" supaya proxy.ts mengarahkan ke halaman berkas.
 */
export async function POST(request: Request) {
  let payload: { registration_number?: string; password?: string };

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Permintaan tidak valid." }, { status: 400 });
  }

  try {
    const data = await apiPost<PpdbLogin>("/ppdb/login", {
      registration_number: payload.registration_number,
      password: payload.password,
    });

    const opsi = {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    } as const;

    const store = await cookies();
    store.set(TOKEN_COOKIE, data.token, opsi);
    store.set(ROLE_COOKIE, "ppdb", opsi);

    return NextResponse.json({ role: "ppdb", home: "/ppdb/dokumen" });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    return NextResponse.json(
      { message: "Tidak dapat menghubungi server madrasah." },
      { status: 502 },
    );
  }
}
