import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import DoctorCard from '../../components/DoctorCard';
import { doctorService } from '../../services/doctorService';
import ChatBotAI from '../../components/ChatBotAI';
import {
    FaStar,
    FaCalendarAlt,
    FaPlay,
    FaShieldAlt,
    FaTooth,
    FaClock,
    FaCheck,
    FaArrowRight,
    FaGem,
    FaTeeth,
    FaBone,
    FaSmile,
    FaTeethOpen,
    FaHeartbeat,
} from 'react-icons/fa';

const SERVICES = [
    {
        icon: FaGem,
        title: 'Mặt Dán Sứ Veneer',
        desc: 'Phục hình thẩm mỹ, che khuyết điểm răng ố vàng, mẻ nhẹ với lớp sứ siêu mỏng bền đẹp.',
        features: ['Tự nhiên như răng thật', 'Độ bền cao', 'Bảo hành dài hạn'],
    },
    {
        icon: FaTeeth,
        title: 'Niềng Răng Thẩm Mỹ',
        desc: 'Khay trong suốt và mắc cài hiện đại, chỉnh nha an toàn do bác sĩ chuyên khoa theo dõi.',
        features: ['Kế hoạch 3D rõ ràng', 'Ít đau, thoải mái', 'Lịch tái khám linh hoạt'],
    },
    {
        icon: FaBone,
        title: 'Cấy Ghép Implant',
        desc: 'Thay thế răng mất với trụ titanium tích hợp xương, ăn nhai chắc chắn, thẩm mỹ lâu dài.',
        features: ['Trụ chính hãng', 'Quy trình vô khuẩn', 'Theo dõi sau cấy'],
    },
    {
        icon: FaSmile,
        title: 'Tẩy Trắng Răng',
        desc: 'Làm sáng răng tại phòng với thuốc chuyên dụng, bảo vệ men răng và nướu.',
        features: ['Hiệu quả nhanh', 'Giảm ê buốt', 'Tư vấn miễn phí'],
    },
    {
        icon: FaTeethOpen,
        title: 'Nhổ Răng Khôn',
        desc: 'Nhổ an toàn bằng kỹ thuật tối thiểu xâm lấn, giảm sưng và hồi phục nhanh.',
        features: ['Chụp CT khi cần', 'Gây tê hiệu quả', 'Chăm sóc sau nhổ'],
    },
    {
        icon: FaHeartbeat,
        title: 'Điều Trị Tổng Quát',
        desc: 'Trám, lấy tủy, vệ sinh cao răng định kỳ — nền tảng cho hơi thở thơm và răng khỏe.',
        features: ['Trang thiết bị hiện đại', 'Chi phí minh bạch', 'Đặt lịch online'],
    },
];

const Home = () => {
    const [doctors, setDoctors] = useState([]);
    const { hash } = useLocation();

    useEffect(() => {
        doctorService.getAll().then(res => setDoctors(res.data.slice(0, 6)));
    }, []);

    useEffect(() => {
        if (!hash) return;
        const id = hash.replace('#', '');
        requestAnimationFrame(() => {
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    }, [hash]);

    return (
        <>
            <section className="landing-hero">
                <div className="landing-hero-glow" aria-hidden />
                <Container className="landing-hero-inner">
                    <Row className="align-items-center g-4 g-lg-5">
                        <Col lg={6}>
                            <div className="landing-badge">
                                <FaStar className="landing-badge-icon" aria-hidden />
                                Chất lượng hàng đầu
                            </div>
                            <h1 className="landing-hero-title">
                                Nụ Cười <span className="text-accent-orange">Tự Tin</span>
                                <br />
                                Sức Khỏe <span className="text-accent-orange">Hoàn Hảo</span>
                            </h1>
                            <p className="landing-hero-lead">
                                Công nghệ nha khoa hiện đại cùng đội ngũ bác sĩ giàu kinh nghiệm — chăm sóc
                                trọn vẹn từ thăm khám đến điều trị, để bạn tự tin mỗi ngày.
                            </p>
                            <div className="landing-hero-cta d-flex flex-wrap gap-3">
                                <Button
                                    as={Link}
                                    to="/doctors"
                                    className="btn-landing-orange btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
                                >
                                    <FaCalendarAlt /> Đặt Lịch Ngay
                                </Button>
                                <Button
                                    as={Link}
                                    to="/doctors"
                                    variant="outline-light"
                                    className="btn-landing-outline btn-lg rounded-pill px-4 d-inline-flex align-items-center gap-2"
                                >
                                    <FaPlay className="landing-play-icon" /> Xem Dịch Vụ
                                </Button>
                            </div>
                            <Row className="landing-stats g-3 mt-4 pt-2">
                                <Col xs={4}>
                                    <div className="landing-stat-value">5000+</div>
                                    <div className="landing-stat-label">Khách hàng</div>
                                </Col>
                                <Col xs={4}>
                                    <div className="landing-stat-value">15+</div>
                                    <div className="landing-stat-label">Năm kinh nghiệm</div>
                                </Col>
                                <Col xs={4}>
                                    <div className="landing-stat-value">98%</div>
                                    <div className="landing-stat-label">Hài lòng</div>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={6}>
                            {/* <div style={{ display: 'flex' }}>
                                <div style={{ backgroundColor: 'white', color: 'black', borderRadius: '20%', display: 'flex', maxWidth: 'fit-content' }}>
                                    <FaShieldAlt className="landing-float-icon" />
                                    <div>
                                        <strong>An Toàn 100%</strong>
                                        <span>Vô khuẩn chuẩn</span>
                                    </div>
                                </div>
                                <div className='.landing-float'>
                                    <FaTooth className="landing-float-icon" />
                                    <div>
                                        <strong>Chất Lượng Cao</strong>
                                        <span>Vật liệu chính hãng</span>
                                    </div>
                                </div>
                                <div className='.landing-float'>
                                    <FaClock className="landing-float-icon" />
                                    <div>
                                        <strong>24/7 Hỗ Trợ</strong>
                                        <span>Đặt lịch linh hoạt</span>
                                    </div>
                                </div>
                            </div> */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                                {/* IMAGE */}
                                <div
                                    style={{
                                        width: '100%',
                                        borderRadius: '16px',
                                        overflow: 'hidden',
                                        position: 'relative',
                                        boxShadow: '0 6px 18px rgba(0,0,0,0.12)'
                                    }}
                                >
                                    <img
                                        src="https://images.pexels.com/photos/3845757/pexels-photo-3845757.jpeg?auto=compress&cs=tinysrgb&w=1200"
                                        alt="dental"
                                        style={{
                                            width: '100%',
                                            height: '220px',
                                            objectFit: 'cover',
                                            display: 'block'
                                        }}
                                    />

                                    {/* overlay nhẹ cho sang */}
                                    <div
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 50%, rgba(0,0,0,0.25))'
                                        }}
                                    />
                                </div>

                                {/* BUTTONS */}
                                <div style={{ display: 'flex', gap: '16px', justifyContent: 'space-between' }}>

                                    {/* Item 1 */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #ffffff, #f1f7ff)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        width: 'fit-content',
                                        transition: 'all 0.25s ease',
                                        cursor: 'pointer'
                                    }}>
                                        <FaShieldAlt style={{
                                            background: 'linear-gradient(135deg, #4facfe, #00f2fe)',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            padding: '8px',
                                            fontSize: '30px',
                                            boxShadow: '0 0 10px rgba(79,172,254,0.6)'
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong style={{ fontSize: '14px', color: '#111' }}>An Toàn 100%</strong>
                                            <span style={{ fontSize: '12px', color: '#555' }}>Vô khuẩn chuẩn</span>
                                        </div>
                                    </div>

                                    {/* Item 2 */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #ffffff, #fff6e9)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        width: 'fit-content',
                                        transition: 'all 0.25s ease',
                                        cursor: 'pointer'
                                    }}>
                                        <FaTooth style={{
                                            background: 'linear-gradient(135deg, #f7971e, #ffd200)',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            padding: '8px',
                                            fontSize: '30px',
                                            boxShadow: '0 0 10px rgba(247,151,30,0.6)'
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong style={{ fontSize: '14px', color: '#111' }}>Chất Lượng Cao</strong>
                                            <span style={{ fontSize: '12px', color: '#555' }}>Vật liệu chính hãng</span>
                                        </div>
                                    </div>

                                    {/* Item 3 */}
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        padding: '10px 14px',
                                        borderRadius: '14px',
                                        background: 'linear-gradient(135deg, #ffffff, #eafff3)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                                        width: 'fit-content',
                                        transition: 'all 0.25s ease',
                                        cursor: 'pointer'
                                    }}>
                                        <FaClock style={{
                                            background: 'linear-gradient(135deg, #43e97b, #38f9d7)',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            padding: '8px',
                                            fontSize: '30px',
                                            boxShadow: '0 0 10px rgba(67,233,123,0.6)'
                                        }} />
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <strong style={{ fontSize: '14px', color: '#111' }}>24/7 Hỗ Trợ</strong>
                                            <span style={{ fontSize: '12px', color: '#555' }}>Đặt lịch linh hoạt</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section id="gioi-thieu" className="landing-about py-5">
                <Container>
                    <Row className="align-items-center g-4">
                        <Col md={6}>
                            <h2 className="landing-section-title-left mb-3">Vì sao chọn chúng tôi</h2>
                            <p className="text-secondary mb-0">
                                Phòng khám hướng tới trải nghiệm nhẹ nhàng: tư vấn rõ ràng, quy trình minh
                                bạch và lịch hẹn đúng giờ. Đội ngũ được đào tạo bài bản, cập nhật kỹ thuật
                                mới để mang lại kết quả bền vững cho nụ cười của bạn.
                            </p>
                        </Col>
                        <Col md={6}>
                            <ul className="landing-about-list list-unstyled mb-0">
                                <li>
                                    <FaCheck className="text-accent-orange" /> Quy trình vô khuẩn và trang thiết bị hiện đại
                                </li>
                                <li>
                                    <FaCheck className="text-accent-orange" /> Bác sĩ chuyên khoa, tận tâm
                                </li>
                                <li>
                                    <FaCheck className="text-accent-orange" /> Đặt lịch online, nhắc lịch tự động
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section id="dich-vu" className="landing-services py-5">
                <Container>
                    <div className="landing-services-head text-center mx-auto mb-5">
                        <h2 className="landing-services-title">Dịch Vụ Nha Khoa Toàn Diện</h2>
                        <p className="landing-services-sub text-secondary mb-0">
                            Giải pháp thẩm mỹ và điều trị trong cùng một hệ sinh thái — được thiết kế phù hợp
                            nhu cầu và thời gian của bạn.
                        </p>
                    </div>
                    <Row className="g-4">
                        {SERVICES.map((s, i) => {
                            const Icon = s.icon;
                            return (
                                <Col md={6} lg={4} key={s.title}>
                                    <article className={`landing-service-card h-100 ${i === 0 ? 'is-featured' : ''}`}>
                                        <div className="landing-service-icon-wrap">
                                            <Icon className="landing-service-icon" aria-hidden />
                                        </div>
                                        <h3 className="landing-service-title">{s.title}</h3>
                                        <p className="landing-service-desc text-secondary">{s.desc}</p>
                                        <ul className="landing-service-features list-unstyled">
                                            {s.features.map(f => (
                                                <li key={f}>
                                                    <FaCheck className="landing-service-check" aria-hidden />
                                                    {f}
                                                </li>
                                            ))}
                                        </ul>
                                        <Link to="/doctors" className="landing-service-link">
                                            Tìm hiểu thêm <FaArrowRight className="ms-1" />
                                        </Link>
                                    </article>
                                </Col>
                            );
                        })}
                    </Row>
                </Container>
            </section>

            <section id="bang-gia" className="landing-pricing py-5 bg-white">
                <Container>
                    <h2 className="text-center landing-section-title mb-4">Bảng giá tham khảo</h2>
                    <Row className="g-3 justify-content-center">
                        {[
                            { name: 'Khám & tư vấn', price: 'Miễn phí*' },
                            { name: 'Vệ sinh răng miệng', price: 'Từ 300.000đ' },
                            { name: 'Trám răng thẩm mỹ', price: 'Từ 400.000đ' },
                        ].map(p => (
                            <Col key={p.name} sm={6} md={4}>
                                <div className="landing-price-pill text-center">
                                    <div className="landing-price-name">{p.name}</div>
                                    <div className="landing-price-val">{p.price}</div>
                                </div>
                            </Col>
                        ))}
                    </Row>
                    <p className="text-center text-secondary small mt-3 mb-0">
                        *Áp dụng điều kiện phòng khám. Giá có thể thay đổi theo chỉ định bác sĩ.
                    </p>
                </Container>
            </section>

            <section id="tin-tuc" className="landing-news py-5">
                <Container>
                    <h2 className="text-center landing-section-title mb-4">Tin tức &amp; gợi ý</h2>
                    <Row className="g-4">
                        <Col md={6}>
                            <div className="landing-news-card h-100">
                                <span className="landing-news-tag">Sức khỏe</span>
                                <h3 className="h5 mt-2">Chăm sóc răng miệng sau niềng</h3>
                                <p className="text-secondary small mb-0">
                                    Vệ sinh đúng cách giúp tránh sâu răng và viêm nướu trong thời gian chỉnh
                                    nha.
                                </p>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="landing-news-card h-100">
                                <span className="landing-news-tag">Thẩm mỹ</span>
                                <h3 className="h5 mt-2">Khi nào nên cân nhắc veneer?</h3>
                                <p className="text-secondary small mb-0">
                                    Veneer phù hợp khi răng ố nhẹ, mẻ nhỏ — bác sĩ sẽ đánh giá men răng trước
                                    khi làm.
                                </p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <section className="landing-doctors py-5 bg-white">
                <Container>
                    <h2 className="text-center landing-section-title mb-2">Bác sĩ nổi bật</h2>
                    <p className="text-center text-secondary mb-5 mx-auto landing-doctors-sub">
                        Đặt lịch trực tiếp với bác sĩ phù hợp chuyên môn của bạn.
                    </p>
                    <Row>
                        {doctors.map(doctor => (
                            <Col md={6} lg={4} key={doctor._id} className="mb-4">
                                <DoctorCard doctor={doctor} />
                            </Col>
                        ))}
                    </Row>
                    <div className="text-center mt-3">
                        <Button
                            as={Link}
                            to="/doctors"
                            className="btn-landing-purple-outline btn-lg rounded-pill px-5"
                        >
                            Xem tất cả bác sĩ
                        </Button>
                    </div>
                </Container>
            </section>

            <ChatBotAI />
        </>
    );
};

export default Home;
