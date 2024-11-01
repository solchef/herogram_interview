const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // console.log(req.user)
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        return res.status(400).json({ message: 'Invalid token.', error: error.message });
    }
};

module.exports = authenticate;
