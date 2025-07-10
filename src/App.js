import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ArticleDetail from './components/articles/ArticleDetail';
import CreateArticle from './components/articles/CreateArticle';
import EditArticle from './components/articles/EditArticle';
import MyArticles from './pages/MyArticles';
import ProtectedRoute from './components/common/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/articles/:slug" element={<ArticleDetail />} />
            <Route 
              path="/my-articles" 
              element={
                <ProtectedRoute>
                  <MyArticles />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-article" 
              element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/edit-article/:id" 
              element={
                <ProtectedRoute>
                  <EditArticle />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;