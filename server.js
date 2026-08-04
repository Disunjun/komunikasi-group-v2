import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import pg from 'pg';

const { Pool } = pg;

// ======================================================
// APP / SERVER
// ======================================================

const app = express();
const server = http.createServer(app);

const PORT = Number(process.env.PORT || 3000);

const FRONTEND_ORIGINS = (
    process.env.FRONTEND_ORIGINS || '*'
)
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);


// ======================================================
// SOCKET.IO
// ======================================================

const io = new Server(server, {
    cors: {
        origin: FRONTEND_ORIGINS.includes('*')
            ? true
            : FRONTEND_ORIGINS,

        methods: ['GET', 'POST']
    },

    transports: ['websocket', 'polling']
});


app.use(cors({
    origin: FRONTEND_ORIGINS.includes('*')
        ? true
        : FRONTEND_ORIGINS
}));

app.use(express.json());


// ======================================================
// POSTGRESQL RAILWAY
// ======================================================

let db = null;

if (process.env.DATABASE_URL) {

    db = new Pool({
        connectionString: process.env.DATABASE_URL,

        ssl: {
            rejectUnauthorized: false
        }
    });

    console.log('[DB] DATABASE_URL ditemukan.');

} else {

    console.warn(
        '[DB] DATABASE_URL tidak ditemukan. Database dinonaktifkan.'
    );
}


// ======================================================
// TEST DATABASE CONNECTION
// ======================================================

async function testDatabase() {

    if (!db) return;

    try {

        const result = await db.query(
            'SELECT NOW() AS waktu'
        );

        console.log(
            '[DB] PostgreSQL CONNECTED:',
            result.rows[0].waktu
        );

    } catch (err) {

        console.error(
            '[DB] PostgreSQL CONNECTION ERROR:',
            err.message
        );
    }
}


// ======================================================
// CREATE TABLES
// ======================================================

async function initializeDatabase() {

    if (!db) return;

    try {

        // ------------------------------------------------
        // USERS
        // ------------------------------------------------

        await db.query(`
            CREATE TABLE IF NOT EXISTS users (

                id BIGSERIAL PRIMARY KEY,

                username VARCHAR(100)
                    UNIQUE
                    NOT NULL,

                password_hash TEXT,

                role VARCHAR(30)
                    DEFAULT 'user',

                active BOOLEAN
                    DEFAULT TRUE,

                muted BOOLEAN
                    DEFAULT FALSE,

                created_at TIMESTAMPTZ
                    DEFAULT NOW(),

                updated_at TIMESTAMPTZ
                    DEFAULT NOW()
            )
        `);


        // ------------------------------------------------
        // ONLINE SESSIONS
        // ------------------------------------------------

        await db.query(`
            CREATE TABLE IF NOT EXISTS online_sessions (

                socket_id VARCHAR(255)
                    PRIMARY KEY,

                username VARCHAR(100)
                    NOT NULL,

                group_name VARCHAR(100),

                channel_name VARCHAR(100),

                peer_id VARCHAR(255),

                mic_status BOOLEAN
                    DEFAULT FALSE,

                floor_status VARCHAR(30)
                    DEFAULT 'idle',

                updated_at TIMESTAMPTZ
                    DEFAULT NOW()
            )
        `);


        // ------------------------------------------------
        // CHAT MESSAGES
        // disiapkan sekarang untuk tahap berikutnya
        // ------------------------------------------------

        await db.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (

                id BIGSERIAL PRIMARY KEY,

                username VARCHAR(100)
                    NOT NULL,

                group_name VARCHAR(100),

                channel_name VARCHAR(100),

                message TEXT
                    NOT NULL,

                created_at TIMESTAMPTZ
                    DEFAULT NOW()
            )
        `);


        console.log(
            '[DB] Database tables READY.'
        );

    } catch (err) {

        console.error(
            '[DB] Database initialization ERROR:',
            err.message
        );
    }
}


// ======================================================
// REALTIME MEMORY STATE
// ======================================================

const sessions = new Map();

const rooms = new Map();

const kicked = new Map();


// ======================================================
// SESSION HELPERS
// ======================================================

function publicSessions() {

    const out = {};

    for (const s of sessions.values()) {

        out[s.nama] = {

            nama: s.nama,

            group: s.group,

            channel: s.channel,

            micStatus: !!s.micStatus,

            floorStatus:
                s.floorStatus || 'idle',

            peerId:
                s.peerId || null,

            timestamp:
                s.timestamp
        };
    }

    return out;
}


function roomUsers(room) {

    const ids =
        rooms.get(room) || new Set();

    return [...ids]

        .map(id =>
            sessions.get(id)
        )

        .filter(Boolean)

        .map(s => ({

            nama: s.nama,

            group: s.group,

            channel: s.channel,

            peerId: s.peerId,

            micStatus:
                !!s.micStatus,

            floorStatus:
                s.floorStatus || 'idle'
        }));
}


// ======================================================
// POSTGRES PRESENCE
// ======================================================

async function savePresence(session) {

    if (!db || !session)
        return;

    try {

        await db.query(
            `
            INSERT INTO online_sessions
            (
                socket_id,
                username,
                group_name,
                channel_name,
                peer_id,
                mic_status,
                floor_status,
                updated_at
            )

            VALUES
            (
                $1,$2,$3,$4,$5,$6,$7,NOW()
            )

            ON CONFLICT (socket_id)

            DO UPDATE SET

                username =
                    EXCLUDED.username,

                group_name =
                    EXCLUDED.group_name,

                channel_name =
                    EXCLUDED.channel_name,

                peer_id =
                    EXCLUDED.peer_id,

                mic_status =
                    EXCLUDED.mic_status,

                floor_status =
                    EXCLUDED.floor_status,

                updated_at =
                    NOW()
            `,

            [
                session.socketId,
                session.nama,
                session.group,
                session.channel,
                session.peerId,
                !!session.micStatus,
                session.floorStatus || 'idle'
            ]
        );

    } catch (err) {

        console.error(
            '[DB] savePresence:',
            err.message
        );
    }
}


async function removePresence(socketId) {

    if (!db)
        return;

    try {

        await db.query(
            `
            DELETE FROM online_sessions
            WHERE socket_id = $1
            `,
            [socketId]
        );

    } catch (err) {

        console.error(
            '[DB] removePresence:',
            err.message
        );
    }
}


// ======================================================
// EMIT PRESENCE
// ======================================================

function emitPresence() {

    io.emit(
        'presence:update',
        publicSessions()
    );
}


// ======================================================
// HTTP HEALTH
// ======================================================

app.get('/health', async (req, res) => {

    let database = 'disabled';

    if (db) {

        try {

            await db.query('SELECT 1');

            database = 'connected';

        } catch {

            database = 'error';
        }
    }

    res.json({

        ok: true,

        service:
            'komunikasi-group-realtime',

        version:
            '2.1.0',

        database,

        time:
            new Date().toISOString(),

        users:
            sessions.size
    });
});


// ======================================================
// PRESENCE API
// ======================================================

app.get(
    '/api/presence',
    (req, res) => {

        res.json({

            ok: true,

            sessions:
                publicSessions()
        });
    }
);


// ======================================================
// DATABASE TEST API
// ======================================================

app.get(
    '/api/db-test',

    async (req, res) => {

        if (!db) {

            return res
                .status(503)
                .json({

                    ok: false,

                    database:
                        'DATABASE_URL not configured'
                });
        }

        try {

            const result =
                await db.query(`
                    SELECT
                        NOW() AS server_time,
                        current_database() AS database_name
                `);

            res.json({

                ok: true,

                database:
                    'connected',

                result:
                    result.rows[0]
            });

        } catch (err) {

            res
                .status(500)
                .json({

                    ok: false,

                    error:
                        err.message
                });
        }
    }
);


// ======================================================
// SOCKET.IO
// ======================================================

io.on(
    'connection',

    socket => {

        console.log(
            '[SOCKET] Connected:',
            socket.id
        );


        socket.emit(
            'server:ready',

            {
                version:
                    '2.1.0',

                transport:
                    socket.conn.transport.name
            }
        );


        // ==================================================
        // ROOM JOIN
        // ==================================================

        socket.on(
            'room:join',

            async payload => {

                try {

                    const nama =
                        String(
                            payload?.nama || ''
                        ).trim();

                    const group =
                        String(
                            payload?.group || ''
                        ).trim();

                    const channel =
                        String(
                            payload?.channel || ''
                        ).trim();

                    const peerId =
                        String(
                            payload?.peerId || ''
                        ).trim();

                    const maxUsers =
                        Number(
                            payload?.maxUsers || 0
                        );


                    if (
                        !nama ||
                        !group ||
                        !channel ||
                        !peerId
                    ) {

                        return socket.emit(
                            'room:error',

                            {
                                message:
                                    'Data room tidak lengkap.'
                            }
                        );
                    }


                    // ---------------------------------------
                    // KICK CHECK
                    // ---------------------------------------

                    const blockedUntil =
                        kicked.get(nama);

                    if (
                        blockedUntil &&
                        blockedUntil > Date.now()
                    ) {

                        return socket.emit(
                            'room:error',

                            {
                                message:
                                    'Anda sedang di-kick oleh admin.'
                            }
                        );
                    }


                    const room =
                        `${group}::${channel}`;


                    // ---------------------------------------
                    // MAX USERS
                    // ---------------------------------------

                    const existing =
                        [
                            ...(
                                rooms.get(room) ||
                                new Set()
                            )
                        ]

                        .map(id =>
                            sessions.get(id)
                        )

                        .filter(Boolean)

                        .filter(
                            s =>
                                s.nama !== nama
                        );


                    if (
                        maxUsers > 0 &&
                        existing.length >= maxUsers
                    ) {

                        return socket.emit(
                            'room:error',

                            {
                                message:
                                    `Channel penuh! Maksimal ${maxUsers} user.`
                            }
                        );
                    }


                    // ---------------------------------------
                    // LEAVE OLD ROOM
                    // ---------------------------------------

                    const old =
                        sessions.get(socket.id);


                    if (old?.room) {

                        rooms
                            .get(old.room)
                            ?.delete(socket.id);

                        socket.leave(
                            old.room
                        );
                    }


                    // ---------------------------------------
                    // CREATE SESSION
                    // ---------------------------------------

                    const session = {

                        socketId:
                            socket.id,

                        nama,

                        group,

                        channel,

                        room,

                        peerId,

                        micStatus:
                            false,

                        floorStatus:
                            'idle',

                        timestamp:
                            Date.now()
                    };


                    sessions.set(
                        socket.id,
                        session
                    );


                    if (
                        !rooms.has(room)
                    ) {

                        rooms.set(
                            room,
                            new Set()
                        );
                    }


                    rooms
                        .get(room)
                        .add(socket.id);


                    socket.join(room);


                    // ---------------------------------------
                    // SAVE POSTGRES
                    // ---------------------------------------

                    await savePresence(
                        session
                    );


                    // ---------------------------------------
                    // RESPONSE
                    // ---------------------------------------

                    socket.emit(
                        'room:joined',

                        {
                            room,

                            users:
                                roomUsers(room),

                            self:
                                session
                        }
                    );


                    io.to(room)
                        .emit(
                            'room:users',
                            roomUsers(room)
                        );


                    emitPresence();


                    console.log(
                        '[ROOM JOIN]',
                        nama,
                        '=>',
                        room
                    );


                } catch (err) {

                    console.error(
                        '[ROOM JOIN ERROR]',
                        err
                    );


                    socket.emit(
                        'room:error',

                        {
                            message:
                                err.message ||
                                'Gagal bergabung room.'
                        }
                    );
                }
            }
        );


        // ==================================================
        // PRESENCE UPDATE
        // ==================================================

        socket.on(
            'presence:update',

            async patch => {

                const s =
                    sessions.get(
                        socket.id
                    );

                if (!s)
                    return;


                if (
                    typeof patch?.micStatus ===
                    'boolean'
                ) {

                    s.micStatus =
                        patch.micStatus;
                }


                if (
                    typeof patch?.floorStatus ===
                    'string'
                ) {

                    s.floorStatus =
                        patch.floorStatus;
                }


                s.timestamp =
                    Date.now();


                await savePresence(s);


                io.to(s.room)
                    .emit(
                        'room:users',
                        roomUsers(s.room)
                    );


                emitPresence();
            }
        );


        // ==================================================
        // FLOOR / PTT EVENT
        // ==================================================

        socket.on(
            'floor:event',

            event => {

                const s =
                    sessions.get(
                        socket.id
                    );

                if (!s?.room)
                    return;


                socket
                    .to(s.room)
                    .emit(
                        'floor:event',

                        {
                            ...event,

                            from:
                                s.nama
                        }
                    );
            }
        );


        // ==================================================
        // ADMIN KICK
        // ==================================================

        socket.on(
            'admin:kick',

            ({ nama }) => {

                if (!nama)
                    return;


                kicked.set(
                    nama,
                    Date.now() + 300000
                );


                for (
                    const s of
                    sessions.values()
                ) {

                    if (
                        s.nama === nama
                    ) {

                        io.to(
                            s.socketId
                        ).emit(
                            'admin:kick',

                            {
                                nama,

                                expiresAt:
                                    kicked.get(nama)
                            }
                        );


                        io.sockets
                            .sockets
                            .get(
                                s.socketId
                            )
                            ?.disconnect(true);
                    }
                }
            }
        );


        // ==================================================
        // DISCONNECT
        // ==================================================

        socket.on(
            'disconnect',

            async reason => {

                const s =
                    sessions.get(
                        socket.id
                    );


                console.log(
                    '[SOCKET] Disconnect:',
                    socket.id,
                    reason
                );


                if (!s)
                    return;


                rooms
                    .get(s.room)
                    ?.delete(
                        socket.id
                    );


                if (
                    rooms
                        .get(s.room)
                        ?.size === 0
                ) {

                    rooms.delete(
                        s.room
                    );
                }


                sessions.delete(
                    socket.id
                );


                await removePresence(
                    socket.id
                );


                if (s.room) {

                    io.to(s.room)
                        .emit(
                            'room:users',
                            roomUsers(s.room)
                        );
                }


                emitPresence();
            }
        );
    }
);


// ======================================================
// CLEANUP STALE SESSION
// ======================================================

setInterval(
    async () => {

        const cutoff =
            Date.now() - 65000;


        for (
            const [id, s]
            of sessions
        ) {

            if (
                s.timestamp <
                cutoff
            ) {

                rooms
                    .get(s.room)
                    ?.delete(id);

                sessions.delete(id);

                await removePresence(id);
            }
        }


        emitPresence();

    },

    15000
);


// ======================================================
// START SERVER
// ======================================================

async function startServer() {

    console.log(
        '========================================'
    );

    console.log(
        ' Komunikasi Group V2 Backend'
    );

    console.log(
        ' Version 2.1.0'
    );

    console.log(
        '========================================'
    );


    await testDatabase();

    await initializeDatabase();


    server.listen(
        PORT,

        () => {

            console.log(
                `[SERVER] Listening on port ${PORT}`
            );

            console.log(
                `[SERVER] PostgreSQL: ${
                    db
                        ? 'ENABLED'
                        : 'DISABLED'
                }`
            );
        }
    );
}


startServer();