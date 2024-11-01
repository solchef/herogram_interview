import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading
    const [error, setError] = useState(null); // State for error messages

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get( `${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setFiles(response.data);
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('Failed to load files. Please try again.');
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };
        fetchFiles();
    }, []);

    const handleDragEnd = async (result) => {
        if (!result.destination) return; // Dropped outside the list

        const reorderedFiles = Array.from(files);
        const [movedFile] = reorderedFiles.splice(result.source.index, 1);
        reorderedFiles.splice(result.destination.index, 0, movedFile);

        setFiles(reorderedFiles); // Update the files state with new order

        // Optional: Save the new order to the backend
        try {
            await axios.put('http://localhost:5000/api/files/reorder', reorderedFiles, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
        } catch (error) {
            console.error('Error saving new file order:', error);
            setError('Failed to save new file order.'); // Handle error
        }
    };

    if (loading) return <p>Loading files...</p>; // Loading state

    if (error) return <p>{error}</p>; // Display error message

    return (
        <div>
            <h2>Your Files</h2>
            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="files">
                    {(provided) => (
                        <ul ref={provided.innerRef} {...provided.droppableProps}>
                            {files.map((file, index) => (
                                <Draggable key={file._id} draggableId={file._id} index={index}>
                                    {(provided) => (
                                        <li
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                border: '1px solid #ccc',
                                                padding: '10px',
                                                margin: '5px 0',
                                                backgroundColor: '#fff',
                                                ...provided.draggableProps.style, // Important for the draggable functionality
                                            }}
                                        >
                                            {file.thumbnail && (
                                                <img
                                                    src={file.thumbnail}
                                                    alt={file.name}
                                                    style={{ width: '50px', height: '50px', marginRight: '10px' }}
                                                />
                                            )}
                                            <p>{file.name}</p>
                                            <p style={{ marginLeft: '10px' }}>Tags: {file.tags.join(', ')}</p>
                                        </li>
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder} {/* This is important for maintaining the layout */}
                        </ul>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};

export default FileList;
