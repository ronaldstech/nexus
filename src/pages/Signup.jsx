import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, UserPlus } from 'lucide-react';

export default function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSignup = (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        console.log('Signup attempt:', { email, password });
    };

    const handleGoogleSignup = () => {
        console.log('Google Sign-Up clicked');
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="icon-wrapper">
                        <UserPlus size={32} />
                    </div>
                    <h1>Create Account</h1>
                    <p>Join us today! Please enter your details.</p>
                </div>

                <form onSubmit={handleSignup} className="auth-form">
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-with-icon">
                            <Mail className="input-icon" size={20} />
                            <input
                                type="email"
                                id="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <div className="input-with-icon">
                            <Lock className="input-icon" size={20} />
                            <input
                                type="password"
                                id="confirmPassword"
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    <button type="submit" className="primary-btn">Sign Up</button>
                </form>

                <div className="divider">
                    <span>or sign up with</span>
                </div>

                <button onClick={handleGoogleSignup} className="google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="google-logo" />
                    Google
                </button>

                <p className="auth-footer">
                    Already have an account? <Link to="/" className="auth-link">Sign in</Link>
                </p>
            </div>
        </div>
    );
}
