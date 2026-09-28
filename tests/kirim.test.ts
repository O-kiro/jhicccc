import { describe, expect, it, vi } from "vitest";
import { kirim, kirimBerkas } from "@/app/components/guru/kirim";

const balas = (isi: unknown, status: number) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(isi), { status }));

describe("pengirim permintaan portal guru", () => {
  it("memetakan galat 422 per kolom", async () => {
    vi.stubGlobal(
      "fetch",
      balas({ message: "gagal", errors: { title: ["Kolom judul wajib diisi."], url: ["Tautan tidak sah."] } }, 422),
    );

    const hasil = await kirim("/api/guru/modul-ajar", "POST", { title: "" });

    expect(hasil.ok).toBe(false);
    if (!hasil.ok) {
      expect(hasil.galat.title).toBe("Kolom judul wajib diisi.");
      expect(hasil.galat.url).toBe("Tautan tidak sah.");
    }
  });

  it("menerjemahkan 429 jadi pesan yang bisa dibaca", async () => {
    vi.stubGlobal("fetch", balas({}, 429));

    const hasil = await kirim("/api/guru/tatib", "POST", {});

    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.pesan).toMatch(/terlalu sering/i);
  });

  it("tidak melempar ketika jaringan mati", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    const hasil = await kirim("/api/guru/tatib", "POST", {});

    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.pesan).toMatch(/tidak dapat dihubungi/i);
  });

  it("mengirim FormData apa adanya dan menjelaskan berkas kebesaran", async () => {
    const fetchMock = balas({}, 413);
    vi.stubGlobal("fetch", fetchMock);

    const form = new FormData();
    form.set("jenis", "foto");
    const hasil = await kirimBerkas("/api/guru/jurnal-harian", form);

    // Content-Type tidak boleh disetel sendiri: boundary-nya ditulis browser.
    expect(fetchMock.mock.calls[0][1].headers).toBeUndefined();
    expect(fetchMock.mock.calls[0][1].body).toBe(form);
    expect(hasil.ok).toBe(false);
    if (!hasil.ok) expect(hasil.pesan).toMatch(/terlalu besar/i);
  });
});
