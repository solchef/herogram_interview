const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/user'); 
const fileRoutes = require('./routes/file'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('uploads')); 

connectDB(); 
console.log("start");

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to the File Management API!'); // Welcome message
});

// Use user and file routes
app.use('/api/users', userRoutes); // All user routes will be prefixed with /api/users
app.use('/api/files', fileRoutes); // All file routes will be prefixed with /api/files

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
