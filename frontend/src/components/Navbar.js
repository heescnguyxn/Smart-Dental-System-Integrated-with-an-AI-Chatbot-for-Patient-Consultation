import React, { useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Navbar as BSNavbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { FaUser, FaSignOutAlt, FaTooth, FaHome, FaCalendarAlt, FaCompass } from 'react-icons/fa';
import DoctorGlobalActions from './DoctorGlobalActions';

const landingSections = [
    { id: 'gioi-thieu', label: 'Giới thiệu' },
    { id: 'dich-vu', label: 'Dịch vụ' },
    { id: 'bang-gia', label: 'Bảng giá' },
    { id: 'tin-tuc', label: 'Tin tức' },
    { id: 'lien-he', label: 'Liên hệ' }
];

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

const SectionDropdownItem = ({ sectionId, children }) => {
    const { pathname } = useLocation();

    return (
        <NavDropdown.Item
            as={Link}
            to={`/#${sectionId}`}
            className="landing-dropdown-item"
            onClick={e => {
                if (pathname === '/') {
                    e.preventDefault();
                    scrollToSection(sectionId);
                }
            }}
        >
            {children}
        </NavDropdown.Item>
    );
};

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const useSectionsDropdown = user?.role === 'patient';

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
                    <Nav className="mx-lg-auto my-3 my-lg-0 align-items-lg-center landing-nav-links">
                        <Nav.Link
                            as={Link}
                            to="/"
                            className={`landing-nav-item rounded-pill px-3 ${isActive('/') ? 'landing-nav-active' : ''}`}
                        >
                            <FaHome className="me-1 d-none d-sm-inline" aria-hidden />
                            Trang chủ
                        </Nav.Link>

                        {(!user || user.role === 'patient') && (
                            useSectionsDropdown ? (
                                <NavDropdown
                                    id="landing-sections-dropdown"
                                    title={(
                                        <span className="d-inline-flex align-items-center gap-2">
                                            <FaCompass aria-hidden />
                                            <span>Khám phá</span>
                                        </span>
                                    )}
                                    className="landing-nav-dropdown"
                                    menuVariant="light"
                                >
                                    {landingSections.map(section => (
                                        <SectionDropdownItem key={section.id} sectionId={section.id}>
                                            {section.label}
                                        </SectionDropdownItem>
                                    ))}
                                </NavDropdown>
                            ) : (
                                landingSections.map(section => (
                                    <HashSectionLink
                                        key={section.id}
                                        sectionId={section.id}
                                        className="landing-nav-item rounded-pill px-3"
                                    >
                                        {section.label}
                                    </HashSectionLink>
                                ))
                            )
                        )}

                        {user && (
                            <>
                                {user.role === 'patient' && (
                                    <>
                                        <Nav.Link
                                            as={Link}
                                            to="/doctors"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/doctors') ? 'landing-nav-active' : ''}`}
                                        >
                                            Tìm bác sĩ
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to="/my-appointments"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/my-appointments') ? 'landing-nav-active' : ''}`}
                                        >
                                            Lịch khám
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to="/my-invoices"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/my-invoices') ? 'landing-nav-active' : ''}`}
                                        >
                                            Hóa đơn
                                        </Nav.Link>
                                    </>
                                )}

                                {user.role === 'doctor' && (
                                    <>
                                        <DoctorGlobalActions />
                                        <Nav.Link
                                            as={Link}
                                            to="/doctor-dashboard"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/doctor-dashboard') ? 'landing-nav-active' : ''}`}
                                        >
                                            Dashboard
                                        </Nav.Link>
                                    </>
                                )}

                                {user.role === 'staff' && (
                                    <>
                                        <Nav.Link
                                            as={Link}
                                            to="/staff-dashboard"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/staff-dashboard') ? 'landing-nav-active' : ''}`}
                                        >
                                            Dashboard
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to="/manage-payments"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/manage-payments') ? 'landing-nav-active' : ''}`}
                                        >
                                            Hóa đơn
                                        </Nav.Link>
                                        <Nav.Link
                                            as={Link}
                                            to="/revenue-report"
                                            className={`landing-nav-item rounded-pill px-3 ${isActive('/revenue-report') ? 'landing-nav-active' : ''}`}
                                        >
                                            Báo cáo
                                        </Nav.Link>
                                    </>
                                )}
                            </>
                        )}
                    </Nav>

                    <Nav className="align-items-lg-center ms-lg-2 landing-nav-actions">
                        {user ? (
                            <>
                                {user.role === 'patient' && (
                                    <Button
                                        as={Link}
                                        to="/book"
                                        className="rounded-pill px-3 px-lg-4 d-flex align-items-center gap-2 btn-landing-booking border-0"
                                    >
                                        <FaCalendarAlt />
                                        <span>Đặt lịch</span>
                                    </Button>
                                )}

                                <NavDropdown
                                    id="landing-account-dropdown"
                                    align="end"
                                    title={(
                                        <span className="d-inline-flex align-items-center gap-2">
                                            <FaUser aria-hidden />
                                            <span className="landing-user-label">{user.name}</span>
                                        </span>
                                    )}
                                    className="landing-account-dropdown"
                                    menuVariant="light"
                                >
                                    <NavDropdown.Item as={Link} to="/profile" className="landing-dropdown-item">
                                        Hồ sơ cá nhân
                                    </NavDropdown.Item>

                                    {user.role === 'patient' && (
                                        <NavDropdown.Item as={Link} to="/my-invoices" className="landing-dropdown-item text-primary fw-bold">
                                            Hóa đơn & Thanh toán
                                        </NavDropdown.Item>
                                    )}

                                    <NavDropdown.Divider />

                                    <NavDropdown.Item
                                        as="button"
                                        type="button"
                                        className="landing-dropdown-item landing-dropdown-item-danger"
                                        onClick={handleLogout}
                                    >
                                        <FaSignOutAlt className="me-2" />
                                        Đăng xuất
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        ) : (
                            <>
                                <Button
                                    as={Link}
                                    to="/doctors"
                                    className="rounded-pill px-3 px-lg-4 d-flex align-items-center gap-2 btn-landing-booking border-0"
                                >
                                    <FaCalendarAlt />
                                    <span>Đặt lịch hẹn</span>
                                </Button>

                                <Button
                                    as={Link}
                                    to="/login"
                                    className="rounded-pill px-3 px-lg-4 d-flex align-items-center gap-2 btn-landing-blue border-0"
                                >
                                    <FaUser />
                                    <span>Đăng nhập</span>
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
