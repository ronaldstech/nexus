import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, User, Sun, Moon } from 'lucide-react';

export default function Login({ theme, toggleTheme }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        console.log('Login attempt:', { email, password });
    };

    const handleGoogleSignIn = () => {
        console.log('Google Sign-In clicked');
    };

    return (
        <div className="auth-container">
            <button className="global-theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <div className="auth-card">
                <div className="auth-header">
                    <div className="icon-wrapper">
                        <User size={32} />
                    </div>
                    <h1>Welcome Back</h1>
                    <p>Please enter your details to sign in.</p>
                </div>

                <form onSubmit={handleLogin} className="auth-form">
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
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-options">
                        <label className="remember-me">
                            <input type="checkbox" />
                            <span>Remember me</span>
                        </label>
                        <a href="#" className="forgot-password">Forgot password?</a>
                    </div>

                    <button type="submit" className="primary-btn">Sign In</button>
                </form>

                <div className="divider">
                    <span>or continue with</span>
                </div>

                <button onClick={handleGoogleSignIn} className="google-btn">
                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google logo" className="google-logo" />
                    Google
                </button>

                <p className="auth-footer">
                    Don't have an account? <Link to="/signup" className="auth-link">Sign up</Link>
                </p>
            </div>
        </div>
    );
}
