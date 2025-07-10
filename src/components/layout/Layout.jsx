import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <nav className="nav">
          <div className="nav-brand">
            <Link to="/" className="nav-link brand">
              📖 Inkwell
            </Link>
          </div>
          
          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/my-articles" className="nav-link">
                  My Articles
                </Link>
                <Link to="/create-article" className="nav-link">
                  Write Article
                </Link>
                <div className="user-menu">
                  <span className="user-greeting">
                    Hello, {user?.username}
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="nav-link">
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Inkwell. Built with React & Django REST Framework.</p>
      </footer>
    </div>
  );
};

export default Layout;