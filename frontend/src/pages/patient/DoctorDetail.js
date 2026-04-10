import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { doctorService } from '../../services/doctorService';
import { FaStar, FaHospital, FaClock, FaStethoscope, FaMoneyBillWave } from 'react-icons/fa';

const DoctorDetail = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await doctorService.getById(id);
                setDoctor(res.data);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctor();
    }, [id]);

    if (loading) return <Container className="py-5 text-center"><h4>Đang tải thông tin...</h4></Container>;
    if (!doctor) return <Container className="py-5 text-center"><h4>Không tìm thấy thông tin bác sĩ</h4></Container>;

    return (
        <Container className="py-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow-lg border-0 rounded-4 overflow-hidden">
                        <Row className="g-0">
                            <Col md={5} className="bg-light text-center p-4 d-flex flex-column justify-content-center align-items-center">
                                <img
                                    src={doctor.userId?.avatar || "https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg"}
                                    onError={(e) => { e.target.onerror = null; e.target.src="https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg" }}
                                    alt="Doctor Avatar"
                                    className="img-fluid rounded-circle mb-3 shadow-sm"
                                    style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #fff' }}
                                />
                                <h3 className="mb-1">{doctor.userId?.name || 'Bác sĩ'}</h3>
                                <Badge bg="primary" className="fs-6 px-3 py-2 mt-2">{doctor.specialty}</Badge>
                                
                                <div className="mt-4 w-100">
                                    <Button as={Link} to={`/book/${doctor._id}`} variant="success" size="lg" className="w-100 rounded-pill shadow-sm">
                                        Đặt Lịch Khám Ngay
                                    </Button>
                                </div>
                            </Col>
                            <Col md={7}>
                                <Card.Body className="p-4 p-md-5">
                                    <h4 className="mb-4 text-primary border-bottom pb-2">Thông Tin Chi Tiết</h4>
                                    
                                    <ListGroup variant="flush" className="mb-4">
                                        <ListGroup.Item className="px-0 py-3 d-flex align-items-center">
                                            <FaHospital className="text-muted me-3 fs-5" />
                                            <div>
                                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Nơi công tác</small>
                                                <span className="fs-6">{doctor.hospital || 'Đang cập nhật'}</span>
                                            </div>
                                        </ListGroup.Item>
                                        
                                        <ListGroup.Item className="px-0 py-3 d-flex align-items-center">
                                            <FaStethoscope className="text-muted me-3 fs-5" />
                                            <div>
                                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Kinh nghiệm</small>
                                                <span className="fs-6">{doctor.experience ? `${doctor.experience} năm` : 'Đang cập nhật'}</span>
                                            </div>
                                        </ListGroup.Item>

                                        <ListGroup.Item className="px-0 py-3 d-flex align-items-center">
                                            <FaStar className="text-warning me-3 fs-5" />
                                            <div>
                                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Đánh giá</small>
                                                <span className="fs-6">{doctor.rating || 0} / 5.0 <span className="text-muted">({doctor.reviewsCount || 0} lượt đánh giá)</span></span>
                                            </div>
                                        </ListGroup.Item>

                                        <ListGroup.Item className="px-0 py-3 d-flex align-items-center">
                                            <FaMoneyBillWave className="text-success me-3 fs-5" />
                                            <div>
                                                <small className="text-muted d-block text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>Phí khám</small>
                                                <span className="fs-6 fw-bold text-success">{doctor.fee ? `${doctor.fee.toLocaleString('vi-VN')} VNĐ` : 'Liên hệ'}</span>
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>

                                    <h5 className="mb-3 text-secondary">Lịch làm việc thường lệ</h5>
                                    {doctor.schedule && doctor.schedule.length > 0 ? (
                                        <div className="d-flex flex-wrap gap-2">
                                            {doctor.schedule.map((slot, idx) => (
                                                <Badge key={idx} bg="light" text="dark" className="border px-3 py-2 fw-normal">
                                                    <FaClock className="me-2 text-primary" />
                                                    {slot.day}: {slot.from} - {slot.to}
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted mb-0">Chưa có lịch cụ thể.</p>
                                    )}
                                </Card.Body>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DoctorDetail;
