import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import './Dashboard.css';

function Dashboard() {
    const [stats, setStats] = useState({
        totalProjects: 0,
        activeProjects: 0,
        totalLabours: 0,
        pendingWages: 0,
        recentRatings: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Fetch projects
            const projectsRes = await api.get('/projects');
            const projects = projectsRes.data;

            // Fetch labours
            const laboursRes = await api.get('/labours');
            const labours = laboursRes.data;

            // Fetch wages
            const wagesRes = await api.get('/wages/status/PENDING');
            const pendingWages = wagesRes.data;

            // Fetch recent ratings
            const ratingsRes = await api.get('/ratings');
            const allRatings = ratingsRes.data;
            const recentRatings = allRatings.slice(-5).reverse();

            setStats({
                totalProjects: projects.length,
                activeProjects: projects.filter(p => p.status === 'IN_PROGRESS').length,
                totalLabours: labours.length,
                pendingWages: pendingWages.length,
                recentRatings
            });
        } catch (err) {
            console.error('Error loading dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <h1>Dashboard</h1>
                <p className="dashboard-subtitle">Overview of your labour management system</p>
            </div>

            <div className="dashboard-layout">
                <div className="dashboard-main">
                    {/* Stats Overview */}
                    <div className="stats-grid">
                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'rgba(99, 102, 241, 0.2)' }}>
                                📊
                            </div>
                            <div className="stat-content">
                                <h3>{stats.totalProjects}</h3>
                                <p>Total Projects</p>
                                <span className="stat-detail">{stats.activeProjects} active</span>
                            </div>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'rgba(236, 72, 153, 0.2)' }}>
                                👷
                            </div>
                            <div className="stat-content">
                                <h3>{stats.totalLabours}</h3>
                                <p>Total Labours</p>
                                <Link to="/labours" className="stat-link">View all →</Link>
                            </div>
                        </div>

                        <div className="stat-card card">
                            <div className="stat-icon" style={{ background: 'rgba(251, 191, 36, 0.2)' }}>
                                💰
                            </div>
                            <div className="stat-content">
                                <h3>{stats.pendingWages}</h3>
                                <p>Pending Wages</p>
                                <Link to="/wages" className="stat-link">Manage →</Link>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="dashboard-grid">
                        <div className="dashboard-card card">
                            <div className="card-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <h3>Projects</h3>
                            <p>Create and manage construction projects</p>
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
                            <p>Manage your workforce and skills</p>
                            <Link to="/labours" className="btn btn-secondary">
                                View Labours
                            </Link>
                        </div>

                        <div className="dashboard-card card">
                            <div className="card-icon">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3>Wages</h3>
                            <p>Track and settle labour wages</p>
                            <Link to="/wages" className="btn btn-outline">
                                Manage Wages
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recent Ratings Sidebar */}
                {stats.recentRatings.length > 0 && (
                    <div className="dashboard-sidebar">
                        <div className="sidebar-card card">
                            <div className="sidebar-header">
                                <h3>⭐ Recent Ratings</h3>
                                <span className="sidebar-badge">{stats.recentRatings.length}</span>
                            </div>
                            <div className="ratings-sidebar-list">
                                {stats.recentRatings.map((rating, idx) => (
                                    <div key={idx} className="rating-sidebar-item">
                                        <div className="rating-sidebar-info">
                                            <strong>{rating.labour?.name || 'Unknown'}</strong>
                                            <span className="rating-sidebar-project">{rating.project?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="rating-sidebar-score">
                                            {'⭐'.repeat(rating.score)}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Dashboard;
