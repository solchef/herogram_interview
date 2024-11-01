import React, { useState } from 'react';
import Draggable from 'react-draggable';
import { FaEllipsisH } from 'react-icons/fa';
import axios from 'axios';
import './FileList.css';
import { useFiles } from '../../utils/useFiles';
import { renderFilePreview } from '../../utils/fileUtils';
import ShareableLinkPopup from '../ShareableLinkPopup';

const FileList = () => {
    const { files, loading, error, handleShare, reorderFileList, handleDelete } = useFiles();
    const [activeFileId, setActiveFileId] = useState(null);
    const [isPopupOpen, setPopupOpen] = useState(false);
    const [link, setLink] = useState('');

    const closePopup = () => setPopupOpen(false);

    const handleDragStop = async (data, index) => {
        const updatedFiles = [...files];
        const draggedFile = updatedFiles.splice(index, 1)[0];

        const dragY = data.y + (data.node.offsetHeight / 2);
        const newIndex = Math.min(
            updatedFiles.length,
            Math.max(0, Math.floor(dragY / data.node.offsetHeight))
        );

        updatedFiles.splice(newIndex, 0, draggedFile);
        reorderFileList(updatedFiles);

        // if (window.confirm("Do you want to save the new order of files?")) {
            const fileIdsInOrder = updatedFiles.map(file => file._id);

            try {
                await axios.post(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/reorder`, {
                    fileIds: fileIdsInOrder,
                });
            } catch (error) {
                console.error('Error reordering files:', error);
                reorderFileList(files);
            }
        // } else {
        //     reorderFileList(files);
        // }
    };

    const toggleDropdown = (fileId) => {
        setActiveFileId(activeFileId === fileId ? null : fileId);
    };

    const renderLoading = () => <p className="loading-message">Loading files...</p>;

    const renderError = () => <p className="error-message">{error}</p>;

    const renderFileItem = (file, index) => {
        const isActive = activeFileId === file._id;

        return (
            <Draggable key={file._id} axis="both" onStop={(e, data) => handleDragStop(data, index)}>
                <div className="file-item" style={{ cursor: 'move', padding: '10px', border: '1px solid #ccc', margin: '5px 0' }}>
                    <div className="file-preview">
                        {renderFilePreview(file)}
                    </div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-tags">Tags: {file.tags ? file.tags.join(', ') : 'None'}</p>
                    <p className="file-stats">
                        Views: {file.views} | Shares: {file.shares}
                    </p>

                    <FaEllipsisH
                        onClick={() => toggleDropdown(file._id)}
                        className="action-icon"
                        title="More options"
                    />

                    {isActive && (
                        <div className="dropdown-menu">
                            <button
                                onClick={async () => {
                                    try {
                                        const generatedLink = await handleShare(file._id);
                                        setLink(generatedLink);
                                        setPopupOpen(true);
                                    } catch (error) {
                                        // alert(error.message);
                                    }
                                }}
                            >
                                Share
                            </button>
                            <button onClick={() => handleDelete(file._id)}>Delete</button>
                            <button onClick={() => alert(`Edit file: ${file.name}`)}>Edit</button>
                        </div>
                    )}
                </div>
            </Draggable>
        );
    };

    const renderFileList = () => (
        <div className="file-list">
            {files.map(renderFileItem)}
        </div>
    );

    return (
        <div className="file-list-container">
            {isPopupOpen && <ShareableLinkPopup link={link} onClose={closePopup} />}
            {loading ? renderLoading() : error ? renderError() : renderFileList()}
        </div>
    );
};

export default FileList;
