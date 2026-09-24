import { proxySend, readJson } from "@/lib/api-proxy";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  return proxySend("PUT", `/guru/bahan-ajar/${encodeURIComponent(id)}`, await readJson(request));
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  return proxySend("DELETE", `/guru/bahan-ajar/${encodeURIComponent(id)}`);
}
