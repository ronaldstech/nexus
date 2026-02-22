import React, { useState, useEffect } from 'react';
import {
    Banknote,
    CalendarClock,
    ShieldCheck,
    Wallet,
    FileText,
    X,
    ChevronRight,
    ChevronLeft,
    UploadCloud,
    AlertCircle,
    Building,
    Phone
} from 'lucide-react';
import './LoanApplicationModal.css';

const LoanApplicationModal = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 5;

    const [formData, setFormData] = useState({
        amount: '',
        durationWeeks: 1, // 1, 2, 3, or 4
        interestRate: 20, // corresponding %, e.g., 20, 25, 30, 35
        collateralName: '',
        collateralPhoto: null,
        receivingMode: 'existing', // 'existing' or 'new'

        // If 'new' is selected
        newModeType: 'bank', // 'bank', 'airtel', 'tnm'
        newBankName: '',
        newAccountNumber: '',
        newMobileNumber: ''
    });

    const [calculatedDueDate, setCalculatedDueDate] = useState('');

    useEffect(() => {
        // Calculate due date based on current date + duration
        const date = new Date();
        date.setDate(date.getDate() + (formData.durationWeeks * 7));

        const formatter = new Intl.DateTimeFormat('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });

        setCalculatedDueDate(formatter.format(date));
    }, [formData.durationWeeks]);

    if (!isOpen) return null;

    const handleNext = () => {
        // Basic validation before preceding
        if (step === 1 && (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0)) {
            alert("Please enter a valid loan amount.");
            return;
        }

        if (step < totalSteps) setStep(step + 1);
        if (step === totalSteps) {
            onComplete(formData);
            setStep(1); // Reset
            setFormData({ ...formData, amount: '', collateralName: '', collateralPhoto: null }); // partial reset
        }
    };

    const handlePrev = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e, fieldName) => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [fieldName]: e.target.files[0] }));
        }
    };

    const setDuration = (weeks, rate) => {
        setFormData(prev => ({ ...prev, durationWeeks: weeks, interestRate: rate }));
    };

    const getProgressPercentage = () => {
        return ((step) / totalSteps) * 100;
    };

    // Calculations for Step 5
    const principal = Number(formData.amount) || 0;
    const interestAmount = principal * (formData.interestRate / 100);
    const totalExpected = principal + interestAmount;

    return (
        <div className="loan-overlay fade-in">
            <div className="loan-modal slide-up">

                {/* Header */}
                <div className="loan-header">
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                    <h2>New Loan Request</h2>
                    <p>Provide details for your cash advance application.</p>

                    <div className="loan-progress-container">
                        <div className="loan-progress-bar-bg">
                            <div
                                className="loan-progress-bar-fill"
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                        <span className="loan-progress-text">{Math.round(getProgressPercentage())}%</span>
                    </div>
                </div>

                {/* Content */}
                <div className="loan-content">

                    {/* STEP 1: AMOUNT */}
                    {step === 1 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><Banknote size={20} /> Step 1: Loan Amount</div>
                            <p className="step-desc">Enter the principal amount you wish to borrow in Malawi Kwacha.</p>

                            <div className="amount-wrapper mt-8">
                                <span className="currency-prefix">MK</span>
                                <input
                                    type="number"
                                    className="amount-input"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="0"
                                    min="1000"
                                    autoFocus
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DURATION */}
                    {step === 2 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><CalendarClock size={20} /> Step 2: Duration & Interest</div>
                            <p className="step-desc">Select your preferred repayment period. Longer durations carry higher interest bounds.</p>

                            <div className="duration-grid">
                                <div className={`duration-card ${formData.durationWeeks === 1 ? 'selected' : ''}`} onClick={() => setDuration(1, 20)}>
                                    <span className="duration-weeks">1 Week</span>
                                    <span className="duration-interest">20% Interest</span>
                                </div>
                                <div className={`duration-card ${formData.durationWeeks === 2 ? 'selected' : ''}`} onClick={() => setDuration(2, 25)}>
                                    <span className="duration-weeks">2 Weeks</span>
                                    <span className="duration-interest">25% Interest</span>
                                </div>
                                <div className={`duration-card ${formData.durationWeeks === 3 ? 'selected' : ''}`} onClick={() => setDuration(3, 30)}>
                                    <span className="duration-weeks">3 Weeks</span>
                                    <span className="duration-interest">30% Interest</span>
                                </div>
                                <div className={`duration-card ${formData.durationWeeks === 4 ? 'selected' : ''}`} onClick={() => setDuration(4, 35)}>
                                    <span className="duration-weeks">4 Weeks</span>
                                    <span className="duration-interest">35% Interest</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 3: COLLATERAL */}
                    {step === 3 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><ShieldCheck size={20} /> Step 3: Collateral</div>
                            <p className="step-desc">Provide details and an image of an item to secure your loan.</p>

                            <div className="input-group">
                                <label>Collateral Item Name</label>
                                <input type="text" name="collateralName" value={formData.collateralName} onChange={handleInputChange} placeholder="e.g., iPhone 13 Pro, HP Laptop" />
                            </div>

                            <div className="input-group mt-8">
                                <label>Upload Item Photo</label>
                                <div className="loan-file-box">
                                    <UploadCloud size={32} color="var(--primary-color)" />
                                    <span style={{ fontWeight: 600 }}>Click or drag photo to upload</span>
                                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Clear photo showing item condition</span>
                                    <input type="file" onChange={(e) => handleFileChange(e, 'collateralPhoto')} accept="image/*" />
                                    {formData.collateralPhoto && <div style={{ marginTop: '8px', color: 'var(--success-color)' }}>{formData.collateralPhoto.name}</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: RECEIVING MODE */}
                    {step === 4 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><Wallet size={20} /> Step 4: Receiving Mode</div>
                            <p className="step-desc">Where should we deposit the funds if approved?</p>

                            <div className="mode-section">
                                <label className={`mode-option ${formData.receivingMode === 'existing' ? 'selected' : ''}`}>
                                    <input type="radio" name="receivingMode" value="existing" checked={formData.receivingMode === 'existing'} onChange={handleInputChange} />
                                    <div className="mode-info">
                                        <span className="mode-title">Use Verified Accounts</span>
                                        <span className="mode-subtitle">Accounts saved during profile registration</span>
                                    </div>
                                </label>

                                <label className={`mode-option mt-8 ${formData.receivingMode === 'new' ? 'selected' : ''}`}>
                                    <input type="radio" name="receivingMode" value="new" checked={formData.receivingMode === 'new'} onChange={handleInputChange} />
                                    <div className="mode-info">
                                        <span className="mode-title">Add New Payout Method</span>
                                        <span className="mode-subtitle">Provide details for a one-time payout destination</span>
                                    </div>
                                </label>
                            </div>

                            {formData.receivingMode === 'new' && (
                                <div className="mode-section mt-16 slide-up">
                                    <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Select Method Type</label>
                                    <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                        <button
                                            className={`btn-secondary ${formData.newModeType === 'bank' ? 'selected-pill' : ''}`}
                                            style={formData.newModeType === 'bank' ? { background: 'var(--primary-color)', color: 'white', borderColor: 'var(--primary-color)' } : {}}
                                            onClick={() => setFormData({ ...formData, newModeType: 'bank' })}
                                        ><Building size={16} /> Bank</button>
                                        <button
                                            className={`btn-secondary ${formData.newModeType === 'airtel' ? 'selected-pill' : ''}`}
                                            style={formData.newModeType === 'airtel' ? { background: '#ff0000', color: 'white', borderColor: '#ff0000' } : {}}
                                            onClick={() => setFormData({ ...formData, newModeType: 'airtel' })}
                                        ><Phone size={16} /> Airtel</button>
                                        <button
                                            className={`btn-secondary ${formData.newModeType === 'tnm' ? 'selected-pill' : ''}`}
                                            style={formData.newModeType === 'tnm' ? { background: '#34a853', color: 'white', borderColor: '#34a853' } : {}}
                                            onClick={() => setFormData({ ...formData, newModeType: 'tnm' })}
                                        ><Phone size={16} /> TNM</button>
                                    </div>

                                    {formData.newModeType === 'bank' && (
                                        <div className="form-group row fade-in">
                                            <div className="input-group">
                                                <label>Bank Name</label>
                                                <input type="text" name="newBankName" value={formData.newBankName} onChange={handleInputChange} placeholder="e.g., FDH Bank" />
                                            </div>
                                            <div className="input-group">
                                                <label>Account Number</label>
                                                <input type="text" name="newAccountNumber" value={formData.newAccountNumber} onChange={handleInputChange} placeholder="000123..." />
                                            </div>
                                        </div>
                                    )}

                                    {formData.newModeType !== 'bank' && (
                                        <div className="input-group fade-in">
                                            <label>{formData.newModeType === 'airtel' ? 'Airtel Money Number' : 'TNM Mpamba Number'}</label>
                                            <input type="tel" name="newMobileNumber" value={formData.newMobileNumber} onChange={handleInputChange} placeholder={formData.newModeType === 'airtel' ? "+2659..." : "+2658..."} />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* STEP 5: OVERVIEW */}
                    {step === 5 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><FileText size={20} /> Step 5: Loan Overview</div>
                            <p className="step-desc">Please review your application details thoroughly before submitting.</p>

                            <div className="overview-card">
                                <div className="summary-row">
                                    <span>Principal Amount</span>
                                    <span className="summary-val">MK {principal.toLocaleString()}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Duration</span>
                                    <span className="summary-val">{formData.durationWeeks} Week(s)</span>
                                </div>
                                <div className="summary-row">
                                    <span>Interest Rate ({formData.interestRate}%)</span>
                                    <span className="summary-val">+ MK {interestAmount.toLocaleString()}</span>
                                </div>

                                <div className="summary-row total">
                                    <span>Total Expected Repayment</span>
                                    <span className="summary-val">MK {totalExpected.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="due-date-box mt-8">
                                <AlertCircle size={24} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Strict Due Date & Time</span>
                                    <span className="due-date-text">{calculatedDueDate}</span>
                                </div>
                            </div>
                        </div>
                    )}

                </div>

                {/* Footer Controls */}
                <div className="loan-footer">
                    {step > 1 ? (
                        <button className="btn-secondary" onClick={handlePrev}>
                            <ChevronLeft size={20} /> Back
                        </button>
                    ) : (
                        <div /> // spacer
                    )}

                    <button className="btn-primary" onClick={handleNext}>
                        {step === totalSteps ? 'Confirm & Submit Application' : 'Continue'}
                        {step < totalSteps && <ChevronRight size={20} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LoanApplicationModal;
