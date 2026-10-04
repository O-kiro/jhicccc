import { NextResponse } from "next/server";
import { instruksi, susunPengetahuan } from "@/lib/chatbot";
import { getSite } from "@/lib/site";

/**
 * Chatbot tanya-jawab situs publik. Kunci Gemini hanya ada di server;
 * peramban cukup mengirim riwayat percakapan singkat.
 */

type Pesan = { role: "user" | "model"; text: string };

const MAKS_PESAN = 12;
const MAKS_KARAKTER = 500;

/**
 * Batas per alamat IP, di memori proses. Cukup untuk satu container; tujuan
 * utamanya menjaga kuota Gemini dari pengunjung iseng.
 */
const BATAS_PER_MENIT = 8;
const BATAS_PER_HARI = 60;
const jejak = new Map<string, number[]>();

function kenaBatas(ip: string): boolean {
  const kini = Date.now();
  const riwayat = (jejak.get(ip) ?? []).filter((t) => kini - t < 86_400_000);
  const semenit = riwayat.filter((t) => kini - t < 60_000).length;

  if (semenit >= BATAS_PER_MENIT || riwayat.length >= BATAS_PER_HARI) {
    jejak.set(ip, riwayat);
    return true;
  }

  riwayat.push(kini);
  jejak.set(ip, riwayat);

  // Bersihkan sesekali supaya peta tidak tumbuh tanpa batas.
  if (jejak.size > 5000) {
    for (const [k, v] of jejak) if (!v.some((t) => kini - t < 86_400_000)) jejak.delete(k);
  }
  return false;
}

function bacaPesan(body: unknown): Pesan[] | null {
  const daftar = (body as { messages?: unknown })?.messages;
  if (!Array.isArray(daftar) || daftar.length === 0) return null;

  const pesan: Pesan[] = daftar.slice(-MAKS_PESAN).map((m) => ({
    role: (m as Pesan)?.role === "model" ? "model" : "user",
    text: String((m as Pesan)?.text ?? "").trim().slice(0, MAKS_KARAKTER),
  }));

  // Gemini meminta giliran pertama dan terakhir dari pengguna.
  while (pesan.length && pesan[0].role !== "user") pesan.shift();
  const akhir = pesan[pesan.length - 1];
  if (!akhir || akhir.role !== "user" || !akhir.text) return null;

  return pesan;
}

export async function POST(request: Request) {
  const kunci = process.env.GEMINI_API_KEY;
  if (!kunci) {
    return NextResponse.json({ message: "Asisten sedang tidak tersedia." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "lokal";
  if (kenaBatas(ip)) {
    return NextResponse.json(
      { message: "Terlalu banyak pertanyaan. Coba lagi sebentar lagi, ya." },
      { status: 429 },
    );
  }

  const pesan = bacaPesan(await request.json().catch(() => null));
  if (!pesan) {
    return NextResponse.json({ message: "Pertanyaan tidak boleh kosong." }, { status: 422 });
  }

  const site = await getSite();
  const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": kunci },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: instruksi(susunPengetahuan(site), !!site.profile.whatsapp) }] },
        contents: pesan.map((m) => ({ role: m.role, parts: [{ text: m.text }] })),
        generationConfig: { temperature: 0.3, maxOutputTokens: 2048 },
      }),
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });

    const data = await res.json().catch(() => null);
    const jawaban: string | undefined = data?.candidates?.[0]?.content?.parts
      ?.map((p: { text?: string }) => p.text ?? "")
      .join("")
      .trim();

    if (!res.ok || !jawaban) {
      console.warn("Chatbot Gemini gagal", res.status, data?.error?.message);
      return NextResponse.json(
        { message: "Maaf, asisten sedang sibuk. Coba lagi sebentar lagi." },
        { status: 502 },
      );
    }

    return NextResponse.json({ reply: jawaban });
  } catch {
    return NextResponse.json(
      { message: "Maaf, asisten tidak dapat dihubungi. Coba lagi sebentar lagi." },
      { status: 502 },
    );
  }
}
