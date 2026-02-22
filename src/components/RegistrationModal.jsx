import React, { useState } from 'react';
import { User, Phone, MapPin, CreditCard, Building, Camera, UploadCloud, X, ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';
import './RegistrationModal.css';

const RegistrationModal = ({ isOpen, onClose, onComplete }) => {
    const [step, setStep] = useState(1);
    const totalSteps = 7;

    const [formData, setFormData] = useState({
        // Step 1: Personal
        firstName: '',
        surname: '',
        gender: '',
        dob: '',
        profilePicture: null,
        // Step 2: Contact
        phoneCalls: '',
        phoneWhatsapp: '',
        email: 'john.doe@example.com', // Pre-filled example
        // Step 3: Location
        district: '',
        street: '',
        // Step 4: National ID
        idNumber: '',
        idFront: null,
        idBack: null,
        idSelfie: null,
        // Step 5: Account Type
        accountType: '', // 'student' or 'personal'
        // Step 6: Mobile Money
        airtelName: '',
        airtelNumber: '+2659',
        tnmName: '',
        tnmNumber: '+2658',
        // Step 7: Bank & Occupation
        bankName: '',
        accountNumber: '',
        branch: '',
        occupation: ''
    });

    if (!isOpen) return null;

    const handleNext = () => {
        if (step < totalSteps) setStep(step + 1);
        if (step === totalSteps) {
            onComplete();
            setStep(1); // Reset for next time
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

    const getProgressPercentage = () => {
        return ((step) / totalSteps) * 100;
    };

    return (
        <div className="registration-overlay fade-in">
            <div className="registration-modal slide-up">

                {/* Header & Progress */}
                <div className="reg-header">
                    <button className="close-btn" onClick={onClose}><X size={24} /></button>
                    <h2>Profile Registration</h2>
                    <p>Complete your KYC details to access full loan features.</p>

                    <div className="progress-container">
                        <div className="progress-bar-bg">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${getProgressPercentage()}%` }}
                            ></div>
                        </div>
                        <span className="progress-text">{Math.round(getProgressPercentage())}% Complete</span>
                    </div>
                </div>

                {/* Form Content */}
                <div className="reg-content">

                    {step === 1 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><User size={20} /> Step 1: Personal Details</div>

                            <div className="form-group row">
                                <div className="input-group">
                                    <label>First Name</label>
                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                                </div>
                                <div className="input-group">
                                    <label>Surname</label>
                                    <input type="text" name="surname" value={formData.surname} onChange={handleInputChange} placeholder="Doe" />
                                </div>
                            </div>

                            <div className="form-group row">
                                <div className="input-group">
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleInputChange}>
                                        <option value="">Select Gender</option>
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Profile Picture</label>
                                <div className="file-upload-box">
                                    <User size={32} className="upload-icon" />
                                    <span>Upload Profile Photo</span>
                                    <input type="file" onChange={(e) => handleFileChange(e, 'profilePicture')} accept="image/*" />
                                    {formData.profilePicture && <div className="file-name">{formData.profilePicture.name}</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><Phone size={20} /> Step 2: Contact Details</div>

                            <div className="input-group">
                                <label>Phone Number (Calls)</label>
                                <input type="tel" name="phoneCalls" value={formData.phoneCalls} onChange={handleInputChange} placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="input-group">
                                <label>Phone Number (WhatsApp)</label>
                                <input type="tel" name="phoneWhatsapp" value={formData.phoneWhatsapp} onChange={handleInputChange} placeholder="+1 (555) 000-0000" />
                            </div>
                            <div className="input-group">
                                <label>Email Address</label>
                                <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled className="disabled-input" />
                                <span className="help-text">Email cannot be changed here.</span>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><MapPin size={20} /> Step 3: Location Details</div>

                            <div className="input-group">
                                <label>District / Region</label>
                                <input type="text" name="district" value={formData.district} onChange={handleInputChange} placeholder="e.g., Downtown District" />
                            </div>
                            <div className="input-group">
                                <label>Street Address</label>
                                <input type="text" name="street" value={formData.street} onChange={handleInputChange} placeholder="123 Main St, Apt 4B" />
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><Camera size={20} /> Step 4: National ID Verification</div>
                            <p className="step-desc">Please provide your ID number and clear photos of your valid National ID.</p>

                            <div className="input-group" style={{ marginBottom: '16px' }}>
                                <label>National ID Number</label>
                                <input type="text" name="idNumber" value={formData.idNumber} onChange={handleInputChange} placeholder="Enter your ID Number" required />
                            </div>

                            <div className="id-upload-grid">
                                <div className="file-upload-box small">
                                    <UploadCloud size={24} className="upload-icon" />
                                    <span>ID Front</span>
                                    <input type="file" onChange={(e) => handleFileChange(e, 'idFront')} accept="image/*" />
                                    {formData.idFront && <div className="file-name">{formData.idFront.name}</div>}
                                </div>

                                <div className="file-upload-box small">
                                    <UploadCloud size={24} className="upload-icon" />
                                    <span>ID Back</span>
                                    <input type="file" onChange={(e) => handleFileChange(e, 'idBack')} accept="image/*" />
                                    {formData.idBack && <div className="file-name">{formData.idBack.name}</div>}
                                </div>

                                <div className="file-upload-box small wide">
                                    <Camera size={24} className="upload-icon" />
                                    <span>Selfie Holding ID</span>
                                    <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Ensure your face and ID details are clearly visible.</p>
                                    <input type="file" onChange={(e) => handleFileChange(e, 'idSelfie')} accept="image/*" />
                                    {formData.idSelfie && <div className="file-name">{formData.idSelfie.name}</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><CreditCard size={20} /> Step 5: Account Type</div>
                            <p className="step-desc">Select the type of account that matches your borrowing needs.</p>

                            <div className="account-type-grid">
                                <button
                                    className={`account-card ${formData.accountType === 'student' ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, accountType: 'student' })}
                                >
                                    <div className="card-icon">🎓</div>
                                    <h3>Student Account</h3>
                                    <p>Tailored for active students needing educational support.</p>
                                </button>

                                <button
                                    className={`account-card ${formData.accountType === 'personal' ? 'selected' : ''}`}
                                    onClick={() => setFormData({ ...formData, accountType: 'personal' })}
                                >
                                    <div className="card-icon">💼</div>
                                    <h3>Personal Account</h3>
                                    <p>Standard account for employed individuals or business needs.</p>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 6 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><Phone size={20} /> Step 6: Mobile Money Wallets</div>
                            <p className="step-desc">Provide your mobile wallet details for seamless transactions. Leave blank if not applicable.</p>

                            <div className="mobile-money-section">
                                <div className="wallet-header">
                                    <img src="/airtel.png" alt="Airtel Money" className="wallet-logo" style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', objectFit: 'contain', background: 'white', borderRadius: '4px', padding: '2px' }} />
                                    <h4>Airtel Money</h4>
                                </div>
                                <div className="form-group row">
                                    <div className="input-group">
                                        <label>Account Name</label>
                                        <input type="text" name="airtelName" value={formData.airtelName} onChange={handleInputChange} placeholder="Account Holder Name" />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <input type="tel" name="airtelNumber" value={formData.airtelNumber} onChange={handleInputChange} placeholder="+2659XXX" />
                                    </div>
                                </div>
                            </div>

                            <div className="mobile-money-section mt-16">
                                <div className="wallet-header">
                                    <img src="/tnm.png" alt="TNM Mpamba" className="wallet-logo" style={{ width: '32px', height: '32px', minWidth: '32px', minHeight: '32px', objectFit: 'contain', background: 'white', borderRadius: '4px', padding: '2px' }} />
                                    <h4>TNM Mpamba</h4>
                                </div>
                                <div className="form-group row">
                                    <div className="input-group">
                                        <label>Account Name</label>
                                        <input type="text" name="tnmName" value={formData.tnmName} onChange={handleInputChange} placeholder="Account Holder Name" />
                                    </div>
                                    <div className="input-group">
                                        <label>Phone Number</label>
                                        <input type="tel" name="tnmNumber" value={formData.tnmNumber} onChange={handleInputChange} placeholder="+2658XXX" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 7 && (
                        <div className="step-pane fade-in">
                            <div className="step-title"><Building size={20} /> Step 7: Bank Details</div>

                            <div className="input-group">
                                <label>Bank Name</label>
                                <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="e.g., Chase Bank" />
                            </div>

                            <div className="form-group row">
                                <div className="input-group">
                                    <label>Account Number</label>
                                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} placeholder="00012345678" />
                                </div>
                                <div className="input-group">
                                    <label>Branch Name</label>
                                    <input type="text" name="branch" value={formData.branch} onChange={handleInputChange} placeholder="Main Branch" />
                                </div>
                            </div>

                            {/* Conditional Field based on Step 5 */}
                            {formData.accountType === 'personal' && (
                                <div className="input-group mt-16 fade-in">
                                    <label>Occupation Details (Required for Personal Accounts)</label>
                                    <input type="text" name="occupation" value={formData.occupation} onChange={handleInputChange} placeholder="Job Title / Employer Name" />
                                </div>
                            )}

                            {formData.accountType === 'student' && (
                                <div className="success-banner fade-in mt-16">
                                    <CheckCircle2 size={20} />
                                    <span>Student Accounts do not require occupation details.</span>
                                </div>
                            )}

                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                <div className="reg-footer">
                    {step > 1 ? (
                        <button className="btn-secondary" onClick={handlePrev}>
                            <ChevronLeft size={20} /> Back
                        </button>
                    ) : (
                        <div /> // Placeholder for styling
                    )}

                    <button className="btn-primary" onClick={handleNext}>
                        {step === totalSteps ? 'Submit Registration' : 'Continue'}
                        {step < totalSteps && <ChevronRight size={20} />}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default RegistrationModal;
