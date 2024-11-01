import axios from 'axios';

const getAuthHeaders = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
});

export const fetchFiles = async () => {
    const response = await axios.get(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files`, getAuthHeaders());
    return response.data;
};

export const generateShareableLink = async (fileId) => {
    const response = await axios.post(
        `${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/share`,
        { fileId },
        getAuthHeaders()
    );
    return response.data.link;
};

export const reorderFiles = async (files) => {
    await axios.put(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/reorder`, files, getAuthHeaders());
};

export const deleteFile = async (fileId) => {
    await axios.delete(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/files/${fileId}`, getAuthHeaders());
};
