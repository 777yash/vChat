# 🎥 vChat — Video Chat for Language Learners

A real-time video chat platform that connects language learners worldwide. Find partners who speak the language you're learning, and who want to learn yours.

## ✨ Features

- **Video & Text Chat** — Real-time messaging and video calls powered by Stream
- **Smart Matching** — Get recommended partners based on your native and learning languages
- **Friend System** — Send requests, accept, search, and manage your connections
- **Profile Customization** — Upload a photo or generate a random avatar, edit bio & languages
- **30+ Themes** — Switch between dark, light, and colorful DaisyUI themes
- **Notifications** — Stay on top of incoming friend requests

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React, Vite, Tailwind CSS, DaisyUI |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT + Cookies |
| Chat/Video | Stream Chat & Video SDK |
| State | TanStack Query, Zustand |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account
- [Stream](https://getstream.io) API keys

### Setup

```bash
# Clone
git clone https://github.com/777yash/vChat.git
cd vChat

# Backend
cd backend
cp .env.example .env   # fill in your keys
npm install

# Frontend
cd ../frontend
npm install

# Run both (from root)
cd ..
npm run build   # install all deps + build frontend
npm run start   # start the server
```

### Environment Variables (`backend/.env`)

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
STEAM_API_KEY=your_stream_api_key
STEAM_API_SECRET=your_stream_api_secret
JWT_SECRET_KEY=your_jwt_secret
NODE_ENV=development
```

## 📁 Project Structure

```
vchat/
├── backend/
│   └── src/
│       ├── controllers/    # Auth, User, Chat logic
│       ├── models/         # User, FriendRequest schemas
│       ├── routes/         # API endpoints
│       ├── middleware/     # JWT auth guard
│       └── server.js       # Express entry point
├── frontend/
│   └── src/
│       ├── pages/          # Home, Friends, Profile, Chat, etc.
│       ├── components/     # Sidebar, Navbar, FriendCard, etc.
│       ├── hooks/          # Auth, Login, Logout hooks
│       ├── lib/            # API client, Axios, utils
│       └── store/          # Zustand theme store
└── package.json            # Root build & start scripts
```
