import React, { useState, useContext } from 'react';
import { Form, Button, Card, Container, Alert } from 'react-bootstrap';
import { authService } from '../../services/authService';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await authService.login(formData);
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err) {
            setError('Email hoặc mật khẩu sai!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <Card style={{ maxWidth: '400px' }} className="mx-auto shadow">
                <Card.Body>
                    <h3 className="text-center mb-4">Đăng nhập</h3>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Mật khẩu</Form.Label>
                            <Form.Control type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </Form.Group>
                        <Button type="submit" className="w-100 mb-3" disabled={loading}>
                            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                        </Button>
                        <p className="text-center">
                            Chưa có tài khoản? <Link to="/register">Đăng ký</Link>
                        </p>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;

