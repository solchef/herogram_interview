import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Auth.css';
import { useAuth } from '../../context/AutContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState(''); // State for error messages
    const { login } = useAuth(); // Get the login function from the context
    const navigate = useNavigate(); // Initialize useNavigate

    const handleLogin = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setErrorMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await axios.post(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/users/login`, { email, password });
            login(response.data.token); 
            navigate('/upload'); // Redirect to the upload page on successful login
        } catch (error) {
            console.error('Error logging in:', error);
            // Set error message based on response from the server
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message || 'An error occurred during login.');
            } else {
                setErrorMessage('An unexpected error occurred. Please try again.');
            }
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleLogin} className="auth-form">
                <h2>Login</h2>
                {errorMessage && <p className="error-message">{errorMessage}</p>} {/* Display error message */}
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default Login;
