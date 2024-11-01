import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import FileUpload from './components/FileUpload';
import { AuthProvider } from './context/AutContext';
import FileList from './components/FileList';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Layout>
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <FileList />
                            </ProtectedRoute>
                        } />
                        <Route path="/upload" element={
                            <ProtectedRoute>
                                <FileUpload />
                            </ProtectedRoute>
                        } />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </Layout>
            </Router>
        </AuthProvider>
    );
};

export default App;
