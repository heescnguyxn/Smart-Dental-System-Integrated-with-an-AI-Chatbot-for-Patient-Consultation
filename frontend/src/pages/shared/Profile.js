import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import userService from '../../services/userService';
import { appointmentService } from '../../services/appointmentService';
import { Container, Row, Col, Card, Form, Button, Alert, ListGroup, Table } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';

const Profile = () => {
    const { user } = useContext(AuthContext);
    const [profileData, setProfileData] = useState(null);
    const [formData, setFormData] = useState({});
    const [appointments, setAppointments] = useState([]);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await userService.getProfile();
            setProfileData(data);
            
            const initialForm = {
                name: data.user.name || '',
                phone: data.user.phone || '',
                avatar: data.user.avatar || '',
            };

            if (data.user.role === 'patient' && data.patient) {
                initialForm.dateOfBirth = data.patient.dateOfBirth ? data.patient.dateOfBirth.split('T')[0] : '';
                initialForm.gender = data.patient.gender || '';
                initialForm.address = data.patient.address || '';
                const myAppts = await appointmentService.getMy();
                setAppointments(myAppts.data || []);
            } else if (data.user.role === 'doctor' && data.doctor) {
                initialForm.specialty = data.doctor.specialty || '';
                initialForm.hospital = data.doctor.hospital || '';
                initialForm.experience = data.doctor.experience || '';
                initialForm.fee = data.doctor.fee || '';
                const docAppts = await appointmentService.getByDoctor();
                setAppointments(docAppts.data || []);
            }
            
            setFormData(initialForm);
        } catch (err) {
            setError(err.response?.data?.msg || 'Error loading profile');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        try {
            await userService.updateProfile(formData);
            setMessage('Profile updated successfully');
            loadData();
        } catch (err) {
            setError(err.response?.data?.msg || 'Error updating profile');
        }
    };

    if (!user) return <Navigate to="/login" />;

    return (
        <Container className="my-5">
            <h2 className="mb-4">Thông Tin Cá Nhân</h2>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Row>
                <Col md={5}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Header as="h5">Cập Nhật Hồ Sơ</Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Họ & Tên</Form.Label>
                                    <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" value={profileData?.user?.email || ''} readOnly disabled />
                                    <Form.Text className="text-muted">Email không thể thay đổi.</Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Số điện thoại</Form.Label>
                                    <Form.Control type="text" name="phone" value={formData.phone || ''} onChange={handleChange} />
                                </Form.Group>

                                {profileData?.user?.role === 'patient' && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Ngày sinh</Form.Label>
                                            <Form.Control type="date" name="dateOfBirth" value={formData.dateOfBirth || ''} onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Giới tính</Form.Label>
                                            <Form.Select name="gender" value={formData.gender || ''} onChange={handleChange}>
                                                <option value="">Chọn giới tính</option>
                                                <option value="male">Nam</option>
                                                <option value="female">Nữ</option>
                                                <option value="other">Khác</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Địa chỉ</Form.Label>
                                            <Form.Control type="text" name="address" value={formData.address || ''} onChange={handleChange} />
                                        </Form.Group>
                                    </>
                                )}

                                {profileData?.user?.role === 'doctor' && (
                                    <>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Chuyên khoa</Form.Label>
                                            <Form.Control type="text" name="specialty" value={formData.specialty || ''} onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Bệnh viện/Phòng khám công tác</Form.Label>
                                            <Form.Control type="text" name="hospital" value={formData.hospital || ''} onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Năm kinh nghiệm</Form.Label>
                                            <Form.Control type="number" name="experience" value={formData.experience || ''} onChange={handleChange} />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Phí khám (VNĐ)</Form.Label>
                                            <Form.Control type="number" name="fee" value={formData.fee || ''} onChange={handleChange} />
                                        </Form.Group>
                                    </>
                                )}

                                <Button variant="primary" type="submit" className="w-100">
                                    Lưu Thay Đổi
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={7}>
                    {profileData?.user?.role === 'patient' && (
                        <>
                            <Card className="mb-4 shadow-sm">
                                <Card.Header as="h5">Lộ Trình Khám Bệnh</Card.Header>
                                <Card.Body>
                                    {profileData?.patient?.medicalHistory?.length > 0 ? (
                                        <ListGroup variant="flush">
                                            {profileData.patient.medicalHistory.map((history, idx) => (
                                                <ListGroup.Item key={idx}>{history}</ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    ) : (
                                        <p className="text-muted">Chưa có dữ liệu lộ trình khám bệnh.</p>
                                    )}
                                </Card.Body>
                            </Card>
                        </>
                    )}

                    {(profileData?.user?.role === 'patient' || profileData?.user?.role === 'doctor') && (
                        <Card className="mb-4 shadow-sm">
                            <Card.Header as="h5">Lịch Khám Bệnh Gần Đây</Card.Header>
                            <Card.Body>
                                {appointments.length > 0 ? (
                                    <Table hover responsive size="sm">
                                        <thead>
                                            <tr>
                                                <th>Ngày</th>
                                                <th>Giờ</th>
                                                <th>{profileData.user.role === 'patient' ? 'Bác Sĩ' : 'Bệnh Nhân'}</th>
                                                <th>Trạng Thái</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {appointments.slice(0, 5).map(apt => (
                                                <tr key={apt._id}>
                                                    <td>{new Date(apt.date).toLocaleDateString('vi-VN')}</td>
                                                    <td>{apt.time}</td>
                                                    <td>
                                                        {profileData.user.role === 'patient'
                                                            ? apt.doctorId?.userId?.name || 'N/A'
                                                            : apt.patientId?.name || 'N/A'}
                                                    </td>
                                                    <td>
                                                        <span className={`badge bg-${apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'secondary'}`}>
                                                            {apt.status === 'pending' ? 'Chờ xác nhận' : apt.status === 'confirmed' ? 'Đã xác nhận' : apt.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                ) : (
                                    <p className="text-muted">Không có lịch khám nào.</p>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;
