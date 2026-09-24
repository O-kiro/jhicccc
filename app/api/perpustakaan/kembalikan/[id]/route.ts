import { proxyPost } from "@/lib/api-proxy";

/** Mengembalikan pinjaman milik sendiri. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/library/loans/${encodeURIComponent(id)}/return`, {});
}
