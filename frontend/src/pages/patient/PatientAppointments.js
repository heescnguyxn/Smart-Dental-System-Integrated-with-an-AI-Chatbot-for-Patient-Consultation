import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Table } from 'react-bootstrap';
import { appointmentService } from '../../services/appointmentService';
import { FaCalendarAlt, FaClock, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaUserMd, FaNotesMedical, FaHistory } from 'react-icons/fa';

const PatientAppointments = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [updateLoading, setUpdateLoading] = useState(false);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const res = await appointmentService.getMy();
            setAppointments(res.data);
        } catch (err) {
            console.error("Failed to fetch appointments", err);
            setError('Không thể tải dữ liệu lịch khám của bạn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    const handleCancel = async (id) => {
        if (!window.confirm("Bạn có chắc chắn muốn hủy lịch hẹn này?")) return;
        
        try {
            setUpdateLoading(true);
            await appointmentService.update(id, { status: 'cancelled' });
            fetchAppointments(); // Refresh list after cancellation
        } catch (err) {
            console.error(err);
            alert('Có lỗi xảy ra khi hủy lịch hẹn. Vui lòng thử lại.');
        } finally {
            setUpdateLoading(false);
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill"><FaHourglassHalf className="me-1"/> Chờ xác nhận</Badge>;
            case 'confirmed': return <Badge bg="primary" className="px-3 py-2 rounded-pill"><FaCheckCircle className="me-1"/> Đã xác nhận</Badge>;
            case 'completed': return <Badge bg="success" className="px-3 py-2 rounded-pill"><FaCheckCircle className="me-1"/> Đã khám xong</Badge>;
            case 'cancelled': return <Badge bg="danger" className="px-3 py-2 rounded-pill"><FaTimesCircle className="me-1"/> Đã hủy</Badge>;
            default: return <Badge bg="secondary" className="px-3 py-2 rounded-pill">{status}</Badge>;
        }
    };

    const pendingApts = appointments.filter(apt => apt.status === 'pending').length;
    const confirmedApts = appointments.filter(apt => apt.status === 'confirmed').length;
    const pastApts = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled').length;

    return (
        <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
            <div className="bg-primary text-white py-4 mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                <Container>
                    <h2 className="mb-0 fw-bold"><FaCalendarAlt className="me-2 mb-1"/> Lịch Khám Của Tôi</h2>
                    <p className="mb-0 mt-1 opacity-75">Xem lại và quản lý các lịch hẹn nha khoa của bạn</p>
                </Container>
            </div>

            <Container>
                {/* Stats Row */}
                <Row className="mb-4">
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                            <Card.Body className="d-flex align-items-center position-relative">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 z-1">
                                    <FaHourglassHalf size={24} className="text-warning" />
                                </div>
                                <div className="z-1">
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Đang chờ xác nhận</h6>
                                    <h3 className="mb-0 fw-bold">{pendingApts}</h3>
                                </div>
                                <FaHourglassHalf className="position-absolute text-warning opacity-10" style={{ right: '-10px', bottom: '-10px', fontSize: '100px' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                            <Card.Body className="d-flex align-items-center position-relative">
                                <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 z-1">
                                    <FaCalendarAlt size={24} className="text-primary" />
                                </div>
                                <div className="z-1">
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Sắp tới (Đã xác nhận)</h6>
                                    <h3 className="mb-0 fw-bold">{confirmedApts}</h3>
                                </div>
                                <FaCalendarAlt className="position-absolute text-primary opacity-10" style={{ right: '-10px', bottom: '-10px', fontSize: '100px' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                            <Card.Body className="d-flex align-items-center position-relative">
                                <div className="bg-secondary bg-opacity-10 p-3 rounded-circle me-3 z-1">
                                    <FaHistory size={24} className="text-secondary" />
                                </div>
                                <div className="z-1">
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Lịch sử khám & Đã hủy</h6>
                                    <h3 className="mb-0 fw-bold">{pastApts}</h3>
                                </div>
                                <FaHistory className="position-absolute text-secondary opacity-10" style={{ right: '-10px', bottom: '-10px', fontSize: '100px' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {error && <Alert variant="danger" className="rounded-4 shadow-sm border-0">{error}</Alert>}

                <Card className="border-0 shadow-sm rounded-4 mb-4">
                    <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                        <h5 className="fw-bold mb-0 text-primary">Danh sách lịch hẹn</h5>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <div className="mb-3">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <FaCalendarAlt size={48} className="text-primary opacity-50" />
                                    </div>
                                </div>
                                <h5>Bạn chưa có lịch hẹn nào</h5>
                                <p className="mb-4">Hãy đặt lịch khám để chăm sóc nụ cười của bạn ngay hôm nay!</p>
                                <Button href="/book" variant="primary" className="px-4 py-2 rounded-pill fw-bold shadow-sm">
                                    Đặt Lịch Khám Mới
                                </Button>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle border-top-0 mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 rounded-start py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Bác sĩ phụ trách</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Thời gian chiếu</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Trạng thái</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Triệu chứng / Ghi chú</th>
                                            <th className="border-0 rounded-end text-center py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {appointments.sort((a, b) => new Date(b.date) - new Date(a.date)).map(apt => (
                                            <tr key={apt._id}>
                                                <td className="py-3">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary bg-opacity-10 p-2 rounded-circle me-3 text-primary">
                                                            <FaUserMd />
                                                        </div>
                                                        <div>
                                                            <div className="fw-bold text-dark">
                                                                {apt.doctorId && apt.doctorId.userId ? apt.doctorId.userId.name : 'Bác sĩ không xác định'}
                                                            </div>
                                                            <div className="text-muted small">Phòng khám cơ sở 1</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="mb-1 fw-medium"><FaCalendarAlt className="text-primary me-2 small"/> {new Date(apt.date).toLocaleDateString('vi-VN')}</div>
                                                    <div className="small text-muted"><FaClock className="me-2"/> {apt.time || 'Chưa cập nhật'}</div>
                                                </td>
                                                <td className="py-3">{getStatusBadge(apt.status)}</td>
                                                <td className="text-muted small py-3" style={{ maxWidth: '200px' }}>
                                                    <div className="d-flex align-items-start">
                                                        <FaNotesMedical className="me-2 mt-1 text-secondary" />
                                                        <span className="text-truncate d-inline-block w-100" title={apt.notes || 'Không có'}>
                                                            {apt.notes ? apt.notes : <em className="opacity-50">Không có</em>}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3">
                                                    <div className="d-flex justify-content-center gap-2">
                                                        {apt.status === 'pending' && (
                                                            <Button 
                                                                variant="outline-danger" 
                                                                size="sm" 
                                                                onClick={() => handleCancel(apt._id)} 
                                                                disabled={updateLoading} 
                                                                className="rounded-pill px-3 d-flex align-items-center"
                                                            >
                                                                {updateLoading ? <Spinner size="sm" className="me-1"/> : <FaTimesCircle className="me-1" />} Hủy lịch
                                                            </Button>
                                                        )}
                                                        {apt.status !== 'pending' && (
                                                            <span className="text-muted small fst-italic">Không có sẵn</span>
                                                        )}
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
            </Container>
        </div>
    );
};

export default PatientAppointments;
