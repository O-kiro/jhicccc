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

import PpdbLoginForm from "@/app/(public)/login/login-form";
import { PortalLoginForm } from "@/app/components/siswa/portal-login-form";

const balas = (isi: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(isi), { status }));

beforeEach(() => {
  params = new URLSearchParams();
  replace.mockClear();
  refresh.mockClear();
});

describe("masuk PPDB", () => {
  /** Dulu formulir ini menerima apa pun lalu langsung berpindah halaman. */
  it("mengirim nomor pendaftaran ke server sebelum berpindah halaman", async () => {
    const fetchMock = balas({ role: "ppdb", home: "/ppdb/dokumen" });
    vi.stubGlobal("fetch", fetchMock);

    render(<PpdbLoginForm />);
    await userEvent.type(screen.getByLabelText(/nomor pendaftaran/i), "PPDB26-0001");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke penyerahan/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledWith("/api/ppdb/auth", expect.anything()));
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      registration_number: "PPDB26-0001",
      password: "password",
    });
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/ppdb/dokumen"));
  });

  it("tidak mengirim apa pun kalau isian kosong", async () => {
    const fetchMock = balas({});
    vi.stubGlobal("fetch", fetchMock);

    render(<PpdbLoginForm />);
    await userEvent.click(screen.getByRole("button", { name: /masuk ke penyerahan/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(/wajib diisi/i);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it("menampilkan penolakan dari server", async () => {
    vi.stubGlobal("fetch", balas({ message: "Nomor pendaftaran atau kata sandi salah." }, 422));

    render(<PpdbLoginForm />);
    await userEvent.type(screen.getByLabelText(/nomor pendaftaran/i), "PPDB26-0009");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "salah");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke penyerahan/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Nomor pendaftaran atau kata sandi salah.");
    expect(replace).not.toHaveBeenCalled();
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
      await userEvent.type(screen.getByLabelText(/NISN, NIP, atau Email/i), "uji");
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
    await userEvent.type(screen.getByLabelText(/NISN, NIP, atau Email/i), "009283741");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/siswa"));
  });

  it("mengikuti tujuan lanjutan di dalam portalnya sendiri", async () => {
    params = new URLSearchParams({ next: "/guru/jurnal-harian" });
    vi.stubGlobal("fetch", balas({ role: "teacher", home: "/guru" }));

    render(<PortalLoginForm />);
    await userEvent.type(screen.getByLabelText(/NISN, NIP, atau Email/i), "rini@madrasah.test");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/guru/jurnal-harian"));
  });

  it("mengarahkan admin ke panel lewat tautan serah-terima", async () => {
    vi.stubGlobal("fetch", balas({ role: "admin", redirect: "http://localhost:8000/admin/handoff/abc" }));
    const ganti = vi.fn();
    vi.stubGlobal("location", { ...window.location, replace: ganti } as unknown as Location);

    render(<PortalLoginForm />);
    await userEvent.type(screen.getByLabelText(/NISN, NIP, atau Email/i), "admin@madrasah.test");
    await userEvent.type(screen.getByLabelText(/^Kata Sandi$/i), "password");
    await userEvent.click(screen.getByRole("button", { name: /masuk ke portal/i }));

    await waitFor(() => expect(ganti).toHaveBeenCalledWith("http://localhost:8000/admin/handoff/abc"));
  });
});
