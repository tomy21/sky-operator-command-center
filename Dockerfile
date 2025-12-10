# Gunakan image resmi Node.js
FROM node:20-alpine

# Install dependensi tambahan yang dibutuhkan Prisma (openssl, libc6, dll.)
RUN apk add --no-cache openssl

RUN rm -rf node_modules

# Set working directory
WORKDIR /app

# Salin file dependency terlebih dahulu (untuk cache layer efisien)
COPY package.json yarn.lock ./

# Install dependency
RUN yarn install

# Salin semua file project (setelah install dependency agar layer cache tidak rusak)
COPY . .

# ✅ Generate Prisma Client (untuk 2 schema)
# RUN npx prisma generate --schema=prisma/main/schema.prisma
# RUN npx prisma generate --schema=prisma/secondary/schema.prisma
# RUN yarn generate
# ✅ Build TypeScript ke dist/
RUN yarn build

# Optional: Expose port (ubah sesuai port kamu)
EXPOSE 3005

# ✅ Jalankan aplikasi
CMD ["yarn","start"]
