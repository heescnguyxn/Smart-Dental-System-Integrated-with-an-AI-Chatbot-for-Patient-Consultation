import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BSNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaTooth, FaHome, FaCalendarAlt } from 'react-icons/fa';

const scrollToSection = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const HashSectionLink = ({ sectionId, className, children }) => {
    const { pathname } = useLocation();
    return (
        <Nav.Link
            as={Link}
            to={`/#${sectionId}`}
            className={className}
            onClick={e => {
                if (pathname === '/') {
                    e.preventDefault();
                    scrollToSection(sectionId);
                }
            }}
        >
            {children}
        </Nav.Link>
    );
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/');
        window.location.reload();
    };

    const isActive = path => pathname === path;

    return (
        <BSNavbar expand="lg" sticky="top" className="navbar-landing py-2 py-lg-3">
            <Container fluid="xxl" className="px-3 px-lg-4">
                <BSNavbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2 fw-bold text-white me-lg-4">
                    <span className="navbar-brand-icon d-inline-flex align-items-center justify-content-center rounded-3">
                        <FaTooth className="text-white" aria-hidden />
                    </span>
                    <span className="navbar-brand-text">Nha Khoa NVL</span>
                </BSNavbar.Brand>
                <BSNavbar.Toggle aria-controls="landing-navbar" className="navbar-dark border-0" />
                <BSNavbar.Collapse id="landing-navbar">
                    <Nav className="mx-lg-auto my-3 my-lg-0 align-items-lg-center gap-lg-1 landing-nav-links">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className={`landing-nav-item rounded-pill px-3 ${isActive('/') ? 'landing-nav-active' : ''}`}
                        >
                            <FaHome className="me-1 d-none d-sm-inline" aria-hidden />
                            Trang Chủ
                        </Nav.Link>
                        <HashSectionLink sectionId="gioi-thieu" className="landing-nav-item rounded-pill px-3">
                            Giới Thiệu
                        </HashSectionLink>
                        <HashSectionLink sectionId="dich-vu" className="landing-nav-item rounded-pill px-3">
                            Dịch Vụ
                        </HashSectionLink>
                        <HashSectionLink sectionId="bang-gia" className="landing-nav-item rounded-pill px-3">
                            Bảng Giá
                        </HashSectionLink>
                        <HashSectionLink sectionId="tin-tuc" className="landing-nav-item rounded-pill px-3">
                            Tin Tức
                        </HashSectionLink>
                        <HashSectionLink sectionId="lien-he" className="landing-nav-item rounded-pill px-3">
                            Liên Hệ
                        </HashSectionLink>
                        {user && (
                            <>
                                <Nav.Link as={Link} to="/doctors" className="landing-nav-item rounded-pill px-3">
                                    Tìm Bác Sĩ
                                </Nav.Link>
                                {user.role === 'patient' && (
                                    <Nav.Link
                                        as={Link}
                                        to="/my-appointments"
                                        className={`landing-nav-item rounded-pill px-3 ${isActive('/my-appointments') ? 'landing-nav-active' : ''}`}
                                    >
                                        Lịch Khám
                                    </Nav.Link>
                                )}
                                {user.role === 'doctor' && (
                                    <Nav.Link
                                        as={Link}
                                        to="/doctor-dashboard"
                                        className={`landing-nav-item rounded-pill px-3 ${isActive('/doctor-dashboard') ? 'landing-nav-active' : ''}`}
                                    >
                                        Dashboard
                                    </Nav.Link>
                                )}
                                {user.role === 'staff' && (
                                    <Nav.Link
                                        as={Link}
                                        to="/staff-dashboard"
                                        className={`landing-nav-item rounded-pill px-3 ${isActive('/staff-dashboard') ? 'landing-nav-active' : ''}`}
                                    >
                                        Staff
                                    </Nav.Link>
                                )}
                            </>
                        )}
                    </Nav>
                    <Nav className="align-items-lg-center gap-2 ms-lg-2">
                        {user ? (
                            <>
                                {user.role === 'patient' && (
                                    <Button
                                        as={Link}
                                        to="/book"
                                        className="rounded-pill px-3 px-lg-4 d-flex align-items-center gap-2 btn-landing-orange border-0 d-none d-lg-flex"
                                    >
                                        <FaCalendarAlt /> Đặt Lịch Hẹn
                                    </Button>
                                )}
                                <Nav.Link as={Link} to="/profile" className="landing-nav-item text-white d-flex align-items-center gap-2 px-3">
                                    <FaUser /> <span className="text-truncate" style={{ maxWidth: '8rem' }}>{user.name}</span>
                                </Nav.Link>
                                <Button
                                    variant="light"
                                    className="rounded-pill px-3 btn-logout-landing d-flex align-items-center gap-2"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt /> Đăng xuất
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/doctors"
                                    className="rounded-pill px-3 px-lg-4 d-flex align-items-center gap-2 btn-landing-orange border-0"
                                >
                                    <FaCalendarAlt /> Đặt Lịch Hẹn
                                </Button>
                                <Button
                                    as={Link}
                                    to="/login"
                                    className="rounded-pill px-3 px-lg-4 d-flex align-items-center gap-2 btn-landing-blue border-0"
                                >
                                    <FaUser /> Đăng Nhập
                                </Button>
                            </>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
};

export default Navbar;
