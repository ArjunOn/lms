import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { labourService } from '../services';
import './LabourList.css';

function LabourList() {
    const [labours, setLabours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        contactNumber: '',
        hourlyRate: '',
    });

    useEffect(() => {
        loadLabours();
    }, []);

    const loadLabours = async () => {
        try {
            setLoading(true);
            const response = await labourService.getAll();
            setLabours(response.data);
        } catch (err) {
            console.error('Error loading labours:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await labourService.create(formData);
            setFormData({ name: '', contactNumber: '', hourlyRate: '' });
            setShowForm(false);
            loadLabours();
        } catch (err) {
            alert('Failed to create labour');
            console.error('Error creating labour:', err);
        }
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
                        <button type="submit" className="btn btn-primary">
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
                    {labours.map((labour) => (
                        <div key={labour.id} className="labour-item card">
                            <div className="labour-item-header">
                                <h3>{labour.name}</h3>
                                <span className="labour-rate">${labour.hourlyRate}/hr</span>
                            </div>
                            <div className="labour-contact">
                                📞 {labour.contactNumber || 'No contact'}
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
                    ))}
                </div>
            )}
        </div>
    );
}

export default LabourList;
