import type { Metadata } from "next";
import LoginPage from "@/app/(public)/login/page";

export const metadata: Metadata = {
  title: "Login Upload Berkas — PPDB",
  description: "Masuk untuk menyerahkan dokumen PPDB MAN Kota Batu.",
};

export default function PpdbLoginPage() {
  return <LoginPage />;
}
