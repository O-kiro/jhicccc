import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/**
 * Webhook dari Laravel: dipanggil tiap kali konten My Website disimpan atau
 * dihapus, supaya situs publik langsung memakai isi terbaru alih-alih
 * menunggu jendela revalidate 60 detik di lib/site.ts.
 *
 * `{ expire: 0 }`, bukan profil "max": di Next 16, "max" berarti
 * stale-while-revalidate — pengunjung pertama setelah admin menyimpan masih
 * mendapat versi lama. Dokumentasi Next memang meminta expire: 0 untuk
 * webhook dari sistem luar.
 */
export async function POST(request: Request) {
  const rahasia = process.env.REVALIDATE_SECRET;

  // Tanpa rahasia, endpoint dimatikan — bukan dibiarkan terbuka.
  if (!rahasia) {
    return NextResponse.json({ message: "Revalidasi tidak diaktifkan." }, { status: 503 });
  }

  const dikirim = request.headers.get("x-revalidate-secret") ?? "";
  const a = Buffer.from(dikirim);
  const b = Buffer.from(rahasia);

  // Perbandingan waktu-tetap: panjang dicek dulu karena timingSafeEqual
  // melempar galat bila panjangnya berbeda.
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return NextResponse.json({ message: "Tidak diizinkan." }, { status: 401 });
  }

  revalidateTag("site", { expire: 0 });

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
