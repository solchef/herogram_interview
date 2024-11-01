export const getFileExtension = (filename) => {
    return filename.split('.').pop().toLowerCase();
};

export const renderFilePreview = (file) => {
    const extension = getFileExtension(file.name);
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
        return <img src={file.thumbnail} alt={file.name} className="file-thumbnail" />;
    } else if (['mp4', 'avi', 'mov'].includes(extension)) {
        return <video controls className="file-video" src={file.path} alt={file.name} />;
    } else {
        return <p className="file-unknown">File type not supported</p>;
    }
};
