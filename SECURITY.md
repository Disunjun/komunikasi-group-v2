# Kebijakan Keamanan

## Versi yang didukung

Hanya branch `main` (backend `server.js` versi terbaru yang di-deploy di Railway)
yang menerima perbaikan keamanan.

## Melaporkan kerentanan

Kirim laporan privat ke pemilik repository melalui
[GitHub Security Advisory](https://github.com/Disunjun/komunikasi-group-v2/security/advisories/new).
Jangan membuka issue publik untuk kerentanan yang belum diperbaiki.

Sertakan: deskripsi masalah, langkah reproduksi, dampak, dan versi/waktu pengujian.
Target respons awal: 7 hari kerja.

## Cakupan

Termasuk: autentikasi user/admin, otorisasi API dan Socket.IO, akses recording,
penanganan token dan sesi, serta konfigurasi CORS.

Tidak termasuk: laporan otomatis tanpa bukti dampak, isu pada dependensi pihak
ketiga yang sudah punya advisory publik, dan serangan yang membutuhkan akses
fisik ke perangkat pengguna.

## Setelah insiden kredensial

Jika sebuah kredensial pernah masuk ke git history, rotasi kredensial tersebut —
menghapus filenya saja tidak cukup karena nilai lama tetap ada di history.
