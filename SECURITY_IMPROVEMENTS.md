# Kontrol Keamanan yang Berlaku

Dokumen ini menjelaskan kondisi keamanan **setelah** perbaikan versi
`2.5.0-A2`. Versi dokumen sebelumnya menjelaskan kontrol yang sebenarnya
belum ada di kode; isinya diganti total.

## Autentikasi

- Tidak ada kredensial default di kode. `ADMIN_NAME`/password admin tidak lagi
  punya nilai fallback hardcoded, dan `.env.example` hanya berisi placeholder.
- Login admin memverifikasi `users.password_hash` (scrypt) untuk akun ber-`role='admin'`.
- Jalur lama `x-admin-name` / `x-admin-password` (header polos) dihapus.
  Seluruh endpoint admin memakai `requireAdminToken` (Bearer, tabel `admin_sessions`).
- `verifyPassword()` hanya menerima hash berformat `scrypt$...`; perbandingan
  password plaintext tidak lagi mungkin, dan pembandingan hash memakai
  `crypto.timingSafeEqual`.
- Rate limit login per IP untuk user dan admin (`LOGIN_MAX_ATTEMPTS`,
  `LOGIN_WINDOW_MS`), dengan respons `429` dan `Retry-After` dalam pesan.

## Otorisasi realtime

- Koneksi Socket.IO wajib membawa token user atau token admin; koneksi anonim ditolak.
- Nama user di room diambil dari token (`socketActor.nama`), bukan dari payload client,
  sehingga impersonasi lewat field `nama` tidak lagi bisa dilakukan.
- `admin:kick` hanya bisa dipanggil socket yang membawa admin token; durasi kick
  diatur `ADMIN_KICK_DURATION_MS`.

## Akses recording

- List, upload, pembuatan signed URL, dan delete memeriksa keanggotaan channel
  di `user_group_channel`; delete tambahan dibatasi pemilik recording.
- Bucket Supabase tetap privat; playback memakai signed URL 5 menit.

## Sesi dan data

- Sesi user/admin yang kedaluwarsa atau dicabut dibersihkan berkala.
- Entri kick yang sudah lewat dihapus dari memori.
- Aksi admin dicatat di `audit_logs` dan disiarkan lewat event `audit:new`.
- Aktivitas masuk/keluar channel dicatat di `activity_logs` untuk statistik admin.

## Transport dan header

- `trust proxy` dikonfigurasi (`TRUST_PROXY_HOPS`) agar rate limit membaca IP asli.
- Header respons: `X-Content-Type-Options`, `X-Frame-Options`,
  `Referrer-Policy`, `Cross-Origin-Resource-Policy`.
- CORS memakai `FRONTEND_ORIGINS`; server memperingatkan bila masih `*`.

## Sisa risiko

- `DATABASE_SSL_REJECT_UNAUTHORIZED` default `false` agar kompatibel dengan
  penyedia PostgreSQL bersertifikat self-signed. Set `true` bila CA-nya valid.
- Rate limit login disimpan di memori proses, jadi tidak terbagi antar instance.
- Password admin lama yang pernah ter-commit di git history **harus dirotasi**;
  menghapus file tidak menghapus nilainya dari history.
