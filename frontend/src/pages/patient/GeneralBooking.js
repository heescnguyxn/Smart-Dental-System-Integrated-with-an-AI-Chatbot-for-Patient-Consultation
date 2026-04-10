import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { FaTooth, FaRegCalendarAlt, FaClock } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

const GeneralBooking = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: user?.email || '',
        doctorId: '',
        reason: '',
        date: new Date(),
        time: '',
        notes: ''
    });

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await doctorService.getAll();
                setDoctors(res.data);
            } catch (err) {
                console.error("Failed to fetch doctors", err);
            }
        };
        fetchDoctors();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, date });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await appointmentService.create({
                doctorId: formData.doctorId,
                date: formData.date,
                time: formData.time,
                reason: formData.reason,
                notes: formData.notes
            });
            setSuccess(true);
            setTimeout(() => {
                navigate('/my-appointments');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.msg || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center" style={{ 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #00b4db 0%, #0083B0 100%)', // matching the blue-green gradient in the image
            padding: '40px 15px'
        }}>
            <Card className="shadow-lg border-0" style={{ width: '100%', maxWidth: '500px', borderRadius: '15px' }}>
                <Card.Body className="p-4 p-md-5">
                    <div className="text-center mb-4">
                        <h3 className="fw-bold text-primary mb-2 align-items-center d-flex justify-content-center gap-2">
                            <FaTooth style={{ color: '#0083B0' }} /> Đặt lịch hẹn
                        </h3>
                        <p className="text-muted small">Vui lòng điền đầy đủ thông tin, chúng tôi sẽ liên hệ ngay.</p>
                    </div>

                    {success ? (
                        <Alert variant="success" className="text-center">
                            🎉 Đặt lịch hẹn thành công! Đang chuyển hướng...
                        </Alert>
                    ) : (
                        <Form onSubmit={handleSubmit}>
                            {error && <Alert variant="danger">{error}</Alert>}
                            
                            <Form.Group className="mb-3">
                                <Form.Control 
                                    type="text" 
                                    name="name" 
                                    value={formData.name} 
                                    onChange={handleChange} 
                                    placeholder="Họ tên" 
                                    required 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control 
                                    type="tel" 
                                    name="phone" 
                                    value={formData.phone} 
                                    onChange={handleChange} 
                                    placeholder="Số điện thoại" 
                                    required 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Control 
                                    type="email" 
                                    name="email" 
                                    value={formData.email} 
                                    onChange={handleChange} 
                                    placeholder="Email" 
                                    required 
                                    className="p-2"
                                />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Select 
                                    name="doctorId" 
                                    value={formData.doctorId} 
                                    onChange={handleChange} 
                                    required 
                                    className="p-2 text-muted"
                                >
                                    <option value="">-- Chọn Bác Sĩ --</option>
                                    {doctors.map(doc => (
                                        <option key={doc._id} value={doc._id}>Bs. {doc.userId?.name} {doc.specialty ? `(${doc.specialty})` : ''}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Select 
                                    name="reason" 
                                    value={formData.reason} 
                                    onChange={handleChange} 
                                    required 
                                    className="p-2 text-muted"
                                >
                                    <option value="">-- Chọn dịch vụ --</option>
                                    <option value="Khám tổng quát">Khám tổng quát</option>
                                    <option value="Nhổ răng">Nhổ răng</option>
                                    <option value="Niềng răng">Niềng răng</option>
                                    <option value="Trám răng">Trám răng</option>
                                    <option value="Tẩy trắng răng">Tẩy trắng răng</option>
                                    <option value="Bọc răng sứ">Bọc răng sứ</option>
                                    <option value="Cạo vôi răng">Cạo vôi răng</option>
                                    <option value="Trồng răng giả (Implant)">Trồng răng giả (Implant)</option>
                                </Form.Select>
                            </Form.Group>

                            <div className="row mb-3">
                                <div className="col-6">
                                    <Form.Group className="position-relative">
                                        <DatePicker 
                                            selected={formData.date} 
                                            onChange={handleDateChange} 
                                            className="form-control p-2 w-100" 
                                            dateFormat="MM/dd/yyyy"
                                            placeholderText="mm/dd/yyyy"
                                            required
                                        />
                                        <FaRegCalendarAlt className="position-absolute text-muted" style={{ right: '10px', top: '12px' }} />
                                    </Form.Group>
                                </div>
                                <div className="col-6">
                                    <Form.Group className="position-relative">
                                        <Form.Control 
                                            type="time" 
                                            name="time" 
                                            value={formData.time} 
                                            onChange={handleChange} 
                                            required 
                                            className="p-2"
                                            placeholder="--:-- --"
                                        />
                                        <FaClock className="position-absolute text-muted d-none" style={{ right: '10px', top: '12px' }} />
                                    </Form.Group>
                                </div>
                            </div>

                            <Form.Group className="mb-4">
                                <Form.Control 
                                    as="textarea" 
                                    name="notes" 
                                    value={formData.notes} 
                                    onChange={handleChange} 
                                    placeholder="Ghi chú thêm..." 
                                    rows={3} 
                                    className="p-2"
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button 
                                    disabled={loading} 
                                    type="submit" 
                                    className="py-2 fw-bold border-0 text-white" 
                                    style={{ background: '#00c6ff', borderRadius: '8px' }}
                                >
                                    {loading ? <Spinner animation="border" size="sm" /> : 'Đặt lịch hẹn'}
                                </Button>
                            </div>
                        </Form>
                    )}
                </Card.Body>
            </Card>
        </div>
    );
};

export default GeneralBooking;
