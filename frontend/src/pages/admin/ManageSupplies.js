import React, { useState, useEffect } from 'react';
import { Container, Card, Table, Button, Badge, Modal, Form, Row, Col, Spinner } from 'react-bootstrap';
import { supplyService } from '../../services/supplyService';
import { FaBoxOpen, FaPlus, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ManageSupplies = () => {
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ name: '', quantity: 0, unit: '', price: 0, supplier: '', threshold: 10 });

    const fetchSupplies = async () => {
        try {
            setLoading(true);
            const res = await supplyService.getAll();
            setSupplies(res.data);
        } catch (error) {
            console.error(error);
            alert("Lỗi tải vật tư");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSupplies();
    }, []);

    const handleShowModal = (supply = null) => {
        if (supply) {
            setEditingId(supply._id);
            setFormData(supply);
        } else {
            setEditingId(null);
            setFormData({ name: '', quantity: 0, unit: '', price: 0, supplier: '', threshold: 10 });
        }
        setShowModal(true);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await supplyService.update(editingId, formData);
            } else {
                await supplyService.create(formData);
            }
            setShowModal(false);
            fetchSupplies();
        } catch (error) {
            console.error(error);
            alert("Lỗi lưu vật tư");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Bạn có chắc chắn xóa vật tư này?")) return;
        try {
            await supplyService.delete(id);
            fetchSupplies();
        } catch (error) {
            alert("Lỗi xóa vật tư");
        }
    };

    const totalValue = supplies.reduce((acc, curr) => acc + (curr.quantity * curr.price), 0);
    const lowStockCount = supplies.filter(s => s.quantity <= s.threshold).length;

    const chartData = {
        labels: supplies.slice(0, 10).map(s => s.name.length > 15 ? s.name.substring(0, 15) + '...' : s.name),
        datasets: [{
            label: 'Số lượng tồn kho',
            data: supplies.slice(0, 10).map(s => s.quantity),
            backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }, {
            label: 'Mức cảnh báo',
            data: supplies.slice(0, 10).map(s => s.threshold),
            backgroundColor: 'rgba(255, 99, 132, 0.6)'
        }]
    };

    return (
        <div className="bg-light pb-5" style={{ minHeight: '100vh' }}>
            <div className="bg-primary text-white py-4 mb-4 shadow-sm" style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
                <Container>
                    <h2 className="mb-0 fw-bold"><FaBoxOpen className="me-2 mb-1"/> Quản lý Vật tư</h2>
                    <p className="mb-0 mt-1 opacity-75">Hệ thống theo dõi và quản lý hàng tồn kho, vật dụng nha khoa</p>
                </Container>
            </div>
            
            <Container>
                <Row className="mb-4">
                    <Col md={4}>
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Body>
                                <h6 className="text-muted fw-bold">Tổng loại vật tư</h6>
                                <h3>{supplies.length}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm rounded-4 h-100">
                            <Card.Body>
                                <h6 className="text-muted fw-bold">Tổng giá trị tồn kho</h6>
                                <h3 className="text-success">{totalValue.toLocaleString('vi-VN')} đ</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="border-0 shadow-sm rounded-4 h-100 bg-danger bg-opacity-10">
                            <Card.Body>
                                <h6 className="text-danger fw-bold"><FaExclamationTriangle/> Cảnh báo sắp hết</h6>
                                <h3 className="text-danger">{lowStockCount}</h3>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col lg={12}>
                        <Card className="border-0 shadow-sm rounded-4">
                            <Card.Header className="bg-white border-0 pt-4 d-flex justify-content-between align-items-center">
                                <h5 className="fw-bold mb-0 text-primary">Biểu đồ Tồn kho (Top 10)</h5>
                            </Card.Header>
                            <Card.Body>
                                {supplies.length > 0 ? (
                                    <div style={{ height: '300px' }}>
                                        <Bar data={chartData} options={{ maintainAspectRatio: false }} />
                                    </div>
                                ) : (
                                    <div className="text-center text-muted py-5">Chưa có dữ liệu vật tư</div>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Card className="border-0 shadow-sm rounded-4">
                    <Card.Header className="bg-white border-0 pt-4 pb-0 d-flex justify-content-between align-items-center">
                        <h5 className="fw-bold mb-0 text-primary">Danh sách Vật tư</h5>
                        <Button variant="primary" className="rounded-pill px-4" onClick={() => handleShowModal()}>
                            <FaPlus className="me-2" /> Thêm mới
                        </Button>
                    </Card.Header>
                    <Card.Body>
                        {loading ? <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div> : (
                            <Table hover responsive className="align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th className="py-3 text-muted" style={{ fontSize: '0.85rem' }}>TÊN VẬT TƯ</th>
                                        <th className="py-3 text-muted" style={{ fontSize: '0.85rem' }}>SỐ LƯỢNG</th>
                                        <th className="py-3 text-muted" style={{ fontSize: '0.85rem' }}>ĐƠN VỊ</th>
                                        <th className="py-3 text-muted" style={{ fontSize: '0.85rem' }}>ĐƠN GIÁ</th>
                                        <th className="py-3 text-muted" style={{ fontSize: '0.85rem' }}>NHÀ CUNG CẤP</th>
                                        <th className="py-3 text-muted text-center" style={{ fontSize: '0.85rem' }}>HÀNH ĐỘNG</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {supplies.map(item => (
                                        <tr key={item._id}>
                                            <td className="fw-bold text-dark py-3">{item.name}</td>
                                            <td className="py-3">
                                                {item.quantity <= item.threshold ? (
                                                    <Badge bg="danger" className="px-3 py-2 rounded-pill">
                                                        {item.quantity} (Sắp hết)
                                                    </Badge>
                                                ) : (
                                                    <span className="fw-medium px-2">{item.quantity}</span>
                                                )}
                                            </td>
                                            <td className="py-3 text-secondary">{item.unit}</td>
                                            <td className="py-3 text-secondary">{item.price.toLocaleString('vi-VN')} đ</td>
                                            <td className="py-3 text-secondary">{item.supplier || '-'}</td>
                                            <td className="py-3 text-center">
                                                <Button variant="outline-primary" size="sm" className="me-2 rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleShowModal(item)}>
                                                    <FaEdit />
                                                </Button>
                                                <Button variant="outline-danger" size="sm" className="rounded-circle" style={{ width: '32px', height: '32px', padding: 0 }} onClick={() => handleDelete(item._id)}>
                                                    <FaTrash />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {supplies.length === 0 && (
                                        <tr><td colSpan="6" className="text-center py-5 text-muted">Chưa có dữ liệu vật tư nào trong kho.</td></tr>
                                    )}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton className="border-0 pb-0">
                    <Modal.Title className="fw-bold">{editingId ? 'Cập nhật Vật tư' : 'Thêm Vật tư mới'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label className="fw-medium text-muted small">Tên vật tư</Form.Label>
                            <Form.Control type="text" className="rounded-3" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium text-muted small">Số lượng tồn</Form.Label>
                                    <Form.Control type="number" className="rounded-3" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium text-muted small">Đơn vị tính</Form.Label>
                                    <Form.Control type="text" className="rounded-3" placeholder="VD: Hộp, Cái..." value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium text-muted small">Đơn giá (VNĐ)</Form.Label>
                                    <Form.Control type="number" className="rounded-3" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="fw-medium text-muted small">Cảnh báo sắp hết <FaExclamationTriangle className="text-warning mb-1"/></Form.Label>
                                    <Form.Control type="number" className="rounded-3" value={formData.threshold} onChange={e => setFormData({...formData, threshold: Number(e.target.value)})} />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-2">
                            <Form.Label className="fw-medium text-muted small">Nhà cung cấp</Form.Label>
                            <Form.Control type="text" className="rounded-3" value={formData.supplier} onChange={e => setFormData({...formData, supplier: e.target.value})} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="border-0 pt-0">
                    <Button variant="light" className="px-4 rounded-pill" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" className="px-4 rounded-pill shadow-sm" onClick={handleSave}>Lưu thông tin</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ManageSupplies;
