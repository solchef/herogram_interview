const express = require('express');
const {
    upload,
    authenticate,
    uploadFile,
    downloadFile,
    shareFile,
    getAllFiles,
    createShareableLink,
    getFileByShareableLink,
} = require('../controllers/FileManagementController');

const router = express.Router();

router.post('/upload', authenticate, upload.single('file'), uploadFile);
router.get('/download/:id', downloadFile);
router.get('/share/:link', shareFile);
router.get('/', getAllFiles);
router.post('/share', createShareableLink);
router.get('/view/:token', getFileByShareableLink);

module.exports = router;
