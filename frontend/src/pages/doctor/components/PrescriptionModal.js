import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Spinner } from 'react-bootstrap';
import { FaPrescriptionBottleAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { medicalRecordService } from '../../../services/medicalRecordService';
import { prescriptionService } from '../../../services/prescriptionService';

const PrescriptionModal = ({ show, onHide, appointment, supplies, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [prescriptionItems, setPrescriptionItems] = useState([{ supplyId: '', quantity: 1, usage: '' }]);
    const [prescriptionNotes, setPrescriptionNotes] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (show && appointment) {
            fetchData();
        } else {
            // Reset state
            setPrescriptionItems([{ supplyId: '', quantity: 1, usage: '' }]);
            setPrescriptionNotes('');
            setErrorMsg('');
        }
    }, [show, appointment]);

    const fetchData = async () => {
        setLoading(true);
        setErrorMsg('');
        try {
            // 1. Get medical record first
            const recordRes = await medicalRecordService.getByAppointment(appointment._id);
            if (!recordRes.data) {
                setErrorMsg('Vui lòng tạo Hồ sơ bệnh án (Ghi nhận kết quả) trước khi lập kế hoạch điều trị!');
                setCurrentRecord(null);
                setLoading(false);
                return;
            }
            setCurrentRecord(recordRes.data);
            
            // 2. Get existing prescription
            const presRes = await prescriptionService.getByMedicalRecord(recordRes.data._id);
            if (presRes.data) {
                setPrescriptionItems(presRes.data.items.length > 0 ? presRes.data.items.map(item => ({
                    supplyId: item.supplyId?._id || item.supplyId,
                    quantity: item.quantity,
                    usage: item.usage
                })) : [{ supplyId: '', quantity: 1, usage: '' }]);
                setPrescriptionNotes(presRes.data.notes || '');
            } else {
                setPrescriptionItems([{ supplyId: '', quantity: 1, usage: '' }]);
                setPrescriptionNotes('');
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Lỗi khi tải dữ liệu kế hoạch điều trị.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        setPrescriptionItems([...prescriptionItems, { supplyId: '', quantity: 1, usage: '' }]);
    };

    const handleRemoveItem = (index) => {
        const newItems = [...prescriptionItems];
        newItems.splice(index, 1);
        setPrescriptionItems(newItems);
    };

    const handleChange = (index, field, value) => {
        const newItems = [...prescriptionItems];
        newItems[index][field] = value;
        setPrescriptionItems(newItems);
    };

    const handleSave = async () => {
        if (!currentRecord) return;
        try {
            setSaving(true);
            const data = {
                medicalRecordId: currentRecord._id,
                patientId: appointment.patientId._id || appointment.patientId,
                doctorId: appointment.doctorId,
                items: prescriptionItems.filter(item => item.supplyId !== ''),
                notes: prescriptionNotes
            };
            
            const existing = await prescriptionService.getByMedicalRecord(currentRecord._id);
            if (existing.data) {
                await prescriptionService.update(existing.data._id, data);
            } else {
                await prescriptionService.create(data);
            }
            alert('Lưu kế hoạch điều trị thành công!');
            if (onSuccess) onSuccess();
            onHide();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi lưu kế hoạch điều trị');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="xl">
            <Modal.Header closeButton>
                <Modal.Title><FaPrescriptionBottleAlt className="me-2" /> Kế hoạch điều trị / Toa thuốc</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4"><Spinner animation="border" /></div>
                ) : errorMsg ? (
                    <div className="alert alert-warning text-center">
                        <p className="mb-0">{errorMsg}</p>
                    </div>
                ) : (
                    <Form>
                        <h6 className="fw-bold mb-3">Vật tư & Thuốc điều trị</h6>
                        {prescriptionItems.map((item, index) => (
                            <Row key={index} className="mb-3 align-items-center bg-light p-2 rounded mx-0">
                                <Col md={4}>
                                    <Form.Group>
                                        <Form.Label className="small">Vật tư/Thuốc</Form.Label>
                                        <Form.Select value={item.supplyId} onChange={(e) => handleChange(index, 'supplyId', e.target.value)}>
                                            <option value="">Chọn vật tư...</option>
                                            {supplies.map(sup => (
                                                <option key={sup._id} value={sup._id}>{sup.name} ({sup.unit})</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col md={2}>
                                    <Form.Group>
                                        <Form.Label className="small">Số lượng</Form.Label>
                                        <Form.Control type="number" min="1" value={item.quantity} onChange={(e) => handleChange(index, 'quantity', e.target.value)} />
                                    </Form.Group>
                                </Col>
                                <Col md={5}>
                                    <Form.Group>
                                        <Form.Label className="small">Cách dùng / Ghi chú</Form.Label>
                                        <Form.Control type="text" value={item.usage} onChange={(e) => handleChange(index, 'usage', e.target.value)} placeholder="Ví dụ: Ngày 2 lần, sau ăn..." />
                                    </Form.Group>
                                </Col>
                                <Col md={1} className="d-flex align-items-end justify-content-center">
                                    <Button variant="outline-danger" className="mt-4" onClick={() => handleRemoveItem(index)}><FaTrash /></Button>
                                </Col>
                            </Row>
                        ))}
                        <Button variant="outline-primary" size="sm" onClick={handleAddItem} className="mb-4">
                            <FaPlus className="me-1" /> Thêm vật tư/thuốc
                        </Button>
                        
                        <Form.Group className="mb-3 mt-2">
                            <Form.Label className="fw-bold">Ghi chú kế hoạch điều trị chung</Form.Label>
                            <Form.Control as="textarea" rows={3} value={prescriptionNotes} onChange={(e) => setPrescriptionNotes(e.target.value)} placeholder="Nhập dặn dò cho bệnh nhân..." />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
                <Button variant="success" onClick={handleSave} disabled={loading || saving || errorMsg !== '' || !currentRecord}>
                    {saving ? 'Đang lưu...' : 'Lưu kế hoạch điều trị'}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PrescriptionModal;
