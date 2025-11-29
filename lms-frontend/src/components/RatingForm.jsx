import { useState } from 'react';
import './RatingForm.css';

function RatingForm({ labourId, labourName, projectId, projectName, onSuccess, onCancel }) {
    const [score, setScore] = useState(0);
    const [hoveredScore, setHoveredScore] = useState(0);
    const [comments, setComments] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (score === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/ratings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    labourId,
                    projectId,
                    score,
                    comments: comments.trim() || null
                })
            });

            if (!response.ok) {
                throw new Error('Failed to submit rating');
            }

            if (onSuccess) onSuccess();
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const renderStars = () => {
        return [1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                type="button"
                className={`star ${star <= (hoveredScore || score) ? 'active' : ''}`}
                onClick={() => setScore(star)}
                onMouseEnter={() => setHoveredScore(star)}
                onMouseLeave={() => setHoveredScore(0)}
                aria-label={`Rate ${star} stars`}
            >
                ★
            </button>
        ));
    };

    return (
        <div className="rating-form-container">
            <div className="rating-form-header">
                <h3>Rate Labour Performance</h3>
                <button className="close-btn" onClick={onCancel} aria-label="Close">×</button>
            </div>

            <div className="rating-form-body">
                <div className="rating-info">
                    <p><strong>Labour:</strong> {labourName}</p>
                    <p><strong>Project:</strong> {projectName}</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Rating *</label>
                        <div className="star-rating">
                            {renderStars()}
                        </div>
                        {score > 0 && (
                            <p className="rating-text">{score} out of 5 stars</p>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="comments">Comments (Optional)</label>
                        <textarea
                            id="comments"
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            placeholder="Share your experience working with this labour..."
                            rows="4"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button type="button" onClick={onCancel} className="btn btn-secondary">
                            Cancel
                        </button>
                        <button type="submit" disabled={submitting || score === 0} className="btn btn-primary">
                            {submitting ? 'Submitting...' : 'Submit Rating'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RatingForm;
