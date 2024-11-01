const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
    const { email, name, username, password } = req.body;

    try {
        // Check for existing email or username
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        // if (existingUser) {
        //     return res.status(400).json({ message: 'Email or username already registered!' });
        // }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, name, username:username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        // console.log(user)
        if (!user) return res.status(400).json({ message: 'User not found!' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials!' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) return res.sendStatus(403);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected route example
const protectedRoute = (req, res) => {
    res.json({ message: 'This is a protected route!', user: req.user });
};

module.exports = {
    register,
    login,
    authenticateJWT,
    protectedRoute,
};
