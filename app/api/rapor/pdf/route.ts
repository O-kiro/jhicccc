import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/api";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api/v1";

/**
 * Meneruskan berkas rapor PDF dari Laravel.
 *
 * Tidak memakai proxyPost: isinya biner, jadi badan respons diteruskan apa
 * adanya beserta nama berkas yang sudah ditentukan server.
 */
export async function GET(request: Request) {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/masuk", request.url));
  }

  const res = await fetch(`${API_URL}/report-card/pdf`, {
    headers: { Accept: "application/pdf", Authorization: `Bearer ${token}` },
    cache: "no-store",
  }).catch(() => null);

  if (!res || !res.ok) {
    return NextResponse.json(
      { message: "Rapor belum tersedia untuk diunduh." },
      { status: res?.status ?? 502 },
    );
  }

  return new NextResponse(res.body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition":
        res.headers.get("content-disposition") ?? 'attachment; filename="rapor.pdf"',
      "Cache-Control": "no-store",
    },
  });
}
