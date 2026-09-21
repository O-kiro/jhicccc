import { proxyPost, readJson } from "@/lib/api-proxy";

/** Menambahkan balasan pada sebuah topik. Validasi dikerjakan Laravel. */
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/forum/threads/${encodeURIComponent(id)}/replies`, await readJson(request));
}
