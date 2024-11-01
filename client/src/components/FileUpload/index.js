import axios from 'axios';
import React, { useState } from 'react';
import './FileUpload.css'; // Import the CSS file

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [tags, setTags] = useState(''); // State for tags
    const [dragging, setDragging] = useState(false); // State to manage drag-and-drop effect

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
        setDragging(false); // Reset dragging state
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        setDragging(true); // Set dragging state
    };

    const handleDragLeave = () => {
        setDragging(false); // Reset dragging state when leaving
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tags', tags); // Append tags to form data

        // Retrieve token from local storage
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/upload`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}` // Include token in headers
                    },
                }
            );
            setMessage(response.data.message);
            setFile(null); // Reset file input after upload
            setTags(''); // Reset tags input after upload
        } catch (error) {
            console.error('Error uploading file:', error);
            setMessage('Error uploading file.');
        }
    };

    const handleAreaClick = () => {
        document.getElementById('file-input').click(); // Trigger file input click
    };

    return (
        <div className="upload-container">
            <h1>Upload File</h1>
            <div
                className={`upload-area ${dragging ? 'drag-over' : ''}`} // Add drag-over class when dragging
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleAreaClick} // Trigger file input on area click
            >
                {file ? (
                    <p>{file.name}</p>
                ) : (
                    <p>Drag & drop your file here or click to select</p>
                )}
                <input
                    id="file-input" // Add an id for programmatic click
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }} // Hide the default file input
                />
            </div>
            <input
                type="text"
                placeholder="Enter tags (comma separated)"
                value={tags}
                onChange={(e) => setTags(e.target.value)} // Handle tag input change
            />
            <button className="upload-button" onClick={handleUpload}>Upload</button>
            {message && <p className="upload-message">{message}</p>}
        </div>
    );
};

export default FileUpload;
