require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const connectDB = require('./Config/database');
const User = require('./Models/User');
const Doctor = require('./Models/Doctor');
const Appointment = require('./Models/Appointment');
const MedicalRecord = require('./Models/MedicalRecord');
const bcrypt = require('bcrypt');

connectDB();

const seedData = async () => {
    try {
        // Clear old data
        await User.deleteMany({});
        await Doctor.deleteMany({});
        await Appointment.deleteMany({});
        await MedicalRecord.deleteMany({});

        const hashedPassword = await bcrypt.hash('123456', 10);

        // Create users
        const doctorUsers = await Promise.all([
            User.create({ name: 'BS. Nguyễn Văn Hải', email: 'hai@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Trần Thị Lan', email: 'lan@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Lê Minh Tuấn', email: 'tuan@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Phạm Quang Cường', email: 'cuong@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Võ Thị Yến', email: 'yen@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Đặng Thái Sơn', email: 'son@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Ngô Thanh Hương', email: 'huong@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Bùi Xuân Trường', email: 'truong@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Nguyễn Bảo Hà', email: 'ha@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),
            User.create({ name: 'BS. Trịnh Tấn Phong', email: 'phong@example.com', password: hashedPassword, role: 'doctor', avatar: 'https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg' }),

            // Patient & Staff
            User.create({ name: 'Patient Test', email: 'patient@test.com', password: hashedPassword, role: 'patient' }),
            User.create({ name: 'Staff Admin', email: 'staff@test.com', password: hashedPassword, role: 'staff' })
        ]);

        // Doctors
        await Doctor.create({
            userId: doctorUsers[0]._id, specialty: 'Nha khoa tổng quát', hospital: 'Bệnh viện Bạch Mai', experience: 10, fee: 500000,
            schedule: [{ day: 'T2', from: '8:00', to: '12:00' }, { day: 'T4', from: '13:00', to: '17:00' }], rating: 4.8, reviewsCount: 120
        });
        await Doctor.create({
            userId: doctorUsers[1]._id, specialty: 'Nhổ răng khôn', hospital: 'Bệnh viện Nhi TW', experience: 8, fee: 350000,
            schedule: [{ day: 'T3', from: '14:00', to: '17:00' }, { day: 'T5', from: '8:00', to: '11:00' }], rating: 4.5, reviewsCount: 89
        });
        await Doctor.create({
            userId: doctorUsers[2]._id, specialty: 'Niềng răng Thẩm mỹ', hospital: 'Bệnh viện Răng Hàm Mặt TW', experience: 12, fee: 400000,
            schedule: [{ day: 'T4', from: '9:00', to: '15:00' }, { day: 'T6', from: '9:00', to: '16:00' }], rating: 4.9, reviewsCount: 165
        });
        await Doctor.create({
            userId: doctorUsers[3]._id, specialty: 'Cấy ghép Implant', hospital: 'Nha Khoa Quốc Tế', experience: 15, fee: 1000000,
            schedule: [{ day: 'T2', from: '9:00', to: '17:00' }, { day: 'T7', from: '8:00', to: '12:00' }], rating: 5.0, reviewsCount: 230
        });
        await Doctor.create({
            userId: doctorUsers[4]._id, specialty: 'Tẩy trắng răng', hospital: 'Phòng Khám Răng Xinh', experience: 5, fee: 250000,
            schedule: [{ day: 'T3', from: '8:00', to: '12:00' }, { day: 'T5', from: '14:00', to: '18:00' }], rating: 4.2, reviewsCount: 45
        });
        await Doctor.create({
            userId: doctorUsers[5]._id, specialty: 'Bọc răng sứ', hospital: 'Bệnh viện Răng Hàm Mặt TW', experience: 9, fee: 600000,
            schedule: [{ day: 'T2', from: '13:00', to: '17:00' }, { day: 'T4', from: '8:00', to: '12:00' }], rating: 4.7, reviewsCount: 110
        });
        await Doctor.create({
            userId: doctorUsers[6]._id, specialty: 'Chữa tủy răng', hospital: 'Bệnh viện Đại học Y', experience: 11, fee: 450000,
            schedule: [{ day: 'T5', from: '8:00', to: '16:00' }, { day: 'T6', from: '8:00', to: '12:00' }], rating: 4.6, reviewsCount: 95
        });
        await Doctor.create({
            userId: doctorUsers[7]._id, specialty: 'Nha khoa trẻ em', hospital: 'Bệnh viện Nhi Đồng', experience: 7, fee: 300000,
            schedule: [{ day: 'T7', from: '8:00', to: '17:00' }, { day: 'CN', from: '8:00', to: '12:00' }], rating: 4.8, reviewsCount: 205
        });
        await Doctor.create({
            userId: doctorUsers[8]._id, specialty: 'Phục hình tháo lắp', hospital: 'Bệnh viện Bạch Mai', experience: 14, fee: 550000,
            schedule: [{ day: 'T3', from: '9:00', to: '12:00' }, { day: 'T6', from: '14:00', to: '17:00' }], rating: 4.4, reviewsCount: 78
        });
        await Doctor.create({
            userId: doctorUsers[9]._id, specialty: 'Tiểu phẫu cắt chóp', hospital: 'Bệnh viện Răng Hàm Mặt TW', experience: 16, fee: 800000,
            schedule: [{ day: 'T2', from: '8:00', to: '12:00' }, { day: 'T4', from: '8:00', to: '12:00' }], rating: 4.9, reviewsCount: 180
        });

        // Sample Appointment & Medical Record
        const aptDate = new Date();
        const sampleApt = await Appointment.create({
            patientId: doctorUsers[10]._id,
            doctorId: doctorUsers[0]._id,
            date: aptDate,
            time: '9:00',
            reason: 'Đau răng hàm dưới',
            status: 'completed',
            notes: 'Bệnh nhân đến khám theo lịch hẹn'
        });

        await MedicalRecord.create({
            patientId: doctorUsers[10]._id,
            doctorId: doctorUsers[0]._id,
            appointmentId: sampleApt._id,
            date: aptDate,
            diagnosis: 'Sâu răng hàm dưới (Răng số 7), cần hàn răng.',
            symptoms: 'Đau buốt khi ăn đồ lạnh, có lỗ hổng màu đen.',
            notes: 'Đã tư vấn phương pháp hàn Composite.'
        });

        console.log('✅ SEED THÀNH CÔNG!');
        console.log('👤 Patient: patient@test.com / 123456');
        console.log('👨‍⚕️ Doctor: (ex: hai@example.com / 123456)');
        console.log('👨‍💼 Staff: staff@test.com / 123456');
        process.exit(0);
    } catch (error) {
        console.error('❌ Seed lỗi:', error.message);
        process.exit(1);
    }
};

seedData();
