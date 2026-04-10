import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { appointmentService } from '../services/appointmentService';
import { useParams } from 'react-router-dom';

const AppointmentForm = ({ doctorId }) => {
    const { doctorId: paramId } = useParams();
    const id = paramId || doctorId;
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState('');
    const [reason, setReason] = useState('');
    const [notes, setNotes] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await appointmentService.create({ doctorId: id, date, time, reason, notes });
            setSuccess(true);
        } catch (error) {
            alert('Lỗi đặt lịch');
        } finally {
            setLoading(false);
        }
    };

    if (success) return <Alert variant="success">Đặt lịch thành công!</Alert>;

    return (
        <Container>
            <h3>Đặt lịch với bác sĩ</h3>
            <Form onSubmit={handleSubmit}>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Ngày khám</Form.Label>
                            <DatePicker selected={date} onChange={setDate} className="form-control" dateFormat="dd/MM/yyyy" />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Giờ</Form.Label>
                            <Form.Control type="time" value={time} onChange={(e) => setTime(e.target.value)} />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mt-3">
                    <Form.Label>Khám bệnh gì (Lý do khám)</Form.Label>
                    <Form.Select value={reason} onChange={(e) => setReason(e.target.value)} required>
                        <option value="">-- Chọn dịch vụ nha khoa --</option>
                        <option value="Khám răng tổng quát">Khám răng tổng quát</option>
                        <option value="Lấy cao răng">Lấy cao răng (Cạo vôi răng)</option>
                        <option value="Nhổ răng">Nhổ răng</option>
                        <option value="Trám răng">Trám răng (Hàn răng)</option>
                        <option value="Niềng răng">Niềng răng (Chỉnh nha)</option>
                        <option value="Tẩy trắng răng">Tẩy trắng răng</option>
                        <option value="Bọc răng sứ">Bọc răng sứ</option>
                        <option value="Trồng răng Implant">Trồng răng Implant</option>
                        <option value="Tái khám">Tái khám</option>
                        <option value="Khác">Khác (Vui lòng ghi ở phần Ghi chú)</option>
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mt-3">
                    <Form.Label>Ghi chú</Form.Label>
                    <Form.Control as="textarea" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </Form.Group>
                <Button type="submit" className="mt-3" disabled={loading}>Đặt lịch</Button>
            </Form>
        </Container>
    );
};

export default AppointmentForm;

