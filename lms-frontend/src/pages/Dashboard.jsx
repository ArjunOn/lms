import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <h1>Welcome to Labour Management System</h1>
                <p className="dashboard-subtitle">Manage your projects, labours, and assignments efficiently</p>
            </div>

            <div className="dashboard-grid">
                <div className="dashboard-card card">
                    <div className="card-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3>Projects</h3>
                    <p>Create and manage construction projects with ease</p>
                    <Link to="/projects" className="btn btn-primary">
                        View Projects
                    </Link>
                </div>

                <div className="dashboard-card card">
                    <div className="card-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3>Labours</h3>
                    <p>Manage your workforce and their skills</p>
                    <Link to="/labours" className="btn btn-secondary">
                        View Labours
                    </Link>
                </div>

                <div className="dashboard-card card">
                    <div className="card-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3>Smart Recommendations</h3>
                    <p>AI-powered labour recommendations based on skills and ratings</p>
                    <Link to="/projects" className="btn btn-outline">
                        Get Started
                    </Link>
                </div>
            </div>

            <div className="features-section">
                <h2>Key Features</h2>
                <div className="features-grid">
                    <div className="feature-item">
                        <div className="feature-icon">✨</div>
                        <h4>Skill-Based Matching</h4>
                        <p>Automatically match labours to projects based on required skills</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">⭐</div>
                        <h4>Rating System</h4>
                        <p>Track labour performance with comprehensive rating system</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">💰</div>
                        <h4>Wage Management</h4>
                        <p>Calculate and manage wages automatically</p>
                    </div>
                    <div className="feature-item">
                        <div className="feature-icon">📊</div>
                        <h4>Project Tracking</h4>
                        <p>Monitor project progress and assignments in real-time</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
