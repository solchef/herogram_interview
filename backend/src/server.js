const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/user');
const fileRoutes = require('./routes/file');
const authenticate = require('./middleware/authenticationMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
    'http://localhost:3000',
    'https://your-frontend-domain.com',
    'https://another-allowed-origin.com',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

connectDB();

app.get('/', (req, res) => {
    res.send('Welcome to the File Management API By Jame Chege!');
});

app.use('/api/users', userRoutes);
app.use('/api/files', authenticate, fileRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});








