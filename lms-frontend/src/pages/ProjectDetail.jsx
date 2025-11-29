import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, assignmentService } from '../services';
import Modal from '../components/Modal';
import './ProjectDetail.css';

function ProjectDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newSkill, setNewSkill] = useState('');
    const [error, setError] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '', details: null });

    useEffect(() => {
        loadProject();
        loadRecommendations();
    }, [id]);

    const loadProject = async () => {
        try {
            const response = await projectService.getById(id);
            setProject(response.data);
        } catch (err) {
            console.error('Error loading project:', err);
            alert('Failed to load project');
            navigate('/projects');
        } finally {
            setLoading(false);
        }
    };

    const loadRecommendations = async () => {
        try {
            const response = await projectService.getRecommendations(id);
            setRecommendations(response.data);
        } catch (err) {
            console.error('Error loading recommendations:', err);
        }
    };

    const handleAddSkill = async (e) => {
        e.preventDefault();
        if (!newSkill.trim()) return;
        setError(null);

        try {
            await projectService.addSkill(id, newSkill);
            setNewSkill('');
            loadProject();
            loadRecommendations();
        } catch (err) {
            setError('Failed to add skill. Please try again.');
            console.error('Error adding skill:', err);
        }
    };

    const handleAssignLabour = async (labourId) => {
        try {
            await assignmentService.create({
                projectId: parseInt(id),
                labourId: labourId,
            });
            loadProject();
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Success!',
                message: 'Labour has been successfully assigned to this project.',
                details: null
            });
        } catch (err) {
            console.error('Error assigning labour:', err);

            // Handle different error types
            if (err.response && err.response.status === 409) {
                const errorData = err.response.data;

                // Check if it's an occupied error with project details
                if (errorData.occupiedProjectName) {
                    setModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Labour Occupied',
                        message: errorData.message || 'This labour is currently assigned to another project.',
                        details: {
                            occupiedProjectName: errorData.occupiedProjectName,
                            assignmentStartDate: errorData.assignmentStartDate
                        }
                    });
                } else {
                    // Duplicate assignment error
                    setModal({
                        isOpen: true,
                        type: 'warning',
                        title: 'Already Assigned',
                        message: errorData.message || 'This labour is already assigned to this project.',
                        details: null
                    });
                }
            } else {
                // Generic error
                setModal({
                    isOpen: true,
                    type: 'error',
                    title: 'Assignment Failed',
                    message: 'Failed to assign labour. Please try again.',
                    details: null
                });
            }
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading project...</p>
            </div>
        );
    }

    if (!project) return null;

    return (
        <div className="project-detail fade-in">
            <div className="detail-header">
                <div>
                    <h1>{project.name}</h1>
                    <p className="detail-subtitle">{project.description || 'No description'}</p>
                </div>
                <button onClick={() => navigate('/projects')} className="btn btn-outline">
                    ← Back to Projects
                </button>
            </div>

            <div className="detail-grid">
                {error && (
                    <div className="alert alert-error" style={{ gridColumn: '1 / -1', marginBottom: '1rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--error)', borderRadius: 'var(--radius-md)', color: 'var(--error)' }}>
                        {error}
                        <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}>×</button>
                    </div>
                )}
                <div className="detail-card card">
                    <h3>Project Information</h3>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Start Date</span>
                            <span className="info-value">{project.startDate || 'Not set'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">End Date</span>
                            <span className="info-value">{project.endDate || 'Not set'}</span>
                        </div>
                    </div>
                </div>

                <div className="detail-card card">
                    <h3>Required Skills</h3>
                    <div className="skills-section">
                        {project.requiredSkills && project.requiredSkills.length > 0 ? (
                            <div className="skills-list">
                                {project.requiredSkills.map((skill, index) => (
                                    <span key={index} className="badge badge-primary">
                                        {skill.name}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p className="text-muted">No skills required yet</p>
                        )}
                        <form onSubmit={handleAddSkill} className="skill-form">
                            <input
                                type="text"
                                value={newSkill}
                                onChange={(e) => setNewSkill(e.target.value)}
                                placeholder="Add a skill (e.g., Plumbing)"
                                className="form-input"
                            />
                            <button type="submit" className="btn btn-primary">
                                Add Skill
                            </button>
                        </form>
                    </div>
                </div>
            </div>

            {recommendations.length > 0 && (
                <div className="recommendations-section card">
                    <h3>🎯 Recommended Labours</h3>
                    <p className="section-subtitle">
                        Based on required skills and ratings
                    </p>
                    <div className="recommendations-grid">
                        {recommendations.map((labour) => (
                            <div key={labour.id} className="labour-card">
                                <div className="labour-header">
                                    <h4>{labour.name}</h4>
                                    <span className="labour-rate">${labour.hourlyRate}/hr</span>
                                </div>
                                <div className="labour-skills">
                                    {labour.skills && labour.skills.map((skill, index) => (
                                        <span key={index} className="badge badge-success">
                                            {skill.name}
                                        </span>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAssignLabour(labour.id)}
                                    className="btn btn-primary btn-sm"
                                >
                                    Assign to Project
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="assignments-section card">
                <h3>Current Assignments</h3>
                {project.assignments && project.assignments.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Labour</th>
                                    <th>Start Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {project.assignments.map((assignment) => (
                                    <tr key={assignment.id}>
                                        <td><strong>{assignment.labour.name}</strong></td>
                                        <td>{assignment.startDate}</td>
                                        <td>
                                            <span className="badge badge-success">{assignment.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-muted">No labours assigned yet</p>
                )}
            </div>

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                details={modal.details}
            />
        </div>
    );
}

export default ProjectDetail;
