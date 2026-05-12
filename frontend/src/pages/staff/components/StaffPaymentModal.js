import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { invoiceService } from '../../../services/invoiceService';
import { FaCreditCard, FaMoneyBillWave, FaQrcode, FaCheckCircle } from 'react-icons/fa';

const METHODS = [
    {
        value: 'cash',
        icon: <FaMoneyBillWave size={20} className="text-warning me-3" />,
        label: 'Tiền mặt',
        desc: 'Bệnh nhân trả tiền mặt tại quầy',
    },
    {
        value: 'card',
        icon: <FaCreditCard size={20} className="text-primary me-3" />,
        label: 'Thẻ ngân hàng',
        desc: 'Quẹt thẻ tại máy POS',
    },
    {
        value: 'transfer',
        icon: <FaQrcode size={20} className="text-success me-3" />,
        label: 'Chuyển khoản / VNPay',
        desc: 'Thanh toán qua chuyển khoản hoặc quét mã QR',
    },
];

const StaffPaymentModal = ({ show, onHide, invoice, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!invoice) return null;

    const handleConfirm = async () => {
        try {
            setLoading(true);
            setError('');
            await invoiceService.pay(invoice._id, { paymentMethod });
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                setPaymentMethod('cash');
                if (onSuccess) onSuccess();
            }, 1500);
        } catch (err) {
            console.error(err);
            setError('Xác nhận thanh toán thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        if (!loading && !success) {
            setPaymentMethod('cash');
            setError('');
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered backdrop="static">
            <Modal.Header closeButton={!loading && !success}>
                <Modal.Title className="fw-bold text-primary">
                    <FaMoneyBillWave className="me-2" /> Xác Nhận Thu Tiền
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {success ? (
                    <div className="text-center py-4">
                        <FaCheckCircle className="text-success mb-3" size={60} />
                        <h4 className="text-success fw-bold">Thu tiền thành công!</h4>
                        <p className="text-muted">Hóa đơn đã được cập nhật trạng thái.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-light p-3 rounded-3 mb-4 border">
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Bệnh nhân</span>
                                <span className="fw-bold">{invoice.patientId?.name || 'Khách'}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span className="text-muted">Mã hóa đơn</span>
                                <span className="fw-bold text-muted">
                                    #{invoice._id.substring(invoice._id.length - 6).toUpperCase()}
                                </span>
                            </div>
                            <hr className="my-2" />
                            <div className="d-flex justify-content-between">
                                <span className="fw-bold">Số tiền thu</span>
                                <span className="fw-bold text-danger fs-5">
                                    {invoice.totalAmount.toLocaleString('vi-VN')} đ
                                </span>
                            </div>
                        </div>

                        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

                        <h6 className="fw-bold mb-3">Phương thức thanh toán</h6>
                        <div className="d-grid gap-2">
                            {METHODS.map(({ value, icon, label, desc }) => (
                                <label
                                    key={value}
                                    className={`border p-3 rounded-3 d-flex align-items-center ${paymentMethod === value ? 'border-primary bg-primary bg-opacity-10' : ''}`}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Form.Check
                                        type="radio"
                                        name="staffPaymentMethod"
                                        checked={paymentMethod === value}
                                        onChange={() => setPaymentMethod(value)}
                                        className="me-3"
                                    />
                                    {icon}
                                    <div>
                                        <div className="fw-bold">{label}</div>
                                        <div className="small text-muted">{desc}</div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </>
                )}
            </Modal.Body>
            {!success && (
                <Modal.Footer className="border-0 pb-4 px-4">
                    <Button variant="light" className="rounded-pill px-4" onClick={handleClose} disabled={loading}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        className="rounded-pill px-4 fw-bold"
                        onClick={handleConfirm}
                        disabled={loading}
                    >
                        {loading && <Spinner size="sm" className="me-2" />}
                        Xác nhận thu {invoice.totalAmount.toLocaleString('vi-VN')} đ
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default StaffPaymentModal;
