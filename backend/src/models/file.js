const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    name: { type: String, required: true },
    path: { type: String, required: true },
    tags: { type: [String], default: [] },
    downloads: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    shareableLink: { type: String, unique: true } // Unique link for sharing
});

module.exports = mongoose.model('File', fileSchema);
