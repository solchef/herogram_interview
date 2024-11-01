// src/components/NavBar.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; // Import the CSS file
import { useAuth } from '../context/AutContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <h1>File Manager</h1>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/upload">Upload</Link></li>
                {isAuthenticated ? (
                    <>
                        <li><Link to="/profile">Profile</Link></li>
                        <li><button onClick={logout}>Logout</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/register">Register</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;
