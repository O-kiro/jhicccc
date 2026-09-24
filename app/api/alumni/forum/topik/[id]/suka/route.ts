import { proxyPost } from "@/lib/api-proxy";

/** Sakelar suka; keadaan barunya dikembalikan Laravel. */
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/alumni/forum/threads/${encodeURIComponent(id)}/like`, {});
}
