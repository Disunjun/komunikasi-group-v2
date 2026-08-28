KOMUNIKASI GROUP V2 — BROADCAST AUDIO LIVE FULL FIX

Broadcast Audio sekarang menggunakan:
- Socket.IO = control/signaling only
- PeerJS/WebRTC = media live
- MP3 di Admin = MediaElement -> Web Audio MediaStreamDestination -> WebRTC
- TEST = manual PTT toggle START/STOP, target aktif, Hari/Jam/Jadwal diabaikan
- MULAI SIARAN = target + Hari + Jam + optional Jadwal
- akhir periode = auto STOP
- Admin STOP/logout/disconnect = STOP semua target
- receiver broadcast call dijawab tanpa mengirim microphone balik
- broadcast text tetap memakai jalur Socket.IO existing

UI periode:
Senin..Minggu checkbox
Jam Mulai HH:MM
Jam Selesai HH:MM
Jadwal Mulai optional

Catatan browser:
Scheduled audio yang dimulai tanpa user gesture bergantung pada kebijakan autoplay browser.
Jika AudioContext/browser belum unlocked, admin perlu melakukan interaksi audio terlebih dahulu.
