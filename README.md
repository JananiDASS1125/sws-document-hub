# SWS AI Document Hub

A full-stack Document Management Dashboard built with the MERN stack. Users can upload company PDF documents, track upload progress in real time, and receive notifications when background processing completes.

## Live Demo
> Run locally using the steps below.

---

## Tech Stack

- **Frontend:** React.js, Axios, WebSocket API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Real-time:** WebSocket (ws library)
- **File Handling:** Multer
- **Font:** Livvic (Google Fonts)

---

## Features

### 1. File Upload — Individual & Bulk
- Drag and drop or click to browse
- Single and multiple file upload support
- Real-time per-file progress bars with filename, size, and status
- Files stored on server with metadata saved to MongoDB
- Uploaded files appear in a document table with download option

### 2. Smart Notifications for Bulk Uploads
- Upload 1–3 files → individual inline progress bars
- Upload 4+ files → background processing toast banner appears immediately
- WebSocket pushes real-time notification when all files are processed
- Notification reads: "X files uploaded successfully" with timestamp

### 3. Notification Center
- Bell icon in header with unread count badge
- Click bell to open notification dropdown
- All notifications fetched from MongoDB — persists across page refresh
- Mark individual notification as read
- Mark all notifications as read

### 4. AI Assistant (UI)
- Chat interface matching SWS AI design
- Suggested question chips for company policies
- Ready for Claude/Groq API integration

---
**Structure:**
sws-document-hub/
├── backend/
│   ├── models/
│   │   ├── File.js
│   │   └── Notification.js
│   ├── routes/
│   │   ├── files.js
│   │   └── notifications.js
│   ├── uploads/
│   ├── server.js
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── UploadZone.jsx
│   │   │   ├── FileList.jsx
│   │   │   ├── NotificationPanel.jsx
│   │   │   └── AIAssistant.jsx
│   │   ├── App.js
│   │   └── index.css
│   └── package.json
└── README.md

## Prerequisites

- Node.js v18+
- MongoDB (local) or MongoDB Atlas
- npm

---

## Setup & Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/JananiDASS1125/sws-document-hub.git
cd sws-document-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file inside `backend/`:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sws-document-hub

Start the backend:
```bash
node server.js
```

You should see:
✅ MongoDB connected
🚀 Server running on port 5000

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

App opens at **http://localhost:3000**

---

## API Endpoints

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/files/upload | Upload single or multiple files |
| GET | /api/files | Get all uploaded files |
| GET | /api/files/download/:id | Download a file by ID |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/notifications | Get all notifications |
| GET | /api/notifications/unread-count | Get unread count |
| PATCH | /api/notifications/:id/read | Mark one as read |
| PATCH | /api/notifications/mark-all-read | Mark all as read |

---

## WebSocket Flow

1. User uploads 4+ files
2. Backend processes all files and saves to MongoDB
3. Backend saves notification to MongoDB
4. Backend broadcasts WebSocket event to all connected clients
5. Frontend receives event and shows toast notification
6. Bell icon badge updates with new unread count

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/sws-document-hub |

