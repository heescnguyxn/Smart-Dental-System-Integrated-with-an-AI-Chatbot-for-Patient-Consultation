import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';
import { FaFileInvoiceDollar, FaCheckCircle, FaClock, FaPrint, FaUser, FaUserMd, FaCalendarAlt } from 'react-icons/fa';

const paymentMethodLabel = (method) => {
    if (method === 'cash') return 'Tiền mặt';
    if (method === 'card') return 'Thẻ ngân hàng';
    if (method === 'transfer') return 'Chuyển khoản';
    return 'N/A';
};

const ReceiptDetailModal = ({ show, onHide, invoice }) => {
    if (!invoice) return null;

    return (
        <Modal show={show} onHide={onHide} centered size="lg">
            <Modal.Header closeButton className="border-0 pb-0">
                <Modal.Title className="fw-bold text-primary">
                    <FaFileInvoiceDollar className="me-2" />
                    Chi tiết Hóa Đơn #{invoice._id.substring(invoice._id.length - 6).toUpperCase()}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="px-4 pb-4">
                <div className="row g-3 mb-4">
                    <div className="col-md-6">
                        <div className="bg-light rounded-3 p-3">
                            <div className="d-flex align-items-center mb-2">
                                <FaUser className="text-primary me-2" />
                                <span className="fw-bold text-muted text-uppercase small">Bệnh nhân</span>
                            </div>
                            <div className="fw-bold fs-6">{invoice.patientId?.name || 'N/A'}</div>
                            {invoice.patientId?.phone && <div className="small text-muted">{invoice.patientId.phone}</div>}
                            {invoice.patientId?.email && <div className="small text-muted">{invoice.patientId.email}</div>}
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="bg-light rounded-3 p-3">
                            <div className="d-flex align-items-center mb-2">
                                <FaUserMd className="text-success me-2" />
                                <span className="fw-bold text-muted text-uppercase small">Bác sĩ phụ trách</span>
                            </div>
                            <div className="fw-bold fs-6">
                                {invoice.appointmentId?.doctorId?.userId?.name || 'N/A'}
                            </div>
                            <div className="d-flex align-items-center mt-1">
                                <FaCalendarAlt className="text-muted me-2" size={12} />
                                <span className="small text-muted">
                                    {invoice.appointmentId?.date
                                        ? new Date(invoice.appointmentId.date).toLocaleDateString('vi-VN')
                                        : 'N/A'}
                                    {invoice.appointmentId?.time ? ` - ${invoice.appointmentId.time}` : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <h6 className="fw-bold text-muted text-uppercase mb-3" style={{ fontSize: '0.8rem' }}>
                    Chi tiết dịch vụ &amp; vật tư
                </h6>
                <div className="table-responsive mb-4">
                    <Table bordered hover size="sm" className="rounded-3 overflow-hidden">
                        <thead className="table-light">
                            <tr>
                                <th>Dịch vụ / Vật tư</th>
                                <th className="text-center" style={{ width: '80px' }}>SL</th>
                                <th className="text-end" style={{ width: '130px' }}>Đơn giá</th>
                                <th className="text-end" style={{ width: '130px' }}>Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.items && invoice.items.map((item, idx) => (
                                <tr key={idx}>
                                    <td>{item.name}</td>
                                    <td className="text-center">{item.quantity}</td>
                                    <td className="text-end">{item.unitPrice.toLocaleString('vi-VN')} đ</td>
                                    <td className="text-end fw-bold">{item.total.toLocaleString('vi-VN')} đ</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="table-light">
                            <tr>
                                <td colSpan="3" className="text-end fw-bold">Tổng cộng</td>
                                <td className="text-end fw-bold text-danger fs-6">
                                    {invoice.totalAmount.toLocaleString('vi-VN')} đ
                                </td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>

                <div
                    className="d-flex justify-content-between align-items-center p-3 rounded-3"
                    style={{ background: invoice.status === 'paid' ? '#d1e7dd' : '#fff3cd' }}
                >
                    <div>
                        <div className="fw-bold">
                            {invoice.status === 'paid' ? (
                                <><FaCheckCircle className="text-success me-2" />Đã thanh toán</>
                            ) : (
                                <><FaClock className="text-warning me-2" />Chưa thanh toán</>
                            )}
                        </div>
                        {invoice.status === 'paid' && (
                            <div className="small text-muted mt-1">
                                Phương thức: {paymentMethodLabel(invoice.paymentMethod)}
                                {invoice.paymentDate && ` · ${new Date(invoice.paymentDate).toLocaleDateString('vi-VN')}`}
                            </div>
                        )}
                    </div>
                    <div className="fs-5 fw-bold text-danger">
                        {invoice.totalAmount.toLocaleString('vi-VN')} đ
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0">
                <Button variant="light" onClick={onHide} className="rounded-pill px-4">Đóng</Button>
                <Button variant="outline-primary" onClick={() => window.print()} className="rounded-pill px-4">
                    <FaPrint className="me-2" /> In hóa đơn
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ReceiptDetailModal;
