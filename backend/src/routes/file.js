const express = require('express');
const multer = require('multer');
const File = require('../models/File'); // Import the File model
const User = require('../models/User'); // Assuming you have a User model
const { v4: uuidv4 } = require('uuid'); // For generating unique shareable links
const jwt = require('jsonwebtoken');
const router = express.Router();
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif|mp4|mov/; // Allowed file types
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File type not allowed!'));
    },
    limits: { fileSize: 10 * 1024 * 1024 }, // Limit file size to 10MB
});

// Ensure to add authentication middleware to get the user ID
const authenticate = async (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your JWT secret
        req.user = await User.findById(decoded.id); // Assuming the ID is stored in the token
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { tags } = req.body; // Expecting tags to be sent as an array in the request body

    try {
        const newFile = new File({
            name: req.file.originalname,
            path: req.file.path,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [], // Split tags and trim whitespace
            uploadedBy: req.user._id, // User ID from the authenticated user
            shareableLink: uuidv4(), // Generate a unique shareable link
            downloads: 0 // Initialize downloads count
        });

        await newFile.save();

        res.status(200).json({
            message: 'File uploaded successfully',
            file: newFile,
        });
    } catch (error) {
        console.error('Error saving file to the database:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Download route to track downloads
router.get('/download/:id', async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Increment download count
        file.downloads += 1;
        await file.save();

        // Send file to user
        res.download(file.path, file.name);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Shareable link route
router.get('/share/:link', async (req, res) => {
    try {
        const file = await File.findOne({ shareableLink: req.params.link });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Increment download count for shareable link access
        file.downloads += 1;
        await file.save();

        // Send file to user
        res.download(file.path, file.name);
    } catch (error) {
        console.error('Error accessing shared file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/', async (req, res) => {
    try {
        const files = await File.find(); // Fetch files from the database
        const filesWithUrls = files.map(file => ({
            ...file.toObject(),
            // Use encodeURIComponent to encode the filename
            path: `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(file.name)}`, // Adjust as necessary
            thumbnail: `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(file.name)}`, // Adjust as necessary
        }));
        res.json(filesWithUrls);
    } catch (error) {
        res.status(500).send('Error fetching files');
    }
});



module.exports = router;
