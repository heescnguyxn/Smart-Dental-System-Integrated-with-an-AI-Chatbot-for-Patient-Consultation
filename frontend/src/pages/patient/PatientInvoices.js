import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Button, Table } from 'react-bootstrap';
import { invoiceService } from '../../services/invoiceService';
import { FaFileInvoiceDollar, FaCheckCircle, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import PaymentModal from './components/PaymentModal';

const PatientInvoices = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await invoiceService.getMy();
            setInvoices(res.data);
        } catch (err) {
            console.error("Failed to fetch invoices", err);
            setError('Không thể tải dữ liệu hóa đơn của bạn. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInvoices();
    }, []);

    const handlePay = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        fetchInvoices(); // Refresh list after payment
    };

    const unpaidCount = invoices.filter(inv => inv.status === 'unpaid').length;
    const paidCount = invoices.filter(inv => inv.status === 'paid').length;

    return (
        <div className="page-fill bg-light pb-5">
            <div className="bg-primary text-white py-4 mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                <Container>
                    <h2 className="mb-0 fw-bold"><FaFileInvoiceDollar className="me-2 mb-1"/> Hóa Đơn & Thanh Toán</h2>
                    <p className="mb-0 mt-1 opacity-75">Quản lý hóa đơn và thực hiện thanh toán chi phí điều trị</p>
                </Container>
            </div>

            <Container>
                {/* Stats Row */}
                <Row className="mb-4">
                    <Col md={6} className="mb-3 mb-md-0">
                        <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                            <Card.Body className="d-flex align-items-center position-relative">
                                <div className="bg-warning bg-opacity-10 p-3 rounded-circle me-3 z-1">
                                    <FaClock size={24} className="text-warning" />
                                </div>
                                <div className="z-1">
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Chưa thanh toán</h6>
                                    <h3 className="mb-0 fw-bold text-warning">{unpaidCount}</h3>
                                </div>
                                <FaClock className="position-absolute text-warning opacity-10" style={{ right: '-10px', bottom: '-10px', fontSize: '100px' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6}>
                        <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                            <Card.Body className="d-flex align-items-center position-relative">
                                <div className="bg-success bg-opacity-10 p-3 rounded-circle me-3 z-1">
                                    <FaCheckCircle size={24} className="text-success" />
                                </div>
                                <div className="z-1">
                                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{fontSize: '0.8rem'}}>Đã thanh toán</h6>
                                    <h3 className="mb-0 fw-bold text-success">{paidCount}</h3>
                                </div>
                                <FaCheckCircle className="position-absolute text-success opacity-10" style={{ right: '-10px', bottom: '-10px', fontSize: '100px' }} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {error && <Alert variant="danger" className="rounded-4 shadow-sm border-0">{error}</Alert>}

                <Card className="border-0 shadow-sm rounded-4 mb-4">
                    <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                        <h5 className="fw-bold mb-0 text-primary">Danh sách hóa đơn</h5>
                    </Card.Header>
                    <Card.Body>
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : invoices.length === 0 ? (
                            <div className="text-center py-5 text-muted">
                                <div className="mb-3">
                                    <div className="bg-light d-inline-block p-4 rounded-circle mb-3">
                                        <FaFileInvoiceDollar size={48} className="text-primary opacity-50" />
                                    </div>
                                </div>
                                <h5>Bạn chưa có hóa đơn nào</h5>
                                <p className="mb-4">Hệ thống sẽ tự động tạo hóa đơn sau khi bạn khám bệnh.</p>
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="align-middle border-top-0 mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="border-0 rounded-start py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Mã Hóa Đơn</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Ngày lập</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Chi tiết</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Tổng tiền</th>
                                            <th className="border-0 py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Trạng thái</th>
                                            <th className="border-0 rounded-end text-center py-3 text-uppercase text-muted" style={{ fontSize: '0.85rem' }}>Hành động</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {invoices.map(inv => (
                                            <tr key={inv._id}>
                                                <td className="py-3 fw-bold text-muted">
                                                    #{inv._id.substring(inv._id.length - 6).toUpperCase()}
                                                </td>
                                                <td className="py-3">
                                                    {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                                                </td>
                                                <td className="py-3 text-muted small" style={{ maxWidth: '250px' }}>
                                                    <ul className="mb-0 ps-3">
                                                        {inv.items && inv.items.map((item, idx) => (
                                                            <li key={idx} className="text-truncate" title={item.name}>
                                                                {item.name} (x{item.quantity})
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </td>
                                                <td className="py-3 fw-bold text-danger">
                                                    {inv.totalAmount.toLocaleString('vi-VN')} VNĐ
                                                </td>
                                                <td className="py-3">
                                                    {inv.status === 'paid' ? (
                                                        <Badge bg="success" className="px-3 py-2 rounded-pill"><FaCheckCircle className="me-1"/> Đã thanh toán</Badge>
                                                    ) : (
                                                        <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill"><FaClock className="me-1"/> Chưa thanh toán</Badge>
                                                    )}
                                                </td>
                                                <td className="py-3 text-center">
                                                    {inv.status === 'unpaid' && (
                                                        <Button 
                                                            variant="primary" 
                                                            size="sm" 
                                                            onClick={() => handlePay(inv)} 
                                                            className="rounded-pill px-3 d-flex align-items-center mx-auto"
                                                        >
                                                            <FaMoneyBillWave className="me-1" /> Thanh toán
                                                        </Button>
                                                    )}
                                                    {inv.status === 'paid' && (
                                                        <span className="text-success small fw-bold">
                                                            <FaCheckCircle className="me-1" /> Hoàn tất
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal Thanh toán */}
            <PaymentModal 
                show={showPaymentModal} 
                onHide={() => setShowPaymentModal(false)} 
                invoice={selectedInvoice} 
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default PatientInvoices;
