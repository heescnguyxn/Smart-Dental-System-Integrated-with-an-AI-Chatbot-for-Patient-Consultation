import React, { useState, useRef, useEffect } from 'react';
import { Button, Form, Card, Badge } from 'react-bootstrap';
import { chatService } from '../services/chatService';
import { FaRobot, FaPaperPlane, FaTimes } from 'react-icons/fa';

const ChatBotAI = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([{ role: 'ai', text: 'Chào! Tôi có thể tư vấn nha khoa cho bạn?' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const sendMessage = async () => {
        if (!input.trim()) return;
        const userMsg = { role: 'user', text: input };
        setMessages(prev => [...prev, userMsg]);
        setLoading(true);
        setInput('');

        try {
            const res = await chatService.sendMessage(input);
            setMessages(prev => [...prev, { role: 'ai', text: res.data.response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ai', text: 'Lỗi kết nối, thử lại nhé!' }]);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button
                className="chat-toggle fixed-bottom m-4 p-4 shadow-lg rounded-circle"
                style={{ width: '70px', height: '70px', background: '#0f4c5c', border: 'none', zIndex: 1050 }}
                onClick={() => setIsOpen(true)}
            >
                <FaRobot size={24} className="text-white" />
            </Button>
        );
    }

    return (
        <div className="chat-container position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1050, maxWidth: '400px', width: '90vw' }}>
            <Card className="h-100 shadow-lg border-0 rounded-4 overflow-hidden" style={{ maxHeight: '70vh' }}>
                <Card.Header className="bg-primary text-white p-3 position-relative">
                    <div className="d-flex align-items-center">
                        <FaRobot className="me-2" />
                        <strong>Chat Nha khoa</strong>
                        <Badge bg="success" className="ms-auto">Online</Badge>
                    </div>
                    <Button
                        variant=""
                        size="sm"
                        className="position-absolute top-0 end-0 m-2 p-1 rounded-circle text-white border-0 bg-transparent hover-shadow"
                        onClick={() => setIsOpen(false)}
                    >
                        <FaTimes />
                    </Button>
                </Card.Header>

                <div className="flex-grow-1 d-flex flex-column p-0">
                    <div className="flex-grow-1 p-3 overflow-auto bg-light" style={{ maxHeight: '400px' }}>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-end' : ''}`}>
                                <div className={`d-inline-block p-3 rounded-3 shadow-sm ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-white border'}`} style={{ maxWidth: '85%' }}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="text-center p-3">
                                <div className="spinner-border spinner-border-sm text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="p-3 border-top bg-white">
                        <div className="input-group">
                            <Form.Control
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                placeholder="Hỏi về nha khoa, nhổ răng, niềng răng..."
                                className="rounded-end-0 border-end-0"
                            />
                            <Button
                                onClick={sendMessage}
                                disabled={loading || !input.trim()}
                                className="rounded-start-0 border-start-0"
                                variant="primary"
                            >
                                <FaPaperPlane />
                            </Button>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ChatBotAI;

