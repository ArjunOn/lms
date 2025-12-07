import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { projectService, assignmentService } from '../services';
import api from '../services/api';
import Modal from '../components/Modal';
import PaymentModal from '../components/PaymentModal';
import RatingForm from '../components/RatingForm';
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
    const [showRatingForm, setShowRatingForm] = useState(false);
    const [ratingTarget, setRatingTarget] = useState(null);
    const [costSummary, setCostSummary] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [paymentModal, setPaymentModal] = useState({ isOpen: false, wage: null });
    const [wageStatus, setWageStatus] = useState({}); // Track wage status per assignment

    useEffect(() => {
        loadProject();
        loadRecommendations();
        loadCostSummary();
    }, [id]);

    const loadProject = async () => {
        try {
            const response = await projectService.getById(id);
            setProject(response.data);

            // Auto-calculate wages for all assignments to ensure they exist
            if (response.data.assignments) {
                for (const assignment of response.data.assignments) {
                    if (assignment.status === 'ACTIVE' || assignment.status === 'COMPLETED') {
                        try {
                            await api.post('/wages/calculate', {
                                assignmentId: assignment.id,
                                endDate: new Date().toISOString().split('T')[0]
                            });
                        } catch (e) {
                            console.warn('Auto-calculation failed for assignment', assignment.id);
                        }
                    }
                }
            }

            // Load wage status for all assignments
            if (response.data.assignments) {
                const statusMap = {};
                for (const assignment of response.data.assignments) {
                    try {
                        const wageResponse = await api.get(`/wages/assignment/${assignment.id}/pending`);
                        statusMap[assignment.id] = wageResponse.data.length === 0 ? 'paid' : 'pending';
                    } catch (e) {
                        statusMap[assignment.id] = 'pending';
                    }
                }
                setWageStatus(statusMap);
            }
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

    const loadCostSummary = async () => {
        try {
            const response = await api.get(`/projects/${id}/cost-summary`);
            setCostSummary(response.data);
        } catch (err) {
            console.error('Error loading cost summary:', err);
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

    const handleRateLabour = (assignment) => {
        setRatingTarget({
            labourId: assignment.labour.id,
            labourName: assignment.labour.name,
            projectId: parseInt(id),
            projectName: project.name
        });
        setShowRatingForm(true);
    };

    const handleRatingSuccess = () => {
        setShowRatingForm(false);
        setRatingTarget(null);
        setModal({
            isOpen: true,
            type: 'success',
            title: 'Rating Submitted',
            message: 'Thank you for rating this labour!',
            details: null
        });
        loadProject();
    };

    const handleStatusChange = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await api.put(`/projects/${id}/status?status=${newStatus}`);
            loadProject();
            loadCostSummary();
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Status Updated',
                message: `Project status changed to ${newStatus.replace('_', ' ')}`,
                details: null
            });
        } catch (err) {
            console.error('Error updating status:', err);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Update Failed',
                message: 'Failed to update project status',
                details: null
            });
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handlePayLabour = async (assignment) => {
        try {
            // Fetch pending wages for this assignment
            const response = await api.get(`/wages/assignment/${assignment.id}/pending`);
            const wages = response.data;
            if (wages.length > 0) {
                setPaymentModal({ isOpen: true, wage: wages[0] });
            } else {
                setModal({
                    isOpen: true,
                    type: 'info',
                    title: 'No Pending Wages',
                    message: 'All wages for this assignment have been settled.',
                    details: null
                });
            }
        } catch (err) {
            console.error('Error fetching wages:', err);
            alert('Failed to fetch wage details');
        }
    };

    const handlePaymentSuccess = () => {
        setPaymentModal({ isOpen: false, wage: null });
        setModal({
            isOpen: true,
            type: 'success',
            title: 'Payment Successful',
            message: 'Payment has been recorded successfully.',
            details: null
        });
        loadProject(); // Reload to update wage status
        loadCostSummary();
    };

    const handleCompleteAssignment = async (assignmentId) => {
        try {
            await api.put(`/assignments/${assignmentId}/complete`);
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Assignment Completed',
                message: 'Labour has been released back to the pool and is now available for other projects.',
                details: null
            });
            loadProject();
            loadRecommendations(); // Refresh recommendations to show newly available labour
        } catch (err) {
            console.error('Error completing assignment:', err);
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Error',
                message: 'Failed to complete assignment.',
                details: null
            });
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'NOT_STARTED': 'badge-secondary',
            'IN_PROGRESS': 'badge-primary',
            'PAUSED': 'badge-warning',
            'COMPLETED': 'badge-success',
            'FAILED': 'badge-danger',
            'CANCELLED': 'badge-secondary'
        };
        return colors[status] || 'badge-secondary';
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
                        <div className="info-item">
                            <span className="info-label">Status</span>
                            <div className="status-controls">
                                <span className={`badge ${getStatusColor(project.status || 'NOT_STARTED')}`}>
                                    {(project.status || 'NOT_STARTED').replace('_', ' ')}
                                </span>
                                <select
                                    value={project.status || 'NOT_STARTED'}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={updatingStatus}
                                    className="status-select"
                                >
                                    <option value="NOT_STARTED">Not Started</option>
                                    <option value="IN_PROGRESS">In Progress</option>
                                    <option value="PAUSED">Paused</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="FAILED">Failed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>
                            </div>
                        </div>
                        {project.budget && (
                            <div className="info-item">
                                <span className="info-label">Budget</span>
                                <span className="info-value">${project.budget.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                </div>

                {costSummary && (
                    <div className="detail-card card">
                        <h3>Cost Summary</h3>
                        <div className="cost-summary">
                            <div className="cost-item">
                                <span className="cost-label">Total Wages Paid</span>
                                <span className="cost-value">${(costSummary.totalWages || 0).toLocaleString()}</span>
                            </div>
                            {costSummary.budget && (
                                <>
                                    <div className="cost-item">
                                        <span className="cost-label">Budget</span>
                                        <span className="cost-value">${costSummary.budget.toLocaleString()}</span>
                                    </div>
                                    <div className="cost-item">
                                        <span className="cost-label">Remaining</span>
                                        <span className={`cost-value ${costSummary.remainingBudget < 0 ? 'text-danger' : 'text-success'}`}>
                                            ${costSummary.remainingBudget.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="cost-item">
                                        <span className="cost-label">Budget Used</span>
                                        <span className="cost-value">{costSummary.percentageUsed.toFixed(1)}%</span>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}

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
            </div >

            {
                recommendations.length > 0 && (
                    <div className="recommendations-section card">
                        <h3>🎯 Recommended Labours</h3>
                        <p className="section-subtitle">
                            Based on required skills and ratings
                        </p>
                        <div className="recommendations-grid">
                            {recommendations
                                .filter(labour => {
                                    // Filter out labours that are already assigned to this project
                                    const isAssignedToThisProject = project.assignments?.some(
                                        assignment => assignment.labour.id === labour.id
                                    );
                                    // Filter out labours that have active assignments on ANY project
                                    const hasActiveAssignment = labour.assignments?.some(
                                        assignment => assignment.status === 'ACTIVE'
                                    );
                                    return !isAssignedToThisProject && !hasActiveAssignment;
                                })
                                .map((labour) => (
                                    <div key={labour.id} className="labour-card">
                                        <div className="labour-header">
                                            <h4>{labour.name}</h4>
                                            <span className="labour-rate">${labour.hourlyRate}/hr</span>
                                        </div>
                                        {labour.ratings && labour.ratings.length > 0 && (
                                            <div className="rating-badge" style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                                                ⭐ {(labour.ratings.reduce((sum, r) => sum + r.score, 0) / labour.ratings.length).toFixed(1)}
                                                <span style={{ opacity: 0.7, marginLeft: '0.25rem' }}>({labour.ratings.length})</span>
                                            </div>
                                        )}
                                        <div className="labour-skills">
                                            {labour.skills?.map((skill, idx) => (
                                                <span key={idx} className="badge badge-primary">{skill.name}</span>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handleAssignLabour(labour.id)}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Assign
                                        </button>
                                    </div>
                                ))}
                        </div>
                        {recommendations.filter(labour => {
                            const isAssignedToThisProject = project.assignments?.some(
                                assignment => assignment.labour.id === labour.id
                            );
                            const hasActiveAssignment = labour.assignments?.some(
                                assignment => assignment.status === 'ACTIVE'
                            );
                            return !isAssignedToThisProject && !hasActiveAssignment;
                        }).length === 0 && (
                                <p className="text-muted" style={{ textAlign: 'center', marginTop: '1rem' }}>
                                    All recommended labours are either already assigned to this project or currently occupied.
                                </p>
                            )}
                    </div>
                )
            }

            < div className="assignments-section card" >
                <h3>Current Assignments</h3>
                {
                    project.assignments && project.assignments.length > 0 ? (
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Labour</th>
                                        <th>Start Date</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {project.assignments.map((assignment) => {
                                        // Check if this labour has already been rated for this project
                                        const alreadyRated = assignment.labour.ratings?.some(
                                            r => r.project?.id === project.id
                                        );

                                        return (
                                            <tr key={assignment.id}>
                                                <td><strong>{assignment.labour.name}</strong></td>
                                                <td>{assignment.startDate}</td>
                                                <td>
                                                    <span className="badge badge-success">{assignment.status}</span>
                                                </td>
                                                <td>
                                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                                        {assignment.status === 'ACTIVE' && (
                                                            <>
                                                                <button
                                                                    onClick={() => handleRateLabour(assignment)}
                                                                    className="btn btn-xs btn-primary"
                                                                    disabled={alreadyRated}
                                                                >
                                                                    {alreadyRated ? '✓ Rated' : '⭐ Rate'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handlePayLabour(assignment)}
                                                                    className="btn btn-xs btn-success"
                                                                    disabled={wageStatus[assignment.id] === 'paid'}
                                                                >
                                                                    {wageStatus[assignment.id] === 'paid' ? '✓ Paid' : '💰 Pay'}
                                                                </button>
                                                                <button
                                                                    onClick={() => handleCompleteAssignment(assignment.id)}
                                                                    className="btn btn-xs btn-outline"
                                                                >
                                                                    ✓ Complete
                                                                </button>
                                                            </>
                                                        )}
                                                        {assignment.status === 'COMPLETED' && (
                                                            <span className="badge badge-success">Completed</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-muted">No labours assigned yet</p>
                    )
                }
            </div >

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
                details={modal.details}
            />

            {
                showRatingForm && ratingTarget && (
                    <Modal
                        isOpen={showRatingForm}
                        onClose={() => setShowRatingForm(false)}
                        title=""
                        message=""
                        type="info"
                    >
                        <RatingForm
                            labourId={ratingTarget.labourId}
                            labourName={ratingTarget.labourName}
                            projectId={ratingTarget.projectId}
                            projectName={ratingTarget.projectName}
                            onSuccess={handleRatingSuccess}
                            onCancel={() => setShowRatingForm(false)}
                        />
                    </Modal>
                )
            }

            {paymentModal.isOpen && paymentModal.wage && (
                <PaymentModal
                    wage={paymentModal.wage}
                    onClose={() => setPaymentModal({ isOpen: false, wage: null })}
                    onSuccess={handlePaymentSuccess}
                    onError={(msg) => setModal({
                        isOpen: true,
                        type: 'error',
                        title: 'Payment Failed',
                        message: msg,
                        details: null
                    })}
                />
            )}
        </div >
    );
}

export default ProjectDetail;
