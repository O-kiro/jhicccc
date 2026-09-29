# Deploy ke VPS (Jagoan Hosting + Webuzo + OpenLiteSpeed)

Panduan menaikkan situs, portal, dan panel admin ke VPS dengan panel Webuzo.
Aplikasinya berjalan di Docker; OpenLiteSpeed bawaan Webuzo hanya menjadi
pintu depan yang memegang domain dan sertifikat HTTPS.

```
Internet ──https──► OpenLiteSpeed (Webuzo, port 80/443, Let's Encrypt)
                      ├─ jhic26.rezasidin.my.id     ──► 127.0.0.1:3000  container frontend (next start)
                      └─ api.jhic26.rezasidin.my.id ──► 127.0.0.1:8000  container backend (FrankenPHP)
```

Frontend memanggil backend lewat alamat publiknya (`https://api.jhic26...`),
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
| A | `jhic26` | IP VPS |
| A | `api.jhic26` | IP VPS |

Kalau nameserver domain diarahkan ke VPS, tambahkan record yang sama di editor
DNS Webuzo. Tunggu sampai keduanya menjawab IP VPS:

```bash
nslookup jhic26.rezasidin.my.id
nslookup api.jhic26.rezasidin.my.id
```

**Record DNS saja belum cukup kalau VPS berada di belakang NAT penyedia.** Pada
paket Jagoan Hosting yang memakai IP bersama, ada tabel *Domain Forwarding*
terpisah, dan **tiap hostname beserta portnya harus didaftarkan di situ** —
kalau tidak, domain menjawab DNS dengan benar tapi tidak pernah sampai ke VPS:

| Hostname | Source port | Destination port | Protocol |
|---|---|---|---|
| `jhic26.rezasidin.my.id` | 80 | 80 | HTTP |
| `jhic26.rezasidin.my.id` | 443 | 443 | HTTPS |
| `api.jhic26.rezasidin.my.id` | 80 | 80 | HTTP |
| `api.jhic26.rezasidin.my.id` | 443 | 443 | HTTPS |

Tabel yang sama biasanya memperlihatkan **port SSH sebenarnya** — sering bukan
22, melainkan port tinggi yang diteruskan ke 22. Periksa di situ sebelum
menyimpulkan SSH-nya mati.

## 2. Siapkan VPS

Masuk lewat SSH (sesuaikan portnya dengan tabel forwarding di langkah 1 —
`ssh -p <port> root@IP-VPS`), lalu:

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

Terakhir, buat jaringan bersama untuk kedua container — sekali saja:

```bash
docker network create makoba
```

Keduanya berada di repo berbeda, jadi masing-masing punya jaringan sendiri.
Tanpa jaringan bersama ini, satu-satunya cara mereka saling memanggil adalah
lewat alamat publik — dan di VPS ber-NAT itu gagal: container tidak bisa
keluar lalu berbalik masuk ke IP-nya sendiri (hairpin NAT). Gejalanya
menyesatkan, `fetch failed` dari dalam container padahal alamat yang sama
normal dari luar.

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

```bash
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8000/up    # 200
```

> **Seluruh akun contoh bersandi `password`.** Seeder menulisnya apa adanya,
> tanpa memeriksa `APP_ENV` — jadi di server pun nilainya sama, untuk admin,
> siswa, guru, alumni, dan pendaftar PPDB. **Ganti sandi Admin Utama sebelum
> domain dibuka ke publik**, lalu sandi akun lain lewat aksi "Setel Ulang
> Sandi" di panel.

Pastikan `APP_KEY` benar-benar terisi — tanpa itu panel admin tidak bisa
login, dan galatnya baru muncul saat mencoba masuk:

```bash
docker compose -f compose.prod.yaml exec app php -r '$k=getenv("APP_KEY"); echo strlen(base64_decode(substr($k,7))), PHP_EOL;'   # harus 32
```

## 4. Frontend

```bash
cd /opt/makoba
git clone https://github.com/O-kiro/jhicccc.git frontend
cd frontend

cat > .env <<'EOF'
API_URL=http://backend:8000/api/v1
SITE_URL=https://jhic26.rezasidin.my.id
REVALIDATE_SECRET=isi-sama-dengan-SITUS_REVALIDATE_SECRET-backend
EOF

docker compose -f compose.prod.yaml up -d --build
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3000/      # 200
```

`backend` di `API_URL` itu alias di jaringan `makoba`, bukan nama host di
internet — jangan diganti alamat publik, lihat alasannya di langkah 2.

Kalau backend belum hidup saat build, halaman dibangun dengan isi bawaan lalu
menyusul isi CMS sendiri paling lama 60 detik setelah backend bisa dijangkau.

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

## 6. Arahkan domain ke container

**Periksa dulu web server-nya apa.** Webuzo bisa memasang Apache atau
OpenLiteSpeed, dan cara menyambungkannya berbeda:

```bash
ss -ltnp | grep -E ':(80|443)\b'
```

Kalau nama prosesnya `httpd`, itu Apache — ikuti bagian di bawah. Kalau
`litespeed`, pakai `extprocessor` milik OpenLiteSpeed.

### Apache

`webuzoVH.conf` dibuat ulang panel setiap kali konfigurasi domain berubah,
jadi jangan diedit. Pakai `.htaccess` di document root — itu bertahan.
`ProxyPass` memang tidak diizinkan di `.htaccess`, tapi `RewriteRule ... [P]`
diizinkan, dan `proxy_module`, `proxy_http_module`, serta `headers_module`
sudah aktif di bawaan Webuzo.

Document root-nya (lihat `webuzoVH.conf` untuk memastikan):

| Domain | Document root | Tujuan |
|---|---|---|
| `jhic26.rezasidin.my.id` | `/home/<user>/public_html` | port 3000 |
| `api.jhic26.rezasidin.my.id` | `/home/<user>/public_html/api` | port 8000 |

Perhatikan: docroot `api` adalah **anak** dari docroot frontend. Tanpa
penyaringan per host, permintaan `https://jhic26.../api/auth/login` — rute
milik Next.js — ikut nyasar ke Laravel. Karena itu aturannya menyaring
`HTTP_HOST`.

```bash
cat > /home/jhic26/public_html/.htaccess <<'EOF'
# Tanpa ini mod_dir mengubah "/" jadi "/index.html" sebelum diteruskan,
# dan Next.js menjawab 404 karena tidak punya rute itu.
DirectoryIndex disabled

RewriteEngine On

# Tantangan Let's Encrypt harus tetap dilayani dari disk.
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]

<IfModule mod_headers.c>
    RequestHeader set X-Forwarded-Proto "https" "expr=%{HTTPS} == 'on'"
</IfModule>
EOF

cat > /home/jhic26/public_html/api/.htaccess <<'EOF'
DirectoryIndex disabled

RewriteEngine On

# api.jhic26.* → backend Laravel
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteCond %{HTTP_HOST} ^api\. [NC]
RewriteRule ^(.*)$ http://127.0.0.1:8000/$1 [P,L]

# /api/... di domain utama → tetap milik Next.js
RewriteCond %{REQUEST_URI} !^/\.well-known/
RewriteCond %{HTTP_HOST} !^api\. [NC]
RewriteRule ^(.*)$ http://127.0.0.1:3000/api/$1 [P,L]

<IfModule mod_headers.c>
    RequestHeader set X-Forwarded-Proto "https" "expr=%{HTTPS} == 'on'"
</IfModule>
EOF

chown jhic26:jhic26 /home/jhic26/public_html/.htaccess /home/jhic26/public_html/api/.htaccess
chmod 644 /home/jhic26/public_html/.htaccess /home/jhic26/public_html/api/.htaccess
```

`.htaccess` dibaca setiap permintaan, jadi **tidak perlu restart Apache**.
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
| Panel admin tanpa gaya, browser memblokir *mixed content* | Laravel tidak memercayai reverse proxy, jadi aset ditautkan dengan `http://`. Perlu `trustProxies` di `bootstrap/app.php` backend — mengisi `TRUSTED_PROXIES` di `.env` **tidak berpengaruh**, tidak ada kode yang membacanya. |
| Login berhasil tapi langsung keluar lagi | Situs dibuka lewat `http://`. Nyalakan paksa HTTPS (langkah 5). |
| Panel admin menolak login, atau galat menyebut *encryption key* | `APP_KEY` kosong atau salah panjang. Lihat pemeriksaan di langkah 3. |
| Mengubah `.env` tidak berpengaruh | `docker compose restart` **tidak** membaca ulang `env_file`. Pakai `up -d` supaya container dibuat ulang. |
| Nilai `.env` terbaca berikut komentarnya | `env_file` Compose menelan `# komentar` di belakang nilai sebagai bagian dari nilai. Taruh komentar di baris sendiri. |
| Build berhenti dengan `Killed` | RAM habis. Tambah swap. |
| Build panic `OS can't spawn worker thread` (os error 11) | Terlalu banyak worker untuk RAM yang ada — bukan batas jumlah proses. Turunkan `NEXT_BUILD_CPUS` (bawaan 2) saat membangun frontend. |
| Build gagal mengunduh paket | Firewall CSF memotong jaringan Docker (lihat langkah 2). |
| Isi situs baru berubah setelah ±1 menit | `REVALIDATE_SECRET` frontend tidak sama dengan `SITUS_REVALIDATE_SECRET` backend. |
| Sertifikat gagal diperbarui | Blok `/.well-known/acme-challenge/` di berkas langkah 6 hilang. |
| Domain tidak bisa dibuka walau DNS sudah benar | VPS di belakang NAT/port forwarding penyedia. Tiap hostname dan port harus didaftarkan di panel penyedia — lihat langkah 1. |
| Portal menjawab "Tidak dapat menghubungi server madrasah", atau 502 pada POST | Container memanggil backend lewat alamat publik. Di VPS ber-NAT itu gagal — pakai alias jaringan bersama (`http://backend:8000/api/v1`), lihat langkah 2 dan 4. |
| Beranda 404 tapi halaman lain normal | `mod_dir` mengubah `/` jadi `/index.html` sebelum diteruskan. Tambahkan `DirectoryIndex disabled` di `.htaccess`. |
| Berkas `.conf` proxy dibuat tapi tidak berpengaruh | Web server-nya Apache, bukan OpenLiteSpeed. Periksa dengan `ss -ltnp | grep ':80'` dan ikuti bagian Apache di langkah 6. |
