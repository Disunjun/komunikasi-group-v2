index.html
File
sw.js
JavaScript
manifest.json
File
netlify.toml
File
https://railway.com/project/b6f076c4-4564-422d-877c-593373f65911/service/75fc2611-803a-424d-8d70-828c75b515e8?environmentId=c8822200-ee83-4ffb-bd8c-442e80c45d8a
{"ok":true,"service":"komunikasi-group-realtime","time":"2026-08-03T05:53:41.181Z","users":0}
{"ok":true,"service":"komunikasi-group-realtime","time":"2026-08-03T06:18:34.011Z","users":0}

eaab12af-19e3-4ead-acfa-e358965e9528.html
File
Periksa Hasil download index.html dari https://app.netlify.com/
db44bc2c-4884-40f8-8138-c4f9e1f3cbdb.html
File
cek index.html dari https://app.netlify.com/projects/komunikasi-group/deploys/6a704c7e3063b400084d4155
Sudah di setting selalu gagal
Apakah status building tidak masalah? Seharusnya succes
https://app.netlify.com/projects/komunikasi-group/configuration/general
Pasted text.txt
Document
Pasted text(1).txt
Document
Apakah perbedaan tersebut tidak berpengaruh?
komunikasi-group-v2-production.up.railway.app
FRONTEND_ORIGINS=https://komunikasi-group.netlify.app

Ukuran File index.html berbeda-beda, apakah pertanda ada file korup/aman saja?
Windows Explorer=143KB
GitHub=140KB
app.netlify.com=139.6KB
be0503fb-d55f-40e9-96be-c6e44cd8782f.html
File
783bcc5b-a58b-439f-94e0-81e171d9c2f9.html
File
Yesterday 2:17 PM
abe0055f-3765-49c7-905b-7a27c56dd02a.json
File
c7ec717c-94cf-4311-93ff-eb29cd0913eb.json
File
4cbb512b-e81a-414f-ad69-b2cbdc361de7.js
JavaScript
e7995c63-50f5-47da-b454-45d606b6f41b.example
File
767a62ea-ea95-4e96-8161-62fffd5c3229.js
JavaScript
0ee921ff-a497-4593-9f3e-729f16bf49d5.js
JavaScript
Sebelum lanjut diskusi, cek file ini, apa ada yang bisa dipakai atau dibuang.
7b50adf0-74da-4556-86da-5003393a298a.json
File
Pasted text(2).txt
Document
ed2fecda-8b13-412e-8235-3b0bafffa03f.js
JavaScript
Ok lanjutkan
Tidak ada. Saya menemukan di github ada ini. Apakah ini tidak berpengaruh?
Betul rupanya permasalahannya disini, sudah saya rubah, cek dulu
Pasted text(3).txt
Document
Ini sukses:
[DB] DATABASE_URL ditemukan.
[DB] PostgreSQL CONNECTED: ...
[DB] Database tables READY.
[SERVER] Listening on port 8080
[SERVER] PostgreSQL: ENABLED

Ini gagal:
[USER] ADMIN CREATE: DBTEST01

Saya curiga ini:
github deployment
Pasted text(4).txt
Document
Sumbernya dari ini:
humorous-emotion / production, saran saya di hapus saja, karena saya tidak pernah buat ini

2c5b92e0 tidak sama 4cd55b3


Pasted text(5).txt
Document
Pasted text(6).txt
Document
Pasted text(7).txt
Document
Biaya server TURN = Severless SFU, bagaimana pendapatmu?
Disimpan dimana nomornya/namanya?
Pasted text(8).txt
Document
Pasted text(9).txt
Document
Pasted text(10).txt
Document
Deploy Logs https://railway.com/project/b6f076c4-4564-422d-877c-593373f65911/service/
Pasted text(11).txt
Document

Sukses. Tahap A sudah lolos Railway:

Version    : 2.4.1-A ✅
PostgreSQL : connected ✅
Backend    : normal ✅

Saya sudah lanjut membuat Tahap B, tetap dari file A yang baru terbukti berhasil.

server_v2.4.1-B_group_channel_api.txt

Tahap B hanya menambahkan:

GET /api/config/groups
PUT /api/config/groups

Belum ada perubahan index.html dan belum ada Socket.IO live-sync.

Copy-paste seluruh file TXT ke server.js GitHub → Commit → tunggu Railway Active → cek /health.

Target:

"version":"2.4.1-B",
"database":"connected"

Kalau 2.4.1-B berhasil, setelah itu kita langsung tes GET /api/config/groups untuk memastikan Group + Channel benar-benar sudah dibaca dari PostgreSQL sebelum melanjutkan ke live-sync. 

server_v2.4.1-B_group_channel_api.txt
Document
{"ok":true,"service":"komunikasi-group-realtime","version":"2.4.1-B","database":"connected","time":"2026-08-05T04:49:20.221Z","users":0}

Bagus. Tahap B berhasil dan PostgreSQL tetap connected.

Sekarang jangan ubah server.js dulu. Kita verifikasi API Group/Channel yang baru.

Buka:

Tes PostgreSQL Group/Channel API

Targetnya kurang lebih:

{
  "ok": true,
  "groups": [
    {
      "nama": "Grup 1",
      "status": "aktif",
      "channel": [
        {
          "nama": "CH 01",
          "status": "aktif"
        }
      ]
    },
    {
      "nama": "Grup 2",
      "status": "aktif",
      "channel": [...]
    }
  ],
  "updatedBy": "system",
  "updatedAt": "..."
}

Kalau muncul "ok":true dan ada Grup 1 + Grup 2 beserta channel, berarti kita sudah membuktikan:

PostgreSQL
   ↓
app_config
   ↓
GET /api/config/groups
   ↓
Railway
   ↓
Browser ✅

Kirim hasilnya. Setelah itu saya lanjut Tahap C — Socket.IO live synchronization, sehingga perubahan Group/Channel dari Admin PC1 dapat dikirim otomatis ke PC2 dan HP1.

{"ok":true,"groups":[{"nama":"Grup 1","prefix":"","status":"aktif","channel":[{"nama":"CH 01","muted":false,"locked":false,"prefix":"","status":"aktif","maxUsers":0,"pttTimeout":0},{"nama":"CH 02","muted":false,"locked":false,"prefix":"","status":"aktif","maxUsers":5,"pttTimeout":30},{"nama":"CH 03","muted":false,"locked":false,"prefix":"","status":"aktif","maxUsers":0,"pttTimeout":0}]},{"nama":"Grup 2","prefix":"","status":"aktif","channel":[{"nama":"CH 01","muted":false,"locked":false,"prefix":"","status":"aktif","maxUsers":0,"pttTimeout":0},{"nama":"CH 02","muted":false,"locked":false,"prefix":"","status":"aktif","maxUsers":3,"pttTimeout":15}]}],"updatedBy":"system","updatedAt":"2026-08-05T04:09:05.031Z"}

Sempurna. Tahap B terverifikasi penuh. Data Group/Channel memang sudah berada di PostgreSQL dan API mengembalikannya dengan benar.

Saya sudah membuat Tahap C — Socket.IO Live Sync.

server_v2.4.1-C_socket_live_sync.txt

Perubahannya sengaja hanya satu fungsi tambahan: setelah PUT /api/config/groups sukses menyimpan ke PostgreSQL, server mengirim:

io.emit('config:groups:update', {
    groups: ...,
    updatedBy: ...,
    updatedAt: ...
});

Sehingga nantinya:

Admin PC1
   │
   │ ubah Group/Channel
   ▼
PostgreSQL
   │
   ├──────── Socket.IO ────────► PC1
   ├──────── Socket.IO ────────► PC2
   └──────── Socket.IO ────────► HP1

Sekarang copy-paste TXT tersebut ke server.js GitHub → Commit → tunggu Railway Active → cek /health.

Target:

"version":"2.4.1-C",
"database":"connected"

Belum perlu menguji Admin Panel, karena index.html sekarang belum mendengarkan event config:groups:update.

Jika /health sudah menunjukkan 2.4.1-C, tahap backend Group/Channel selesai. Sesudah itu kita masuk Tahap D: modifikasi index.html, yang akan menjadi tahap ketika PC1, PC2, dan HP1 benar-benar mulai memakai satu data Admin Panel yang sama dari PostgreSQL. 

server_v2.4.1-C_socket_live_sync.txt
Document

Library
/
server_v2.4.1-C_socket_live_sync.txt
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import crypto from 'crypto';
import { promisify } from 'util';
import { Server } from 'socket.io';
import pg from 'pg';

const { Pool } = pg;
const scryptAsync = promisify(crypto.scrypt);
const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || '*').split(',').map(s => s.trim()).filter(Boolean);
const ADMIN_NAME = process.env.ADMIN_NAME || 'Didik Suntoro';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'D1d1kSunt0r0@#$';

const corsOrigin = FRONTEND_ORIGINS.includes('*') ? true : FRONTEND_ORIGINS;
const io = new Server(server, { cors: { origin: corsOrigin, methods: ['GET','POST','PATCH','DELETE'] }, transports: ['websocket','polling'] });
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '64kb' }));

let db = null;
if (process.env.DATABASE_URL) {
  db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  console.log('[DB] DATABASE_URL ditemukan.');
} else console.warn('[DB] DATABASE_URL tidak ditemukan. Database dinonaktifkan.');

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
}
async function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!stored.startsWith('scrypt$')) return crypto.timingSafeEqual(Buffer.from(String(password)), Buffer.from(String(stored)));
  const [, salt, hex] = stored.split('$');
  const derived = Buffer.from(await scryptAsync(password, salt, 64));
  const expected = Buffer.from(hex, 'hex');
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}
function publicUser(row) {
  return { id: row.id, nama: row.username, role: row.role || 'user', status: row.active ? 'aktif' : 'nonaktif', banned: !!row.banned, muted: !!row.muted, dibuatOleh: row.created_by || 'system', tanggalDibuat: row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-' };
}
function requireDb(res) { if (db) return true; res.status(503).json({ok:false,message:'Database belum tersedia'}); return false; }
function isAdminRequest(req) { return req.get('x-admin-name') === ADMIN_NAME && req.get('x-admin-password') === ADMIN_PASSWORD; }
function requireAdmin(req,res,next) { if (!isAdminRequest(req)) return res.status(401).json({ok:false,message:'Admin tidak terautentikasi'}); next(); }

async function testDatabase() {
  if (!db) return;
  try { const r = await db.query('SELECT NOW() AS waktu'); console.log('[DB] PostgreSQL CONNECTED:', r.rows[0].waktu); }
  catch (e) { console.error('[DB] PostgreSQL CONNECTION ERROR:', e.message); }
}
async function initializeDatabase() {
  if (!db) return;
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, password_hash TEXT, role VARCHAR(30) DEFAULT 'user', active BOOLEAN DEFAULT TRUE, muted BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR(100) DEFAULT 'system'`);
    await db.query(`CREATE TABLE IF NOT EXISTS online_sessions (socket_id VARCHAR(255) PRIMARY KEY, username VARCHAR(100) NOT NULL, group_name VARCHAR(100), channel_name VARCHAR(100), peer_id VARCHAR(255), mic_status BOOLEAN DEFAULT FALSE, floor_status VARCHAR(30) DEFAULT 'idle', updated_at TIMESTAMPTZ DEFAULT NOW())`);
    await db.query(`CREATE TABLE IF NOT EXISTS chat_messages (id BIGSERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, group_name VARCHAR(100), channel_name VARCHAR(100), message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`);
    // ===== ADMIN SYNC STAGE A: PostgreSQL schema only =====
    await db.query(`CREATE TABLE IF NOT EXISTS app_config (
      config_key VARCHAR(100) PRIMARY KEY,
      config_value JSONB NOT NULL,
      updated_by VARCHAR(100) DEFAULT 'system',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGSERIAL PRIMARY KEY,
      admin_name VARCHAR(100) NOT NULL,
      action VARCHAR(100) NOT NULL,
      target TEXT,
      detail TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    const defaultGroups = [
      {nama:'Grup 1',prefix:'',status:'aktif',channel:[
        {nama:'CH 01',prefix:'',maxUsers:0,pttTimeout:0,status:'aktif',locked:false,muted:false},
        {nama:'CH 02',prefix:'',maxUsers:5,pttTimeout:30,status:'aktif',locked:false,muted:false},
        {nama:'CH 03',prefix:'',maxUsers:0,pttTimeout:0,status:'aktif',locked:false,muted:false}
      ]},
      {nama:'Grup 2',prefix:'',status:'aktif',channel:[
        {nama:'CH 01',prefix:'',maxUsers:0,pttTimeout:0,status:'aktif',locked:false,muted:false},
        {nama:'CH 02',prefix:'',maxUsers:3,pttTimeout:15,status:'aktif',locked:false,muted:false}
      ]}
    ];

    await db.query(
      `INSERT INTO app_config(config_key,config_value,updated_by)
       VALUES($1,$2::jsonb,$3)
       ON CONFLICT(config_key) DO NOTHING`,
      ['groups', JSON.stringify(defaultGroups), 'system']
    );

    const adminHash = await hashPassword(ADMIN_PASSWORD);
    await db.query(`INSERT INTO users(username,password_hash,role,active,banned,muted,created_by) VALUES($1,$2,'admin',TRUE,FALSE,FALSE,'system') ON CONFLICT(username) DO UPDATE SET role='admin'`, [ADMIN_NAME, adminHash]);
    console.log('[DB] Database tables READY.');
  } catch(e) { console.error('[DB] Database initialization ERROR:', e.message); }
}

// ===== USER / AUTH API =====
app.post('/api/auth/register', async (req,res) => {
  if (!requireDb(res)) return;
  try {
    const nama=String(req.body?.nama||'').trim(), sandi=String(req.body?.sandi||'');
    if(nama.length<2 || sandi.length<4) return res.status(400).json({ok:false,message:'Nama minimal 2 karakter dan password minimal 4 karakter.'});
    if(nama.toLowerCase()===ADMIN_NAME.toLowerCase()) return res.status(400).json({ok:false,message:'Nama ini tidak boleh digunakan.'});
    const h=await hashPassword(sandi);
    const r=await db.query(`INSERT INTO users(username,password_hash,role,active,banned,muted,created_by) VALUES($1,$2,'user',TRUE,FALSE,FALSE,$1) RETURNING *`,[nama,h]);
    console.log('[USER] REGISTER:', nama); res.json({ok:true,user:publicUser(r.rows[0])});
  } catch(e) { if(e.code==='23505') return res.status(409).json({ok:false,message:'Nama sudah terdaftar.'}); console.error('[USER] REGISTER ERROR:',e.message); res.status(500).json({ok:false,message:'Gagal mendaftar user.'}); }
});
app.post('/api/auth/login', async (req,res) => {
  if (!requireDb(res)) return;
  try {
    const nama=String(req.body?.nama||'').trim(), sandi=String(req.body?.sandi||'');
    const r=await db.query(`SELECT * FROM users WHERE lower(username)=lower($1) LIMIT 1`,[nama]);
    const u=r.rows[0]; if(!u || !(await verifyPassword(sandi,u.password_hash))) return res.status(401).json({ok:false,message:'Nama atau Kata Sandi salah!'});
    if(u.banned) return res.status(403).json({ok:false,message:'Akun Anda telah di-banned! Hubungi admin.'});
    if(!u.active) return res.status(403).json({ok:false,message:'Akun Anda dinonaktifkan! Hubungi admin.'});
    console.log('[USER] LOGIN:',u.username); res.json({ok:true,user:publicUser(u)});
  } catch(e){ console.error('[USER] LOGIN ERROR:',e.message); res.status(500).json({ok:false,message:'Login gagal.'}); }
});
app.get('/api/users', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const r=await db.query(`SELECT * FROM users ORDER BY id ASC`); res.json({ok:true,users:r.rows.map(publicUser)}); } catch(e){res.status(500).json({ok:false,message:e.message});} });
app.post('/api/users', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const nama=String(req.body?.nama||'').trim(),sandi=String(req.body?.sandi||''); if(nama.length<2||sandi.length<4)return res.status(400).json({ok:false,message:'Nama/password tidak valid.'}); const h=await hashPassword(sandi); const r=await db.query(`INSERT INTO users(username,password_hash,role,active,banned,muted,created_by) VALUES($1,$2,'user',TRUE,FALSE,FALSE,$3) RETURNING *`,[nama,h,ADMIN_NAME]); console.log('[USER] ADMIN CREATE:',nama); res.json({ok:true,user:publicUser(r.rows[0])}); } catch(e){ if(e.code==='23505')return res.status(409).json({ok:false,message:'Nama sudah terdaftar.'}); res.status(500).json({ok:false,message:e.message}); } });
app.patch('/api/users/:id', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const active=req.body?.status==='aktif', banned=!!req.body?.banned, muted=!!req.body?.muted; const r=await db.query(`UPDATE users SET active=$1,banned=$2,muted=$3,updated_at=NOW() WHERE id=$4 AND role<>'admin' RETURNING *`,[active,banned,muted,req.params.id]); if(!r.rows[0])return res.status(404).json({ok:false,message:'User tidak ditemukan/tidak dapat diubah.'}); console.log('[USER] UPDATE:',r.rows[0].username); res.json({ok:true,user:publicUser(r.rows[0])}); } catch(e){res.status(500).json({ok:false,message:e.message});} });
app.patch('/api/users/:id/password', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const sandi=String(req.body?.sandi||''); if(sandi.length<4)return res.status(400).json({ok:false,message:'Password minimal 4 karakter.'}); const h=await hashPassword(sandi); const r=await db.query(`UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2 AND role<>'admin' RETURNING username`,[h,req.params.id]); if(!r.rows[0])return res.status(404).json({ok:false,message:'User tidak ditemukan.'}); console.log('[USER] RESET PASSWORD:',r.rows[0].username); res.json({ok:true}); } catch(e){res.status(500).json({ok:false,message:e.message});} });
app.delete('/api/users/:id', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const r=await db.query(`DELETE FROM users WHERE id=$1 AND role<>'admin' RETURNING username`,[req.params.id]); if(!r.rows[0])return res.status(404).json({ok:false,message:'User tidak ditemukan.'}); console.log('[USER] DELETE:',r.rows[0].username); res.json({ok:true}); } catch(e){res.status(500).json({ok:false,message:e.message});} });

const sessions=new Map(), rooms=new Map(), kicked=new Map();
function publicSessions(){ const out={}; for(const s of sessions.values()) out[s.nama]={nama:s.nama,group:s.group,channel:s.channel,micStatus:!!s.micStatus,floorStatus:s.floorStatus||'idle',peerId:s.peerId||null,timestamp:s.timestamp}; return out; }
function roomUsers(room){ return [...(rooms.get(room)||new Set())].map(id=>sessions.get(id)).filter(Boolean).map(s=>({nama:s.nama,group:s.group,channel:s.channel,peerId:s.peerId,micStatus:!!s.micStatus,floorStatus:s.floorStatus||'idle'})); }
async function savePresence(s){ if(!db||!s)return; try{await db.query(`INSERT INTO online_sessions(socket_id,username,group_name,channel_name,peer_id,mic_status,floor_status,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,NOW()) ON CONFLICT(socket_id) DO UPDATE SET username=EXCLUDED.username,group_name=EXCLUDED.group_name,channel_name=EXCLUDED.channel_name,peer_id=EXCLUDED.peer_id,mic_status=EXCLUDED.mic_status,floor_status=EXCLUDED.floor_status,updated_at=NOW()`,[s.socketId,s.nama,s.group,s.channel,s.peerId,!!s.micStatus,s.floorStatus||'idle']);}catch(e){console.error('[DB] savePresence:',e.message);} }
async function removePresence(id){if(!db)return;try{await db.query(`DELETE FROM online_sessions WHERE socket_id=$1`,[id]);}catch(e){console.error('[DB] removePresence:',e.message);}}
function emitPresence(){io.emit('presence:update',publicSessions());}

app.get('/health',async(req,res)=>{let database='disabled';if(db){try{await db.query('SELECT 1');database='connected';}catch{database='error';}}res.json({ok:true,service:'komunikasi-group-realtime',version:'2.4.1-C',database,time:new Date().toISOString(),users:sessions.size});});

// ===== ADMIN SYNC STAGE B: PostgreSQL Group/Channel API =====
app.get('/api/config/groups', async (req,res) => {
  if(!requireDb(res)) return;
  try {
    const r = await db.query(
      `SELECT config_value, updated_by, updated_at
       FROM app_config
       WHERE config_key=$1
       LIMIT 1`,
      ['groups']
    );
    const row = r.rows[0];
    res.json({
      ok:true,
      groups:row?.config_value || [],
      updatedBy:row?.updated_by || 'system',
      updatedAt:row?.updated_at || null
    });
  } catch(e) {
    console.error('[CONFIG] GET GROUPS:', e.message);
    res.status(500).json({ok:false,message:'Gagal membaca konfigurasi Group/Channel.'});
  }
});

app.put('/api/config/groups', requireAdmin, async (req,res) => {
  if(!requireDb(res)) return;
  try {
    if(!Array.isArray(req.body?.groups)) {
      return res.status(400).json({ok:false,message:'Format groups tidak valid.'});
    }

    const groups = req.body.groups.map(g => ({
      nama:String(g?.nama || '').trim(),
      prefix:String(g?.prefix || ''),
      status:g?.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      channel:Array.isArray(g?.channel) ? g.channel.map(c => ({
        nama:String(c?.nama || '').trim(),
        prefix:String(c?.prefix || ''),
        maxUsers:Math.max(0, Number(c?.maxUsers) || 0),
        pttTimeout:Math.max(0, Number(c?.pttTimeout) || 0),
        status:c?.status === 'nonaktif' ? 'nonaktif' : 'aktif',
        locked:!!c?.locked,
        muted:!!c?.muted
      })).filter(c => c.nama) : []
    })).filter(g => g.nama);

    const r = await db.query(
      `INSERT INTO app_config(config_key,config_value,updated_by,updated_at)
       VALUES($1,$2::jsonb,$3,NOW())
       ON CONFLICT(config_key) DO UPDATE SET
         config_value=EXCLUDED.config_value,
         updated_by=EXCLUDED.updated_by,
         updated_at=NOW()
       RETURNING config_value,updated_by,updated_at`,
      ['groups', JSON.stringify(groups), ADMIN_NAME]
    );

    console.log('[CONFIG] GROUPS SAVED:', groups.length);

    // Stage C: broadcast the committed PostgreSQL configuration to all connected clients.
    io.emit('config:groups:update', {
      groups:r.rows[0].config_value,
      updatedBy:r.rows[0].updated_by,
      updatedAt:r.rows[0].updated_at
    });

    res.json({
      ok:true,
      groups:r.rows[0].config_value,
      updatedBy:r.rows[0].updated_by,
      updatedAt:r.rows[0].updated_at
    });
  } catch(e) {
    console.error('[CONFIG] PUT GROUPS:', e.message);
    res.status(500).json({ok:false,message:'Gagal menyimpan konfigurasi Group/Channel.'});
  }
});

app.get('/api/presence',(req,res)=>res.json({ok:true,sessions:publicSessions()}));

// ===== CLOUDFLARE REALTIME TURN =====
// TURN Key ID dan API Token tetap hanya di Railway Variables.
app.get('/api/turn-credentials', async (req, res) => {
  const keyId = process.env.CLOUDFLARE_TURN_KEY_ID;
  const apiToken = process.env.CLOUDFLARE_TURN_API_TOKEN;

  if (!keyId || !apiToken) {
    console.error('[TURN] Cloudflare TURN variables belum lengkap.');
    return res.status(503).json({ ok:false, message:'Cloudflare TURN belum dikonfigurasi di server.' });
  }

  try {
    const cfResponse = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(keyId)}/credentials/generate-ice-servers`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ttl: 86400 })
      }
    );

    const data = await cfResponse.json().catch(() => null);

    if (!cfResponse.ok) {
      console.error('[TURN] Cloudflare request gagal:', cfResponse.status, data);
      return res.status(502).json({
        ok:false,
        message:'Gagal memperoleh TURN credentials dari Cloudflare.',
        status:cfResponse.status
      });
    }

    let iceServers = [];
    if (Array.isArray(data?.iceServers)) iceServers = data.iceServers;
    else if (data && (data.urls || data.url)) iceServers = [data];

    if (!iceServers.length) {
      console.error('[TURN] Respons Cloudflare tidak berisi ICE servers.');
      return res.status(502).json({ ok:false, message:'Respons TURN Cloudflare tidak valid.' });
    }

    console.log('[TURN] Temporary ICE credentials generated.');
    res.json({ ok:true, ttl:86400, iceServers });
  } catch (e) {
    console.error('[TURN] ERROR:', e.message);
    res.status(502).json({ ok:false, message:'Tidak dapat menghubungi Cloudflare TURN.' });
  }
});

app.get('/api/db-test',async(req,res)=>{if(!requireDb(res))return;try{const r=await db.query(`SELECT NOW() AS server_time,current_database() AS database_name`);res.json({ok:true,database:'connected',result:r.rows[0]});}catch(e){res.status(500).json({ok:false,error:e.message});}});

io.on('connection',socket=>{
  console.log('[SOCKET] Connected:',socket.id); socket.emit('server:ready',{version:'2.4.1-C',transport:socket.conn.transport.name});
  socket.on('room:join',async payload=>{try{
    const nama=String(payload?.nama||'').trim(),group=String(payload?.group||'').trim(),channel=String(payload?.channel||'').trim(),peerId=String(payload?.peerId||'').trim(),maxUsers=Number(payload?.maxUsers||0);
    if(!nama||!group||!channel||!peerId)return socket.emit('room:error',{message:'Data room tidak lengkap.'});
    if(db){const ur=await db.query(`SELECT active,banned FROM users WHERE lower(username)=lower($1) LIMIT 1`,[nama]); if(!ur.rows[0])return socket.emit('room:error',{message:'User tidak terdaftar di database.'}); if(ur.rows[0].banned||!ur.rows[0].active)return socket.emit('room:error',{message:'Akun tidak diizinkan masuk.'});}
    const blockedUntil=kicked.get(nama);if(blockedUntil&&blockedUntil>Date.now())return socket.emit('room:error',{message:'Anda sedang di-kick oleh admin.'});
    const room=`${group}::${channel}`; const existing=[...(rooms.get(room)||new Set())].map(id=>sessions.get(id)).filter(Boolean).filter(s=>s.nama!==nama); if(maxUsers>0&&existing.length>=maxUsers)return socket.emit('room:error',{message:`Channel penuh! Maksimal ${maxUsers} user.`});
    const old=sessions.get(socket.id);if(old?.room){rooms.get(old.room)?.delete(socket.id);socket.leave(old.room);} const session={socketId:socket.id,nama,group,channel,room,peerId,micStatus:false,floorStatus:'idle',timestamp:Date.now()}; sessions.set(socket.id,session);if(!rooms.has(room))rooms.set(room,new Set());rooms.get(room).add(socket.id);socket.join(room);await savePresence(session);socket.emit('room:joined',{room,users:roomUsers(room),self:session});io.to(room).emit('room:users',roomUsers(room));emitPresence();console.log('[ROOM JOIN]',nama,'=>',room);
  }catch(e){console.error('[ROOM JOIN ERROR]',e);socket.emit('room:error',{message:e.message||'Gagal bergabung room.'});}});
  socket.on('presence:update',async patch=>{const s=sessions.get(socket.id);if(!s)return;if(typeof patch?.micStatus==='boolean')s.micStatus=patch.micStatus;if(typeof patch?.floorStatus==='string')s.floorStatus=patch.floorStatus;s.timestamp=Date.now();await savePresence(s);io.to(s.room).emit('room:users',roomUsers(s.room));emitPresence();});
  socket.on('floor:event',event=>{const s=sessions.get(socket.id);if(!s?.room)return;socket.to(s.room).emit('floor:event',{...event,from:s.nama});});
  socket.on('chat:send',async(payload,ack)=>{try{const s=sessions.get(socket.id);if(!s?.room){ack?.({ok:false,message:'Belum masuk channel.'});return;}const message=String(payload?.message||'').trim().slice(0,2000);if(!message){ack?.({ok:false,message:'Pesan kosong.'});return;}if(db){const ur=await db.query(`SELECT muted,active,banned FROM users WHERE lower(username)=lower($1) LIMIT 1`,[s.nama]);if(ur.rows[0]?.muted||!ur.rows[0]?.active||ur.rows[0]?.banned){ack?.({ok:false,message:'Akun tidak diizinkan mengirim pesan.'});return;}await db.query(`INSERT INTO chat_messages(username,group_name,channel_name,message) VALUES($1,$2,$3,$4)`,[s.nama,s.group,s.channel,message]);}io.to(s.room).emit('chat:message',{nama:s.nama,message});ack?.({ok:true});}catch(e){console.error('[CHAT ERROR]',e.message);socket.emit('chat:error',{message:'Pesan gagal dikirim.'});ack?.({ok:false,message:'Pesan gagal dikirim.'});}});
  socket.on('admin:kick',({nama})=>{if(!nama)return;kicked.set(nama,Date.now()+300000);for(const s of sessions.values())if(s.nama===nama){io.to(s.socketId).emit('admin:kick',{nama,expiresAt:kicked.get(nama)});io.sockets.sockets.get(s.socketId)?.disconnect(true);}});
  socket.on('disconnect',async reason=>{const s=sessions.get(socket.id);console.log('[SOCKET] Disconnect:',socket.id,reason);if(!s)return;rooms.get(s.room)?.delete(socket.id);if(rooms.get(s.room)?.size===0)rooms.delete(s.room);sessions.delete(socket.id);await removePresence(socket.id);if(s.room)io.to(s.room).emit('room:users',roomUsers(s.room));emitPresence();});
});
setInterval(async()=>{const cutoff=Date.now()-65000;for(const[id,s]of sessions)if(s.timestamp<cutoff){rooms.get(s.room)?.delete(id);sessions.delete(id);await removePresence(id);}emitPresence();},15000);

async function startServer(){console.log('========================================');console.log(' Komunikasi Group V2 Backend');console.log(' Version 2.4.1-C');console.log('========================================');await testDatabase();await initializeDatabase();server.listen(PORT,()=>{console.log(`[SERVER] Listening on port ${PORT}`);console.log(`[SERVER] PostgreSQL: ${db?'ENABLED':'DISABLED'}`);});}
startServer();
Library
/
server_v2.4.1-C_socket_live_sync.txt
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import crypto from 'crypto';
import { promisify } from 'util';
import { Server } from 'socket.io';
import pg from 'pg';

const { Pool } = pg;
const scryptAsync = promisify(crypto.scrypt);
const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || '*').split(',').map(s => s.trim()).filter(Boolean);
const ADMIN_NAME = process.env.ADMIN_NAME || 'Didik Suntoro';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'D1d1kSunt0r0@#$';

const corsOrigin = FRONTEND_ORIGINS.includes('*') ? true : FRONTEND_ORIGINS;
const io = new Server(server, { cors: { origin: corsOrigin, methods: ['GET','POST','PATCH','DELETE'] }, transports: ['websocket','polling'] });
app.use(cors({ origin: corsOrigin }));
app.use(express.json({ limit: '64kb' }));

let db = null;
if (process.env.DATABASE_URL) {
  db = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  console.log('[DB] DATABASE_URL ditemukan.');
} else console.warn('[DB] DATABASE_URL tidak ditemukan. Database dinonaktifkan.');

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = await scryptAsync(password, salt, 64);
  return `scrypt$${salt}$${Buffer.from(derived).toString('hex')}`;
}
async function verifyPassword(password, stored) {
  if (!stored) return false;
  if (!stored.startsWith('scrypt$')) return crypto.timingSafeEqual(Buffer.from(String(password)), Buffer.from(String(stored)));
  const [, salt, hex] = stored.split('$');
  const derived = Buffer.from(await scryptAsync(password, salt, 64));
  const expected = Buffer.from(hex, 'hex');
  return derived.length === expected.length && crypto.timingSafeEqual(derived, expected);
}
function publicUser(row) {
  return { id: row.id, nama: row.username, role: row.role || 'user', status: row.active ? 'aktif' : 'nonaktif', banned: !!row.banned, muted: !!row.muted, dibuatOleh: row.created_by || 'system', tanggalDibuat: row.created_at ? new Date(row.created_at).toLocaleDateString('id-ID') : '-' };
}
function requireDb(res) { if (db) return true; res.status(503).json({ok:false,message:'Database belum tersedia'}); return false; }
function isAdminRequest(req) { return req.get('x-admin-name') === ADMIN_NAME && req.get('x-admin-password') === ADMIN_PASSWORD; }
function requireAdmin(req,res,next) { if (!isAdminRequest(req)) return res.status(401).json({ok:false,message:'Admin tidak terautentikasi'}); next(); }

async function testDatabase() {
  if (!db) return;
  try { const r = await db.query('SELECT NOW() AS waktu'); console.log('[DB] PostgreSQL CONNECTED:', r.rows[0].waktu); }
  catch (e) { console.error('[DB] PostgreSQL CONNECTION ERROR:', e.message); }
}
async function initializeDatabase() {
  if (!db) return;
  try {
    await db.query(`CREATE TABLE IF NOT EXISTS users (id BIGSERIAL PRIMARY KEY, username VARCHAR(100) UNIQUE NOT NULL, password_hash TEXT, role VARCHAR(30) DEFAULT 'user', active BOOLEAN DEFAULT TRUE, muted BOOLEAN DEFAULT FALSE, created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW())`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS banned BOOLEAN DEFAULT FALSE`);
    await db.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS created_by VARCHAR(100) DEFAULT 'system'`);
    await db.query(`CREATE TABLE IF NOT EXISTS online_sessions (socket_id VARCHAR(255) PRIMARY KEY, username VARCHAR(100) NOT NULL, group_name VARCHAR(100), channel_name VARCHAR(100), peer_id VARCHAR(255), mic_status BOOLEAN DEFAULT FALSE, floor_status VARCHAR(30) DEFAULT 'idle', updated_at TIMESTAMPTZ DEFAULT NOW())`);
    await db.query(`CREATE TABLE IF NOT EXISTS chat_messages (id BIGSERIAL PRIMARY KEY, username VARCHAR(100) NOT NULL, group_name VARCHAR(100), channel_name VARCHAR(100), message TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW())`);
    // ===== ADMIN SYNC STAGE A: PostgreSQL schema only =====
    await db.query(`CREATE TABLE IF NOT EXISTS app_config (
      config_key VARCHAR(100) PRIMARY KEY,
      config_value JSONB NOT NULL,
      updated_by VARCHAR(100) DEFAULT 'system',
      updated_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    await db.query(`CREATE TABLE IF NOT EXISTS audit_logs (
      id BIGSERIAL PRIMARY KEY,
      admin_name VARCHAR(100) NOT NULL,
      action VARCHAR(100) NOT NULL,
      target TEXT,
      detail TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )`);

    const defaultGroups = [
      {nama:'Grup 1',prefix:'',status:'aktif',channel:[
        {nama:'CH 01',prefix:'',maxUsers:0,pttTimeout:0,status:'aktif',locked:false,muted:false},
        {nama:'CH 02',prefix:'',maxUsers:5,pttTimeout:30,status:'aktif',locked:false,muted:false},
        {nama:'CH 03',prefix:'',maxUsers:0,pttTimeout:0,status:'aktif',locked:false,muted:false}
      ]},
      {nama:'Grup 2',prefix:'',status:'aktif',channel:[
        {nama:'CH 01',prefix:'',maxUsers:0,pttTimeout:0,status:'aktif',locked:false,muted:false},
        {nama:'CH 02',prefix:'',maxUsers:3,pttTimeout:15,status:'aktif',locked:false,muted:false}
      ]}
    ];

    await db.query(
      `INSERT INTO app_config(config_key,config_value,updated_by)
       VALUES($1,$2::jsonb,$3)
       ON CONFLICT(config_key) DO NOTHING`,
      ['groups', JSON.stringify(defaultGroups), 'system']
    );

    const adminHash = await hashPassword(ADMIN_PASSWORD);
    await db.query(`INSERT INTO users(username,password_hash,role,active,banned,muted,created_by) VALUES($1,$2,'admin',TRUE,FALSE,FALSE,'system') ON CONFLICT(username) DO UPDATE SET role='admin'`, [ADMIN_NAME, adminHash]);
    console.log('[DB] Database tables READY.');
  } catch(e) { console.error('[DB] Database initialization ERROR:', e.message); }
}

// ===== USER / AUTH API =====
app.post('/api/auth/register', async (req,res) => {
  if (!requireDb(res)) return;
  try {
    const nama=String(req.body?.nama||'').trim(), sandi=String(req.body?.sandi||'');
    if(nama.length<2 || sandi.length<4) return res.status(400).json({ok:false,message:'Nama minimal 2 karakter dan password minimal 4 karakter.'});
    if(nama.toLowerCase()===ADMIN_NAME.toLowerCase()) return res.status(400).json({ok:false,message:'Nama ini tidak boleh digunakan.'});
    const h=await hashPassword(sandi);
    const r=await db.query(`INSERT INTO users(username,password_hash,role,active,banned,muted,created_by) VALUES($1,$2,'user',TRUE,FALSE,FALSE,$1) RETURNING *`,[nama,h]);
    console.log('[USER] REGISTER:', nama); res.json({ok:true,user:publicUser(r.rows[0])});
  } catch(e) { if(e.code==='23505') return res.status(409).json({ok:false,message:'Nama sudah terdaftar.'}); console.error('[USER] REGISTER ERROR:',e.message); res.status(500).json({ok:false,message:'Gagal mendaftar user.'}); }
});
app.post('/api/auth/login', async (req,res) => {
  if (!requireDb(res)) return;
  try {
    const nama=String(req.body?.nama||'').trim(), sandi=String(req.body?.sandi||'');
    const r=await db.query(`SELECT * FROM users WHERE lower(username)=lower($1) LIMIT 1`,[nama]);
    const u=r.rows[0]; if(!u || !(await verifyPassword(sandi,u.password_hash))) return res.status(401).json({ok:false,message:'Nama atau Kata Sandi salah!'});
    if(u.banned) return res.status(403).json({ok:false,message:'Akun Anda telah di-banned! Hubungi admin.'});
    if(!u.active) return res.status(403).json({ok:false,message:'Akun Anda dinonaktifkan! Hubungi admin.'});
    console.log('[USER] LOGIN:',u.username); res.json({ok:true,user:publicUser(u)});
  } catch(e){ console.error('[USER] LOGIN ERROR:',e.message); res.status(500).json({ok:false,message:'Login gagal.'}); }
});
app.get('/api/users', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const r=await db.query(`SELECT * FROM users ORDER BY id ASC`); res.json({ok:true,users:r.rows.map(publicUser)}); } catch(e){res.status(500).json({ok:false,message:e.message});} });
app.post('/api/users', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const nama=String(req.body?.nama||'').trim(),sandi=String(req.body?.sandi||''); if(nama.length<2||sandi.length<4)return res.status(400).json({ok:false,message:'Nama/password tidak valid.'}); const h=await hashPassword(sandi); const r=await db.query(`INSERT INTO users(username,password_hash,role,active,banned,muted,created_by) VALUES($1,$2,'user',TRUE,FALSE,FALSE,$3) RETURNING *`,[nama,h,ADMIN_NAME]); console.log('[USER] ADMIN CREATE:',nama); res.json({ok:true,user:publicUser(r.rows[0])}); } catch(e){ if(e.code==='23505')return res.status(409).json({ok:false,message:'Nama sudah terdaftar.'}); res.status(500).json({ok:false,message:e.message}); } });
app.patch('/api/users/:id', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const active=req.body?.status==='aktif', banned=!!req.body?.banned, muted=!!req.body?.muted; const r=await db.query(`UPDATE users SET active=$1,banned=$2,muted=$3,updated_at=NOW() WHERE id=$4 AND role<>'admin' RETURNING *`,[active,banned,muted,req.params.id]); if(!r.rows[0])return res.status(404).json({ok:false,message:'User tidak ditemukan/tidak dapat diubah.'}); console.log('[USER] UPDATE:',r.rows[0].username); res.json({ok:true,user:publicUser(r.rows[0])}); } catch(e){res.status(500).json({ok:false,message:e.message});} });
app.patch('/api/users/:id/password', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const sandi=String(req.body?.sandi||''); if(sandi.length<4)return res.status(400).json({ok:false,message:'Password minimal 4 karakter.'}); const h=await hashPassword(sandi); const r=await db.query(`UPDATE users SET password_hash=$1,updated_at=NOW() WHERE id=$2 AND role<>'admin' RETURNING username`,[h,req.params.id]); if(!r.rows[0])return res.status(404).json({ok:false,message:'User tidak ditemukan.'}); console.log('[USER] RESET PASSWORD:',r.rows[0].username); res.json({ok:true}); } catch(e){res.status(500).json({ok:false,message:e.message});} });
app.delete('/api/users/:id', requireAdmin, async (req,res)=>{ if(!requireDb(res)) return; try { const r=await db.query(`DELETE FROM users WHERE id=$1 AND role<>'admin' RETURNING username`,[req.params.id]); if(!r.rows[0])return res.status(404).json({ok:false,message:'User tidak ditemukan.'}); console.log('[USER] DELETE:',r.rows[0].username); res.json({ok:true}); } catch(e){res.status(500).json({ok:false,message:e.message});} });

const sessions=new Map(), rooms=new Map(), kicked=new Map();
function publicSessions(){ const out={}; for(const s of sessions.values()) out[s.nama]={nama:s.nama,group:s.group,channel:s.channel,micStatus:!!s.micStatus,floorStatus:s.floorStatus||'idle',peerId:s.peerId||null,timestamp:s.timestamp}; return out; }
function roomUsers(room){ return [...(rooms.get(room)||new Set())].map(id=>sessions.get(id)).filter(Boolean).map(s=>({nama:s.nama,group:s.group,channel:s.channel,peerId:s.peerId,micStatus:!!s.micStatus,floorStatus:s.floorStatus||'idle'})); }
async function savePresence(s){ if(!db||!s)return; try{await db.query(`INSERT INTO online_sessions(socket_id,username,group_name,channel_name,peer_id,mic_status,floor_status,updated_at) VALUES($1,$2,$3,$4,$5,$6,$7,NOW()) ON CONFLICT(socket_id) DO UPDATE SET username=EXCLUDED.username,group_name=EXCLUDED.group_name,channel_name=EXCLUDED.channel_name,peer_id=EXCLUDED.peer_id,mic_status=EXCLUDED.mic_status,floor_status=EXCLUDED.floor_status,updated_at=NOW()`,[s.socketId,s.nama,s.group,s.channel,s.peerId,!!s.micStatus,s.floorStatus||'idle']);}catch(e){console.error('[DB] savePresence:',e.message);} }
async function removePresence(id){if(!db)return;try{await db.query(`DELETE FROM online_sessions WHERE socket_id=$1`,[id]);}catch(e){console.error('[DB] removePresence:',e.message);}}
function emitPresence(){io.emit('presence:update',publicSessions());}

app.get('/health',async(req,res)=>{let database='disabled';if(db){try{await db.query('SELECT 1');database='connected';}catch{database='error';}}res.json({ok:true,service:'komunikasi-group-realtime',version:'2.4.1-C',database,time:new Date().toISOString(),users:sessions.size});});

// ===== ADMIN SYNC STAGE B: PostgreSQL Group/Channel API =====
app.get('/api/config/groups', async (req,res) => {
  if(!requireDb(res)) return;
  try {
    const r = await db.query(
      `SELECT config_value, updated_by, updated_at
       FROM app_config
       WHERE config_key=$1
       LIMIT 1`,
      ['groups']
    );
    const row = r.rows[0];
    res.json({
      ok:true,
      groups:row?.config_value || [],
      updatedBy:row?.updated_by || 'system',
      updatedAt:row?.updated_at || null
    });
  } catch(e) {
    console.error('[CONFIG] GET GROUPS:', e.message);
    res.status(500).json({ok:false,message:'Gagal membaca konfigurasi Group/Channel.'});
  }
});

app.put('/api/config/groups', requireAdmin, async (req,res) => {
  if(!requireDb(res)) return;
  try {
    if(!Array.isArray(req.body?.groups)) {
      return res.status(400).json({ok:false,message:'Format groups tidak valid.'});
    }

    const groups = req.body.groups.map(g => ({
      nama:String(g?.nama || '').trim(),
      prefix:String(g?.prefix || ''),
      status:g?.status === 'nonaktif' ? 'nonaktif' : 'aktif',
      channel:Array.isArray(g?.channel) ? g.channel.map(c => ({
        nama:String(c?.nama || '').trim(),
        prefix:String(c?.prefix || ''),
        maxUsers:Math.max(0, Number(c?.maxUsers) || 0),
        pttTimeout:Math.max(0, Number(c?.pttTimeout) || 0),
        status:c?.status === 'nonaktif' ? 'nonaktif' : 'aktif',
        locked:!!c?.locked,
        muted:!!c?.muted
      })).filter(c => c.nama) : []
    })).filter(g => g.nama);

    const r = await db.query(
      `INSERT INTO app_config(config_key,config_value,updated_by,updated_at)
       VALUES($1,$2::jsonb,$3,NOW())
       ON CONFLICT(config_key) DO UPDATE SET
         config_value=EXCLUDED.config_value,
         updated_by=EXCLUDED.updated_by,
         updated_at=NOW()
       RETURNING config_value,updated_by,updated_at`,
      ['groups', JSON.stringify(groups), ADMIN_NAME]
    );

    console.log('[CONFIG] GROUPS SAVED:', groups.length);

    // Stage C: broadcast the committed PostgreSQL configuration to all connected clients.
    io.emit('config:groups:update', {
      groups:r.rows[0].config_value,
      updatedBy:r.rows[0].updated_by,
      updatedAt:r.rows[0].updated_at
    });

    res.json({
      ok:true,
      groups:r.rows[0].config_value,
      updatedBy:r.rows[0].updated_by,
      updatedAt:r.rows[0].updated_at
    });
  } catch(e) {
    console.error('[CONFIG] PUT GROUPS:', e.message);
    res.status(500).json({ok:false,message:'Gagal menyimpan konfigurasi Group/Channel.'});
  }
});

app.get('/api/presence',(req,res)=>res.json({ok:true,sessions:publicSessions()}));

// ===== CLOUDFLARE REALTIME TURN =====
// TURN Key ID dan API Token tetap hanya di Railway Variables.
app.get('/api/turn-credentials', async (req, res) => {
  const keyId = process.env.CLOUDFLARE_TURN_KEY_ID;
  const apiToken = process.env.CLOUDFLARE_TURN_API_TOKEN;

  if (!keyId || !apiToken) {
    console.error('[TURN] Cloudflare TURN variables belum lengkap.');
    return res.status(503).json({ ok:false, message:'Cloudflare TURN belum dikonfigurasi di server.' });
  }

  try {
    const cfResponse = await fetch(
      `https://rtc.live.cloudflare.com/v1/turn/keys/${encodeURIComponent(keyId)}/credentials/generate-ice-servers`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ttl: 86400 })
      }
    );

    const data = await cfResponse.json().catch(() => null);

    if (!cfResponse.ok) {
      console.error('[TURN] Cloudflare request gagal:', cfResponse.status, data);
      return res.status(502).json({
        ok:false,
        message:'Gagal memperoleh TURN credentials dari Cloudflare.',
        status:cfResponse.status
      });
    }

    let iceServers = [];
    if (Array.isArray(data?.iceServers)) iceServers = data.iceServers;
    else if (data && (data.urls || data.url)) iceServers = [data];

    if (!iceServers.length) {
      console.error('[TURN] Respons Cloudflare tidak berisi ICE servers.');
      return res.status(502).json({ ok:false, message:'Respons TURN Cloudflare tidak valid.' });
    }

    console.log('[TURN] Temporary ICE credentials generated.');
    res.json({ ok:true, ttl:86400, iceServers });
  } catch (e) {
    console.error('[TURN] ERROR:', e.message);
    res.status(502).json({ ok:false, message:'Tidak dapat menghubungi Cloudflare TURN.' });
  }
});

app.get('/api/db-test',async(req,res)=>{if(!requireDb(res))return;try{const r=await db.query(`SELECT NOW() AS server_time,current_database() AS database_name`);res.json({ok:true,database:'connected',result:r.rows[0]});}catch(e){res.status(500).json({ok:false,error:e.message});}});

io.on('connection',socket=>{
  console.log('[SOCKET] Connected:',socket.id); socket.emit('server:ready',{version:'2.4.1-C',transport:socket.conn.transport.name});
  socket.on('room:join',async payload=>{try{
    const nama=String(payload?.nama||'').trim(),group=String(payload?.group||'').trim(),channel=String(payload?.channel||'').trim(),peerId=String(payload?.peerId||'').trim(),maxUsers=Number(payload?.maxUsers||0);
    if(!nama||!group||!channel||!peerId)return socket.emit('room:error',{message:'Data room tidak lengkap.'});
    if(db){const ur=await db.query(`SELECT active,banned FROM users WHERE lower(username)=lower($1) LIMIT 1`,[nama]); if(!ur.rows[0])return socket.emit('room:error',{message:'User tidak terdaftar di database.'}); if(ur.rows[0].banned||!ur.rows[0].active)return socket.emit('room:error',{message:'Akun tidak diizinkan masuk.'});}
    const blockedUntil=kicked.get(nama);if(blockedUntil&&blockedUntil>Date.now())return socket.emit('room:error',{message:'Anda sedang di-kick oleh admin.'});
    const room=`${group}::${channel}`; const existing=[...(rooms.get(room)||new Set())].map(id=>sessions.get(id)).filter(Boolean).filter(s=>s.nama!==nama); if(maxUsers>0&&existing.length>=maxUsers)return socket.emit('room:error',{message:`Channel penuh! Maksimal ${maxUsers} user.`});
    const old=sessions.get(socket.id);if(old?.room){rooms.get(old.room)?.delete(socket.id);socket.leave(old.room);} const session={socketId:socket.id,nama,group,channel,room,peerId,micStatus:false,floorStatus:'idle',timestamp:Date.now()}; sessions.set(socket.id,session);if(!rooms.has(room))rooms.set(room,new Set());rooms.get(room).add(socket.id);socket.join(room);await savePresence(session);socket.emit('room:joined',{room,users:roomUsers(room),self:session});io.to(room).emit('room:users',roomUsers(room));emitPresence();console.log('[ROOM JOIN]',nama,'=>',room);
  }catch(e){console.error('[ROOM JOIN ERROR]',e);socket.emit('room:error',{message:e.message||'Gagal bergabung room.'});}});
  socket.on('presence:update',async patch=>{const s=sessions.get(socket.id);if(!s)return;if(typeof patch?.micStatus==='boolean')s.micStatus=patch.micStatus;if(typeof patch?.floorStatus==='string')s.floorStatus=patch.floorStatus;s.timestamp=Date.now();await savePresence(s);io.to(s.room).emit('room:users',roomUsers(s.room));emitPresence();});
  socket.on('floor:event',event=>{const s=sessions.get(socket.id);if(!s?.room)return;socket.to(s.room).emit('floor:event',{...event,from:s.nama});});
  socket.on('chat:send',async(payload,ack)=>{try{const s=sessions.get(socket.id);if(!s?.room){ack?.({ok:false,message:'Belum masuk channel.'});return;}const message=String(payload?.message||'').trim().slice(0,2000);if(!message){ack?.({ok:false,message:'Pesan kosong.'});return;}if(db){const ur=await db.query(`SELECT muted,active,banned FROM users WHERE lower(username)=lower($1) LIMIT 1`,[s.nama]);if(ur.rows[0]?.muted||!ur.rows[0]?.active||ur.rows[0]?.banned){ack?.({ok:false,message:'Akun tidak diizinkan mengirim pesan.'});return;}await db.query(`INSERT INTO chat_messages(username,group_name,channel_name,message) VALUES($1,$2,$3,$4)`,[s.nama,s.group,s.channel,message]);}io.to(s.room).emit('chat:message',{nama:s.nama,message});ack?.({ok:true});}catch(e){console.error('[CHAT ERROR]',e.message);socket.emit('chat:error',{message:'Pesan gagal dikirim.'});ack?.({ok:false,message:'Pesan gagal dikirim.'});}});
  socket.on('admin:kick',({nama})=>{if(!nama)return;kicked.set(nama,Date.now()+300000);for(const s of sessions.values())if(s.nama===nama){io.to(s.socketId).emit('admin:kick',{nama,expiresAt:kicked.get(nama)});io.sockets.sockets.get(s.socketId)?.disconnect(true);}});
  socket.on('disconnect',async reason=>{const s=sessions.get(socket.id);console.log('[SOCKET] Disconnect:',socket.id,reason);if(!s)return;rooms.get(s.room)?.delete(socket.id);if(rooms.get(s.room)?.size===0)rooms.delete(s.room);sessions.delete(socket.id);await removePresence(socket.id);if(s.room)io.to(s.room).emit('room:users',roomUsers(s.room));emitPresence();});
});
setInterval(async()=>{const cutoff=Date.now()-65000;for(const[id,s]of sessions)if(s.timestamp<cutoff){rooms.get(s.room)?.delete(id);sessions.delete(id);await removePresence(id);}emitPresence();},15000);

async function startServer(){console.log('========================================');console.log(' Komunikasi Group V2 Backend');console.log(' Version 2.4.1-C');console.log('========================================');await testDatabase();await initializeDatabase();server.listen(PORT,()=>{console.log(`[SERVER] Listening on port ${PORT}`);console.log(`[SERVER] PostgreSQL: ${db?'ENABLED':'DISABLED'}`);});}
startServer();
