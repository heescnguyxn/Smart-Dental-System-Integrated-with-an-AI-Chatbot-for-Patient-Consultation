import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import DoctorCard from '../../components/DoctorCard';
import { doctorService } from '../../services/doctorService';

const DocterSearch = () => {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [specialty, setSpecialty] = useState('');
    
    // Autocomplete states
    const [allDoctors, setAllDoctors] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const loadDoctors = async (query = search, spec = specialty) => {
        try {
            const params = { specialty: spec, q: query };
            const res = await doctorService.getAll(params);
            setDoctors(res.data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
    };

    useEffect(() => {
        const fetchAllDoctors = async () => {
            try {
                const res = await doctorService.getAll({});
                setAllDoctors(res.data);
            } catch (error) {
                console.error('Error fetching all doctors:', error);
            }
        };
        fetchAllDoctors();
        loadDoctors('', '');
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);
        if (value.trim().length > 0) {
            const filtered = allDoctors.filter(doc => 
                doc.userId?.name?.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSelectSuggestion = (docName) => {
        setSearch(docName);
        setShowSuggestions(false);
        loadDoctors(docName, specialty);
    };

    const handleSearch = () => {
        setShowSuggestions(false);
        loadDoctors(search, specialty);
    };

    const handleSpecialtyChange = (e) => {
        const val = e.target.value;
        setSpecialty(val);
        loadDoctors(search, val);
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-center">Đội Ngũ Bác Sĩ</h2>
            <Row className="mb-5 justify-content-center">
                <Col md={5} className="position-relative">
                    <Form.Control
                        placeholder="Nhập tên bác sĩ để tìm kiếm..."
                        value={search}
                        onChange={handleSearchChange}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        onFocus={() => { if (search.trim()) setShowSuggestions(true) }}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ListGroup className="position-absolute w-100 shadow" style={{ zIndex: 1000, top: '100%', left: 0 }}>
                            {suggestions.slice(0, 5).map(doc => (
                                <ListGroup.Item 
                                    action 
                                    key={doc._id} 
                                    onClick={() => handleSelectSuggestion(doc.userId?.name)}
                                >
                                    {doc.userId?.name} <small className="text-muted">({doc.specialty})</small>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    )}
                </Col>
                <Col md={4} className="mt-3 mt-md-0">
                    <Form.Select value={specialty} onChange={handleSpecialtyChange}>
                        <option value="">Tất cả chuyên khoa</option>
                        <option value="Nha khoa tổng quát">Nha khoa tổng quát</option>
                        <option value="Nhổ răng khôn">Nhổ răng khôn</option>
                        <option value="Niềng răng Thẩm mỹ">Niềng răng Thẩm mỹ</option>
                        <option value="Cấy ghép Implant">Cấy ghép Implant</option>
                        <option value="Tẩy trắng răng">Tẩy trắng răng</option>
                        <option value="Bọc răng sứ">Bọc răng sứ</option>
                        <option value="Chữa tủy răng">Chữa tủy răng</option>
                        <option value="Nha khoa trẻ em">Nha khoa trẻ em</option>
                        <option value="Phục hình tháo lắp">Phục hình tháo lắp</option>
                        <option value="Tiểu phẫu cắt chóp">Tiểu phẫu cắt chóp</option>
                    </Form.Select>
                </Col>
                <Col md={2} className="mt-3 mt-md-0">
                    <Button onClick={handleSearch} className="w-100" variant="primary">Tìm Kiếm</Button>
                </Col>
            </Row>
            
            <Row>
                {doctors.length ? (
                    doctors.map(doctor => (
                        <Col md={4} sm={6} key={doctor._id} className="mb-4">
                            <DoctorCard doctor={doctor} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <div className="text-center py-5">
                            <h4 className="text-muted mb-3">Không tìm thấy bác sĩ nào</h4>
                            <p className="text-secondary">Vui lòng thử lại với từ khóa hoặc chuyên khoa khác.</p>
                        </div>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default DocterSearch;

