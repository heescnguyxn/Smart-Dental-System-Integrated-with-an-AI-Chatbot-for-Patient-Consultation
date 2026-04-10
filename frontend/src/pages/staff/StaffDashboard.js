import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { appointmentService } from '../../services/appointmentService';
import { Link } from 'react-router-dom';

const StaffDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const mockStats = { patients: 150, doctors: 25 };

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

    return (
        <Container className="py-5">
            <h1>Dashboard Nhân viên</h1>
            <Row className="mb-4">
                <Col md={4}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Bệnh nhân</Card.Title>
                            <h2>{mockStats.patients}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Bác sĩ</Card.Title>
                            <h2>{mockStats.doctors}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card>
                        <Card.Body className="text-center">
                            <Card.Title>Lịch hẹn</Card.Title>
                            <h2>{appointments.length}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="bg-primary text-white" style={{ cursor: 'pointer', marginTop: '15px' }} onClick={() => window.location.href='/manage-supplies'}>
                        <Card.Body className="text-center">
                            <Card.Title>Quản lý Vật tư</Card.Title>
                            <h2>Kho</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between align-items-center">
                            <span>Danh sách lịch hẹn mới nhất</span>
                            <Button as={Link} to="/manage-appointments" variant="primary" size="sm">Xem tất cả / Quản lý</Button>
                        </Card.Header>
                        <Card.Body>
                            <Table responsive hover>
                                <thead>
                                    <tr>
                                        <th>Mã LH</th>
                                        <th>Bệnh nhân</th>
                                        <th>Bác sĩ</th>
                                        <th>Ngày giờ</th>
                                        <th>Trạng thái</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.slice(0, 5).map(apt => (
                                        <tr key={apt._id}>
                                            <td>{apt._id.substring(apt._id.length - 6)}</td>
                                            <td>{apt.patientId?.name || 'N/A'}</td>
                                            <td>{apt.doctorId?.userId?.name || 'N/A'}</td>
                                            <td>{new Date(apt.date).toLocaleDateString('vi-VN')} {apt.time}</td>
                                            <td>
                                                <Badge bg={apt.status === 'confirmed' ? 'success' : apt.status === 'cancelled' ? 'danger' : 'warning'}>
                                                    {apt.status === 'pending' ? 'Chờ xác nhận' : apt.status === 'confirmed' ? 'Đã xác nhận' : apt.status === 'completed' ? 'Đã khám' : 'Đã hủy'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    ))}
                                    {appointments.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="text-center">Không có dữ liệu lịch hẹn</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default StaffDashboard;

