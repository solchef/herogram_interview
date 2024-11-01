// import React from 'react';
// import { useDropzone } from 'react-dropzone';
// import axios from 'axios';

// const FileUpload = () => {
//     const onDrop = async (acceptedFiles) => {
//         const formData = new FormData();
//         acceptedFiles.forEach((file) => {
//             formData.append('files', file);
//         });

//         try {
//             const response = await axios.post('http://localhost:5000/api/files/upload', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data',
//                     Authorization: `Bearer ${localStorage.getItem('token')}`, // Send the token
//                 },
//             });
//             console.log(response.data);
//         } catch (error) {
//             console.error('Error uploading files:', error);
//         }
//     };

//     const { getRootProps, getInputProps } = useDropzone({ onDrop });

//     return (
//         <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center' }}>
//             <input {...getInputProps()} />
//             <p>Drag 'n' drop some files here, or click to select files</p>
//         </div>
//     );
// };

// export default FileUpload;



import React, { useState } from 'react';

const FileUpload = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const droppedFile = event.dataTransfer.files[0];
        setFile(droppedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/api/files/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            setMessage('Error uploading file.');
        }
    };

    return (
        <div>
            <h1>Upload File</h1>
            <div
                onDrop={handleDrop}
                onDragOver={(event) => event.preventDefault()}
                style={{
                    border: '2px dashed #ccc',
                    padding: '20px',
                    width: '300px',
                    textAlign: 'center',
                    margin: '20px auto',
                }}
            >
                {file ? (
                    <p>{file.name}</p>
                ) : (
                    <p>Drag & drop your file here or click to select</p>
                )}
                <input type="file" onChange={handleFileChange} />
            </div>
            <button onClick={handleUpload}>Upload</button>
            {message && <p>{message}</p>}
        </div>
    );
};

export default FileUpload;
