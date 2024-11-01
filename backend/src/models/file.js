const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    tags: { type: [String], default: [] },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    shareableLink: { type: String },
    downloads: { type: Number, default: 0 },
    views: { type: Number, default: 0 }, // Add views field
    shares: { type: Number, default: 0 }, // Add shares field
}, { timestamps: true });

const File = mongoose.model('File', fileSchema);

module.exports = File;
