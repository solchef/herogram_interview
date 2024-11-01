const express = require('express');
const {
    upload,
    uploadFile,
    downloadFile,
    shareFile,
    getAllFiles,
    createShareableLink,
    getFileByShareableLink,
    reorderFiles,
} = require('../controllers/FileManagementController');
const authenticate = require('../middleware/authenticationMiddleware');

const router = express.Router();

router.post('/reorder', reorderFiles); // Added authentication to reorder route
router.put('/reorder', reorderFiles); // Added authentication to reorder route
router.post('/upload', authenticate, upload.single('file'), uploadFile); 
router.get('/download/:id', authenticate, downloadFile); 
router.get('/share/:link', shareFile);
router.get('/', authenticate, getAllFiles); 
router.post('/create-link', authenticate, createShareableLink); 
router.get('/view/:token', getFileByShareableLink);

module.exports = router;
