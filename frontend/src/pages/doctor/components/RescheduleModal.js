import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { appointmentService } from '../../../services/appointmentService';

const RescheduleModal = ({ show, onHide, appointment, onSuccess }) => {
    const [newDate, setNewDate] = useState(new Date());
    const [newTime, setNewTime] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (appointment && show) {
            setNewDate(new Date(appointment.date));
            setNewTime(appointment.time || '');
        }
    }, [appointment, show]);

    const handleReschedule = async () => {
        if (!appointment) return;
        try {
            setLoading(true);
            await appointmentService.update(appointment._id, { date: newDate, time: newTime });
            if (onSuccess) onSuccess();
            onHide();
        } catch (err) {
            console.error(err);
            alert('Lỗi thay đổi lịch hẹn');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
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
                <Button variant="secondary" onClick={onHide} disabled={loading}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleReschedule} disabled={loading || !newTime}>
                    {loading ? 'Đang cập nhật...' : 'Lưu thay đổi'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default RescheduleModal;
