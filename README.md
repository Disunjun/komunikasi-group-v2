# komunikasi-group-v2

KomGrup - Realtime Communication Application for Group Voice & Text Communication

## 📋 Overview

**Komunikasi Group v2** (KomGrup) is a real-time communication platform designed for group voice and text communication. Built with modern web technologies, it provides push-to-talk (PTT) functionality, multiple channels per group, user management, and admin controls.

## ✨ Features

### User Features
- **Real-time Voice Communication**: Push-to-talk (PTT) functionality with floor control
- **Text Chat**: Send and receive messages in real-time
- **Multiple Groups & Channels**: Organized communication structure with configurable channels
- **User Status**: Visual indicators for mic status and speaking state
- **Dark/Light Mode**: Toggle between themes for comfortable viewing
- **PWA Support**: Install as a Progressive Web App for mobile/desktop use
- **Whisper Messages**: Private messaging between users

### Admin Features
- **User Management**: Create, edit, ban, mute, and delete users
- **Group/Channel Configuration**: Manage groups, channels, and their settings
- **Live Monitoring**: View online users and activity in real-time tree view
- **Activity Logs**: Track user actions and system events
- **Audit Logs**: Monitor admin actions for accountability
- **Statistics Dashboard**: View system metrics and usage statistics
- **Kick/Ban Controls**: Remove disruptive users from sessions

## 🛠️ Tech Stack

### Backend
- **Node.js** with ES Modules
- **Express.js** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **PostgreSQL** - Database (via Supabase or direct connection)
- **pg** - PostgreSQL client
- **crypto** - Password hashing (scrypt) and session tokens

### Frontend
- **Vanilla JavaScript** - No framework dependencies
- **CSS3** - Custom styling with CSS variables for theming
- **Web Audio API** - Audio capture and playback
- **Service Workers** - PWA offline support

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (for ES module support)
- PostgreSQL database (optional but recommended)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd komunikasi-group-v2
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=3000
   FRONTEND_ORIGINS=*
   
   # Admin Credentials (REQUIRED - no defaults for security)
   ADMIN_NAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   
   # Database (optional but recommended)
   DATABASE_URL=postgresql://user:password@localhost:5432/komgrup
   
   # Optional Admin Settings
   ADMIN_SESSION_TTL_MS=1800000
   ADMIN_LOGIN_MAX_ATTEMPTS=5
   ADMIN_LOGIN_WINDOW_MS=600000
   ADMIN_KICK_DURATION_MS=300000
   ```

4. **Initialize the database** (if using PostgreSQL)
   ```bash
   # The database tables will be created automatically on first run
   # Or manually run the schema.sql file
   psql -d your_database -f schema.sql
   ```

5. **Start the server**
   ```bash
   # Production
   npm start
   
   # Development (with auto-reload)
   npm run dev
   ```

6. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
komunikasi-group-v2/
├── server.js           # Main Express + Socket.IO server
├── index.html          # Frontend HTML/CSS/JS (single-page app)
├── package.json        # Dependencies and scripts
├── schema.sql          # Database schema
├── netlify.toml        # Netlify deployment configuration
├── manifest.json       # PWA manifest
├── sw.js               # Service worker for PWA
├── .env                # Environment variables (create this)
└── README.md           # This file
```

## 🔐 Security Features

- **Password Hashing**: scrypt algorithm with salt
- **Session Management**: Short-lived admin sessions with SHA-256 token hashing
- **Rate Limiting**: Login attempt throttling to prevent brute-force attacks
- **CORS Protection**: Configurable origin restrictions
- **Audit Logging**: All admin actions are logged
- **Environment Variables**: Sensitive credentials must be set via environment

## 🎮 Usage Guide

### For Users

1. **Register/Login**: Create an account or login with existing credentials
2. **Select Group**: Choose from available communication groups
3. **Join Channel**: Click on a channel to join
4. **Push-to-Talk**: Hold the PTT button to speak, release to listen
5. **Send Messages**: Type in the chat input and press Enter or Send

### For Admins

1. **Login**: Use admin credentials to access the admin panel
2. **Dashboard**: View statistics and system overview
3. **Users Tab**: Manage user accounts (create, edit, ban, mute, delete)
4. **Groups Tab**: Configure groups and channels
5. **Monitoring**: View live user activity in the tree view
6. **Logs**: Access activity and audit logs

## ⚙️ Configuration Options

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | 3000 | Server port |
| `FRONTEND_ORIGINS` | `*` | Comma-separated allowed origins |
| `ADMIN_NAME` | *(required)* | Admin username |
| `ADMIN_PASSWORD` | *(required)* | Admin password |
| `DATABASE_URL` | *(optional)* | PostgreSQL connection string |
| `ADMIN_SESSION_TTL_MS` | 1800000 | Admin session duration (30 min) |
| `ADMIN_LOGIN_MAX_ATTEMPTS` | 5 | Max login attempts before lockout |
| `ADMIN_LOGIN_WINDOW_MS` | 600000 | Login attempt window (10 min) |
| `ADMIN_KICK_DURATION_MS` | 300000 | Kick duration (5 min) |

### Default Groups & Channels

The system initializes with default groups:
- **Grup 1**: CH 01, CH 02 (max 5 users), CH 03
- **Grup 2**: CH 01, CH 02 (max 3 users)

## 🌐 Deployment

### Netlify

The application is configured for Netlify deployment:
- Static assets are cached aggressively
- Service worker and manifest have no-cache headers
- See `netlify.toml` for detailed configuration

### Manual Deployment

1. Set up Node.js environment on your server
2. Configure PostgreSQL database
3. Set environment variables
4. Run `npm install --production`
5. Start with `npm start` or use PM2 for process management

## 📊 Database Schema

The application uses the following tables:
- `users` - User accounts and credentials
- `online_sessions` - Active user connections
- `chat_messages` - Message history
- `app_config` - Application configuration (groups, channels)
- `audit_logs` - Admin action logs
- `activity_logs` - User activity tracking

## 🤝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Admin
- `POST /api/admin/login` - Admin login
- `GET /api/admin/session` - Get current admin session
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PATCH /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/groups` - Get groups configuration
- `POST /api/admin/groups` - Update groups configuration
- `GET /api/admin/activity` - Get activity logs
- `GET /api/admin/audit` - Get audit logs
- `GET /api/admin/stats` - Get system statistics

### Socket.IO Events
- `user:join` - User joins a channel
- `user:leave` - User leaves a channel
- `message:new` - New chat message
- `ptt:request` - Request floor for PTT
- `ptt:release` - Release floor
- `admin:user-kick` - Kick user (admin)
- `admin:user-ban` - Ban user (admin)

## 📝 License

This project is private and proprietary.

## 👥 Contributing

This is a private project. For questions or issues, contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: 2024
