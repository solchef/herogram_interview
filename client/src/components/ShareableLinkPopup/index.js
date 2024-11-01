import React from 'react';
import './ShareableLinkPopup.css'; // Make sure to create this CSS file

const ShareableLinkPopup = ({ link, onClose }) => {
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Shareable Link</h2>
                <p>{link}</p>
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default ShareableLinkPopup;
