/**
 * Uji beban situs MAN Kota Batu dengan k6.
 *
 *   k6 run k6/web.js                                  # smoke (bawaan)
 *   k6 run -e SKENARIO=load k6/web.js                 # beban normal
 *   k6 run -e SKENARIO=stress k6/web.js               # cari batas
 *   k6 run -e BASE_URL=http://localhost:3000 k6/web.js
 *
 * Portal ikut diuji bila akun uji diberikan (login sekali per VU):
 *   k6 run -e SISWA_ID=009283741 -e SISWA_PASS=password k6/web.js
 *
 * Catatan:
 * - API Laravel membatasi 120 permintaan/menit per IP untuk /public/site dan
 *   6/menit untuk login. Semua VU k6 berasal dari satu IP, jadi skenario
 *   berat sengaja menguji HALAMAN (Next.js, yang menyimpan data CMS di
 *   cache), bukan memukul API langsung. 429 dihitung terpisah, bukan galat.
 * - /api/chat (chatbot) tidak diuji: tiap pertanyaan memakan kuota Gemini.
 * - VPS-nya kecil. Jalankan stress di luar jam pakai, dan hentikan (Ctrl+C)
 *   begitu galat mulai naik.
 */
import http from "k6/http";
import { check, group, sleep } from "k6";
import { Counter, Rate, Trend } from "k6/metrics";

const BASE = (__ENV.BASE_URL || "https://jhic26.rezasidin.my.id").replace(/\/$/, "");
const API = (__ENV.API_URL || "https://api.jhic26.rezasidin.my.id/api/v1").replace(/\/$/, "");
const SKENARIO = __ENV.SKENARIO || "smoke";
const SISWA = __ENV.SISWA_ID && __ENV.SISWA_PASS ? { id: __ENV.SISWA_ID, pass: __ENV.SISWA_PASS } : null;

const kenaLimit = new Counter("kena_rate_limit");
const halamanGagal = new Rate("halaman_gagal");
const waktuHalaman = new Trend("waktu_halaman", true);

const PROFIL = {
  smoke: { executor: "constant-vus", vus: 1, duration: "30s" },
  load: {
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { duration: "1m", target: 20 },
      { duration: "3m", target: 20 },
      { duration: "30s", target: 0 },
    ],
  },
  stress: {
    executor: "ramping-vus",
    startVUs: 0,
    stages: [
      { duration: "1m", target: 30 },
      { duration: "2m", target: 60 },
      { duration: "2m", target: 100 },
      { duration: "1m", target: 0 },
    ],
  },
};

const scenarios = {
  pengunjung: { ...PROFIL[SKENARIO], exec: "pengunjung" },
};

// Portal: sedikit VU saja — login dibatasi 6/menit per IP.
if (SISWA) {
  scenarios.siswa = {
    executor: "constant-vus",
    vus: SKENARIO === "smoke" ? 1 : 3,
    duration: SKENARIO === "smoke" ? "30s" : "4m",
    exec: "siswa",
  };
}

export const options = {
  scenarios,
  thresholds: {
    // 95% halaman di bawah 2 detik, 99% di bawah 4 detik.
    waktu_halaman: ["p(95)<2000", "p(99)<4000"],
    halaman_gagal: ["rate<0.01"],
    http_req_failed: ["rate<0.05"],
  },
  summaryTrendStats: ["avg", "med", "p(90)", "p(95)", "p(99)", "max"],
};

/** Halaman publik dengan bobot kira-kira sesuai lalu lintas nyata. */
const HALAMAN = [
  ["/", 30],
  ["/ppdb", 15],
  ["/berita", 10],
  ["/profil", 10],
  ["/kontak", 8],
  ["/layanan", 5],
  ["/program/riset", 5],
  ["/program/tahfidz", 4],
  ["/program/olimpiade", 4],
  ["/alumni", 4],
  ["/masuk", 5],
];
const TOTAL_BOBOT = HALAMAN.reduce((n, [, b]) => n + b, 0);

function pilihHalaman() {
  let r = Math.random() * TOTAL_BOBOT;
  for (const [jalur, bobot] of HALAMAN) {
    if ((r -= bobot) <= 0) return jalur;
  }
  return "/";
}

function buka(jalur, tag) {
  const res = http.get(`${BASE}${jalur}`, { tags: { halaman: tag || jalur }, redirects: 5 });

  if (res.status === 429) {
    kenaLimit.add(1);
    return res;
  }

  const ok = check(res, {
    [`${tag || jalur} → 200`]: (r) => r.status === 200,
    [`${tag || jalur} → berisi HTML`]: (r) => (r.body || "").includes("</html>"),
  });
  halamanGagal.add(!ok);
  waktuHalaman.add(res.timings.duration, { halaman: tag || jalur });
  return res;
}

/** Sekali di awal: pastikan situs & API hidup, ambil satu slug berita. */
export function setup() {
  const situs = http.get(`${BASE}/`);
  if (situs.status !== 200) {
    throw new Error(`Situs tidak bisa dibuka (${situs.status}) di ${BASE}`);
  }

  const api = http.get(`${API}/public/site`, { headers: { Accept: "application/json" } });
  check(api, { "API /public/site → 200": (r) => r.status === 200 });

  let berita = null;
  try {
    berita = api.json("news.0.slug") || null;
  } catch {
    berita = null;
  }
  return { berita };
}

/** Pengunjung umum: menjelajah 3–5 halaman dengan jeda membaca. */
export function pengunjung(data) {
  const jumlah = 3 + Math.floor(Math.random() * 3);

  for (let i = 0; i < jumlah; i++) {
    const jalur = pilihHalaman();
    group(`halaman ${jalur}`, () => buka(jalur));
    sleep(1 + Math.random() * 3);
  }

  if (data.berita && Math.random() < 0.3) {
    group("detail berita", () => buka(`/berita/${data.berita}`, "/berita/[slug]"));
    sleep(2 + Math.random() * 3);
  }
}

let sudahMasuk = false;

/** Siswa: login sekali per VU, lalu membuka halaman-halaman portal. */
export function siswa() {
  if (!sudahMasuk) {
    const res = http.post(
      `${BASE}/api/auth/login`,
      JSON.stringify({ identifier: SISWA.id, password: SISWA.pass, remember: false }),
      { headers: { "Content-Type": "application/json" }, tags: { halaman: "login" } },
    );
    if (res.status === 429) {
      kenaLimit.add(1);
      sleep(15);
      return;
    }
    sudahMasuk = check(res, { "login siswa → 200": (r) => r.status === 200 });
    if (!sudahMasuk) {
      sleep(10);
      return;
    }
  }

  for (const jalur of ["/siswa", "/siswa/tugas", "/siswa/modul", "/siswa/perpustakaan", "/siswa/forum", "/siswa/ranking"]) {
    const res = buka(jalur);
    // Sesi habis: proxy mengalihkan ke /masuk. Login ulang di iterasi berikut.
    if (res.url && res.url.includes("/masuk")) {
      sudahMasuk = false;
      return;
    }
    sleep(1 + Math.random() * 2);
  }
}
