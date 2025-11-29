import { Link, useLocation } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="layout">
            <header className="header">
                <div className="header-content">
                    <div className="logo">
                        <h1>Labour Management System</h1>
                    </div>
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
                    </nav>
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
