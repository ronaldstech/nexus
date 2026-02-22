import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    Clock,
    Activity,
    AlertCircle,
    CheckCircle,
    Moon,
    Sun,
    LogOut,
    Menu,
    X,
    CreditCard,
    Smartphone,
    Building,
    ChevronDown,
    ChevronUp,
    FileText,
    Wallet
} from 'lucide-react';
import RegistrationModal from '../components/RegistrationModal';
import LoanApplicationModal from '../components/LoanApplicationModal';
import './UserDashboard.css';


// Mock Data for a single user
const USER_MOCK_DATA = {
    pending: [
        { id: 'req_010', amount: '$1,500', dateRequested: '2026-02-21', purpose: 'Emergency Medical', status: 'Under Review' },
    ],
    active: [
        { id: 'act_005', amount: '$5,000', issueDate: '2025-12-01', interest: '5%', nextPayment: '2026-03-01', status: 'Active' },
    ],
    due: [
        // Setting a due date slightly in the future to test the countdown timer
        { id: 'due_003', amount: '$800', dueDateString: '2026-02-28T23:59:59', penalty: '$0', penaltyRate: '$10/day after due date' },
        { id: 'due_004', amount: '$1,200', dueDateString: '2026-02-23T15:30:00', penalty: '$0', penaltyRate: '$15/day after due date' }
    ],
    paid: [
        { id: 'pd_008', amount: '$2,000', paymentTimestamp: '2025-11-15T14:22:15', mode: 'Credit Card', status: 'Cleared' },
        { id: 'pd_009', amount: '$500', paymentTimestamp: '2026-01-05T09:05:40', mode: 'Bank Transfer', status: 'Cleared' },
    ]
};

const CountdownTimer = ({ targetDateString }) => {
    const calculateTimeLeft = () => {
        const difference = +new Date(targetDateString) - +new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60)
            };
        } else {
            timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
        }
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    const isUrgent = timeLeft.days <= 1 && !timeLeft.expired;
    const isExpired = timeLeft.expired;

    const formatNumber = (num) => num.toString().padStart(2, '0');

    if (isExpired) {
        return <div className="text-error font-bold">OVERDUE</div>;
    }

    return (
        <div className="countdown-timer">
            <div className={`time-box ${isUrgent ? 'urgent' : ''}`}>
                <span className="time-val">{formatNumber(timeLeft.days)}</span>
                <span className="time-label">DD</span>
            </div>
            <span className="mt-1">:</span>
            <div className={`time-box ${isUrgent ? 'urgent' : ''}`}>
                <span className="time-val">{formatNumber(timeLeft.hours)}</span>
                <span className="time-label">HH</span>
            </div>
            <span className="mt-1">:</span>
            <div className={`time-box ${isUrgent ? 'urgent' : ''}`}>
                <span className="time-val">{formatNumber(timeLeft.minutes)}</span>
                <span className="time-label">MM</span>
            </div>
            <span className="mt-1">:</span>
            <div className={`time-box ${isUrgent ? 'urgent' : ''}`}>
                <span className="time-val">{formatNumber(timeLeft.seconds)}</span>
                <span className="time-label">SS</span>
            </div>
        </div>
    );
};


const UserDashboard = ({ theme, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Modals & Flows State
    const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
    const [isProfileComplete, setIsProfileComplete] = useState(false);
    const [isLoanModalOpen, setIsLoanModalOpen] = useState(false);

    const data = USER_MOCK_DATA;

    const toggleRow = (id) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
        } else {
            setExpandedRowId(id);
        }
    };

    const tabs = [
        { id: 'overview', label: 'My Overview', icon: LayoutDashboard },
        { id: 'pending', label: 'Pending Requests', icon: Clock, count: data.pending.length },
        { id: 'active', label: 'Active Loans', icon: Activity, count: data.active.length },
        { id: 'due', label: 'Due Loans', icon: AlertCircle, count: data.due.length },
        { id: 'paid', label: 'Paid Loans', icon: CheckCircle, count: data.paid.length },
    ];

    const getPaymentIcon = (mode) => {
        switch (mode.toLowerCase()) {
            case 'credit card': return <CreditCard size={16} />;
            case 'bank transfer': return <Building size={16} />;
            default: return <Smartphone size={16} />;
        }
    };

    const formatTimestamp = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', ''); // e.g. 02/21/2026 14:22:15
    };

    const renderTableHead = () => {
        return (
            <tr>
                <th>Loan Ref</th>
                <th>Amount</th>
                <th>Status / Due</th>
                <th className="action-col">Details</th>
            </tr>
        );
    };

    const renderTableBody = () => {
        const currentData = data[activeTab];

        if (!currentData || currentData.length === 0) {
            return (
                <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                        No records found.
                    </td>
                </tr>
            );
        }

        return currentData.map((row) => (
            <React.Fragment key={row.id}>
                {/* Compact Row */}
                <tr
                    className={`nav-item-row ${expandedRowId === row.id ? 'expanded' : ''}`}
                    onClick={() => toggleRow(row.id)}
                >
                    <td className="font-mono">{row.id}</td>
                    <td className="amount-cell">{row.amount}</td>

                    <td>
                        {/* Dynamic status column based on tab */}
                        {activeTab === 'pending' && <span className="status-badge pending">{row.status}</span>}
                        {activeTab === 'active' && <span className="status-badge active">{row.status}</span>}
                        {activeTab === 'due' && (
                            <div className="flex-col">
                                <span className="status-badge due">Due Now</span>
                            </div>
                        )}
                        {activeTab === 'paid' && <span className="status-badge paid">{row.status}</span>}
                    </td>

                    <td className="action-col">
                        <button className="expand-btn">
                            {expandedRowId === row.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                        </button>
                    </td>
                </tr>

                {/* Expanded Details Row */}
                {expandedRowId === row.id && (
                    <tr className="expanded-details-row">
                        <td colSpan="4">
                            <div className="expanded-content fade-in">
                                <div className="details-grid">

                                    {activeTab === 'pending' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Date Requested</span>
                                                <span>{row.dateRequested}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Purpose</span>
                                                <span>{row.purpose}</span>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'active' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Issue Date</span>
                                                <span>{row.issueDate}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Interest</span>
                                                <span>{row.interest}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Next Payment</span>
                                                <span>{row.nextPayment}</span>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'due' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Time Remaining</span>
                                                <CountdownTimer targetDateString={row.dueDateString} />
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Penalty</span>
                                                <span className="penalty-cell">{row.penaltyRate}</span>
                                            </div>
                                            <div className="detail-item actions-full">
                                                <button className="btn-verify" style={{ width: 'fit-content' }}>
                                                    Pay Now
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'paid' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Payment Mode</span>
                                                <div className="payment-mode">
                                                    {getPaymentIcon(row.mode)}
                                                    {row.mode}
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Payment Timestamp</span>
                                                <span className="payment-timestamp">{formatTimestamp(row.paymentTimestamp)}</span>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </td>
                    </tr>
                )}
            </React.Fragment>
        ));
    };

    return (
        <div className="user-layout">
            {isSidebarOpen && (
                <div
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 30 }}
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <Activity className="logo-icon" color="var(--primary-color)" />
                        <span className="logo-text">Nexus</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '12px', paddingLeft: '12px' }}>MY LOANS</p>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsSidebarOpen(false);
                            }}
                        >
                            <tab.icon size={20} />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && <span className="badge">{tab.count}</span>}
                        </button>
                    ))}
                </nav>

                <div style={{ padding: '24px 16px', borderTop: '1px solid var(--lp-border-color)' }}>
                    <button className="nav-item" style={{ color: 'var(--error-color)' }}>
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="topbar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', padding: '8px', display: 'none' }}
                            onClick={() => setIsSidebarOpen(true)}
                            className="mobile-menu-btn"
                        >
                            <Menu size={24} />
                        </button>
                        <h1 style={{ fontSize: '20px', fontWeight: 600 }}>Welcome back, John</h1>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                        <button style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--text-secondary)', width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={toggleTheme}>
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="user-profile-widget">
                            <div className="user-avatar">JD</div>
                            <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '8px' }}>
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>John Doe</span>
                                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Standard User</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <div style={{ marginBottom: '32px' }}>
                        <div className="tab-dropdown-container">
                            <button className="tab-dropdown-btn" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    {React.createElement(tabs.find(t => t.id === activeTab)?.icon || Activity, { size: 32, color: 'var(--primary-color)' })}
                                    <span>{tabs.find(t => t.id === activeTab)?.label}</span>
                                </div>
                                {isDropdownOpen ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                            </button>

                            {isDropdownOpen && (
                                <div className="tab-dropdown-menu fade-in">
                                    <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '1px', marginBottom: '8px', paddingLeft: '12px', paddingTop: '8px' }}>NAVIGATE TO</p>
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            className={`dropdown-item ${activeTab === tab.id ? 'active' : ''}`}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setIsDropdownOpen(false);
                                            }}
                                        >
                                            <tab.icon size={20} />
                                            <span>{tab.label}</span>
                                            {tab.count !== undefined && <span className="badge">{tab.count}</span>}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
                            {activeTab === 'overview'
                                ? "Here's a snapshot of your loan activities."
                                : `View your ${activeTab} loans below.`}
                        </p>
                    </div>

                    {activeTab === 'overview' ? (
                        <>
                            {!isProfileComplete ? (
                                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px dashed var(--error-color)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                        <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--error-color)' }}>
                                            <FileText size={48} />
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '20px', marginBottom: '8px', color: 'var(--text-primary)' }}>Profile Registration Required</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px auto' }}>
                                        To unlock full access to loan requests and account features, you need to complete your profile registration.
                                    </p>
                                    <button
                                        onClick={() => setIsRegistrationModalOpen(true)}
                                        style={{ background: 'var(--lp-gradient-primary)', color: 'var(--text-primary)', border: 'none', padding: '12px 24px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 14px rgba(118,53,220,0.3)' }}
                                    >
                                        Complete Registration Now
                                    </button>
                                </div>
                            ) : (
                                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--card-bg)', borderRadius: '16px', border: '1px solid var(--primary-color)', background: 'linear-gradient(180deg, rgba(118, 53, 220, 0.05) 0%, transparent 100%)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                                        <div style={{ background: 'rgba(118, 53, 220, 0.1)', padding: '16px', borderRadius: '50%', color: 'var(--primary-color)' }}>
                                            <Wallet size={48} />
                                        </div>
                                    </div>
                                    <h3 style={{ fontSize: '24px', marginBottom: '8px', color: 'var(--text-primary)' }}>Need a Cash Advance?</h3>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', maxWidth: '450px', margin: '0 auto 24px auto' }}>
                                        Your profile is verified. You can now apply for an instant loan backed by your collateral.
                                    </p>
                                    <button
                                        onClick={() => setIsLoanModalOpen(true)}
                                        style={{ background: 'var(--lp-gradient-primary)', color: 'var(--text-primary)', border: 'none', padding: '14px 28px', borderRadius: '12px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', boxShadow: '0 8px 24px rgba(118,53,220,0.4)', transition: 'transform 0.2s' }}
                                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        Request New Loan
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="table-container">
                            <table className="data-table">
                                <thead>
                                    {renderTableHead()}
                                </thead>
                                <tbody>
                                    {renderTableBody()}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>

            <RegistrationModal
                isOpen={isRegistrationModalOpen}
                onClose={() => setIsRegistrationModalOpen(false)}
                onComplete={() => {
                    setIsProfileComplete(true);
                    setIsRegistrationModalOpen(false);
                }}
            />

            <LoanApplicationModal
                isOpen={isLoanModalOpen}
                onClose={() => setIsLoanModalOpen(false)}
                onComplete={(data) => {
                    alert(`Loan Submitted Successfully!\nPrincipal: MK ${data.amount}\nDuration: ${data.durationWeeks} Weeks`);
                    setIsLoanModalOpen(false);
                }}
            />
        </div>
    );
};

export default UserDashboard;
