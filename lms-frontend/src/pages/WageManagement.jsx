import { useState, useEffect } from 'react';
import PaymentModal from '../components/PaymentModal';
import api from '../services/api';
import './WageManagement.css';

function WageManagement() {
    const [wages, setWages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [paymentModal, setPaymentModal] = useState({ isOpen: false, wage: null });
    const [errorModal, setErrorModal] = useState({ isOpen: false, message: '' });

    useEffect(() => {
        loadWages();
    }, [filter]);

    const loadWages = async () => {
        try {
            setLoading(true);
            const url = filter === 'ALL'
                ? '/wages'
                : `/wages/status/${filter}`;
            const response = await api.get(url);
            setWages(response.data);
        } catch (err) {
            console.error('Error loading wages:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSettle = (wage) => {
        setPaymentModal({ isOpen: true, wage: wage });
    };

    const handlePaymentSuccess = () => {
        setPaymentModal({ isOpen: false, wage: null });
        loadWages();
    };

    const getStatusBadge = (status) => {
        const badges = {
            'PENDING': 'badge-warning',
            'IN_PROGRESS': 'badge-primary',
            'SETTLED': 'badge-success'
        };
        return badges[status] || 'badge-secondary';
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading wages...</p>
            </div>
        );
    }

    return (
        <div className="wage-management fade-in">
            <div className="page-header">
                <div>
                    <h1>Wage Management</h1>
                    <p className="page-subtitle">Track and settle labour wages</p>
                </div>
                <div className="filter-controls">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`btn ${filter === 'ALL' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('PENDING')}
                        className={`btn ${filter === 'PENDING' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilter('SETTLED')}
                        className={`btn ${filter === 'SETTLED' ? 'btn-primary' : 'btn-outline'}`}
                    >
                        Settled
                    </button>
                </div>
            </div>

            {wages.length === 0 ? (
                <div className="empty-state card">
                    <div className="empty-icon">💰</div>
                    <h3>No wages found</h3>
                    <p>No wage records match the selected filter</p>
                </div>
            ) : (
                <div className="wages-table card">
                    <table>
                        <thead>
                            <tr>
                                <th>Labour</th>
                                <th>Project</th>
                                <th>Days Worked</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Calculated Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wages.map((wage) => (
                                <tr key={wage.id}>
                                    <td><strong>{wage.assignment?.labour?.name || 'N/A'}</strong></td>
                                    <td>{wage.assignment?.project?.name || 'N/A'}</td>
                                    <td>{wage.daysWorked || 0} days</td>
                                    <td className="amount">${(wage.totalAmount || 0).toLocaleString()}</td>
                                    <td>
                                        <span className={`badge ${getStatusBadge(wage.status)}`}>
                                            {wage.status}
                                        </span>
                                    </td>
                                    <td>{wage.calculatedDate || 'N/A'}</td>
                                    <td>
                                        {wage.status === 'PENDING' && (
                                            <button
                                                onClick={() => handleSettle(wage)}
                                                className="btn btn-sm btn-success"
                                            >
                                                Settle
                                            </button>
                                        )}
                                        {wage.status === 'SETTLED' && (
                                            <span className="text-muted">Settled on {wage.settledDate}</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}


            {paymentModal.isOpen && paymentModal.wage && (
                <PaymentModal
                    wage={paymentModal.wage}
                    onClose={() => setPaymentModal({ isOpen: false, wage: null })}
                    onSuccess={handlePaymentSuccess}
                    onError={(msg) => setErrorModal({ isOpen: true, message: msg })}
                />
            )}

            {errorModal.isOpen && (
                <div className="modal-overlay">
                    <div className="modal-content card">
                        <div className="modal-header">
                            <h3 className="text-danger">Payment Failed</h3>
                            <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="close-btn">×</button>
                        </div>
                        <p>{errorModal.message}</p>
                        <div className="modal-footer">
                            <button onClick={() => setErrorModal({ isOpen: false, message: '' })} className="btn btn-primary">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default WageManagement;
