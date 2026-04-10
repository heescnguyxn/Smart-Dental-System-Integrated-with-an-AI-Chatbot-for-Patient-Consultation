import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
    return (
        <footer id="lien-he" className="footer-landing py-5 mt-0">
            <Container>
                <Row>
                    <Col md={4}>
                        <h5>Hệ thống đặt lịch khám</h5>
                        <p>Ứng dụng hỗ trợ đặt lịch bác sĩ nhanh chóng.</p>
                    </Col>
                    <Col md={4}>
                        <h6>Liên kết</h6>
                        <ul className="list-unstyled">
                            <li><a href="/">Trang chủ</a></li>
                            <li><a href="/doctors">Tìm bác sĩ</a></li>
                            <li><a href="/#dich-vu">Dịch vụ</a></li>
                        </ul>
                    </Col>
                    <Col md={4}>
                        <h6>Liên hệ</h6>
                        <p>Email: support@kltm.vn</p>
                    </Col>
                </Row>
                <hr />
                <p className="text-center mb-0 opacity-75">&copy; {new Date().getFullYear()} Nha Khoa NVL — KLTN.</p>
            </Container>
        </footer>
    );
};

export default Footer;

