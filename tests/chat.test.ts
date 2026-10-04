// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import * as konten from "@/lib/content";

vi.mock("@/lib/site", () => ({
  getSite: async () => ({
    programs: konten.programs,
    extracurriculars: [],
    facilities: [],
    achievements: [],
    agenda: [],
    news: [],
    digitalServices: [],
    faqs: [{ q: "Apakah ada asrama?", a: "Belum ada asrama." }],
    profile: { whatsapp: "0812-1111-2222" },
  }),
}));

const { POST } = await import("@/app/api/chat/route");

let ipKe = 0;
const tanya = (messages: unknown, ip = `10.0.0.${++ipKe}`) =>
  POST(
    new Request("http://x/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": ip },
      body: JSON.stringify({ messages }),
    }),
  );

const gemini = (teks: string, status = 200) =>
  vi.fn().mockImplementation(
    async () => new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: teks }] } }] }), { status }),
  );

beforeEach(() => {
  process.env.GEMINI_API_KEY = "kunci-uji";
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("chatbot", () => {
  it("meneruskan percakapan ke Gemini dengan pengetahuan situs dan mengembalikan jawabannya", async () => {
    const fetchMock = gemini("Belum ada asrama.");
    vi.stubGlobal("fetch", fetchMock);

    const res = await tanya([{ role: "user", text: "Ada asrama?" }]);

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ reply: "Belum ada asrama." });

    const [url, opsi] = fetchMock.mock.calls[0];
    expect(url).toContain("generativelanguage.googleapis.com");
    expect(opsi.headers["x-goog-api-key"]).toBe("kunci-uji");
    const body = JSON.parse(opsi.body);
    expect(body.systemInstruction.parts[0].text).toContain("Apakah ada asrama?");
    expect(body.systemInstruction.parts[0].text).toContain("WhatsApp admin: 0812-1111-2222");
    expect(body.contents).toEqual([{ role: "user", parts: [{ text: "Ada asrama?" }] }]);
  });

  it("menolak pertanyaan kosong tanpa memanggil Gemini", async () => {
    const fetchMock = gemini("x");
    vi.stubGlobal("fetch", fetchMock);

    expect((await tanya([{ role: "user", text: "   " }])).status).toBe(422);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("membatasi pertanyaan per IP", async () => {
    vi.stubGlobal("fetch", gemini("ok"));
    const kode = [];
    for (let i = 0; i < 9; i++) kode.push((await tanya([{ role: "user", text: "halo" }], "9.9.9.9")).status);
    expect(kode.slice(0, 8).every((k) => k === 200)).toBe(true);
    expect(kode[8]).toBe(429);
  });

  it("pesan ramah bila Gemini gagal, dan 503 bila kunci belum dipasang", async () => {
    vi.stubGlobal("fetch", gemini("", 500));
    expect((await tanya([{ role: "user", text: "halo" }])).status).toBe(502);

    delete process.env.GEMINI_API_KEY;
    expect((await tanya([{ role: "user", text: "halo" }])).status).toBe(503);
  });
});
