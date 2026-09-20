# Frontend MAN Kota Batu — Next.js 16.
#
# Node 22 LTS; Next 16 dan React 19 membutuhkan Node 20 ke atas.
FROM node:22-alpine

WORKDIR /app

# Entrypoint ditulis langsung di sini agar tidak menambah folder baru di repo.
RUN <<'SH' cat > /usr/local/bin/entrypoint && chmod +x /usr/local/bin/entrypoint
#!/bin/sh
set -e
cd /app

if [ ! -d node_modules ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
    echo "→ memasang dependensi Node"
    npm ci
fi

echo "→ siap di http://localhost:3000"
exec "$@"
SH

EXPOSE 3000

ENTRYPOINT ["entrypoint"]
# -H 0.0.0.0 wajib: tanpa itu Next hanya mendengar di dalam container dan
# port yang dipublikasikan tidak bisa dibuka dari host.
CMD ["npm", "run", "dev", "--", "-H", "0.0.0.0"]
