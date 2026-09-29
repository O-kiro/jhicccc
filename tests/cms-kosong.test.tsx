import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { News } from "@/app/components/news";
import { Testimonials } from "@/app/components/testimonials";

/**
 * Daftar dari CMS bisa kosong — semua berita belum terbit, dijadwalkan, atau
 * dihapus dari panel admin. Dulu beranda langsung gagal dirender (500) karena
 * `News` membaca `slug` dari berita pertama yang tidak ada.
 */
describe("beranda dengan CMS kosong", () => {
  it("bagian berita menampilkan keterangan, bukan galat", () => {
    // Reveal memakai IntersectionObserver, yang tidak ada di jsdom.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );

    render(<News news={[]} />);

    expect(screen.getByText(/belum ada berita yang terbit/i)).toBeInTheDocument();
    // Tautan ke indeks berita (versi desktop dan ponsel) tetap ada.
    for (const tautan of screen.getAllByRole("link", { name: /semua berita/i })) {
      expect(tautan).toHaveAttribute("href", "/berita");
    }
  });

  it("bagian testimoni disembunyikan", () => {
    const { container } = render(<Testimonials testimonials={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
