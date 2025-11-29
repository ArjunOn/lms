import { useEffect } from 'react';
import './Modal.css';

function Modal({ isOpen, onClose, title, message, type = 'info', details = null }) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            default:
                return 'ℹ';
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                <div className={`modal-header modal-header-${type}`}>
                    <div className="modal-icon">{getIcon()}</div>
                    <h2 className="modal-title">{title}</h2>
                    <button className="modal-close" onClick={onClose} aria-label="Close">
                        ×
                    </button>
                </div>
                <div className="modal-body">
                    <p className="modal-message">{message}</p>
                    {details && (
                        <div className="modal-details">
                            <h4>Project Details:</h4>
                            <div className="detail-item">
                                <span className="detail-label">Project:</span>
                                <span className="detail-value">{details.occupiedProjectName}</span>
                            </div>
                            <div className="detail-item">
                                <span className="detail-label">Assigned Since:</span>
                                <span className="detail-value">{details.assignmentStartDate}</span>
                            </div>
                        </div>
                    )}
                </div>
                <div className="modal-footer">
                    <button className={`btn btn-${type}`} onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Modal;
