import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services';
import Modal from '../components/Modal';
import './ProjectForm.css';

function ProjectForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
        status: 'NOT_STARTED',
        requiredSkills: [],
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ isOpen: false, type: 'info', title: '', message: '' });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const projectData = {
                ...formData,
                budget: formData.budget ? parseFloat(formData.budget) : null
            };
            console.log('Submitting project data:', projectData);
            await projectService.create(projectData);
            navigate('/projects');
        } catch (err) {
            console.error('Error creating project:', err);
            console.error('Error response:', err.response?.data);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create project. Please try again.';
            setModal({
                isOpen: true,
                type: 'error',
                title: 'Project Creation Failed',
                message: errorMessage
            });
        } finally {
            setLoading(false);
        }
    };

    const handleAddSkill = () => {
        if (!currentSkill.trim()) return;
        setFormData({
            ...formData,
            requiredSkills: [...formData.requiredSkills, { name: currentSkill.trim() }]
        });
        setCurrentSkill('');
    };

    const handleRemoveSkill = (index) => {
        setFormData({
            ...formData,
            requiredSkills: formData.requiredSkills.filter((_, i) => i !== index)
        });
    };

    return (
        <div className="project-form fade-in">
            <div className="form-header">
                <h1>Create New Project</h1>
                <p>Fill in the details to create a new construction project</p>
            </div>

            <div className="form-container card">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="name" className="form-label">
                            Project Name *
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            className="form-textarea"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter project description"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="startDate" className="form-label">
                                Start Date
                            </label>
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                className="form-input"
                                value={formData.startDate}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="endDate" className="form-label">
                                End Date
                            </label>
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                className="form-input"
                                value={formData.endDate}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="budget" className="form-label">
                                Budget ($)
                            </label>
                            <input
                                type="number"
                                id="budget"
                                name="budget"
                                className="form-input"
                                value={formData.budget}
                                onChange={handleChange}
                                placeholder="Enter project budget"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="status" className="form-label">
                                Initial Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                className="form-input"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="NOT_STARTED">Not Started</option>
                                <option value="IN_PROGRESS">In Progress</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Required Skills</label>
                        <div className="skills-input-container">
                            <input
                                type="text"
                                value={currentSkill}
                                onChange={(e) => setCurrentSkill(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                placeholder="Enter a skill (e.g. Carpentry)"
                                className="form-input"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="btn btn-secondary"
                            >
                                Add
                            </button>
                        </div>
                        <div className="skills-list mt-2">
                            {formData.requiredSkills.map((skill, index) => (
                                <span key={index} className="badge badge-primary">
                                    {skill.name}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveSkill(index)}
                                        className="btn-close"
                                        aria-label="Remove"
                                    >
                                        ×
                                    </button>
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/projects')}
                            className="btn btn-outline"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={loading}>
                            {loading ? 'Creating...' : 'Create Project'}
                        </button>
                    </div>
                </form>
            </div>

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

export default ProjectForm;
