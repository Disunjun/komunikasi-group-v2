import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { createClient } from '@supabase/supabase-js';

const app = express();
const server = http.createServer(app);
const PORT = Number(process.env.PORT || 3000);
const FRONTEND_ORIGINS = (process.env.FRONTEND_ORIGINS || '*').split(',').map(s => s.trim()).filter(Boolean);
const io = new Server(server, {
  cors: { origin: FRONTEND_ORIGINS.includes('*') ? true : FRONTEND_ORIGINS, methods: ['GET','POST'] },
  transports: ['websocket','polling']
});
app.use(cors({ origin: FRONTEND_ORIGINS.includes('*') ? true : FRONTEND_ORIGINS }));
app.use(express.json());

const sessions = new Map(); // socket.id -> session
const rooms = new Map(); // room -> Set(socket.id)
const kicked = new Map(); // username -> expiresAt

const supabase = process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession:false } })
  : null;

function publicSessions() {
  const out = {};
  for (const s of sessions.values()) out[s.nama] = {
    nama: s.nama, group: s.group, channel: s.channel,
    micStatus: !!s.micStatus, floorStatus: s.floorStatus || 'idle',
    peerId: s.peerId || null, timestamp: s.timestamp
  };
  return out;
}
function roomUsers(room) {
  const ids = rooms.get(room) || new Set();
  return [...ids].map(id => sessions.get(id)).filter(Boolean).map(s => ({
    nama:s.nama, group:s.group, channel:s.channel, peerId:s.peerId,
    micStatus:!!s.micStatus, floorStatus:s.floorStatus || 'idle'
  }));
}
async function persistPresence() {
  if (!supabase) return;
  const rows = [...sessions.values()].map(s => ({
    username:s.nama, group_name:s.group, channel_name:s.channel, peer_id:s.peerId,
    mic_status:!!s.micStatus, floor_status:s.floorStatus || 'idle',
    updated_at:new Date().toISOString(), socket_id:s.socketId
  }));
  try {
    await supabase.from('online_sessions').delete().neq('socket_id','__never__');
    if (rows.length) await supabase.from('online_sessions').upsert(rows, { onConflict:'socket_id' });
  } catch (e) { console.error('Supabase presence:', e.message); }
}
function emitPresence() {
  io.emit('presence:update', publicSessions());
}

app.get('/health', (req,res)=>res.json({ok:true, service:'komunikasi-group-realtime', time:new Date().toISOString(), users:sessions.size}));
app.get('/api/presence', (req,res)=>res.json({ok:true, sessions:publicSessions()}));

io.on('connection', socket => {
  socket.emit('server:ready', { version:'2.0.0', transport:socket.conn.transport.name });

  socket.on('room:join', async payload => {
    try {
      const nama = String(payload?.nama || '').trim();
      const group = String(payload?.group || '').trim();
      const channel = String(payload?.channel || '').trim();
      const peerId = String(payload?.peerId || '').trim();
      const maxUsers = Number(payload?.maxUsers || 0);
      if (!nama || !group || !channel || !peerId) return socket.emit('room:error',{message:'Data room tidak lengkap.'});
      const blockedUntil = kicked.get(nama);
      if (blockedUntil && blockedUntil > Date.now()) return socket.emit('room:error',{message:'Anda sedang di-kick oleh admin.'});

      const room = `${group}::${channel}`;
      const existing = [...(rooms.get(room) || new Set())]
        .map(id=>sessions.get(id)).filter(Boolean).filter(s=>s.nama !== nama);
      if (maxUsers > 0 && existing.length >= maxUsers) return socket.emit('room:error',{message:`Channel penuh! Maksimal ${maxUsers} user.`});

      // Leave previous room first.
      const old = sessions.get(socket.id);
      if (old?.room) {
        rooms.get(old.room)?.delete(socket.id);
        socket.leave(old.room);
      }
      const session = { socketId:socket.id, nama, group, channel, room, peerId, micStatus:false, floorStatus:'idle', timestamp:Date.now() };
      sessions.set(socket.id, session);
      if (!rooms.has(room)) rooms.set(room,new Set());
      rooms.get(room).add(socket.id);
      socket.join(room);
      socket.emit('room:joined',{room, users:roomUsers(room), self:session});
      io.to(room).emit('room:users',roomUsers(room));
      emitPresence();
      await persistPresence();
    } catch (e) { socket.emit('room:error',{message:e.message || 'Gagal bergabung room.'}); }
  });

  socket.on('presence:update', async patch => {
    const s = sessions.get(socket.id); if (!s) return;
    if (typeof patch?.micStatus === 'boolean') s.micStatus = patch.micStatus;
    if (typeof patch?.floorStatus === 'string') s.floorStatus = patch.floorStatus;
    s.timestamp = Date.now();
    io.to(s.room).emit('room:users',roomUsers(s.room));
    emitPresence();
    await persistPresence();
  });

  socket.on('floor:event', event => {
    const s = sessions.get(socket.id); if (!s?.room) return;
    socket.to(s.room).emit('floor:event', { ...event, from:s.nama });
  });

  socket.on('admin:kick', ({nama}) => {
    if (!nama) return;
    kicked.set(nama, Date.now()+300000);
    for (const s of sessions.values()) if (s.nama === nama) {
      io.to(s.socketId).emit('admin:kick',{nama, expiresAt:kicked.get(nama)});
      io.sockets.sockets.get(s.socketId)?.disconnect(true);
    }
  });

  socket.on('disconnect', async () => {
    const s = sessions.get(socket.id);
    if (!s) return;
    rooms.get(s.room)?.delete(socket.id);
    if (rooms.get(s.room)?.size === 0) rooms.delete(s.room);
    sessions.delete(socket.id);
    if (s.room) io.to(s.room).emit('room:users',roomUsers(s.room));
    emitPresence();
    await persistPresence();
  });
});

setInterval(()=>{
  const cutoff = Date.now()-65000;
  for (const [id,s] of sessions) if (s.timestamp < cutoff) {
    rooms.get(s.room)?.delete(id); sessions.delete(id);
  }
  emitPresence();
},15000);

server.listen(PORT,()=>console.log(`Komunikasi Group realtime server listening on :${PORT}`));
