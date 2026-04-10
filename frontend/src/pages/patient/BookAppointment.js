import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import DoctorCard from '../../components/DoctorCard';
import AppointmentForm from '../../components/AppointmentForm';
import { doctorService } from '../../services/doctorService';

const BookAppointment = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        doctorService.getById(doctorId).then(res => {
            setDoctor(res.data);
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [doctorId]);

    if (loading) return <div className="text-center py-5"><Spinner /></div>;

    if (!doctor) return <div>Bác sĩ không tồn tại</div>;

    return (
        <Container className="py-5">
            <Row>
                <Col md={4}>
                    <DoctorCard doctor={doctor} />
                </Col>
                <Col md={8}>
                    <h2>Lịch khám với {doctor.userId?.name}</h2>
                    <AppointmentForm doctorId={doctorId} />
                </Col>
            </Row>
        </Container>
    );
};

export default BookAppointment;

