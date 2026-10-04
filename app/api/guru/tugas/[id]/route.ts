import { proxySend, readJson } from "@/lib/api-proxy";

type Ctx = { params: Promise<{ id: string }> };

/** Menyunting tugas. Kepemilikan kursusnya diperiksa Laravel. */
export async function PUT(request: Request, { params }: Ctx) {
  const { id } = await params;
  return proxySend("PUT", `/guru/tugas/${encodeURIComponent(id)}`, await readJson(request));
}

export async function DELETE(_request: Request, { params }: Ctx) {
  const { id } = await params;
  return proxySend("DELETE", `/guru/tugas/${encodeURIComponent(id)}`);
}
