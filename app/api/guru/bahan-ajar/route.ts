import { proxyPost, readJson } from "@/lib/api-proxy";

export async function POST(request: Request) {
  return proxyPost("/guru/bahan-ajar", await readJson(request));
}
