import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEllipsisH } from 'react-icons/fa';
import './FileList.css';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('Failed to load files. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchFiles();
    }, []);

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedFiles = Array.from(files);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);

        setFiles(reorderedFiles);

        try {
            await axios.put(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/reorder`, reorderedFiles, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Error saving new file order:', error);
            setError('Failed to save new file order. Please try again.');
        }
    };

    const handleShare = (file) => {
        alert(`Sharing file: ${file.name}`);
    };

    const handleDelete = async (fileId) => {
        const confirmed = window.confirm('Are you sure you want to delete this file?');
        if (confirmed) {
            try {
                await axios.delete(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/${fileId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFiles(files.filter(file => file._id !== fileId));
            } catch (error) {
                console.error('Error deleting file:', error);
                setError('Failed to delete file. Please try again.');
            }
        }
    };

    const renderLoading = () => <p className="loading-message">Loading files...</p>;

    const renderError = () => <p className="error-message">{error}</p>;

    const getFileExtension = (filename) => {
        return filename.split('.').pop().toLowerCase();
    };
    
    const renderFileItem = (file, index) => {
        const extension = getFileExtension(file.name);
    
        return (
            <Draggable key={file._id} draggableId={file._id} index={index}>
                {(provided) => (
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="file-item"
                    >
                        {['jpg', 'jpeg', 'png', 'gif'].includes(extension) ? (
                            <img src={file.thumbnail} alt={file.name} className="file-thumbnail" />
                        ) : ['mp4', 'avi', 'mov'].includes(extension) ? (
                            <video controls className="file-video" src={file.path} alt={file.name} />
                        ) : (
                            <p className="file-unknown">File type not supported</p>
                        )}
    
                        <p className="file-name">{file.name}</p>
                        <p className="file-tags">Tags: {file.tags ? file.tags.join(', ') : 'None'}</p>
    
                        {file.uploadedBy === localStorage.getItem('userId') && (
                            <div className="file-actions">
                                <FaEllipsisH onClick={() => handleShare(file)} className="action-icon" title="Share" />
                                <button className="delete-button" onClick={() => handleDelete(file._id)}>
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                )}
            </Draggable>
        );
    };
    

    const renderFileList = () => (
        <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="files">
                {(provided) => (
                    <ul ref={provided.innerRef} {...provided.droppableProps} className="file-list">
                        {files.map((file, index) => renderFileItem(file, index))}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );

    if (loading) return renderLoading();
    if (error) return renderError();

    return (
        <div>
            <h2>Your Files</h2>
            {renderFileList()}
        </div>
    );
};

export default FileList;
