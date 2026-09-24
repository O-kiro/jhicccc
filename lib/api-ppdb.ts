/**
 * Klien unggah berkas PPDB — endpoint /ppdb/* di Laravel (guard "ppdb").
 *
 * Terpisah dari portal siswa/guru/alumni: calon siswa belum punya hubungan
 * apa pun dengan madrasah selain nomor pendaftarannya.
 */

import { cache } from "react";
import { authedGet } from "@/lib/api";

export type ApiPpdbBerkas = {
  registrant: {
    name: string;
    registration_number: string;
    jalur: string;
    origin_school: string | null;
    note: string | null;
  };
  documents: {
    jenis: string;
    label: string;
    wajib: boolean;
    document: {
      id: number;
      original_name: string;
      size_kb: number;
      status: "menunggu" | "diterima" | "ditolak";
      status_label: string;
      /** Alasan dari panitia saat berkas diminta diganti. */
      note: string | null;
      file_url: string;
      uploaded_on: string | null;
    } | null;
  }[];
  summary: {
    wajib: number;
    terunggah: number;
    kurang: number;
    ditolak: number;
    diterima: number;
    lengkap: boolean;
  };
  max_file_kb: number;
};

export const getPpdbBerkas = cache(
  (): Promise<ApiPpdbBerkas> => authedGet<ApiPpdbBerkas>("/ppdb/berkas"),
);
