import React from 'react';
import { Link } from 'react-router-dom';
import {
    Sun, Moon, Shield, Clock, Banknote,
    ArrowRight
} from 'lucide-react';
import './LandingPage.css';

export default function LandingPage({ theme, toggleTheme }) {

    return (
        <div className="lp-wrapper">
            {/* Navbar */}
            <nav className="lp-navbar">
                <div className="lp-container lp-nav-content">
                    <div className="lp-brand">
                        <Shield className="lp-brand-icon" size={28} />
                        <span>Nexus</span>
                    </div>
                    <div className="lp-nav-actions">
                        <button className="lp-theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </button>
                        <Link to="/login" className="lp-secondary-btn">Log In</Link>
                        <Link to="/signup" className="lp-primary-btn">Apply Now</Link>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="lp-hero">
                <div className="lp-hero-bg-gradient"></div>
                <div className="lp-container lp-hero-content">
                    <h1>
                        Empower Your <br />
                        <span className="lp-gradient-text">Financial Future</span>
                    </h1>
                    <p>
                        Nexus provides fast, flexible, and fair personal loans. Get the funding you need today to achieve your goals tomorrow.
                    </p>
                    <div className="lp-hero-actions">
                        <Link to="/signup" className="lp-primary-btn">
                            Get Started
                            <ArrowRight size={18} />
                        </Link>
                        <button className="lp-secondary-btn">View Rates</button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="lp-features">
                <div className="lp-container">
                    <h2 className="lp-section-title">Why Choose Nexus?</h2>
                    <p className="lp-section-subtitle">We've reimagined lending to put your needs first, delivering a seamless experience from application to repayment.</p>

                    <div className="lp-features-grid">
                        <div className="lp-feature-card">
                            <div className="lp-feature-icon-wrapper">
                                <Clock size={28} />
                            </div>
                            <h3>Fast Approval</h3>
                            <p>Get a decision in minutes. Our advanced technology ensures your application is processed quickly and efficiently.</p>
                        </div>

                        <div className="lp-feature-card">
                            <div className="lp-feature-icon-wrapper">
                                <Banknote size={28} />
                            </div>
                            <h3>Low Interest Rates</h3>
                            <p>We offer highly competitive rates tailored to your credit profile, saving you money over the life of your loan.</p>
                        </div>

                        <div className="lp-feature-card">
                            <div className="lp-feature-icon-wrapper">
                                <Shield size={28} />
                            </div>
                            <h3>Secure & Private</h3>
                            <p>Your data is protected with bank-level encryption. We prioritize your privacy and never sell your information.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="lp-how-it-works">
                <div className="lp-container">
                    <h2 className="lp-section-title">How It Works</h2>
                    <p className="lp-section-subtitle">Securing a loan with Nexus is straightforward and transparent. Just three simple steps.</p>

                    <div className="lp-steps-list">
                        <div className="lp-step-item">
                            <div className="lp-step-number">1</div>
                            <div className="lp-step-content">
                                <h3>Check Your Rate</h3>
                                <p>Fill out a brief online form to see what you qualify for without affecting your credit score.</p>
                            </div>
                        </div>

                        <div className="lp-step-item">
                            <div className="lp-step-number">2</div>
                            <div className="lp-step-content">
                                <h3>Choose Your Terms</h3>
                                <p>Select the loan amount and repayment schedule that best fits your monthly budget.</p>
                            </div>
                        </div>

                        <div className="lp-step-item">
                            <div className="lp-step-number">3</div>
                            <div className="lp-step-content">
                                <h3>Receive Funds</h3>
                                <p>Once approved, the funds are deposited directly into your bank account, often within 24 hours.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="lp-cta-section">
                <div className="lp-container">
                    <h2 className="lp-section-title">Ready to take control?</h2>
                    <p className="lp-section-subtitle">Join thousands of members who trust Nexus for their financing needs.</p>
                    <Link to="/signup" className="lp-primary-btn">
                        Apply Now
                        <ArrowRight size={18} />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="lp-footer">
                <div className="lp-container lp-footer-content">
                    <div className="lp-footer-brand">
                        <Shield className="lp-brand-icon" size={24} />
                        <span>Nexus</span>
                    </div>
                    <div className="lp-footer-links">
                        <a href="#">About Us</a>
                        <a href="#">Rates & Terms</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Contact Support</a>
                    </div>
                    <div className="lp-footer-bottom">
                        <p>&copy; {new Date().getFullYear()} Nexus Financial Inc. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
