import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FileList = () => {
    const [files, setFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/files', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
            }
        };
        fetchFiles();
    }, []);

    return (
        <div>
            <h2>Your Files</h2>
            <ul>
                {files.map(file => (
                    <li key={file._id}>{file.name}</li>
                ))}
            </ul>
        </div>
    );
};

export default FileList;
