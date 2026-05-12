import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner, Alert, Table, Badge } from 'react-bootstrap';
import { FaFileMedical, FaPrescriptionBottleAlt, FaNotesMedical, FaUserMd } from 'react-icons/fa';
import { medicalRecordService } from '../../../services/medicalRecordService';
import { prescriptionService } from '../../../services/prescriptionService';

const PatientMedicalRecordModal = ({ show, onHide, appointment }) => {
    const [loading, setLoading] = useState(false);
    const [record, setRecord] = useState(null);
    const [prescription, setPrescription] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (show && appointment) {
            fetchData();
        } else {
            setRecord(null);
            setPrescription(null);
            setErrorMsg('');
        }
    }, [show, appointment]);

    const fetchData = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            // 1. Lấy hồ sơ bệnh án
            const recordRes = await medicalRecordService.getByAppointment(appointment._id);
            if (!recordRes.data) {
                setErrorMsg('Chưa có hồ sơ bệnh án nào được ghi nhận cho lịch hẹn này.');
                setLoading(false);
                return;
            }
            setRecord(recordRes.data);
            
            // 2. Lấy đơn thuốc/Kế hoạch điều trị nếu có
            try {
                const presRes = await prescriptionService.getByMedicalRecord(recordRes.data._id);
                if (presRes.data) {
                    setPrescription(presRes.data);
                }
            } catch (err) {
                console.log("Không có đơn thuốc/Kế hoạch điều trị", err);
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Lỗi khi tải dữ liệu hồ sơ bệnh án.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title><FaFileMedical className="me-2" /> Hồ sơ Bệnh án chi tiết</Modal.Title>
            </Modal.Header>
            <Modal.Body className="bg-light p-4">
                {loading ? (
                    <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>
                ) : errorMsg ? (
                    <Alert variant="warning" className="text-center">{errorMsg}</Alert>
                ) : record ? (
                    <div className="medical-record-details">
                        {/* Thông tin bác sĩ */}
                        <div className="d-flex align-items-center mb-4 bg-white p-3 rounded shadow-sm border-start border-4 border-primary">
                            <div className="bg-primary bg-opacity-10 p-3 rounded-circle me-3 text-primary">
                                <FaUserMd size={24} />
                            </div>
                            <div>
                                <h6 className="mb-1 text-muted text-uppercase" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>Bác sĩ phụ trách</h6>
                                <h5 className="mb-0 fw-bold">{appointment?.doctorId?.userId?.name || 'Không rõ'}</h5>
                            </div>
                        </div>

                        {/* Chi tiết bệnh án */}
                        <h6 className="fw-bold text-primary mb-3"><FaNotesMedical className="me-2"/> Kết quả khám</h6>
                        <div className="bg-white p-4 rounded shadow-sm mb-4">
                            <Row className="mb-3">
                                <Col md={3} className="text-muted fw-semibold">Triệu chứng:</Col>
                                <Col md={9}>{record.symptoms || <em className="text-muted">Không có</em>}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={3} className="text-muted fw-semibold">Chẩn đoán:</Col>
                                <Col md={9}><Badge bg="danger" className="fs-6 px-3 py-2">{record.diagnosis || 'Chưa có chẩn đoán'}</Badge></Col>
                            </Row>
                            <Row>
                                <Col md={3} className="text-muted fw-semibold">Lời dặn:</Col>
                                <Col md={9} style={{ whiteSpace: 'pre-line' }}>{record.notes || <em className="text-muted">Không có</em>}</Col>
                            </Row>
                        </div>

                        {/* Kế hoạch điều trị / Đơn thuốc */}
                        {prescription && prescription.items && prescription.items.length > 0 && (
                            <>
                                <h6 className="fw-bold text-success mb-3"><FaPrescriptionBottleAlt className="me-2"/> Đơn thuốc / Điều trị</h6>
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <Table hover responsive className="mb-0 align-middle">
                                        <thead className="table-light">
                                            <tr>
                                                <th className="border-0">Tên vật tư / Thuốc</th>
                                                <th className="border-0 text-center">Số lượng</th>
                                                <th className="border-0">Cách sử dụng</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {prescription.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="fw-semibold text-primary">
                                                        {item.supplyId?.name || 'Vật tư/Thuốc (Không rõ tên)'}
                                                    </td>
                                                    <td className="text-center fw-bold">{item.quantity} {item.supplyId?.unit || ''}</td>
                                                    <td>{item.usage || <em className="text-muted small">Không có</em>}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </Table>
                                    
                                    {prescription.notes && (
                                        <div className="mt-4 pt-3 border-top">
                                            <div className="text-muted fw-semibold mb-2">Ghi chú điều trị:</div>
                                            <div style={{ whiteSpace: 'pre-line' }}>{prescription.notes}</div>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide} className="rounded-pill px-4">
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PatientMedicalRecordModal;
