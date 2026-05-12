import React, { useState } from 'react';
import { Modal, Button, Form, Spinner, Alert } from 'react-bootstrap';
import { invoiceService } from '../../../services/invoiceService';
import { FaCreditCard, FaMoneyBillWave, FaQrcode, FaCheckCircle } from 'react-icons/fa';

const PaymentModal = ({ show, onHide, invoice, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    if (!invoice) return null;

    const handlePayment = async () => {
        try {
            setLoading(true);
            setError('');
            
            // Call API to pay invoice
            await invoiceService.pay(invoice._id, { paymentMethod });
            
            setSuccess(true);
            setTimeout(() => {
                setSuccess(false);
                if (onSuccess) onSuccess();
            }, 2000); // Wait 2s to show success message before closing
        } catch (err) {
            console.error(err);
            setError('Thanh toán thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered backdrop="static">
            <Modal.Header closeButton={!loading && !success}>
                <Modal.Title className="fw-bold text-primary">Thanh Toán Hóa Đơn</Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4">
                {success ? (
                    <div className="text-center py-4">
                        <FaCheckCircle className="text-success mb-3" size={60} />
                        <h4 className="text-success fw-bold">Thanh toán thành công!</h4>
                        <p className="text-muted">Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
                    </div>
                ) : (
                    <>
                        <div className="bg-light p-3 rounded-3 mb-4 text-center border">
                            <p className="mb-1 text-muted">Tổng số tiền cần thanh toán</p>
                            <h2 className="mb-0 text-danger fw-bold">{invoice.totalAmount.toLocaleString('vi-VN')} VNĐ</h2>
                            <p className="small text-muted mt-2 mb-0">Mã Hóa Đơn: #{invoice._id.substring(invoice._id.length - 6).toUpperCase()}</p>
                        </div>

                        {error && <Alert variant="danger">{error}</Alert>}

                        <h6 className="fw-bold mb-3">Chọn phương thức thanh toán</h6>
                        <div className="d-grid gap-3">
                            <label className={`border p-3 rounded-3 cursor-pointer d-flex align-items-center ${paymentMethod === 'card' ? 'border-primary bg-primary bg-opacity-10' : ''}`} style={{ cursor: 'pointer' }}>
                                <Form.Check 
                                    type="radio" 
                                    name="paymentMethod" 
                                    id="method-card"
                                    checked={paymentMethod === 'card'}
                                    onChange={() => setPaymentMethod('card')}
                                    className="me-3"
                                />
                                <FaCreditCard size={24} className="text-primary me-3" />
                                <div>
                                    <div className="fw-bold">Thẻ Tín Dụng / Ghi Nợ</div>
                                    <div className="small text-muted">Visa, MasterCard, JCB</div>
                                </div>
                            </label>

                            <label className={`border p-3 rounded-3 cursor-pointer d-flex align-items-center ${paymentMethod === 'transfer' ? 'border-primary bg-primary bg-opacity-10' : ''}`} style={{ cursor: 'pointer' }}>
                                <Form.Check 
                                    type="radio" 
                                    name="paymentMethod" 
                                    id="method-transfer"
                                    checked={paymentMethod === 'transfer'}
                                    onChange={() => setPaymentMethod('transfer')}
                                    className="me-3"
                                />
                                <FaQrcode size={24} className="text-success me-3" />
                                <div>
                                    <div className="fw-bold">Chuyển Khoản Ngân Hàng / VNPay</div>
                                    <div className="small text-muted">Quét mã QR qua ứng dụng Mobile Banking</div>
                                </div>
                            </label>

                            <label className={`border p-3 rounded-3 cursor-pointer d-flex align-items-center ${paymentMethod === 'cash' ? 'border-primary bg-primary bg-opacity-10' : ''}`} style={{ cursor: 'pointer' }}>
                                <Form.Check 
                                    type="radio" 
                                    name="paymentMethod" 
                                    id="method-cash"
                                    checked={paymentMethod === 'cash'}
                                    onChange={() => setPaymentMethod('cash')}
                                    className="me-3"
                                />
                                <FaMoneyBillWave size={24} className="text-warning me-3" />
                                <div>
                                    <div className="fw-bold">Tiền mặt tại quầy</div>
                                    <div className="small text-muted">Thanh toán trực tiếp tại phòng khám</div>
                                </div>
                            </label>
                        </div>
                    </>
                )}
            </Modal.Body>
            {!success && (
                <Modal.Footer className="border-0 pb-4 px-4">
                    <Button variant="light" className="w-100 mb-2 rounded-pill fw-bold" onClick={onHide} disabled={loading}>
                        Hủy
                    </Button>
                    <Button variant="primary" className="w-100 rounded-pill fw-bold py-2" onClick={handlePayment} disabled={loading}>
                        {loading ? <Spinner size="sm" /> : `Xác nhận thanh toán ${invoice.totalAmount.toLocaleString('vi-VN')} VNĐ`}
                    </Button>
                </Modal.Footer>
            )}
        </Modal>
    );
};

export default PaymentModal;
