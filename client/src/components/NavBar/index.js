import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css'; 
import { useAuth } from '../../context/AutContext';

const Navbar = () => {
    const { isAuthenticated, logout } = useAuth();

    return (
        <nav>
            <div className="navbar-content">
                <h1>File Manager</h1>
                <ul>
                    {isAuthenticated ? (
                        <>
                            {/* <li><Link to="/profile">Profile</Link></li> */}
                            <li><Link to="/">Home</Link></li>
                            <li><Link to="/upload">Upload</Link></li>
                            <li><button onClick={logout}>Logout</button></li>
                        </>
                    ) : (
                        <>
                            <li><Link to="/login">Login</Link></li>
                            <li><Link to="/register">Register</Link></li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;
