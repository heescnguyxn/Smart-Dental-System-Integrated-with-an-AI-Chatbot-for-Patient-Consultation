const jwt = require('jsonwebtoken');
const User = require('../Models/User'); // Will create

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) return res.status(401).json({ msg: 'No token' });

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) return res.status(401).json({ msg: 'Invalid token' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ msg: 'Token invalid' });
    }
};

module.exports = auth;

