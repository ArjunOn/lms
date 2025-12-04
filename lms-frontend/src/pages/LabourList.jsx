import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { labourService } from '../services';
import api from '../services/api';
import Modal from '../components/Modal';
import './LabourList.css';

function LabourList() {
    const [labours, setLabours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        hourlyRate: '',
        skills: [],
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [ratings, setRatings] = useState({});
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });
    const [selectedSkill, setSelectedSkill] = useState('ALL');
    const [availableSkills, setAvailableSkills] = useState([]);

    useEffect(() => {
        loadLabours();
    }, []);

    const loadLabours = async () => {
        try {
            setLoading(true);
            const response = await labourService.getAll();
            setLabours(response.data);

            // Fetch ratings for each labour
            const ratingsData = {};
            for (const labour of response.data) {
                try {
                    const avgResponse = await api.get(`/ratings/labour/${labour.id}/average`);
                    const avgRating = avgResponse.data;
                    const ratingsResponse = await api.get(`/ratings/labour/${labour.id}`);
                    const labourRatings = ratingsResponse.data;
                    ratingsData[labour.id] = {
                        average: avgRating,
                        count: labourRatings.length
                    };
                } catch (err) {
                    console.error(`Error loading ratings for labour ${labour.id}:`, err);
                }
            }
            setRatings(ratingsData);

            // Extract unique skills for filtering
            const skills = new Set();
            response.data.forEach(labour => {
                labour.skills?.forEach(skill => skills.add(skill.name));
            });
            setAvailableSkills(Array.from(skills).sort());
        } catch (err) {
            console.error('Error loading labours:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const labourData = {
                ...formData,
                hourlyRate: parseFloat(formData.hourlyRate)
            };
            await labourService.create(labourData);
            setFormData({ name: '', contactNumber: '', hourlyRate: '', skills: [] });
            setCurrentSkill('');
            setShowForm(false);
            loadLabours();
            setModal({
                isOpen: true,
                type: 'success',
                title: 'Success!',
                message: 'Labour created successfully'
            });
        } catch (err) {
            console.error('Error creating labour:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create labour. Please try again.';
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Labour Creation Failed',
                message: errorMessage
            });
        }
    };

    const handleAddSkillToForm = () => {
        if (!currentSkill.trim()) return;
        setFormData({
            ...formData,
            skills: [...formData.skills, { name: currentSkill.trim() }]
        });
        setCurrentSkill('');
    };

    const handleRemoveSkillFromForm = (index) => {
        setFormData({
            ...formData,
            skills: formData.skills.filter((_, i) => i !== index)
        });
    };

    const handleAddSkill = async (labourId, skillName) => {
        if (!skillName.trim()) return;
        try {
            await labourService.addSkill(labourId, skillName);
            loadLabours();
        } catch (err) {
            alert('Failed to add skill');
            console.error('Error adding skill:', err);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading labours...</p>
            </div>
        );
    }

    return (
        <div className="labour-list fade-in">
            <div className="page-header">
                <div>
                    <h1>Labours</h1>
                    <p className="page-subtitle">Manage your workforce</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn btn-primary">
                    {showForm ? 'Cancel' : '+ Add Labour'}
                </button>
            </div>

            {/* Skill Filter */}
            <div className="filter-section card" style={{ marginBottom: 'var(--spacing-lg)' }}>
                <h4 style={{ marginBottom: 'var(--spacing-sm)', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Filter by Skill</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-xs)' }}>
                    <button
                        onClick={() => setSelectedSkill('ALL')}
                        className={`btn btn-xs ${selectedSkill === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        All ({labours.length})
                    </button>
                    <button
                        onClick={() => setSelectedSkill('UNASSIGNED')}
                        className={`btn btn-xs ${selectedSkill === 'UNASSIGNED' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Unassigned ({labours.filter(l => !l.assignments?.some(a => a.status === 'ACTIVE')).length})
                    </button>
                    {availableSkills.map(skill => (
                        <button
                            key={skill}
                            onClick={() => setSelectedSkill(skill)}
                            className={`btn btn-xs ${selectedSkill === skill ? 'btn-primary' : 'btn-outline'}`}
                        >
                            {skill} ({labours.filter(l => l.skills?.some(s => s.name === skill)).length})
                        </button>
                    ))}
                </div>
            </div>

            {showForm && (
                <div className="labour-form card">
                    <h3>Add New Labour</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="name" className="form-label">Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-input"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    placeholder="Enter name"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="contactNumber" className="form-label">Contact Number</label>
                                <input
                                    type="text"
                                    id="contactNumber"
                                    className="form-input"
                                    value={formData.contactNumber}
                                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                                    placeholder="Enter contact number"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="hourlyRate" className="form-label">Hourly Rate ($)</label>
                                <input
                                    type="number"
                                    id="hourlyRate"
                                    className="form-input"
                                    value={formData.hourlyRate}
                                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                    placeholder="Enter hourly rate"
                                    step="0.01"
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Skills</label>
                            <div className="skills-input-container" style={{ display: 'flex', gap: '0.5rem' }}>
                                <input
                                    type="text"
                                    value={currentSkill}
                                    onChange={(e) => setCurrentSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkillToForm())}
                                    placeholder="Enter a skill (e.g. Carpentry)"
                                    className="form-input"
                                />
                                <button
                                    type="button"
                                    onClick={handleAddSkillToForm}
                                    className="btn btn-secondary"
                                >
                                    Add
                                </button>
                            </div>
                            {formData.skills.length > 0 && (
                                <div className="skills-list" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                    {formData.skills.map((skill, index) => (
                                        <span key={index} className="badge badge-primary">
                                            {skill.name}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSkillFromForm(index)}
                                                className="btn-close"
                                                aria-label="Remove"
                                                style={{ marginLeft: '0.5rem', background: 'none', border: 'none', color: 'inherit', cursor: 'pointer' }}
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                            Add Labour
                        </button>
                    </form>
                </div>
            )}

            {labours.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-icon">👷</div>
                    <h3>No labours yet</h3>
                    <p>Add your first labour to get started</p>
                    <button onClick={() => setShowForm(true)} className="btn btn-primary">
                        Add Labour
                    </button>
                </div>
            ) : (
                <div className="labours-grid">
                    {labours
                        .filter(labour => {
                            if (selectedSkill === 'ALL') return true;
                            if (selectedSkill === 'UNASSIGNED') {
                                return !labour.assignments?.some(a => a.status === 'ACTIVE');
                            }
                            return labour.skills?.some(s => s.name === selectedSkill);
                        })
                        .map((labour) => {
                            const activeAssignments = labour.assignments?.filter(a => a.status === 'ACTIVE').length || 0;
                            const totalAssignments = labour.assignments?.length || 0;
                            const totalRatings = labour.ratings?.length || 0;
                            const avgRating = ratings[labour.id]?.average || 0;
                            const isUnassigned = activeAssignments === 0;

                            // Get unique projects from assignments
                            const uniqueProjects = new Set(labour.assignments?.map(a => a.project?.id).filter(Boolean));
                            const totalProjects = uniqueProjects.size;

                            return (
                                <div key={labour.id} className="labour-item card">
                                    <div className="labour-item-header">
                                        <div>
                                            <h3>{labour.name}</h3>
                                            {isUnassigned && (
                                                <span className="badge badge-success" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                                    ✓ Available
                                                </span>
                                            )}
                                            {totalRatings > 0 && (
                                                <div className="rating-badge">
                                                    <span className="rating-stars">⭐ {avgRating.toFixed(1)}</span>
                                                    <span className="rating-count">({totalRatings} {totalRatings === 1 ? 'rating' : 'ratings'})</span>
                                                </div>
                                            )}
                                        </div>
                                        <span className="labour-rate">${labour.hourlyRate}/hr</span>
                                    </div>

                                    <div className="labour-contact">
                                        📞 {labour.contactNumber || 'No contact'}
                                    </div>

                                    {/* Overview Statistics */}
                                    <div className="labour-overview">
                                        <div className="overview-stat">
                                            <div className="stat-icon">📋</div>
                                            <div className="stat-info">
                                                <div className="stat-value">{activeAssignments}</div>
                                                <div className="stat-label">Active</div>
                                            </div>
                                        </div>
                                        <div className="overview-stat">
                                            <div className="stat-icon">🏗️</div>
                                            <div className="stat-info">
                                                <div className="stat-value">{totalProjects}</div>
                                                <div className="stat-label">Projects</div>
                                            </div>
                                        </div>
                                        <div className="overview-stat">
                                            <div className="stat-icon">📊</div>
                                            <div className="stat-info">
                                                <div className="stat-value">{totalAssignments}</div>
                                                <div className="stat-label">Total Jobs</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="labour-skills-section">
                                        <strong>Skills:</strong>
                                        <div className="skills-list">
                                            {labour.skills && labour.skills.length > 0 ? (
                                                labour.skills.map((skill, index) => (
                                                    <span key={index} className="badge badge-primary">
                                                        {skill.name}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-muted">No skills</span>
                                            )}
                                        </div>
                                        <form
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                const input = e.target.elements.skillName;
                                                handleAddSkill(labour.id, input.value);
                                                input.value = '';
                                            }}
                                            className="add-skill-form"
                                        >
                                            <input
                                                type="text"
                                                name="skillName"
                                                placeholder="Add skill"
                                                className="form-input"
                                            />
                                            <button type="submit" className="btn btn-sm btn-outline">
                                                Add
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            )}

            <Modal
                isOpen={modal.isOpen}
                onClose={() => setModal({ ...modal, isOpen: false })}
                title={modal.title}
                message={modal.message}
                type={modal.type}
            />
        </div>
    );
}

export default LabourList;
