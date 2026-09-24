import { proxyPost, readJson } from "@/lib/api-proxy";

/** Meminjam buku. Kuota dan pinjaman ganda diperiksa Laravel (Sirkulasi). */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/library/books/${encodeURIComponent(id)}/borrow`, await readJson(request));
}
