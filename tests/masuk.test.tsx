import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const replace = vi.fn();
const refresh = vi.fn();
let params = new URLSearchParams();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ replace, refresh, push: vi.fn() }),
  useSearchParams: () => params,
}));

import { PortalLoginForm } from "@/app/components/siswa/portal-login-form";

const balas = (isi: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(isi), { status }));

beforeEach(() => {
  params = new URLSearchParams();
  replace.mockClear();
  refresh.mockClear();
});

describe("masuk PPDB lewat gerbang yang sama", () => {
  const isi = async (id: string, sandi: string) => {
    render(<PortalLoginForm />);
    await userEvent.type(screen.getByLabelText(/Email atau ID Pengguna/i), id);
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), sandi);
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));
  };

  it("nomor berawalan PPDB langsung ke jalur PPDB lalu ke halaman berkas", async () => {
    const fetchMock = balas({ role: "ppdb", home: "/ppdb/dokumen" });
    vi.stubGlobal("fetch", fetchMock);

    await isi("PPDB26-0001", "password");

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/ppdb/dokumen"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe("/api/ppdb/auth");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      registration_number: "PPDB26-0001",
      password: "password",
    });
  });

  it("nomor format lain dicoba sebagai PPDB bila login biasa menolak", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "salah" }), { status: 422 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ role: "ppdb", home: "/ppdb/dokumen" })));
    vi.stubGlobal("fetch", fetchMock);

    await isi("REG-77", "password");

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/ppdb/dokumen"));
    expect(fetchMock.mock.calls.map((c) => c[0])).toEqual(["/api/auth/login", "/api/ppdb/auth"]);
  });

  it("pesan login biasa yang ditampilkan bila keduanya menolak", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "Kata sandi salah." }), { status: 422 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ message: "lain" }), { status: 422 }));
    vi.stubGlobal("fetch", fetchMock);

    await isi("1234567890", "salah");

    expect(await screen.findByRole("alert")).toHaveTextContent("Kata sandi salah.");
    expect(replace).not.toHaveBeenCalled();
  });

  it("email tidak pernah dicoba sebagai PPDB", async () => {
    const fetchMock = balas({ message: "salah" }, 422);
    vi.stubGlobal("fetch", fetchMock);

    await isi("guru@madrasah.test", "salah");

    await screen.findByRole("alert");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("gerbang masuk portal", () => {
  it("mengantar tiap peran ke portalnya", async () => {
    for (const [peran, tujuan] of [
      ["student", "/siswa"],
      ["teacher", "/guru"],
      ["alumni", "/alumni/portal"],
    ] as const) {
      replace.mockClear();
      vi.stubGlobal("fetch", balas({ role: peran, home: tujuan }));

      const { unmount } = render(<PortalLoginForm />);
      await userEvent.type(screen.getByLabelText(/Email atau ID Pengguna/i), "uji");
      await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
      await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

      await waitFor(() => expect(replace).toHaveBeenCalledWith(tujuan));
      unmount();
    }
  });

  /** ?next= tidak boleh dipakai melempar orang ke luar situs. */
  it("mengabaikan tujuan lanjutan yang bukan portalnya sendiri", async () => {
    params = new URLSearchParams({ next: "//situs-lain.example/curi" });
    vi.stubGlobal("fetch", balas({ role: "student", home: "/siswa" }));

    render(<PortalLoginForm />);
    await userEvent.type(screen.getByLabelText(/Email atau ID Pengguna/i), "009283741");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/siswa"));
  });

  it("mengikuti tujuan lanjutan di dalam portalnya sendiri", async () => {
    params = new URLSearchParams({ next: "/guru/jurnal-harian" });
    vi.stubGlobal("fetch", balas({ role: "teacher", home: "/guru" }));

    render(<PortalLoginForm />);
    await userEvent.type(screen.getByLabelText(/Email atau ID Pengguna/i), "rini@madrasah.test");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/guru/jurnal-harian"));
  });

  it("mengarahkan admin ke panel lewat tautan serah-terima", async () => {
    vi.stubGlobal("fetch", balas({ role: "admin", redirect: "http://localhost:8000/admin/handoff/abc" }));
    const ganti = vi.fn();
    vi.stubGlobal("location", { ...window.location, replace: ganti } as unknown as Location);

    render(<PortalLoginForm />);
    await userEvent.type(screen.getByLabelText(/Email atau ID Pengguna/i), "admin@madrasah.test");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

    await waitFor(() => expect(ganti).toHaveBeenCalledWith("http://localhost:8000/admin/handoff/abc"));
  });
});
