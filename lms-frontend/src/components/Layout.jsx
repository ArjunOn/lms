import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

function Layout({ children }) {
    const location = useLocation();
    const { user, logout } = useAuth();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <h1>Labour Management System</h1>
                    </div>
                    {user && (
                        <nav className="nav" aria-label="Main navigation">
                            <Link
                                to="/"
                                className={`nav-link ${isActive('/') ? 'active' : ''}`}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/projects"
                                className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
                            >
                                Projects
                            </Link>
                            <Link
                                to="/labours"
                                className={`nav-link ${isActive('/labours') ? 'active' : ''}`}
                            >
                                Labours
                            </Link>
                            <Link
                                to="/wages"
                                className={`nav-link ${isActive('/wages') ? 'active' : ''}`}
                            >
                                Wages
                            </Link>
                            <div className="user-menu">
                                <span className="user-name">Welcome, {user.username}</span>
                                <button onClick={logout} className="btn btn-sm btn-outline">
                                    Logout
                                </button>
                            </div>
                        </nav>
                    )}
                </div>
            </header>

            <main className="main-content">
                {children}
            </main>

            <footer className="footer">
                <p>&copy; 2025 Labour Management System. Built with React & Spring Boot.</p>
            </footer>
        </div>
    );
}

export default Layout;
