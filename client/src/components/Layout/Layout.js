// src/components/Layout.js
import React from 'react';
import Navbar from '../NavBar';
import './Layout.css'; // Import the CSS file for styling

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Navbar />
            <main className="main-content">
                {children}
            </main>
            <footer className="footer">
                <p>&copy; 2024 James Waweru Chege. Herogram Interview.</p>
            </footer>
        </div>
    );
};

export default Layout;
