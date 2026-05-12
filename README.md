# Smart Dental System

## Setup (first time only)

```bash
# Backend
cd Backend
npm install
node seed.js   # seed sample data

# Frontend
cd ../frontend
npm install
```

Create `Backend/.env`:
```env
MONGO_URI=database_connect_string
JWT_SECRET=your_secret
PORT=5000
GROQ_API_KEY=your_groq_key
```

---

## Run

Open two terminals:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd Backend
npm run dev
```

```bash
# Terminal 2 — Frontend (http://localhost:3000)
cd frontend
npm start
```

---

## Test Accounts

| Role | Email | Password |
|---|---|---|
| Patient | patient@test.com | 123456 |
| Staff | staff@test.com | 123456 |
| Doctor | hai@example.com | 123456 |
