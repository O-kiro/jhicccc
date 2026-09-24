import { proxyPost, readJson } from "@/lib/api-proxy";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return proxyPost(`/alumni/forum/threads/${encodeURIComponent(id)}/replies`, await readJson(request));
}
