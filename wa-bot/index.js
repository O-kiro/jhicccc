const { Client, LocalAuth } = require('whatsapp-web.js');
const { GoogleGenAI } = require('@google/genai');
const fs = require('fs');
const qrcode = require('qrcode-terminal');

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
  },
});

const GEMINI_API_KEY = 'AIzaSyB6VzUCDxgNCOcZfERIMJ9xTU_OaIWeYus';
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

const BOT_NUMBER = '6285961447024';

const SCHOOL_INFO = {
  name: 'MAN Kota Batu (MAKOBA)',
  address: 'Jl. Patimura No.25, Temas, Kec. Batu, Kota Batu, Jawa Timur',
  phone: '+62 341 592533',
  email: 'mankotabatu@kemenag.go.id',
  website: 'https://mankotabatu.sch.id',
  students: 1299,
  teachers: 84,
  classes: 38,
  programs: ['Kelas Riset', 'Kelas Olimpiade', 'Kelas Tahfidz 30 Juz'],
  tagline: 'Berilmu. Berakhlak. Berprestasi.'
};

// Fungsi Helper untuk memanggil Gemini dengan Fallback Model & Retry jika 503
async function generateContentWithFallback(systemPrompt) {
  const models = ['gemini-3.6-flash', 'gemini-2.5-flash', 'gemini-1.5-flash'];

  for (const modelName of models) {
    try {
      console.log(`⏳ Mengirim request menggunakan model: ${modelName}`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: systemPrompt,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      console.warn(`⚠️ Model ${modelName} gagal/overloaded: ${err.message || err}`);
      // Tunggu 1 detik sebelum mencoba model berikutnya
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  throw new Error('Semua model Gemini sedang sibuk.');
}

client.on('qr', (qr) => {
  console.log('🔍 Silakan scan QR Code di bawah ini:');
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('✅ MAKOBA Bot aktif!');
});

client.on('message', async (message) => {
  const text = message.body.trim();
  const sender = message.from;

  if (!text) return;

  console.log(`📩 Pesan masuk dari ${sender}: "${text}"`);

  const lowerText = text.toLowerCase();

  // 1. Tampilkan Menu Pilihan Link (Tanpa Ketik) saat pertama chat / diklik dari web
  if (lowerText.includes('halo admin') || lowerText.includes('informasi lengkap sekolah') || lowerText === 'menu') {
    const linkPPDB = `https://wa.me/${BOT_NUMBER}?text=Info%20PPDB`;
    const linkProgram = `https://wa.me/${BOT_NUMBER}?text=Info%20Program%20Unggulan`;
    const linkFasilitas = `https://wa.me/${BOT_NUMBER}?text=Info%20Fasilitas%20Sekolah`;
    const linkEkstra = `https://wa.me/${BOT_NUMBER}?text=Info%20Ekstrakurikuler`;

    const menuMsg =
        `👋 *Selamat Datang di ${SCHOOL_INFO.name}!*\n\n` +
        `Silakan *KLIK LINK* di bawah ini untuk memilih informasi secara otomatis (tanpa perlu mengetik):\n\n` +
        `📌 *Info PPDB / Pendaftaran:*\n👉 ${linkPPDB}\n\n` +
        `🎓 *Program Unggulan:*\n👉 ${linkProgram}\n\n` +
        `🏢 *Fasilitas Sekolah:*\n👉 ${linkFasilitas}\n\n` +
        `🎭 *Daftar Ekstrakurikuler:*\n👉 ${linkEkstra}\n\n` +
        `💬 *Atau Kamu bisa langsung mengetikkan pertanyaan bebas Kamu di sini.*`;

    return message.reply(menuMsg);
  }

  // 2. Pemetaan topik berdasarkan link opsi
  let queryApresiasi = text;
  if (text === 'Info PPDB') {
    queryApresiasi = 'Jelaskan syarat, alur, dan jalur pendaftaran PPDB di MAN Kota Batu secara lengkap.';
  } else if (text === 'Info Program Unggulan') {
    queryApresiasi = 'Jelaskan secara detail tentang Kelas Riset, Kelas Olimpiade, dan Kelas Tahfidz di MAN Kota Batu.';
  } else if (text === 'Info Fasilitas Sekolah') {
    queryApresiasi = 'Sebutkan fasilitas lengkap akademik, keagamaan, laboratorium, dan olahraga di MAN Kota Batu.';
  } else if (text === 'Info Ekstrakurikuler') {
    queryApresiasi = 'Sebutkan daftar ekstrakurikuler lengkap di MAN Kota Batu.';
  }

  try {
    const systemPrompt = `Kamu adalah Nyx, asisten virtual resmi dari ${SCHOOL_INFO.name}.

Data Sekolah:
- Nama: ${SCHOOL_INFO.name}
- Alamat: ${SCHOOL_INFO.address}
- Telp: ${SCHOOL_INFO.phone}
- Email: ${SCHOOL_INFO.email}
- Website: ${SCHOOL_INFO.website}
- Program Unggulan: ${SCHOOL_INFO.programs.join(', ')}
- Tagline: ${SCHOOL_INFO.tagline}

Instruksi:
1. Jawab pertanyaan/topik berikut secara ramah, sopan, dan informatif: "${queryApresiasi}".
2. Di bagian akhir jawaban, berikan catatan bahwa untuk kembali ke daftar opsi, pengguna bisa mengklik link menu atau menunggu respons manual dari Admin Manusia.`;

    const jawaban = await generateContentWithFallback(systemPrompt);
    console.log(`✅ Berhasil mengirim balasan ke ${sender}`);
    return message.reply(jawaban);

  } catch (err) {
    console.error('❌ ERROR GEMINI (SEMUA MODEL SIBUK):', err.message || err);
    return message.reply(
        `Halo! Saat ini server AI kami sedang mengalami lonjakan beban. Silakan kirim ulang pertanyaan Kamu beberapa saat lagi, atau tunggu respons manual dari Admin kami.`
    );
  }
});

client.initialize();