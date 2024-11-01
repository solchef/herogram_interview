const express = require('express');
const { upload, uploadFile, downloadFile, shareFile, getAllFiles, createShareableLink, getFileByShareableLink } = require('../controllers/FileManagementController');
const authenticate = require('../middleware/authenticationMiddleware'); 

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile); 
router.get('/download/:id', authenticate, downloadFile); 
router.get('/share/:link', shareFile);
router.get('/', authenticate, getAllFiles); 
router.post('/create-link', authenticate, createShareableLink); 
router.get('/view/:token', getFileByShareableLink);

module.exports = router;
