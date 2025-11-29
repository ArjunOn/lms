import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services';
import './ProjectForm.css';

function ProjectForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        requiredSkills: [],
    });
    const [currentSkill, setCurrentSkill] = useState('');
    const [loading, setLoading] = useState(false);

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
            await projectService.create(formData);
            navigate('/projects');
        } catch (err) {
            alert('Failed to create project');
            console.error('Error creating project:', err);
        } finally {
            setLoading(false);
        }
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
        </div>
    );
}

export default ProjectForm;
