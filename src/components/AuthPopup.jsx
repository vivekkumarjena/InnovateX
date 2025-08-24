import React, { useState } from 'react';
import './AuthPopup.css';
import { useAuth } from '../context/AuthContext';

const AuthPopup = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const { login, register } = useAuth();

  const onChange = (e) => setForm({ ...form, [e.target.id]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setSubmitting(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        if (form.password !== form.confirmPassword) throw new Error('Passwords do not match');
        await register(form.fullName, form.email, form.password);
      }
      onClose();
    } catch (error) {
      setErr(error?.response?.data?.message || error.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-popup-overlay">
      <div className="auth-popup">
        <button className="close-btn" onClick={onClose}>×</button>

        {isLogin ? (
          <div className="auth-form">
            <h2>Login</h2>
            <p>Welcome Back! Login to continue to your account</p>

            {err && <p className="error">{err}</p>}

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email ID</label>
                <input type="email" id="email" placeholder="Enter your email" value={form.email} onChange={onChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Enter your password" value={form.password} onChange={onChange} required />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Logging in...' : 'Login'}</button>
            </form>

            <p className="auth-switch">
              Don't have an account?{' '}
              <span onClick={() => setIsLogin(false)}>Sign Up</span>
            </p>
          </div>
        ) : (
          <div className="auth-form">
            <h2>Sign Up</h2>
            <p>Create a new account to get started</p>

            {err && <p className="error">{err}</p>}

            <form onSubmit={onSubmit}>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input type="text" id="fullName" placeholder="Enter your full name" value={form.fullName} onChange={onChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email ID</label>
                <input type="email" id="email" placeholder="Enter your email" value={form.email} onChange={onChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" placeholder="Create a password" value={form.password} onChange={onChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" placeholder="Confirm your password" value={form.confirmPassword} onChange={onChange} required />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>{submitting ? 'Creating...' : 'Sign Up'}</button>
            </form>

            <p className="auth-switch">
              Already have an account?{' '}
              <span onClick={() => setIsLogin(true)}>Login</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthPopup;