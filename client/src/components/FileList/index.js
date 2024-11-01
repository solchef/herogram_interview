// src/components/FileList.js
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FaEllipsisH } from 'react-icons/fa';
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

    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const reorderedFiles = Array.from(files);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);

        await reorderFileList(reorderedFiles);
    };

    const toggleDropdown = (fileId) => {
        setActiveFileId(activeFileId === fileId ? null : fileId);
    };

    const renderLoading = () => <p className="loading-message">Loading files...</p>;

    const renderError = () => <p className="error-message">{error}</p>;

    const renderFileItem = (file, index) => {
        const isActive = activeFileId === file._id;

        return (
            <Draggable key={file._id} draggableId={file._id} index={index}>
                {(provided) => (
                    <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="file-item"
                    >
                        <div className="file-preview">
                            {renderFilePreview(file)}
                        </div>
                        <p className="file-name">{file.name}</p>
                        <p className="file-tags">Tags: {file.tags ? file.tags.join(', ') : 'None'}</p>

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
                                            alert(error.message);
                                        }
                                    }}
                                >
                                    Share
                                </button>
                                <button onClick={() => handleDelete(file._id)}>Delete</button>
                                <button onClick={() => alert(`Edit file: ${file.name}`)}>Edit</button>
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
                        {files.map(renderFileItem)}
                        {provided.placeholder}
                    </ul>
                )}
            </Droppable>
        </DragDropContext>
    );

    return (
        <div className="file-list-container">
            {isPopupOpen && <ShareableLinkPopup link={link} onClose={closePopup} />}
            {loading ? renderLoading() : error ? renderError() : renderFileList()}
        </div>
    );
};

export default FileList;
