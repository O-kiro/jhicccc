import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import DokumenForm from "@/app/(public)/ppdb/dokumen/dokumen-form";
import type { ApiPpdbBerkas } from "@/lib/api-ppdb";

const refresh = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ refresh, replace: vi.fn(), push: vi.fn() }),
}));

function data(ubah: Partial<ApiPpdbBerkas> = {}): ApiPpdbBerkas {
  return {
    registrant: {
      name: "Nayla Putri",
      registration_number: "PPDB26-0001",
      jalur: "Prestasi",
      origin_school: "SMPN 1 Kota Batu",
      note: null,
    },
    documents: [
      { jenis: "kartu_keluarga", label: "Fotokopi Kartu Keluarga", wajib: true, document: null },
    ],
    summary: { wajib: 1, terunggah: 0, kurang: 1, ditolak: 0, diterima: 0, lengkap: false },
    max_file_kb: 5120,
    ...ubah,
  };
}

const pdf = () => new File(["%PDF-1.4"], "kk.pdf", { type: "application/pdf" });

describe("unggah berkas PPDB", () => {
  /**
   * Dulu tombol kirim hanya mengubah tampilan jadi "Berkas Terkirim" tanpa
   * mengirim apa pun. Tes ini yang menjaga supaya itu tidak terulang.
   */
  it("benar-benar mengirim berkas ke server", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: 1, status: "menunggu" }), { status: 201 }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<DokumenForm data={data()} />);
    await userEvent.upload(screen.getByLabelText(/pilih berkas pdf/i), pdf());

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    const [url, opsi] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/ppdb/berkas");
    expect(opsi.method).toBe("POST");

    const terkirim = opsi.body as FormData;
    expect(terkirim.get("jenis")).toBe("kartu_keluarga");
    expect((terkirim.get("file") as File).name).toBe("kk.pdf");

    // Halaman disegarkan supaya statusnya ikut berubah.
    await waitFor(() => expect(refresh).toHaveBeenCalled());
  });

  it("menampilkan alasan penolakan dari server", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ errors: { file: ["Berkas harus berformat PDF."] } }), {
          status: 422,
        }),
      ),
    );

    render(<DokumenForm data={data()} />);
    await userEvent.upload(screen.getByLabelText(/pilih berkas pdf/i), pdf());

    expect(await screen.findByRole("alert")).toHaveTextContent("Berkas harus berformat PDF.");
  });

  it("menampilkan catatan panitia pada berkas yang diminta diganti", () => {
    render(
      <DokumenForm
        data={data({
          documents: [
            {
              jenis: "kartu_keluarga",
              label: "Fotokopi Kartu Keluarga",
              wajib: true,
              document: {
                id: 7,
                original_name: "kk.pdf",
                size_kb: 64,
                status: "ditolak",
                status_label: "Perlu Diganti",
                note: "Hasil pindaian tidak terbaca.",
                file_url: "/storage/ppdb/1/kk.pdf",
                uploaded_on: "2026-09-24",
              },
            },
          ],
          summary: { wajib: 1, terunggah: 1, kurang: 0, ditolak: 1, diterima: 0, lengkap: false },
        })}
      />,
    );

    expect(screen.getByText(/Hasil pindaian tidak terbaca/)).toBeInTheDocument();
    expect(screen.getByText("Perlu Diganti")).toBeInTheDocument();
    // Berkas yang ditolak boleh dihapus; yang sudah diterima tidak.
    expect(screen.getByRole("button", { name: /hapus/i })).toBeInTheDocument();
  });

  it("menyembunyikan tombol hapus pada berkas yang sudah diterima", () => {
    render(
      <DokumenForm
        data={data({
          documents: [
            {
              jenis: "kartu_keluarga",
              label: "Fotokopi Kartu Keluarga",
              wajib: true,
              document: {
                id: 7,
                original_name: "kk.pdf",
                size_kb: 64,
                status: "diterima",
                status_label: "Diterima",
                note: null,
                file_url: "/storage/ppdb/1/kk.pdf",
                uploaded_on: "2026-09-24",
              },
            },
          ],
          summary: { wajib: 1, terunggah: 1, kurang: 0, ditolak: 0, diterima: 1, lengkap: true },
        })}
      />,
    );

    expect(screen.queryByRole("button", { name: /hapus/i })).not.toBeInTheDocument();
    expect(screen.getByText(/Semua berkas wajib sudah terkirim/)).toBeInTheDocument();
  });
});
