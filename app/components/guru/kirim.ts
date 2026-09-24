/**
 * Permintaan tulis dari komponen klien portal guru ke route handler
 * /api/guru/*, dengan galat validasi Laravel dipetakan per kolom.
 */

export type Hasil<T> =
  | { ok: true; data: T }
  | { ok: false; pesan: string; galat: Record<string, string> };

/**
 * Unggahan berkas. Sengaja tidak menyetel Content-Type: browser yang
 * menuliskannya lengkap dengan boundary multipart.
 */
export async function kirimBerkas<T = unknown>(url: string, data: FormData): Promise<Hasil<T>> {
  try {
    const res = await fetch(url, { method: "POST", body: data });
    const isi = await res.json().catch(() => null);

    if (res.ok) {
      return { ok: true, data: isi as T };
    }

    const galat = Object.fromEntries(
      Object.entries((isi?.errors ?? {}) as Record<string, unknown>).map(([k, v]) => [
        k,
        Array.isArray(v) ? String(v[0]) : String(v),
      ]),
    );

    return {
      ok: false,
      pesan:
        res.status === 413
          ? "Berkas terlalu besar untuk diunggah."
          : (isi?.message ?? "Gagal mengunggah."),
      galat,
    };
  } catch {
    return { ok: false, pesan: "Server tidak dapat dihubungi.", galat: {} };
  }
}

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
