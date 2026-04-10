Phòng khám Nha khoa ABC - Hệ thống đặt lịch (KLTN)

## Chạy dự án

### Backend
```bash
cd Backend
npm install
# Seed database (chạy 1 lần)
node seed.js
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm start
```

## Features
- Đăng ký/đăng nhập (JWT)
- Tìm kiếm bác sĩ theo chuyên khoa
- Đặt lịch khám
- Dashboard bác sĩ/nhân viên
- ChatBot AI tư vấn
- Quản lý bệnh nhân/lịch hẹn (staff)

## Stack
- Frontend: React, Bootstrap, Axios
- Backend: Node.js, Express, Mongoose (MongoDB)
- Auth: JWT

