import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button, Spinner, Form, InputGroup } from 'react-bootstrap';
import { invoiceService } from '../../services/invoiceService';
import {
    FaFileInvoiceDollar, FaCheckCircle, FaClock, FaSearch,
    FaEye, FaMoneyBillWave, FaChartLine
} from 'react-icons/fa';
import ReceiptDetailModal from './components/ReceiptDetailModal';
import StaffPaymentModal from './components/StaffPaymentModal';

const paymentMethodLabel = (method) => {
    if (method === 'cash') return 'Tiền mặt';
    if (method === 'card') return 'Thẻ';
    if (method === 'transfer') return 'Chuyển khoản';
    return method;
};

const ManagePayments = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);

    useEffect(() => {
        fetchInvoices();
    }, []);

    const fetchInvoices = async () => {
        try {
            setLoading(true);
            const res = await invoiceService.getAll();
            setInvoices(res.data);
        } catch (error) {
            console.error('Error fetching invoices', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (invoice) => {
        setSelectedInvoice(invoice);
        setShowDetailModal(true);
    };

    const handleCollectPayment = (invoice) => {
        setSelectedInvoice(invoice);
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = () => {
        setShowPaymentModal(false);
        fetchInvoices();
    };

    const filteredInvoices = invoices.filter(inv => {
        const matchesSearch =
            inv.patientId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inv.appointmentId?.doctorId?.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const totalRevenue = invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.totalAmount, 0);
    const unpaidCount = invoices.filter(inv => inv.status === 'unpaid').length;
    const paidCount = invoices.filter(inv => inv.status === 'paid').length;

    return (
        <div className="page-fill bg-light pb-5">
            <div
                className="text-white py-4 mb-4 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}
            >
                <Container>
                    <h2 className="mb-0 fw-bold">
                        <FaFileInvoiceDollar className="me-2 mb-1" /> Quản Lý Hóa Đơn &amp; Thu Ngân
                    </h2>
                    <p className="mb-0 mt-1 opacity-75">Xem và xử lý thanh toán hóa đơn bệnh nhân</p>
                </Container>
            </div>

            <Container>
                {/* Stats */}
                <Row className="mb-4 g-3">
                    {[
                        {
                            icon: <FaFileInvoiceDollar size={22} className="text-primary" />,
                            bg: 'bg-primary',
                            label: 'Tổng hóa đơn',
                            value: invoices.length,
                            valueClass: 'text-primary',
                            iconBig: <FaFileInvoiceDollar />,
                        },
                        {
                            icon: <FaClock size={22} className="text-warning" />,
                            bg: 'bg-warning',
                            label: 'Chưa thanh toán',
                            value: unpaidCount,
                            valueClass: 'text-warning',
                            iconBig: <FaClock />,
                        },
                        {
                            icon: <FaCheckCircle size={22} className="text-success" />,
                            bg: 'bg-success',
                            label: 'Đã thanh toán',
                            value: paidCount,
                            valueClass: 'text-success',
                            iconBig: <FaCheckCircle />,
                        },
                        {
                            icon: <FaChartLine size={22} className="text-danger" />,
                            bg: 'bg-danger',
                            label: 'Doanh thu',
                            value: totalRevenue.toLocaleString('vi-VN') + ' đ',
                            valueClass: 'text-danger',
                            iconBig: <FaChartLine />,
                            small: true,
                        },
                    ].map(({ icon, bg, label, value, valueClass, iconBig, small }, idx) => (
                        <Col md={3} key={idx}>
                            <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
                                <Card.Body className="d-flex align-items-center position-relative">
                                    <div className={`${bg} bg-opacity-10 p-3 rounded-circle me-3`} style={{ zIndex: 1 }}>
                                        {icon}
                                    </div>
                                    <div style={{ zIndex: 1 }}>
                                        <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
                                            {label}
                                        </h6>
                                        {small ? (
                                            <h5 className={`mb-0 fw-bold ${valueClass}`}>{value}</h5>
                                        ) : (
                                            <h3 className={`mb-0 fw-bold ${valueClass}`}>{value}</h3>
                                        )}
                                    </div>
                                    <span
                                        className={`position-absolute ${valueClass} opacity-10`}
                                        style={{ right: '-10px', bottom: '-10px', fontSize: '90px' }}
                                    >
                                        {iconBig}
                                    </span>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                {/* Search & Filter */}
                <Card className="border-0 shadow-sm rounded-4 mb-4">
                    <Card.Body>
                        <Row className="g-3 align-items-center">
                            <Col md={7}>
                                <InputGroup>
                                    <InputGroup.Text className="bg-white border-end-0">
                                        <FaSearch className="text-muted" />
                                    </InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Tìm theo tên bệnh nhân, bác sĩ hoặc mã hóa đơn..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="border-start-0 ps-0"
                                    />
                                </InputGroup>
                            </Col>
                            <Col md={3}>
                                <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="unpaid">Chưa thanh toán</option>
                                    <option value="paid">Đã thanh toán</option>
                                </Form.Select>
                            </Col>
                            <Col md={2} className="text-muted small">
                                {filteredInvoices.length} hóa đơn
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>

                {/* Table */}
                <Card className="border-0 shadow-sm rounded-4">
                    <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                        <h5 className="fw-bold mb-0 text-primary">Danh sách hóa đơn</h5>
                    </Card.Header>
                    <Card.Body className="p-0">
                        {loading ? (
                            <div className="text-center py-5">
                                <Spinner animation="border" variant="primary" />
                            </div>
                        ) : (
                            <div className="table-responsive">
                                <Table hover className="mb-0 align-middle">
                                    <thead className="table-light">
                                        <tr>
                                            <th className="py-3 px-4 border-0 text-uppercase text-muted" style={{ fontSize: '0.8rem' }}>Mã HĐ</th>
                                            <th className="py-3 border-0 text-uppercase text-muted" style={{ fontSize: '0.8rem' }}>Bệnh nhân</th>
                                            <th className="py-3 border-0 text-uppercase text-muted" style={{ fontSize: '0.8rem' }}>Bác sĩ khám</th>
                                            <th className="py-3 border-0 text-uppercase text-muted" style={{ fontSize: '0.8rem' }}>Tổng tiền</th>
                                            <th className="py-3 border-0 text-uppercase text-muted" style={{ fontSize: '0.8rem' }}>Trạng thái</th>
                                            <th className="py-3 border-0 text-center text-uppercase text-muted" style={{ fontSize: '0.8rem' }}>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredInvoices.map(inv => (
                                            <tr key={inv._id}>
                                                <td className="px-4 fw-bold text-muted">
                                                    #{inv._id.substring(inv._id.length - 6).toUpperCase()}
                                                </td>
                                                <td>
                                                    <div className="fw-bold">{inv.patientId?.name || 'Khách'}</div>
                                                    <div className="small text-muted">
                                                        {new Date(inv.createdAt).toLocaleDateString('vi-VN')}
                                                    </div>
                                                </td>
                                                <td className="text-muted">
                                                    {inv.appointmentId?.doctorId?.userId?.name || 'N/A'}
                                                </td>
                                                <td className="fw-bold text-danger">
                                                    {inv.totalAmount.toLocaleString('vi-VN')} đ
                                                </td>
                                                <td>
                                                    {inv.status === 'paid' ? (
                                                        <div>
                                                            <Badge bg="success" className="rounded-pill px-3 py-2 d-block mb-1">
                                                                <FaCheckCircle className="me-1" /> Đã thu tiền
                                                            </Badge>
                                                            <div className="small text-muted">
                                                                {paymentMethodLabel(inv.paymentMethod)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <Badge bg="warning" text="dark" className="rounded-pill px-3 py-2">
                                                            <FaClock className="me-1" /> Chờ thanh toán
                                                        </Badge>
                                                    )}
                                                </td>
                                                <td className="text-center">
                                                    <div className="d-flex gap-2 justify-content-center">
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            onClick={() => handleViewDetail(inv)}
                                                            className="rounded-pill px-3"
                                                        >
                                                            <FaEye className="me-1" /> Chi tiết
                                                        </Button>
                                                        {inv.status === 'unpaid' && (
                                                            <Button
                                                                variant="primary"
                                                                size="sm"
                                                                onClick={() => handleCollectPayment(inv)}
                                                                className="rounded-pill px-3 fw-bold"
                                                            >
                                                                <FaMoneyBillWave className="me-1" /> Thu tiền
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                        {filteredInvoices.length === 0 && (
                                            <tr>
                                                <td colSpan="6" className="text-center py-5 text-muted">
                                                    <FaFileInvoiceDollar size={40} className="mb-2 opacity-25 d-block mx-auto" />
                                                    Không tìm thấy hóa đơn nào
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </Table>
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <ReceiptDetailModal
                show={showDetailModal}
                onHide={() => setShowDetailModal(false)}
                invoice={selectedInvoice}
            />

            <StaffPaymentModal
                show={showPaymentModal}
                onHide={() => setShowPaymentModal(false)}
                invoice={selectedInvoice}
                onSuccess={handlePaymentSuccess}
            />
        </div>
    );
};

export default ManagePayments;
