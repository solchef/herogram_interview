const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
const authenticate = require('./middleware/authenticationMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
    'http://localhost:3000',
    'http://209.38.203.71',
];

const corsOptions = {
    origin: '*', // Allow all origins (for testing only)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
};

// Use the CORS middleware before other routes
app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the File Management API By Jame Chege!');
});

app.use('/api/users', userRoutes);
app.use('/api/files', fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
