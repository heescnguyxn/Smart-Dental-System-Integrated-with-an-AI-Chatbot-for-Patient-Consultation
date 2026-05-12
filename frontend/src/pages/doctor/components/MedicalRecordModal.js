import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';
import { FaFileMedical } from 'react-icons/fa';
import { medicalRecordService } from '../../../services/medicalRecordService';

const MedicalRecordModal = ({ show, onHide, appointment, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [currentRecord, setCurrentRecord] = useState(null);
    const [recordForm, setRecordForm] = useState({ diagnosis: '', symptoms: '', notes: '' });

    useEffect(() => {
        if (show && appointment) {
            fetchRecord();
        }
    }, [show, appointment]);

    const fetchRecord = async () => {
        setLoading(true);
        try {
            const res = await medicalRecordService.getByAppointment(appointment._id);
            if (res.data) {
                setCurrentRecord(res.data);
                setRecordForm({
                    diagnosis: res.data.diagnosis || '',
                    symptoms: res.data.symptoms || '',
                    notes: res.data.notes || ''
                });
            } else {
                setCurrentRecord(null);
                setRecordForm({ diagnosis: '', symptoms: '', notes: '' });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            if (currentRecord) {
                await medicalRecordService.update(currentRecord._id, recordForm);
                alert('Cập nhật bệnh án thành công!');
            } else {
                const patientId = appointment.patientId._id || appointment.patientId;
                await medicalRecordService.create({
                    patientId,
                    doctorId: appointment.doctorId,
                    appointmentId: appointment._id,
                    ...recordForm
                });
                alert('Ghi nhận kết quả khám bệnh thành công!');
            }
            if (onSuccess) onSuccess();
            onHide();
        } catch (err) {
            console.error(err);
            alert('Lỗi khi lưu hồ sơ bệnh án');
        } finally {
            setSaving(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title><FaFileMedical className="me-2" /> Hồ sơ bệnh án</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4"><Spinner animation="border" /></div>
                ) : (
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Triệu chứng</Form.Label>
                            <Form.Control as="textarea" rows={3} value={recordForm.symptoms} onChange={(e) => setRecordForm({...recordForm, symptoms: e.target.value})} placeholder="Nhập triệu chứng của bệnh nhân..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Chẩn đoán <span className="text-danger">*</span></Form.Label>
                            <Form.Control as="textarea" rows={3} value={recordForm.diagnosis} onChange={(e) => setRecordForm({...recordForm, diagnosis: e.target.value})} placeholder="Nhập kết quả chẩn đoán..." />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Ghi chú thêm</Form.Label>
                            <Form.Control as="textarea" rows={2} value={recordForm.notes} onChange={(e) => setRecordForm({...recordForm, notes: e.target.value})} />
                        </Form.Group>
                    </Form>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Đóng</Button>
                <Button variant="primary" onClick={handleSave} disabled={loading || saving || !recordForm.diagnosis}>
                    {saving ? 'Đang lưu...' : (currentRecord ? 'Cập nhật bệnh án' : 'Lưu kết quả')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default MedicalRecordModal;
