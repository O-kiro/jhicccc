# Frontend MAN Kota Batu — Next.js 16.
#
# Dua target dalam satu berkas:
#
#   dev       dipakai compose.yaml. Kode di-mount dari host, `next dev`.
#             Khusus laptop pengembang.
#   produksi  dipakai compose.prod.yaml. `next build` lalu `next start`:
#             NODE_ENV=production, sehingga cookie login bertanda Secure dan
#             galat tidak ditampilkan lengkap ke pengunjung.
#
# Node 22 LTS; Next 16 dan React 19 membutuhkan Node 20 ke atas.

# ======================================================================= dev
FROM node:22-alpine AS dev

WORKDIR /app

# Entrypoint ditulis langsung di sini agar tidak menambah folder baru di repo.
RUN <<'SH' cat > /usr/local/bin/entrypoint
#!/bin/sh
set -e
cd /app

# node_modules adalah volume Docker yang bertahan antar `up`, bahkan setelah
# `--build`. Dulu dependensi hanya dipasang saat volume masih kosong, jadi
# versi pertama dipakai selamanya: package-lock.json sudah Next 16.3.6, tapi
# container tetap menjalankan 16.2.9. Sekarang salinan lockfile disimpan
# setelah `npm ci` berhasil, dan pemasangan diulang begitu isinya berbeda.
# (`npm ci` mengosongkan isi node_modules tanpa menghapus foldernya, jadi aman
# untuk titik mount.)
stempel=node_modules/.lockfile-terpasang
if ! cmp -s package-lock.json "$stempel"; then
    echo "→ memasang dependensi Node (package-lock.json baru atau berubah)"
    npm ci
    cp package-lock.json "$stempel"
fi

echo "→ siap di http://localhost:3000"
exec "$@"
SH

# Git di Windows mengubah akhir baris jadi CRLF saat checkout, dan skrip di
# atas ikut terbawa. Shebang-nya lalu terbaca "#!/bin/sh\r", sehingga kernel
# mencari penafsir bernama "/bin/sh\r" dan gagal dengan pesan menyesatkan:
#   exec /usr/local/bin/entrypoint: no such file or directory
# CR dibuang di sini supaya image tetap jalan walau checkout-nya CRLF.
RUN sed -i 's/\r$//' /usr/local/bin/entrypoint \
    && chmod +x /usr/local/bin/entrypoint

EXPOSE 3000

ENTRYPOINT ["entrypoint"]
# -H 0.0.0.0 wajib: tanpa itu Next hanya mendengar di dalam container dan
# port yang dipublikasikan tidak bisa dibuka dari host.
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]

# ================================================================== produksi
FROM node:22-alpine AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Dibaca saat build: rewrite /storage di next.config.ts (tujuannya dibakukan
# ke routes manifest) dan SITE_URL untuk robots.txt serta sitemap.xml. Harus
# sama dengan nilai saat berjalan — compose.prod.yaml mengisi keduanya.
ARG API_URL=http://host.docker.internal:8000/api/v1
ARG SITE_URL=https://jhic26.rezasidin.my.id

# Jumlah worker saat membangun. Bawaan Next adalah jumlah CPU dikurangi satu,
# dan itu mencelakakan VPS kecil: 8 vCPU dengan RAM 4 GB berarti tujuh proses
# Node sekaligus, masing-masing ratusan MB. Yang muncul bukan pesan "kehabisan
# memori" yang jelas, melainkan panic dari Turbopack:
#
#   OS can't spawn worker thread: Resource temporarily unavailable (os error 11)
#
# EAGAIN itu datang dari gagalnya alokasi stack thread, bukan dari batas
# jumlah proses — plafon prosesnya sendiri masih longgar.
#
# Tiga kolam thread yang berbeda, dan tak satu pun membatasi yang lain:
#
#   TOKIO_WORKER_THREADS  kolam Rust milik Turbopack
#   NEXT_BUILD_CPUS       worker pembuat halaman statis (dibaca next.config.ts)
#   VIPS_*                libvips, dipakai saat membuat gambar OpenGraph
#
# Yang ketiga paling mudah terlewat: gejalanya bukan kehabisan memori,
# melainkan build berhenti di satu halaman saja —
#
#   Error occurred prerendering page "/opengraph-image"
#   glib: Error creating thread: Resource temporarily unavailable
#
# padahal 39 halaman sebelumnya mulus.
ARG NEXT_BUILD_CPUS=2

ENV API_URL=$API_URL \
    SITE_URL=$SITE_URL \
    NEXT_BUILD_CPUS=$NEXT_BUILD_CPUS \
    TOKIO_WORKER_THREADS=$NEXT_BUILD_CPUS \
    VIPS_CONCURRENCY=$NEXT_BUILD_CPUS \
    VIPS_MAX_THREADS=$NEXT_BUILD_CPUS \
    NEXT_TELEMETRY_DISABLED=1

RUN npm run build && npm prune --omit=dev

FROM node:22-alpine AS produksi

WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

COPY --from=build --chown=node:node /app/package.json /app/next.config.ts ./
COPY --from=build --chown=node:node /app/node_modules ./node_modules
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next ./.next

USER node

EXPOSE 3000

CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0", "-p", "3000"]
