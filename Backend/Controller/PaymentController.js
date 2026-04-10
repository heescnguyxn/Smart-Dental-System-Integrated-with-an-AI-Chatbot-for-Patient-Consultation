// Mock payment controller (real Stripe later)

exports.createPayment = async (req, res) => {
    try {
        const { appointmentId, amount } = req.body;
        // Mock payment process
        const payment = {
            id: 'pay_' + Date.now(),
            appointmentId,
            amount,
            status: 'paid',
            date: new Date()
        };
        res.status(201).json(payment);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
};

exports.getPayments = async (req, res) => {
    res.json([{ id: 'mock1', amount: 500000, status: 'paid' }]);
};

