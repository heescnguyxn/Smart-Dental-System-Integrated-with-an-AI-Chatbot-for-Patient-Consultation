import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';
import { appointmentService } from '../../services/appointmentService';

const ManageAppointments = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = async () => {
        try {
            const res = await appointmentService.getAll();
            setAppointments(res.data);
        } catch (error) {
            console.error('Error fetching appointments', error);
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            await appointmentService.update(id, { status });
            loadAppointments();
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    return (
        <Container className="py-5">
            <h1>Quản lý lịch hẹn</h1>
            <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Bệnh nhân</th>
                        <th>Bác sĩ</th>
                        <th>Ngày</th>
                        <th>Giờ</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map(apt => (
                        <tr key={apt._id}>
                            <td>{apt._id.substring(apt._id.length - 6)}</td>
                            <td>{apt.patientId?.name || 'N/A'}</td>
                            <td>{apt.doctorId?.userId?.name || 'N/A'}</td>
                            <td>{new Date(apt.date).toLocaleDateString('vi-VN')}</td>
                            <td>{apt.time}</td>
                            <td>
                                <Badge bg={apt.status === 'confirmed' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'warning'}>
                                    {apt.status === 'pending' ? 'Chờ xác nhận' : apt.status === 'confirmed' ? 'Đã xác nhận' : apt.status === 'completed' ? 'Đã khám' : 'Đã hủy'}
                                </Badge>
                            </td>
                            <td>
                                {apt.status === 'pending' && (
                                    <>
                                        <Button variant="outline-success" size="sm" className="me-1" onClick={() => handleUpdateStatus(apt._id, 'confirmed')}>Xác nhận</Button>
                                        <Button variant="outline-danger" size="sm" onClick={() => handleUpdateStatus(apt._id, 'cancelled')}>Hủy</Button>
                                    </>
                                )}
                                {apt.status === 'confirmed' && (
                                    <Button variant="outline-info" size="sm" className="me-1" onClick={() => handleUpdateStatus(apt._id, 'completed')}>Hoàn thành</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                    {appointments.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center">Không có dữ liệu lịch hẹn</td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageAppointments;
