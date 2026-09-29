# Deploy ke VPS (Jagoan Hosting + Webuzo + OpenLiteSpeed)

Panduan menaikkan situs, portal, dan panel admin ke VPS dengan panel Webuzo.
Aplikasinya berjalan di Docker; OpenLiteSpeed bawaan Webuzo hanya menjadi
pintu depan yang memegang domain dan sertifikat HTTPS.

```
Internet ──https──► OpenLiteSpeed (Webuzo, port 80/443, Let's Encrypt)
                      ├─ jhic26.rezasidin.my.id     ──► 127.0.0.1:3000  container frontend (next start)
                      └─ api.jhic26.rezasidin.my.id ──► 127.0.0.1:8000  container backend (FrankenPHP)
```

Frontend memanggil backend lewat alamat publiknya (`https://api.jhic2026...`),
dan backend memanggil webhook frontend lewat alamat publik juga. Kedua port
aplikasi hanya terbuka untuk 127.0.0.1, jadi tidak bisa dibuka langsung dari
luar tanpa HTTPS.

Versi Node.js di Webuzo tidak berpengaruh: Node dan PHP ada di dalam container.

> **Kalau tidak mau memasang Docker di VPS**, ada jalur kedua: menjalankan
> frontend sebagai aplikasi Node biasa lewat fitur Node.js Webuzo. Kolom
> *Application startup file* diisi `.next/standalone/server.js` — berkas yang
> dibuat Next sendiri dari `output: "standalone"`. Langkahnya ada di
> `handover.md` bagian "Memasang di server (tanpa Docker)". Jangan menulis
> `server.js` sendiri: server bawaan Next tetap menjalankan `proxy.ts`, penjaga
> rute portal, sedangkan server kustom berisiko melewatinya.

---

## 0. Sebelum mulai (di laptop)

- **Backend**: patch keamanan (`keamanan-backend-v3.patch`) sudah dipasang dan
  di-push ke `main` di GitHub. Tanpa itu semua akun contoh di server — termasuk
  Admin Utama — bersandi `password`, berkas PPDB bisa diunduh siapa saja, dan
  `compose.prod.yaml` masih versi lama. Nama cabang atau PR tidak menjamin
  isinya, jadi periksa dari folder backend:

  ```bash
  git fetch origin && git grep -q SandiContoh origin/main -- database/seeders/PortalSeeder.php \
    && echo "patch keamanan sudah di main" || echo "BELUM — jangan deploy dulu"
  ```
- **Frontend**: cabang kerja sudah di-merge ke `main` (berkas ini ikut di
  dalamnya).

## 1. DNS

Di member area Jagoan Hosting → domain `rezasidin.my.id` → kelola DNS, tambahkan
dua record (bukan *domain forwarding*):

| Tipe | Nama | Nilai |
|---|---|---|
| A | `jhic2026` | IP VPS |
| A | `api.jhic2026` | IP VPS |

Kalau nameserver domain diarahkan ke VPS, tambahkan record yang sama di editor
DNS Webuzo. Tunggu sampai keduanya menjawab IP VPS:

```bash
nslookup jhic26.rezasidin.my.id
nslookup api.jhic26.rezasidin.my.id
```

## 2. Siapkan VPS

Masuk lewat `ssh root@IP-VPS`, lalu:

```bash
# Port 3000 dan 8000 harus kosong.
ss -ltnp | grep -E ':(3000|8000)\b' || echo "port 3000 dan 8000 kosong"

# Cek OS-nya.
grep -E '^(ID|VERSION_ID)=' /etc/os-release
```

Pasang Docker sesuai OS. Skrip `get.docker.com` menolak AlmaLinux dan Rocky
("Unsupported distribution"), jadi keduanya memakai repositori CentOS resmi:

```bash
# AlmaLinux / Rocky
dnf -y install dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Ubuntu / Debian
curl -fsSL https://get.docker.com | sh
```

Lalu, untuk semua OS:

```bash
systemctl enable --now docker
docker compose version
```

Bila server memakai firewall CSF (`csf -v` berhasil), buka `/etc/csf/csf.conf`,
set `DOCKER = "1"`, lalu `csf -r && systemctl restart docker`. Tanpa itu, setiap
CSF dimuat ulang container kehilangan akses internet dan build gagal mengunduh.

RAM 4 GB cukup untuk build. Pada RAM 2 GB, tambahkan swap dulu.

## 3. Backend

```bash
mkdir -p /opt/makoba && cd /opt/makoba
git clone https://github.com/O-kiro/jhicccc-backend.git backend
cd backend

cp .env.production.example .env
openssl rand -hex 32          # salin hasilnya ke SITUS_REVALIDATE_SECRET
nano .env                     # isi yang bertanda ISI; APP_KEY boleh kosong

docker compose -f compose.prod.yaml up -d --build
```

Saat pertama jalan, sandi acak akun contoh dicetak **sekali**. Catat sekarang:

```bash
docker compose -f compose.prod.yaml logs app | grep -A9 "Sandi akun contoh"
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/up    # 200
```

## 4. Frontend

```bash
cd /opt/makoba
git clone https://github.com/O-kiro/jhicccc.git frontend
cd frontend

cat > .env <<'EOF'
API_URL=https://api.jhic26.rezasidin.my.id/api/v1
SITE_URL=https://jhic26.rezasidin.my.id
REVALIDATE_SECRET=isi-sama-dengan-SITUS_REVALIDATE_SECRET-backend
EOF

docker compose -f compose.prod.yaml up -d --build
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/      # 200
```

Kalau domain backend belum hidup saat build, halaman dibangun dengan isi
bawaan lalu menyusul isi CMS sendiri paling lama 60 detik setelah backend bisa
dijangkau.

## 5. Domain dan HTTPS di Webuzo

Di panel pengguna Webuzo (biasanya `https://IP-VPS:2003`):

1. **Tambah domain** `jhic26.rezasidin.my.id` dan `api.jhic26.rezasidin.my.id`
   (sebagai subdomain dari `rezasidin.my.id` atau addon domain; nama menunya
   bisa sedikit berbeda).
2. **Pasang sertifikat Let's Encrypt** untuk keduanya. DNS di langkah 1 harus
   sudah mengarah ke VPS.
3. **Nyalakan paksa HTTPS** (redirect http → https) untuk keduanya. Tanpa ini,
   pengunjung yang membuka `http://` tidak akan bisa masuk: cookie login hanya
   dikirim lewat HTTPS.

## 6. Arahkan domain ke container (OpenLiteSpeed)

Webuzo memuat berkas di `/var/webuzo-data/openlitespeed/custom/domains/` ke
dalam VirtualHost domain yang namanya sama, dan tidak menimpanya saat panel
membangun ulang konfigurasi.

```bash
mkdir -p /var/webuzo-data/openlitespeed/custom/domains
cd /var/webuzo-data/openlitespeed/custom/domains

cat > jhic26.rezasidin.my.id.conf <<'EOF'
extprocessor makoba_frontend {
  type                    proxy
  address                 127.0.0.1:3000
  maxConns                100
  initTimeout             60
  retryTimeout            0
  respBuffer              0
}

# Pembaruan sertifikat Let's Encrypt tetap dilayani dari document root.
context /.well-known/acme-challenge/ {
  location                $DOC_ROOT/.well-known/acme-challenge/
  allowBrowse             1
}

context / {
  type                    proxy
  handler                 makoba_frontend
  addDefaultCharset       off
}
EOF

sed -e 's/makoba_frontend/makoba_backend/g' -e 's/127.0.0.1:3000/127.0.0.1:8000/' \
  jhic26.rezasidin.my.id.conf > api.jhic26.rezasidin.my.id.conf
```

Mulai ulang OpenLiteSpeed dari panel admin Webuzo (Services), atau lewat SSH:

```bash
systemctl list-units | grep -i -E 'lsws|litespeed'   # cek nama layanannya
systemctl restart lsws
```

## 7. Periksa

```bash
curl -sI http://jhic26.rezasidin.my.id | head -1                              # 301
curl -s -o /dev/null -w "%{http_code}\n" https://jhic26.rezasidin.my.id/      # 200
curl -s -o /dev/null -w "%{http_code}\n" https://api.jhic26.rezasidin.my.id/up  # 200
curl -sI https://jhic26.rezasidin.my.id/siswa | grep -i location              # /masuk?next=%2Fsiswa
```

Dari laptop, `http://IP-VPS:3000` dan `http://IP-VPS:8000` harus **tidak** bisa
dibuka.

Lalu di browser:

1. Buka `https://api.jhic26.rezasidin.my.id/admin`, masuk sebagai Admin Utama
   dengan sandi dari langkah 3, dan **ganti sandinya**.
2. Buka `https://jhic26.rezasidin.my.id/masuk` dan coba akun siswa, guru, dan
   alumni. Ganti sandi akun contoh lewat panel (Setel Ulang Sandi) bila akan
   dipakai juri.

## 8. Memperbarui versi dan cadangan

Kode ada di dalam image, jadi setiap perubahan dibangun ulang (sekitar 1–3
menit); `restart` saja tidak cukup.

```bash
cd /opt/makoba/frontend && git pull && docker compose -f compose.prod.yaml up -d --build
cd /opt/makoba/backend  && git pull && docker compose -f compose.prod.yaml up -d --build
```

Cadangkan basis data dan unggahan dari folder `backend`:

```bash
docker compose -f compose.prod.yaml cp app:/app/data/database.sqlite ./cadangan-$(date +%F).sqlite
docker compose -f compose.prod.yaml cp app:/app/storage/app ./cadangan-unggahan-$(date +%F)
```

## 9. Kalau ada masalah

| Gejala | Penyebab dan jalan keluar |
|---|---|
| Domain menjawab 502/503 | Container belum jalan: `docker compose -f compose.prod.yaml ps` lalu `logs`. |
| Container backend langsung berhenti, log menyebut APP_DEBUG | `APP_DEBUG` di `.env` backend harus `false`. |
| Panel admin tanpa gaya, browser memblokir *mixed content* | `TRUSTED_PROXIES=*` belum ada di `.env` backend. Isi, lalu `up -d`. |
| Login berhasil tapi langsung keluar lagi | Situs dibuka lewat `http://`. Nyalakan paksa HTTPS (langkah 5). |
| Build berhenti dengan `Killed` | RAM habis. Tambah swap. |
| Build gagal mengunduh paket | Firewall CSF memotong jaringan Docker (lihat langkah 2). |
| Isi situs baru berubah setelah ±1 menit | `REVALIDATE_SECRET` frontend tidak sama dengan `SITUS_REVALIDATE_SECRET` backend. |
| Sertifikat gagal diperbarui | Blok `/.well-known/acme-challenge/` di berkas langkah 6 hilang. |
