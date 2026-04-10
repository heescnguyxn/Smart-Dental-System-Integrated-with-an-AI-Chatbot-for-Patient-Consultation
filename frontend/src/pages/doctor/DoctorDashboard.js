import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Card, Badge, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import { appointmentService } from '../../services/appointmentService';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaCalendarAlt, FaClock, FaUser, FaCheckCircle, FaHourglassHalf, FaChartLine, FaEdit, FaTimesCircle } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const DoctorDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Modal state for rescheduling
    const [showModal, setShowModal] = useState(false);
    const [selectedApt, setSelectedApt] = useState(null);
    const [newDate, setNewDate] = useState(new Date());
    const [newTime, setNewTime] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await appointmentService.getByDoctor();
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            setError('Không thể tải dữ liệu lịch hẹn, vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleUpdateStatus = async (id, status) => {
        try {
            setUpdateLoading(true);
            await appointmentService.update(id, { status });
            fetchAppointments(); // Refresh list after update
        } catch (err) {
            console.error(err);
            alert('Lỗi cập nhật trạng thái');
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleReschedule = async () => {
        if (!selectedApt) return;
        try {
            setUpdateLoading(true);
            await appointmentService.update(selectedApt._id, { date: newDate, time: newTime });
            setShowModal(false);
            fetchAppointments(); // Refresh list
        } catch (err) {
            console.error(err);
            alert('Lỗi thay đổi lịch hẹn');
        } finally {
            setUpdateLoading(false);
        }
    };

    const openRescheduleModal = (apt) => {
        setSelectedApt(apt);
        setNewDate(new Date(apt.date));
        setNewTime(apt.time || '');
        setShowModal(true);
    };

    const pendingApts = appointments.filter(apt => apt.status === 'pending').length;
    const confirmedApts = appointments.filter(apt => apt.status === 'confirmed' || apt.status === 'completed').length;

    const chartData = {
        labels: ['Hôm nay', 'Tuần này', 'Tháng này'],
        datasets: [{ 
            label: 'Tổng số lịch hẹn', 
            data: [appointments.length || 0, Math.floor((appointments.length || 0) * 1.5), Math.floor((appointments.length || 0) * 3)], 
            borderColor: '#4e73df',
            backgroundColor: 'rgba(78, 115, 223, 0.1)',
            fill: true,
            tension: 0.4
        }]
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill"><FaHourglassHalf className="me-1"/> Chờ xác nhận</Badge>;
            case 'confirmed': return <Badge bg="primary" className="px-3 py-2 rounded-pill"><FaCheckCircle className="me-1"/> Đã xác nhận</Badge>;
            case 'completed': return <Badge bg="success" className="px-3 py-2 rounded-pill"><FaCheckCircle className="me-1"/> Đã khám xong</Badge>;
            case 'cancelled': return <Badge bg="danger" className="px-3 py-2 rounded-pill">Đã hủy</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
        }
    };

    return (
        <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
            <div className="bg-primary text-white py-4 mb-4 shadow-sm">
                <Container>
                    <h2 className="mb-0 fw-bold"><FaChartLine className="me-2"/> Bảng điều khiển Bác sĩ</h2>
                    <p className="mb-0 mt-1 opacity-75">Quản lý lịch hẹn và bệnh nhân của bạn</p>
                </Container>
            </div>

            <Container>
                {/* Stats Row */}
                <Row className="mb-4">
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 rounded-4">
                            <Card.Body className="d-flex align-items-center">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3">
                                    <FaCalendarAlt size={24} className="text-primary" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Tổng lịch hẹn</h6>
                                    <h3 className="mb-0 fw-bold">{appointments.length}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 rounded-4">
                            <Card.Body className="d-flex align-items-center">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3">
                                    <FaHourglassHalf size={24} className="text-warning" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Chờ xác nhận</h6>
                                    <h3 className="mb-0 fw-bold">{pendingApts}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm h-100 rounded-4">
                            <Card.Body className="d-flex align-items-center">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3">
                                    <FaCheckCircle size={24} className="text-success" />
                                </div>
                                <div>
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Đã xác nhận / Hoàn thành</h6>
                                    <h3 className="mb-0 fw-bold">{confirmedApts}</h3>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {error && <Alert variant="danger">{error}</Alert>}

                <Row>
                    <Col lg={8} className="mb-4 mb-lg-0">
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                                <h5 className="fw-bold mb-0">Lịch hẹn sắp tới</h5>
                            </Card.Header>
                            <Card.Body>
                                {loading ? (
                                    <div className="d-flex justify-content-center align-items-center py-5">
                                        <Spinner animation="border" variant="primary" />
                                    </div>
                                ) : appointments.length === 0 ? (
                                    <div className="text-center py-5 text-muted">
                                        <div className="mb-3"><FaCalendarAlt size={48} className="opacity-25" /></div>
                                        <p className="mb-0">Hiện tại chưa có lịch hẹn nào.</p>
                                    </div>
                                ) : (
                                    <div className="table-responsive">
                                        <Table hover className="align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th className="border-0 rounded-start">Bệnh nhân</th>
                                                    <th className="border-0">Thời gian</th>
                                                    <th className="border-0">Trạng thái</th>
                                                    <th className="border-0">Ghi chú</th>
                                                    <th className="border-0 rounded-end text-center">Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {appointments.map(apt => (
                                                    <tr key={apt._id}>
                                                        <td>
                                                            <div className="d-flex align-items-center">
                                                                <div className="bg-light p-2 rounded-circle me-3 text-secondary">
                                                                    <FaUser />
                                                                </div>
                                                                <div className="fw-bold">
                                                                    {apt.patientId ? apt.patientId.name : 'Khách vãng lai'}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div className="mb-1"><FaCalendarAlt className="text-muted me-2 small"/> {new Date(apt.date).toLocaleDateString('vi-VN')}</div>
                                                            <div className="small text-muted"><FaClock className="me-2"/> {apt.time || 'N/A'}</div>
                                                        </td>
                                                        <td>{getStatusBadge(apt.status)}</td>
                                                        <td className="text-muted small">
                                                            {apt.notes ? (apt.notes.length > 30 ? apt.notes.substring(0,30) + '...' : apt.notes) : '-'}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center gap-2">
                                                                {apt.status === 'pending' && (
                                                                    <>
                                                                        <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(apt._id, 'confirmed')} disabled={updateLoading} title="Xác nhận">
                                                                            <FaCheckCircle />
                                                                        </Button>
                                                                        <Button variant="outline-danger" size="sm" onClick={() => handleUpdateStatus(apt._id, 'cancelled')} disabled={updateLoading} title="Hủy bỏ">
                                                                            <FaTimesCircle />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                                {apt.status === 'confirmed' && (
                                                                     <Button variant="outline-success" size="sm" onClick={() => handleUpdateStatus(apt._id, 'completed')} disabled={updateLoading} title="Hoàn thành">
                                                                            Đã khám xong
                                                                    </Button>
                                                                )}
                                                                {(apt.status === 'pending' || apt.status === 'confirmed') && (
                                                                    <Button variant="outline-primary" size="sm" onClick={() => openRescheduleModal(apt)} disabled={updateLoading} title="Thay đổi lịch hẹn">
                                                                        <FaEdit />
                                                                    </Button>
                                                                )}
                                                                {apt.status === 'completed' && <span className="text-muted small">Không có</span>}
                                                                {apt.status === 'cancelled' && <span className="text-muted small">Không có</span>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                    
                    <Col lg={4}>
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                                <h5 className="fw-bold mb-0">Tổng quan lịch khám</h5>
                            </Card.Header>
                            <Card.Body>
                                <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Reschedule Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thay đổi lịch hẹn</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Ngày khám mới</Form.Label>
                            <DatePicker 
                                selected={newDate} 
                                onChange={(date) => setNewDate(date)} 
                                className="form-control w-100" 
                                dateFormat="dd/MM/yyyy" 
                                minDate={new Date()}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Giờ khám mới</Form.Label>
                            <Form.Select value={newTime} onChange={(e) => setNewTime(e.target.value)}>
                                <option value="">Chọn giờ</option>
                                <option value="9:00">9:00</option>
                                <option value="10:00">10:00</option>
                                <option value="11:00">11:00</option>
                                <option value="14:00">14:00</option>
                                <option value="15:00">15:00</option>
                                <option value="16:00">16:00</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)} disabled={updateLoading}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={handleReschedule} disabled={updateLoading || !newTime}>
                        {updateLoading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default DoctorDashboard;

