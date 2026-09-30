// @vitest-environment node
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "@/proxy";

const B = "http://localhost:3000";

/** Permintaan dengan cookie sesi seperti yang dipasang route handler. */
function minta(path: string, cookie?: { token?: string; peran?: string }) {
  const req = new NextRequest(new URL(path, B));
  if (cookie?.token) req.cookies.set("makoba-token", cookie.token);
  if (cookie?.peran) req.cookies.set("makoba-peran", cookie.peran);
  return req;
}

const tujuan = (res: Response) => res.headers.get("location");

describe("penjaga rute", () => {
  it("melempar pengunjung tanpa sesi ke halaman masuk, membawa tujuannya", () => {
    const res = proxy(minta("/siswa/ranking"));
    expect(tujuan(res)).toBe(`${B}/masuk?next=%2Fsiswa%2Franking`);
  });

  it("mengantar pendaftar PPDB ke halaman masuknya sendiri, bukan gerbang portal", () => {
    expect(tujuan(proxy(minta("/ppdb/dokumen")))).toBe(`${B}/ppdb/login`);
  });

  it("membiarkan halaman publik PPDB terbuka", () => {
    expect(proxy(minta("/ppdb/login")).headers.get("location")).toBeNull();
  });

  it("mengembalikan orang ke portalnya sendiri saat salah alamat", () => {
    const siswa = { token: "t", peran: "siswa" };
    expect(tujuan(proxy(minta("/guru/jadwal", siswa)))).toBe(`${B}/siswa`);

    const guru = { token: "t", peran: "guru" };
    expect(tujuan(proxy(minta("/alumni/portal", guru)))).toBe(`${B}/guru`);

    const alumni = { token: "t", peran: "alumni" };
    expect(tujuan(proxy(minta("/siswa", alumni)))).toBe(`${B}/alumni/portal`);
  });

  it("meloloskan pemilik portal ke halamannya", () => {
    const guru = { token: "t", peran: "guru" };
    expect(proxy(minta("/guru/jurnal-harian", guru)).headers.get("location")).toBeNull();
  });

  it("menganggap sesi lama tanpa cookie peran sebagai siswa", () => {
    expect(proxy(minta("/siswa", { token: "t" })).headers.get("location")).toBeNull();
    expect(tujuan(proxy(minta("/guru", { token: "t" })))).toBe(`${B}/siswa`);
  });

  it("tidak memantulkan yang sudah masuk kembali ke halaman masuk", () => {
    expect(tujuan(proxy(minta("/masuk", { token: "t", peran: "alumni" })))).toBe(`${B}/alumni/portal`);
    expect(tujuan(proxy(minta("/ppdb/login", { token: "t", peran: "ppdb" })))).toBe(`${B}/ppdb/dokumen`);
  });

  /**
   * Token yang dicabut dulu membuat /siswa dan /masuk saling melempar tanpa
   * henti. Cookie harus dibuang saat kembali dengan tanda expired.
   */
  it("membuang cookie basi saat sesi dinyatakan berakhir", () => {
    const res = proxy(minta("/masuk?expired=1", { token: "basi", peran: "guru" }));

    expect(res.headers.get("location")).toBeNull();
    const dibuang = res.cookies.getAll().filter((c) => c.value === "");
    expect(dibuang.map((c) => c.name).sort()).toEqual(["makoba-peran", "makoba-token"]);
  });

  it("membuang cookie basi juga di halaman masuk PPDB", () => {
    const res = proxy(minta("/ppdb/login?expired=1", { token: "basi", peran: "ppdb" }));

    expect(res.headers.get("location")).toBeNull();
    expect(res.cookies.getAll().filter((c) => c.value === "")).toHaveLength(2);
  });
});
