import React from 'react';
import { Container, Table, Button } from 'react-bootstrap';

const ManagePatients = () => {
    const mockPatients = [
        { id: 1, name: 'Nguyễn Văn A', email: 'a@example.com', phone: '0123456789', status: 'active' },
        { id: 2, name: 'Trần Thị B', email: 'b@example.com', phone: '0987654321', status: 'inactive' }
    ];

    return (
        <Container className="py-5">
            <h1>Quản lý bệnh nhân</h1>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên</th>
                        <th>Email</th>
                        <th>Điện thoại</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {mockPatients.map(patient => (
                        <tr key={patient.id}>
                            <td>{patient.id}</td>
                            <td>{patient.name}</td>
                            <td>{patient.email}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.status}</td>
                            <td><Button variant="outline-danger" size="sm">Xóa</Button></td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};

export default ManagePatients;

