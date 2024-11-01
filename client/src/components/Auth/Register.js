// src/components/Auth/Register.js
import React, { useState } from 'react';
import axios from 'axios';
import './Auth.css'; // Make sure to import the CSS file

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { login } = useAuth(); // Assuming you have a login function

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/register`, { email, password });
            console.log(response.data);
            // Optionally log in the user after registration
            // login(response.data.token); // Uncomment if you want to log in the user immediately after registering
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
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
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
