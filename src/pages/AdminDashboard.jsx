import React, { useState, useMemo } from 'react';
import {
    LayoutDashboard,
    Clock,
    Activity,
    AlertCircle,
    CheckCircle,
    Moon,
    Sun,
    LogOut,
    Search,
    Check,
    CreditCard,
    Menu,
    X,
    ChevronDown,
    ChevronUp,
    BarChart3,
    TrendingUp,
    Users
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip, // Renamed to avoid confusion with potential UI Tooltips
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import './AdminDashboard.css';

// Mock Data
const MOCK_DATA = {
    pending: [
        { id: 'req_001', user: 'Alice Smith', amount: '$5,000', dateRequested: '2026-02-20', purpose: 'Home Renovation', status: 'Pending' },
        { id: 'req_002', user: 'Bob Johnson', amount: '$1,200', dateRequested: '2026-02-21', purpose: 'Car Repair', status: 'Pending' },
        { id: 'req_003', user: 'Charlie Davis', amount: '$10,000', dateRequested: '2026-02-22', purpose: 'Business Expansion', status: 'Pending' },
    ],
    active: [
        { id: 'act_001', user: 'Diana Prince', amount: '$3,500', issueDate: '2025-10-15', interest: '5%', nextPayment: '2026-03-15', status: 'Active' },
        { id: 'act_002', user: 'Evan Wright', amount: '$8,000', issueDate: '2025-11-20', interest: '4.5%', nextPayment: '2026-03-20', status: 'Active' },
    ],
    due: [
        { id: 'due_001', user: 'Fiona Gallagher', amount: '$2,000', dueDate: '2026-02-18', daysOverdue: 4, penalty: '$50', status: 'Due' },
        { id: 'due_002', user: 'George Martin', amount: '$4,500', dueDate: '2026-02-20', daysOverdue: 2, penalty: '$25', status: 'Due' },
    ],
    paid: [
        { id: 'pd_001', user: 'Hannah Abbott', amount: '$1,500', paymentMode: 'Bank Transfer', paymentDate: '2026-02-15', verified: true, status: 'Paid' },
        { id: 'pd_002', user: 'Ian Malcolm', amount: '$3,000', paymentMode: 'Credit Card', paymentDate: '2026-02-21', verified: false, status: 'Paid' },
        { id: 'pd_003', user: 'Julia Child', amount: '$5,000', paymentMode: 'Mobile Money', paymentDate: '2026-02-22', verified: false, status: 'Paid' },
    ]
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

const AdminDashboard = ({ theme, toggleTheme }) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [data, setData] = useState(MOCK_DATA);
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [expandedRowId, setExpandedRowId] = useState(null);

    const toggleRow = (id) => {
        if (expandedRowId === id) {
            setExpandedRowId(null);
        } else {
            setExpandedRowId(id);
        }
    };

    const handleVerify = (id) => {
        setData((prev) => ({
            ...prev,
            paid: prev.paid.map(loan =>
                loan.id === id ? { ...loan, verified: true } : loan
            )
        }));
    };

    const getFilteredData = (tabData) => {
        return tabData.filter(item =>
            item.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.amount.includes(searchTerm)
        );
    };

    const tabs = [
        { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
        { id: 'pending', label: 'Pending Requests', icon: Clock, count: data.pending.length },
        { id: 'active', label: 'Active Loans', icon: Activity, count: data.active.length },
        { id: 'due', label: 'Due Loans', icon: AlertCircle, count: data.due.length },
        { id: 'paid', label: 'Paid Loans', icon: CheckCircle, count: data.paid.length },
    ];

    // Compute stats for overview
    const stats = useMemo(() => {
        const parseAmount = (str) => parseFloat(str.replace(/[^0-9.-]+/g, ""));

        let totalActiveAmount = 0;
        data.active.forEach(item => totalActiveAmount += parseAmount(item.amount));

        let totalPaidAmount = 0;
        data.paid.forEach(item => totalPaidAmount += parseAmount(item.amount));

        const barData = [
            { name: 'Pending', value: data.pending.map(i => parseAmount(i.amount)).reduce((a, b) => a + b, 0) },
            { name: 'Active', value: totalActiveAmount },
            { name: 'Due', value: data.due.map(i => parseAmount(i.amount)).reduce((a, b) => a + b, 0) },
            { name: 'Paid', value: totalPaidAmount }
        ];

        // Group pending requests by purpose for pie chart
        const purposeCount = {};
        data.pending.forEach(req => {
            purposeCount[req.purpose] = (purposeCount[req.purpose] || 0) + 1;
        });
        const pieData = Object.keys(purposeCount).map(key => ({
            name: key,
            value: purposeCount[key]
        }));

        return { totalActiveAmount, totalPaidAmount, barData, pieData };
    }, [data]);

    const renderOverview = () => {
        return (
            <div className="overview-container fade-in">
                {/* KPI Cards */}
                <div className="kpi-grid">
                    <div className="kpi-card">
                        <div className="kpi-icon-box active-box">
                            <TrendingUp size={24} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-title">Active Loan Volume</span>
                            <span className="kpi-value">${stats.totalActiveAmount.toLocaleString()}</span>
                            <span className="kpi-trend positive">+12% from last month</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon-box pending-box">
                            <Users size={24} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-title">Pending Requests</span>
                            <span className="kpi-value">{data.pending.length}</span>
                            <span className="kpi-trend neutral">Requires review</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon-box paid-box">
                            <CheckCircle size={24} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-title">Total Repaid</span>
                            <span className="kpi-value">${stats.totalPaidAmount.toLocaleString()}</span>
                            <span className="kpi-trend positive">+5% from last month</span>
                        </div>
                    </div>

                    <div className="kpi-card">
                        <div className="kpi-icon-box due-box">
                            <AlertCircle size={24} />
                        </div>
                        <div className="kpi-info">
                            <span className="kpi-title">Overdue Loans</span>
                            <span className="kpi-value">{data.due.length}</span>
                            <span className="kpi-trend negative">Action needed</span>
                        </div>
                    </div>
                </div>

                {/* Charts Area */}
                <div className="charts-grid">
                    {/* Bar Chart: Loan Volume by Status */}
                    <div className="chart-card">
                        <h3 className="chart-title"><BarChart3 size={18} className="mr-2 inline" /> Loan Volume by Status</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--lp-border-color)" />
                                    <XAxis dataKey="name" tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                    <YAxis tickFormatter={(val) => `$${val / 1000}k`} tick={{ fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--lp-border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                        formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                                    />
                                    <Bar dataKey="value" fill="var(--accent-color)" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Pie Chart: Request Purposes */}
                    <div className="chart-card">
                        <h3 className="chart-title">Pending Request Purposes</h3>
                        <div className="chart-wrapper">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={stats.pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {stats.pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--lp-border-color)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="chart-legend">
                            {stats.pieData.map((entry, index) => (
                                <div key={entry.name} className="legend-item">
                                    <div className="legend-color" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                                    <span className="legend-text">{entry.name} ({entry.value})</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTableHead = () => {
        return (
            <tr>
                <th>Borrower</th>
                <th>Amount</th>
                <th>Status / Due</th>
                <th className="action-col">Details</th>
            </tr>
        );
    };

    const renderTableBody = () => {
        const currentData = getFilteredData(data[activeTab]);

        if (currentData.length === 0) {
            return (
                <tr>
                    <td colSpan="8" className="empty-state">
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
                    <td className="font-medium">{row.user}</td>
                    <td className="amount-cell">{row.amount}</td>

                    <td>
                        {/* Dynamic status/due column based on tab */}
                        {activeTab === 'pending' && <span className="status-badge pending">{row.status}</span>}
                        {activeTab === 'active' && <span className="status-badge active">{row.status}</span>}
                        {activeTab === 'due' && (
                            <div className="flex-col">
                                <span className="status-badge due">{row.status}</span>
                                <span className="overdue-days mt-1">{row.daysOverdue} days</span>
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
                                    <div className="detail-item">
                                        <span className="detail-label">Loan ID</span>
                                        <span className="font-mono">{row.id}</span>
                                    </div>

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
                                            <div className="detail-item actions-full">
                                                <div className="action-buttons">
                                                    <button className="btn-approve">Approve Request</button>
                                                    <button className="btn-reject">Reject Request</button>
                                                </div>
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
                                                <span className="detail-label">Due Date</span>
                                                <span className="due-date">{row.dueDate}</span>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Penalty</span>
                                                <span className="penalty-cell">{row.penalty}</span>
                                            </div>
                                            <div className="detail-item actions-full">
                                                <button className="btn-remind">Send Reminder to {row.user}</button>
                                            </div>
                                        </>
                                    )}

                                    {activeTab === 'paid' && (
                                        <>
                                            <div className="detail-item">
                                                <span className="detail-label">Payment Mode</span>
                                                <div className="payment-mode">
                                                    <CreditCard size={14} className="mr-1" />
                                                    {row.paymentMode}
                                                </div>
                                            </div>
                                            <div className="detail-item">
                                                <span className="detail-label">Payment Date</span>
                                                <span>{row.paymentDate}</span>
                                            </div>
                                            <div className="detail-item actions-full">
                                                {row.verified ? (
                                                    <span className="verified-badge"><Check size={14} /> Payment Verified</span>
                                                ) : (
                                                    <button onClick={() => handleVerify(row.id)} className="btn-verify">
                                                        Verify this Payment
                                                    </button>
                                                )}
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
        <div className="admin-layout">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo-container">
                        <LayoutDashboard className="logo-icon" />
                        <span className="logo-text">Nexus Admin</span>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <p className="nav-label">LOAN MANAGEMENT</p>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => {
                                setActiveTab(tab.id);
                                setIsSidebarOpen(false); // Close sidebar on mobile after selecting
                            }}
                        >
                            <tab.icon className="nav-icon" />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && <span className="badge">{tab.count}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <button className="nav-item text-error">
                        <LogOut className="nav-icon" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="main-content">
                <header className="topbar">
                    <div className="topbar-left">
                        <button
                            className="mobile-menu-btn"
                            onClick={() => setIsSidebarOpen(true)}
                            aria-label="Open menu"
                        >
                            <Menu size={24} />
                        </button>
                        <div className="search-bar">
                            <Search className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by user or amount..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="topbar-actions">
                        <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="Toggle theme">
                            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                        <div className="admin-profile">
                            <div className="avatar">A</div>
                            <div className="admin-info">
                                <span className="admin-name">Admin User</span>
                                <span className="admin-role">Super Admin</span>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="content-area">
                    <div className="page-header">
                        <h2>{tabs.find(t => t.id === activeTab)?.label}</h2>
                        {activeTab === 'overview' ? (
                            <p className="subtitle">Welcome back. Here is your platform's summary today.</p>
                        ) : (
                            <p className="subtitle">Manage and monitor {activeTab} loan segments.</p>
                        )}
                    </div>

                    {activeTab === 'overview' ? (
                        renderOverview()
                    ) : (
                        <div className="table-container fade-in">
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
        </div>
    );
};

export default AdminDashboard;
