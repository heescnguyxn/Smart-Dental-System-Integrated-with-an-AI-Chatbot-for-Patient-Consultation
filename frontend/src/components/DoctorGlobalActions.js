import React, { useState, useEffect } from 'react';
import { Nav, NavDropdown, Modal, Form, Button, ListGroup, Spinner, Badge } from 'react-bootstrap';
import { FaFileMedical, FaPrescriptionBottleAlt, FaSearch, FaUser, FaCalendarAlt, FaCheckCircle } from 'react-icons/fa';
import { appointmentService } from '../services/appointmentService';
import { supplyService } from '../services/supplyService';
import MedicalRecordModal from '../pages/doctor/components/MedicalRecordModal';
import PrescriptionModal from '../pages/doctor/components/PrescriptionModal';

const DoctorGlobalActions = () => {
    const [showSearch, setShowSearch] = useState(false);
    const [actionType, setActionType] = useState(''); // 'record' or 'prescription'
    
    const [appointments, setAppointments] = useState([]);
    const [supplies, setSupplies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const [selectedApt, setSelectedApt] = useState(null);
    const [showRecordModal, setShowRecordModal] = useState(false);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

    useEffect(() => {
        if (showSearch) {
            fetchData();
        }
    }, [showSearch]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [aptRes, supRes] = await Promise.all([
                appointmentService.getByDoctor(),
                supplyService.getAll()
            ]);
            // Filter appointments to exclude cancelled ones
            const validApts = aptRes.data.filter(apt => apt.status !== 'cancelled');
            setAppointments(validApts);
            setSupplies(supRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenSearch = (type) => {
        setActionType(type);
        setSearchQuery('');
        setShowSearch(true);
    };

    const handleSelectApt = (apt) => {
        setSelectedApt(apt);
        setShowSearch(false);
        if (actionType === 'record') {
            setShowRecordModal(true);
        } else if (actionType === 'prescription') {
            setShowPrescriptionModal(true);
        }
    };

    const filteredAppointments = appointments.filter(apt => {
        const patientName = apt.patientId?.name?.toLowerCase() || 'khách vãng lai';
        return patientName.includes(searchQuery.toLowerCase());
    });

    return (
        <>
            <NavDropdown 
                title={<><FaFileMedical className="me-1 d-none d-sm-inline" /> Nghiệp vụ Bác sĩ</>} 
                id="doctor-actions-dropdown" 
                className="landing-nav-dropdown"
            >
                <NavDropdown.Item onClick={() => handleOpenSearch('record')}>
                    Quản lý hồ sơ bệnh án
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => handleOpenSearch('prescription')}>
                    <FaPrescriptionBottleAlt className="me-2 text-muted" /> Lập kế hoạch điều trị
                </NavDropdown.Item>
            </NavDropdown>

            {/* Patient Search Modal */}
            <Modal show={showSearch} onHide={() => setShowSearch(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {actionType === 'record' ? 'Chọn bệnh nhân để xem / quản lý bệnh án' : 'Chọn bệnh nhân để lập kế hoạch / kê thuốc'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <div className="input-group">
                            <span className="input-group-text bg-white"><FaSearch /></span>
                            <Form.Control 
                                type="text" 
                                placeholder="Tìm kiếm theo tên bệnh nhân..." 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                autoFocus
                            />
                        </div>
                    </Form.Group>

                    {loading ? (
                        <div className="text-center py-4"><Spinner animation="border" /></div>
                    ) : (
                        <ListGroup className="search-result-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map(apt => (
                                    <ListGroup.Item 
                                        key={apt._id} 
                                        action 
                                        onClick={() => handleSelectApt(apt)}
                                        className="d-flex justify-content-between align-items-center"
                                    >
                                        <div>
                                            <div className="fw-bold"><FaUser className="me-2 text-muted" /> {apt.patientId?.name || 'Khách vãng lai'}</div>
                                            <div className="small text-muted mt-1">
                                                <FaCalendarAlt className="me-1"/> {new Date(apt.date).toLocaleDateString('vi-VN')} - {apt.time}
                                            </div>
                                        </div>
                                        <div>
                                            {apt.status === 'completed' ? (
                                                <Badge bg="success"><FaCheckCircle className="me-1" /> Đã khám</Badge>
                                            ) : apt.status === 'confirmed' ? (
                                                <Badge bg="primary"><FaCheckCircle className="me-1" /> Đã xác nhận</Badge>
                                            ) : (
                                                <Badge bg="warning" text="dark">Chờ xác nhận</Badge>
                                            )}
                                        </div>
                                    </ListGroup.Item>
                                ))
                            ) : (
                                <div className="text-center py-3 text-muted">Không tìm thấy bệnh nhân nào.</div>
                            )}
                        </ListGroup>
                    )}
                </Modal.Body>
            </Modal>

            {/* Action Modals */}
            <MedicalRecordModal 
                show={showRecordModal} 
                onHide={() => setShowRecordModal(false)} 
                appointment={selectedApt} 
            />
            
            <PrescriptionModal 
                show={showPrescriptionModal} 
                onHide={() => setShowPrescriptionModal(false)} 
                appointment={selectedApt} 
                supplies={supplies} 
            />
        </>
    );
};

export default DoctorGlobalActions;
