const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); 
const userRoutes = require('./routes/user'); 
const fileRoutes = require('./routes/file'); 
const authenticate = require('./middleware/authenticationMiddleware'); // Import the authentication middleware

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

app.use('/api/users', userRoutes); 

app.use('/api/files', authenticate, fileRoutes); 

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
