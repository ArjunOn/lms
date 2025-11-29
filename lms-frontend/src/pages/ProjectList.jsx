import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { projectService } from '../services';
import './ProjectList.css';

function ProjectList() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            setLoading(true);
            const response = await projectService.getAll();
            setProjects(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to load projects. Please ensure the backend is running.');
            console.error('Error loading projects:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectService.delete(id);
            loadProjects();
        } catch (err) {
            alert('Failed to delete project');
            console.error('Error deleting project:', err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading projects...</p>
            </div>
        );
    }

    return (
        <div className="project-list fade-in">
            <div className="page-header">
                <div>
                    <h1>Projects</h1>
                    <p className="page-subtitle">Manage your construction projects</p>
                </div>
                <Link to="/projects/new" className="btn btn-primary">
                    + Create Project
                </Link>
            </div>

            {error && (
                <div className="error-message">
                    <p>{error}</p>
                </div>
            )}

            {projects.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-icon">📋</div>
                    <h3>No projects yet</h3>
                    <p>Create your first project to get started</p>
                    <Link to="/projects/new" className="btn btn-primary">
                        Create Project
                    </Link>
                </div>
            ) : (
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Required Skills</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map((project) => (
                                <tr key={project.id}>
                                    <td>
                                        <strong>{project.name}</strong>
                                    </td>
                                    <td>{project.description || '-'}</td>
                                    <td>{project.startDate || '-'}</td>
                                    <td>{project.endDate || '-'}</td>
                                    <td>
                                        {project.requiredSkills && project.requiredSkills.length > 0 ? (
                                            <div className="skills-list">
                                                {project.requiredSkills.map((skill) => (
                                                    <span key={skill.id} className="badge badge-primary">
                                                        {skill.name}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-muted">No skills</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <Link
                                                to={`/projects/${project.id}`}
                                                className="btn-icon"
                                                aria-label="View project"
                                            >
                                                👁️
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
                                                className="btn-icon btn-danger"
                                                aria-label="Delete project"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default ProjectList;
