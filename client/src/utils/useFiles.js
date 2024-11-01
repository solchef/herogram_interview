import { useState, useEffect } from 'react';
import { fetchFiles, generateShareableLink, reorderFiles, deleteFile } from './api';

export const useFiles = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const filesData = await fetchFiles();
                setFiles(filesData);
            } catch (error) {
                console.error('Error fetching files:', error);
                setError('Failed to load files. Please check your connection and try again.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleShare = async (fileId) => {
        try {
            const link = await generateShareableLink(fileId);
            return link;
        } catch (error) {
            console.error('Error generating shareable link:', error);
            throw new Error('Failed to generate shareable link. Please try again.');
        }
    };

    const reorderFileList = async (reorderedFiles) => {
        try {
            await reorderFiles(reorderedFiles);
            setFiles(reorderedFiles);
        } catch (error) {
            console.error('Error saving new file order:', error);
            setError('Failed to save new file order. Please try again.');
        }
    };

    const handleDelete = async (fileId) => {
        try {
            await deleteFile(fileId);
            setFiles((prevFiles) => prevFiles.filter(file => file._id !== fileId));
        } catch (error) {
            console.error('Error deleting file:', error);
            setError('Failed to delete file. Please try again.');
        }
    };

    return { files, loading, error, handleShare, reorderFileList, handleDelete };
};


