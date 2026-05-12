import React, { useState, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Spinner, ButtonGroup, Button } from 'react-bootstrap';
import {
    Chart as ChartJS,
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, ArcElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { invoiceService } from '../../services/invoiceService';
import {
    FaChartLine, FaMoneyBillWave, FaFileInvoiceDollar,
    FaCheckCircle, FaClock, FaCalculator,
} from 'react-icons/fa';

ChartJS.register(
    CategoryScale, LinearScale, BarElement, LineElement,
    PointElement, ArcElement, Title, Tooltip, Legend, Filler
);

const PERIODS = [
    { key: '7d',  label: '7 ngày' },
    { key: '30d', label: '30 ngày' },
    { key: '3m',  label: '3 tháng' },
    { key: '12m', label: '12 tháng' },
];

const METHOD_LABELS = { cash: 'Tiền mặt', card: 'Thẻ NH', transfer: 'Chuyển khoản' };
const METHOD_COLORS = ['#0d6efd', '#20c997', '#fd7e14'];

// ── data helpers ──────────────────────────────────────────────

function buildTimeSeries(paidInvoices, period) {
    const now = new Date();
    const labels = [];
    const map = {};

    if (period === '7d' || period === '30d') {
        const days = period === '7d' ? 7 : 30;
        for (let i = days - 1; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toLocaleDateString('vi-VN');
            labels.push(key);
            map[key] = 0;
        }
        paidInvoices.forEach(inv => {
            const key = new Date(inv.paymentDate || inv.createdAt).toLocaleDateString('vi-VN');
            if (key in map) map[key] += inv.totalAmount;
        });
    } else {
        const months = period === '3m' ? 3 : 12;
        for (let i = months - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `T${d.getMonth() + 1}/${d.getFullYear()}`;
            labels.push(key);
            map[key] = 0;
        }
        paidInvoices.forEach(inv => {
            const d = new Date(inv.paymentDate || inv.createdAt);
            const key = `T${d.getMonth() + 1}/${d.getFullYear()}`;
            if (key in map) map[key] += inv.totalAmount;
        });
    }

    return { labels, values: labels.map(l => map[l]) };
}

function buildMethodBreakdown(paidInvoices) {
    const acc = { cash: 0, card: 0, transfer: 0 };
    paidInvoices.forEach(inv => {
        if (inv.paymentMethod in acc) acc[inv.paymentMethod] += inv.totalAmount;
    });
    return acc;
}

function buildDoctorRevenue(paidInvoices) {
    const acc = {};
    paidInvoices.forEach(inv => {
        const name = inv.appointmentId?.doctorId?.userId?.name || 'Không rõ';
        acc[name] = (acc[name] || 0) + inv.totalAmount;
    });
    return Object.entries(acc).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

function filterByPeriod(invoices, period) {
    const now = new Date();
    let from;
    if (period === '7d')  from = new Date(now - 7 * 864e5);
    else if (period === '30d') from = new Date(now - 30 * 864e5);
    else if (period === '3m')  from = new Date(now.getFullYear(), now.getMonth() - 3, 1);
    else                       from = new Date(now.getFullYear(), now.getMonth() - 12, 1);
    return invoices.filter(inv => new Date(inv.createdAt) >= from);
}

// ── stat card ─────────────────────────────────────────────────

function StatCard({ icon, bgClass, label, value, valueClass, small }) {
    return (
        <Card className="border-0 shadow-sm h-100 rounded-4 overflow-hidden">
            <Card.Body className="d-flex align-items-center position-relative">
                <div className={`${bgClass} bg-opacity-10 p-3 rounded-circle me-3`} style={{ zIndex: 1 }}>
                    {icon}
                </div>
                <div style={{ zIndex: 1 }}>
                    <h6 className="text-muted mb-1 text-uppercase fw-bold" style={{ fontSize: '0.75rem' }}>
                        {label}
                    </h6>
                    {small
                        ? <h5 className={`mb-0 fw-bold ${valueClass}`}>{value}</h5>
                        : <h3 className={`mb-0 fw-bold ${valueClass}`}>{value}</h3>
                    }
                </div>
            </Card.Body>
        </Card>
    );
}

// ── main component ────────────────────────────────────────────

const RevenueReport = () => {
    const [allInvoices, setAllInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('30d');

    useEffect(() => {
        invoiceService.getAll()
            .then(res => setAllInvoices(res.data))
            .catch(err => console.error('Error fetching invoices', err))
            .finally(() => setLoading(false));
    }, []);

    const periodInvoices = useMemo(() => filterByPeriod(allInvoices, period), [allInvoices, period]);
    const paidInvoices   = useMemo(() => periodInvoices.filter(inv => inv.status === 'paid'), [periodInvoices]);

    const totalRevenue  = useMemo(() => paidInvoices.reduce((s, inv) => s + inv.totalAmount, 0), [paidInvoices]);
    const unpaidCount   = useMemo(() => periodInvoices.filter(inv => inv.status === 'unpaid').length, [periodInvoices]);
    const avgInvoice    = paidInvoices.length ? Math.round(totalRevenue / paidInvoices.length) : 0;

    const timeSeries     = useMemo(() => buildTimeSeries(paidInvoices, period), [paidInvoices, period]);
    const methodBreakdown = useMemo(() => buildMethodBreakdown(paidInvoices), [paidInvoices]);
    const doctorRevenue  = useMemo(() => buildDoctorRevenue(paidInvoices), [paidInvoices]);

    // chart configs
    const revenueChartData = {
        labels: timeSeries.labels,
        datasets: [{
            label: 'Doanh thu (đ)',
            data: timeSeries.values,
            backgroundColor: 'rgba(13, 110, 253, 0.15)',
            borderColor: '#0d6efd',
            borderWidth: 2,
            pointBackgroundColor: '#0d6efd',
            pointRadius: timeSeries.labels.length <= 14 ? 4 : 2,
            fill: true,
            tension: 0.4,
        }],
    };

    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.parsed.y.toLocaleString('vi-VN')} đ`,
                },
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: v => v >= 1e6
                        ? (v / 1e6).toFixed(1) + 'M'
                        : v >= 1e3 ? (v / 1e3).toFixed(0) + 'K' : v,
                },
                grid: { color: 'rgba(0,0,0,0.05)' },
            },
            x: { grid: { display: false } },
        },
    };

    const methodChartData = {
        labels: Object.keys(methodBreakdown).map(k => METHOD_LABELS[k] || k),
        datasets: [{
            data: Object.values(methodBreakdown),
            backgroundColor: METHOD_COLORS,
            borderWidth: 0,
            hoverOffset: 8,
        }],
    };

    const methodChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom', labels: { padding: 16, usePointStyle: true } },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.parsed.toLocaleString('vi-VN')} đ`,
                },
            },
        },
        cutout: '65%',
    };

    const doctorChartData = {
        labels: doctorRevenue.map(([name]) => name),
        datasets: [{
            label: 'Doanh thu (đ)',
            data: doctorRevenue.map(([, v]) => v),
            backgroundColor: [
                'rgba(13,110,253,0.75)', 'rgba(32,201,151,0.75)', 'rgba(253,126,20,0.75)',
                'rgba(220,53,69,0.75)',  'rgba(108,117,125,0.75)', 'rgba(111,66,193,0.75)',
            ],
            borderRadius: 6,
            borderSkipped: false,
        }],
    };

    const doctorChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: ctx => ` ${ctx.parsed.x.toLocaleString('vi-VN')} đ`,
                },
            },
        },
        scales: {
            x: {
                beginAtZero: true,
                ticks: {
                    callback: v => v >= 1e6
                        ? (v / 1e6).toFixed(1) + 'M'
                        : v >= 1e3 ? (v / 1e3).toFixed(0) + 'K' : v,
                },
                grid: { color: 'rgba(0,0,0,0.05)' },
            },
            y: { grid: { display: false } },
        },
    };

    return (
        <div className="page-fill bg-light pb-5">
            {/* Header */}
            <div
                className="text-white py-4 mb-4 shadow-sm"
                style={{ background: 'linear-gradient(135deg, #198754 0%, #146c43 100%)' }}
            >
                <Container>
                    <h2 className="mb-0 fw-bold">
                        <FaChartLine className="me-2 mb-1" /> Báo Cáo Doanh Thu
                    </h2>
                    <p className="mb-0 mt-1 opacity-75">Thống kê và phân tích doanh thu từ hóa đơn bệnh nhân</p>
                </Container>
            </div>

            <Container>
                {/* Period selector */}
                <div className="d-flex justify-content-end mb-4">
                    <ButtonGroup>
                        {PERIODS.map(p => (
                            <Button
                                key={p.key}
                                variant={period === p.key ? 'primary' : 'outline-primary'}
                                size="sm"
                                onClick={() => setPeriod(p.key)}
                                className="px-3"
                            >
                                {p.label}
                            </Button>
                        ))}
                    </ButtonGroup>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <Spinner animation="border" variant="success" />
                    </div>
                ) : (
                    <>
                        {/* Stats row */}
                        <Row className="mb-4 g-3">
                            <Col md={3}>
                                <StatCard
                                    icon={<FaMoneyBillWave size={22} className="text-success" />}
                                    bgClass="bg-success"
                                    label="Tổng doanh thu"
                                    value={totalRevenue.toLocaleString('vi-VN') + ' đ'}
                                    valueClass="text-success"
                                    small
                                />
                            </Col>
                            <Col md={3}>
                                <StatCard
                                    icon={<FaFileInvoiceDollar size={22} className="text-primary" />}
                                    bgClass="bg-primary"
                                    label="Tổng hóa đơn"
                                    value={periodInvoices.length}
                                    valueClass="text-primary"
                                />
                            </Col>
                            <Col md={3}>
                                <StatCard
                                    icon={<FaCheckCircle size={22} className="text-success" />}
                                    bgClass="bg-success"
                                    label="Đã thanh toán"
                                    value={paidInvoices.length}
                                    valueClass="text-success"
                                />
                            </Col>
                            <Col md={3}>
                                <StatCard
                                    icon={<FaClock size={22} className="text-warning" />}
                                    bgClass="bg-warning"
                                    label="Chưa thanh toán"
                                    value={unpaidCount}
                                    valueClass="text-warning"
                                />
                            </Col>
                        </Row>

                        {/* Second stats row */}
                        <Row className="mb-4 g-3">
                            <Col md={4}>
                                <StatCard
                                    icon={<FaCalculator size={22} className="text-info" />}
                                    bgClass="bg-info"
                                    label="Trung bình / hóa đơn"
                                    value={avgInvoice.toLocaleString('vi-VN') + ' đ'}
                                    valueClass="text-info"
                                    small
                                />
                            </Col>
                            <Col md={4}>
                                <StatCard
                                    icon={<FaMoneyBillWave size={22} className="text-primary" />}
                                    bgClass="bg-primary"
                                    label="Tiền mặt"
                                    value={methodBreakdown.cash.toLocaleString('vi-VN') + ' đ'}
                                    valueClass="text-primary"
                                    small
                                />
                            </Col>
                            <Col md={4}>
                                <StatCard
                                    icon={<FaChartLine size={22} className="text-danger" />}
                                    bgClass="bg-danger"
                                    label="Thẻ & Chuyển khoản"
                                    value={(methodBreakdown.card + methodBreakdown.transfer).toLocaleString('vi-VN') + ' đ'}
                                    valueClass="text-danger"
                                    small
                                />
                            </Col>
                        </Row>

                        {/* Revenue over time */}
                        <Card className="border-0 shadow-sm rounded-4 mb-4">
                            <Card.Header className="bg-white border-0 pt-4 pb-0">
                                <h5 className="fw-bold mb-0 text-primary">
                                    <FaChartLine className="me-2" />
                                    Doanh thu theo thời gian
                                </h5>
                            </Card.Header>
                            <Card.Body style={{ height: '280px' }}>
                                {paidInvoices.length === 0 ? (
                                    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                        Không có dữ liệu trong khoảng thời gian này
                                    </div>
                                ) : (
                                    <Line data={revenueChartData} options={revenueChartOptions} />
                                )}
                            </Card.Body>
                        </Card>

                        {/* Bottom two charts */}
                        <Row className="g-4">
                            <Col md={5}>
                                <Card className="border-0 shadow-sm rounded-4 h-100">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0">
                                        <h5 className="fw-bold mb-0 text-primary">
                                            Phương thức thanh toán
                                        </h5>
                                    </Card.Header>
                                    <Card.Body style={{ height: '280px' }}>
                                        {paidInvoices.length === 0 ? (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                                Không có dữ liệu
                                            </div>
                                        ) : (
                                            <Doughnut data={methodChartData} options={methodChartOptions} />
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={7}>
                                <Card className="border-0 shadow-sm rounded-4 h-100">
                                    <Card.Header className="bg-white border-0 pt-4 pb-0">
                                        <h5 className="fw-bold mb-0 text-primary">
                                            Doanh thu theo bác sĩ (Top 6)
                                        </h5>
                                    </Card.Header>
                                    <Card.Body style={{ height: '280px' }}>
                                        {doctorRevenue.length === 0 ? (
                                            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
                                                Không có dữ liệu
                                            </div>
                                        ) : (
                                            <Bar data={doctorChartData} options={doctorChartOptions} />
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Row>
                    </>
                )}
            </Container>
        </div>
    );
};

export default RevenueReport;
