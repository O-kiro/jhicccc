/**
 * Permintaan tulis dari komponen klien portal guru ke route handler
 * /api/guru/*, dengan galat validasi Laravel dipetakan per kolom.
 */

export type Hasil<T> =
  | { ok: true; data: T }
  | { ok: false; pesan: string; galat: Record<string, string> };

export async function kirim<T = unknown>(
  url: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown,
): Promise<Hasil<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await res.json().catch(() => null);

    if (res.ok) {
      return { ok: true, data: data as T };
    }

    // Laravel mengirim { errors: { kolom: ["pesan", ...] } } untuk 422.
    const galat = Object.fromEntries(
      Object.entries((data?.errors ?? {}) as Record<string, unknown>).map(([k, v]) => [
        k,
        Array.isArray(v) ? String(v[0]) : String(v),
      ]),
    );

    return {
      ok: false,
      pesan:
        res.status === 429
          ? "Terlalu sering menyimpan. Coba lagi sebentar lagi."
          : (data?.message ?? "Gagal menyimpan."),
      galat,
    };
  } catch {
    return { ok: false, pesan: "Server tidak dapat dihubungi.", galat: {} };
  }
}
