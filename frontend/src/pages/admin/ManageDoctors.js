import React from 'react';
import { Container, Table, Button, Badge } from 'react-bootstrap';

const ManageDoctors = () => {
    const mockDoctors = [
        { id: 1, name: 'BS. Lê Văn C', specialty: 'Tim mạch', hospital: 'Bạch Mai', status: 'active' },
        { id: 2, name: 'BS. Phạm Thị D', specialty: 'Nhi khoa', hospital: 'Nhi TW', status: 'pending' }
    ];

    return (
        <Container className="py-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Quản lý bác sĩ</h1>
                <Button variant="primary">Thêm bác sĩ</Button>
            </div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Chuyên khoa</th>
                        <th>Bệnh viện</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {mockDoctors.map(doctor => (
                        <tr key={doctor.id}>
                            <td>{doctor.id}</td>
                            <td>{doctor.name}</td>
                            <td>{doctor.specialty}</td>
                            <td>{doctor.hospital}</td>
                            <td><Badge bg={doctor.status === 'active' ? 'success' : 'warning'}>{doctor.status}</Badge></td>
                            <td>
                                <Button variant="outline-primary" size="sm" className="me-1">Sửa</Button>
                                <Button variant="outline-danger" size="sm">Xóa</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManageDoctors;

