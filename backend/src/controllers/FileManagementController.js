const multer = require('multer');
const File = require('../models/File');
const User = require('../models/User');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const crypto = require('crypto');

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
        const filetypes = /jpeg|jpg|png|gif|mp4|mov/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File type not allowed!'));
    },
    limits: { fileSize: 10 * 1024 * 1024 },
});



const uploadFile = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    const { tags } = req.body;
    

    try {
        const newFile = new File({
            name: req.file.originalname,
            path: req.file.path,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            uploadedBy: req.user.id,
            shareableLink: uuidv4(),
            downloads: 0,
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
};

const downloadFile = async (req, res) => {
    try {
        const file = await File.findById(req.params.id);
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        file.downloads += 1;
        file.views += 1; 
        await file.save();

        res.download(file.path, file.name);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const shareFile = async (req, res) => {
    try {
        const file = await File.findOne({ shareableLink: req.params.link });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        file.shares += 1; 
        file.downloads += 1; 
        await file.save();

        res.download(file.path, file.name);
    } catch (error) {
        console.error('Error accessing shared file:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


const getAllFiles = async (req, res) => {
    try {
        const files = await File.find();
        const filesWithUrls = files.map(file => ({
            ...file.toObject(),
            path: `${req.protocol}://${req.get('host')}/${file.path}`,
            thumbnail: `${req.protocol}://${req.get('host')}/${file.path}`,
        }));
        res.json(filesWithUrls);
    } catch (error) {
        res.status(500).send('Error fetching files');
    }
};

const generateShareableLink = async (fileId) => {
    const token = crypto.randomBytes(16).toString('hex');
    const link = `${process.env.APP_URL}/api/files/view/${token}`;

    await File.findByIdAndUpdate(fileId, { shareableLink: token }, { new: true });

    return link;
};

const createShareableLink = async (req, res) => {
    const { fileId } = req.body;
    try {
        const link = await generateShareableLink(fileId);
        res.json({ link });
    } catch (error) {
        console.error('Error generating shareable link:', error);
        res.status(500).json({ message: 'Failed to generate shareable link.' });
    }
};

const getFileByShareableLink = async (req, res) => {
    try {
        const file = await File.findOne({ shareableLink: req.params.token });
        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }
        res.json(file);
    } catch (error) {
        console.error('Error fetching file by link:', error);
        res.status(500).json({ message: 'Failed to fetch file.' });
    }
};






module.exports = {
    upload,
    uploadFile,
    downloadFile,
    shareFile,
    getAllFiles,
    createShareableLink,
    getFileByShareableLink,
};
