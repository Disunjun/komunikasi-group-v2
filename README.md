# komunikasi-group-v2

KomGrup — aplikasi komunikasi realtime (push-to-talk, chat, recording) dengan
backend Node.js/Socket.IO dan frontend statis satu file.

## Arsitektur

| Bagian | Isi | Deploy |
| --- | --- | --- |
| Backend | `server.js` (Express + Socket.IO + PostgreSQL + Supabase Storage) | Railway |
| Frontend | `index.html`, `sw.js`, `manifest.json` (PWA, PeerJS/WebRTC) | Netlify |
| Database | `schema.sql`, `001_recording_v1.sql`, `002_auth_hardening.sql` | Supabase PostgreSQL |

Suara live memakai WebRTC peer-to-peer (PeerJS) dengan TURN dari Cloudflare.
Socket.IO dipakai untuk presence, floor control (PTT), chat, dan event admin.
Recording disimpan di bucket privat Supabase Storage; playback memakai signed URL
berumur 5 menit.

## Model autentikasi

- **User**: `POST /api/auth/login` → Bearer token (tabel `auth_sessions`).
  Semua API user dan koneksi Socket.IO user wajib memakai token ini.
- **Admin**: `POST /api/admin/login` → Bearer token admin (tabel `admin_sessions`).
  Password admin diverifikasi dari `users.password_hash` (scrypt), bukan dari env.
  Seluruh endpoint admin dan `admin:kick` wajib memakai token admin.
- Identitas user di room diambil dari token, bukan dari payload client.
- Akses recording dibatasi keanggotaan channel di tabel `user_group_channel`.

Tidak ada kredensial default. Jika `ADMIN_NAME` kosong, siapa pun dengan
`role='admin'` di tabel `users` boleh login sebagai admin.

## Menjalankan secara lokal

```bash
npm install
cp .env.example .env   # isi nilainya
npm run dev            # atau: npm start
```

Server berjalan di `http://localhost:3000`. Cek `GET /health`.
Tanpa `DATABASE_URL` server tetap hidup, tetapi fitur database dinonaktifkan.

Frontend cukup dibuka sebagai file statis (`index.html`). Untuk menunjuk ke
backend lain, set `window.REALTIME_SERVER_URL` sebelum script utama dijalankan.

## Variabel environment

Lihat `.env.example` untuk daftar lengkap beserta nilai default.
Yang wajib di produksi: `DATABASE_URL`, `FRONTEND_ORIGINS`, `ADMIN_NAME`.
Recording butuh `SUPABASE_URL` dan `SUPABASE_SERVICE_ROLE_KEY`.

## Setup database

Jalankan di Supabase SQL Editor sesuai urutan:

1. `schema.sql` — tabel dasar (users, sesi, config, chat, presence, audit, activity).
2. `001_recording_v1.sql` — `user_group_channel` dan `voice_messages`.
3. `002_auth_hardening.sql` — hanya untuk database lama (rename `audit_logs.username`
   → `admin_name`, tambah `activity_logs`). Aman dijalankan berulang.

`server.js` tidak pernah membuat atau mengubah tabel.

Membuat admin pertama: buat baris di `users` dengan `role='admin'` dan
`password_hash` berformat scrypt (`scrypt$<salt>$<hex>`), misalnya lewat
`hashPassword()` di `server.js`.

## Perintah pemeriksaan

```bash
npm run lint    # ESLint (server.js)
npm run check   # cek sintaks Node
```

## Keamanan

Laporan kerentanan: lihat `SECURITY.md`.
Ringkasan kontrol keamanan yang berlaku: `SECURITY_IMPROVEMENTS.md`.
