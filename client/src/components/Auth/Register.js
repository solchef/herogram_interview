// src/components/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Auth.css'; // Make sure to import the CSS file

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_REACT_APP_BACKEND_URL}/api/users/register`, { email, name, password });
            console.log('Registration successful:', response.data);
            // Redirect to login page after successful registration
            navigate('/login'); // Redirect to the login page
        } catch (error) {
            console.error('Error registering:', error);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleRegister} className="auth-form">
                <h2>Register</h2>
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
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
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Register;
