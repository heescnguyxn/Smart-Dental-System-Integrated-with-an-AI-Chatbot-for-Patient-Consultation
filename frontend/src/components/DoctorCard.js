import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaHospital, FaClock } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const DoctorCard = ({ doctor }) => {
    const { user } = useAuth();
    return (
        <Card className="h-100 shadow-sm doctor-card-hover" style={{ transition: 'transform 0.2s' }}>
            <Link to={`/doctor/${doctor._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Card.Img
                    variant="top"
                    height="200"
                    className="object-fit-cover"
                    src={doctor.userId?.avatar || "https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg"}
                    onError={(e) => { e.target.onerror = null; e.target.src = "https://blob.khoav4.com/1733804518305-9f81666e83e9a49f1c11fa0961fe220d.jpg" }}
                    alt="Nha sĩ"
                />
                <Card.Body>
                    <Card.Title>{doctor.userId?.name || 'Nha sĩ'}</Card.Title>
                    <Badge bg="info" className="mb-2">{doctor.specialty}</Badge>
                    <div className="mt-2 text-muted">
                        <FaHospital className="me-2" /> {doctor.hospital || 'Phòng Nha ABC'}
                    </div>
                    <div className="mt-1 text-muted">
                        <FaStar className="text-warning me-2" /> {doctor.rating || 4.5} ({doctor.reviewsCount || 0} đánh giá)
                    </div>
                    <div className="mt-2 fw-bold text-success fs-5">
                        <FaClock className="me-2" /> {doctor.fee?.toLocaleString('vi-VN')}đ
                    </div>
                </Card.Body>
            </Link>
            <Card.Footer className="pt-2 pb-2 bg-white border-top-0">
                {user && user.role === 'doctor' ? (
                    <Button as={Link} to="/doctor-dashboard" variant="success" className="w-100 rounded-pill py-2">
                        Xem lịch khám
                    </Button>
                ) : (
                    <Button as={Link} to={`/book/${doctor._id}`} variant="primary" className="w-100 rounded-pill py-2 shadow-sm">
                        Đặt Lịch Khám
                    </Button>
                )}
            </Card.Footer>
        </Card>
    );
};

export default DoctorCard;

