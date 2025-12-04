import { useState } from 'react';
import QRCode from 'react-qr-code';
import api from '../services/api';
import './PaymentModal.css';

function PaymentModal({ wage, onClose, onSuccess, onError }) {
    const [activeTab, setActiveTab] = useState('UPI');
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            await api.post('/payments', {
                wageId: wage.id,
                amount: wage.totalAmount, // Assuming full payment
                method: activeTab,
                transactionReference: activeTab === 'UPI' ? `UPI-${Date.now()}` : `CASH-${Date.now()}`, // Mock ref
                notes: notes
            });

            onSuccess();
            onClose();
        } catch (err) {
            console.error('Payment error:', err);
            const errorMessage = err.response?.data?.message || 'Payment failed. Please try again.';
            if (onError) {
                onError(errorMessage);
            } else {
                alert(errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    // Generate UPI String
    // Format: upi://pay?pa=<upi_id>&pn=<name>&am=<amount>&cu=INR
    // We'll use a placeholder UPI ID for now.
    const upiId = "labouradmin@upi";
    const labourName = wage.assignment?.labour?.name || "Labour";
    const amount = wage.totalAmount || 0;
    const upiString = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(labourName)}&am=${amount}&cu=INR`;

    return (
        <div className="modal-overlay">
            <div className="modal-content payment-modal">
                <div className="modal-header">
                    <h2>Pay {labourName}</h2>
                    <button onClick={onClose} className="close-btn">×</button>
                </div>

                <div className="payment-amount">
                    <span className="label">Amount to Pay</span>
                    <span className="value">${amount.toLocaleString()}</span>
                </div>

                <div className="payment-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'UPI' ? 'active' : ''}`}
                        onClick={() => setActiveTab('UPI')}
                    >
                        UPI / QR
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'CASH' ? 'active' : ''}`}
                        onClick={() => setActiveTab('CASH')}
                    >
                        Cash
                    </button>
                </div>

                <div className="payment-body">
                    {activeTab === 'UPI' ? (
                        <div className="upi-section">
                            <div className="qr-container">
                                <QRCode value={upiString} size={200} />
                            </div>
                            <p className="scan-instruction">Scan with any UPI app to pay</p>
                            <div className="upi-details">
                                <small>UPI ID: {upiId}</small>
                            </div>
                            <button
                                onClick={handlePayment}
                                className="btn btn-primary btn-block"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Mark as Paid'}
                            </button>
                        </div>
                    ) : (
                        <div className="cash-section">
                            <div className="form-group">
                                <label>Notes / Comments</label>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="e.g. Paid in hand, Advance settlement..."
                                    rows="4"
                                />
                            </div>
                            <button
                                onClick={handlePayment}
                                className="btn btn-primary btn-block"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Confirm Cash Payment'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PaymentModal;
