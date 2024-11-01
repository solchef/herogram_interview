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

        const fileIdsInOrder = updatedFiles.map(file => file._id);

        try {
            await axios.post(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/reorder`, {
                fileIds: fileIdsInOrder,
            });
        } catch (error) {
            console.error('Error reordering files:', error);
            reorderFileList(files);
        }
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
                <div className="file-item" style={{ cursor: 'move', padding: '10px', border: '1px solid #ccc', margin: '5px 0', minHeight: "300px" }}>
                    <div className="file-preview">
                        {renderFilePreview(file)}
                    </div>
                    <p className="file-name">{file.name}</p>
                    <p className="file-tags">Tags: {file.tags ? file.tags.join(', ') : 'None'}</p>
                    <p className="file-stats">
                        Views: {file.views} | Shares: {file.shares}
                    </p>
                    <div className='share-button'>
                        <button
                            onClick={async (e) => {
                                e.stopPropagation(); // Prevent drag event when clicking the button
                                try {
                                    const generatedLink = await handleShare(file._id);
                                    setLink(generatedLink);
                                    setPopupOpen(true);
                                } catch (error) {
                                    // Handle error (e.g., alert error.message)
                                }
                            }}
                        >
                            Share
                        </button>
                    </div>
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
