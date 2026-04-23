import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Login.css';
import './AuthPassword.css';

export default function ForgotPassword() {
  const { t, lang } = useLang();
  useScrollReveal();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setSuccessMessage('');

    try {
      const res = await fetch('/api/v1/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        setSuccessMessage(
          json.message ||
          (lang === 'en'
            ? 'If your email exists in our system, a reset link has been sent.'
            : 'আপনার ইমেইল আমাদের সিস্টেমে থাকলে একটি রিসেট লিংক পাঠানো হয়েছে।'),
        );
        return;
      }

      if (res.status === 422 && json.errors?.email?.[0]) {
        setApiError(json.errors.email[0]);
        return;
      }

      setApiError(
        json.message ||
        (lang === 'en'
          ? 'Unable to send reset link right now. Please try again.'
          : 'এই মুহূর্তে রিসেট লিংক পাঠানো যাচ্ছে না। আবার চেষ্টা করুন।'),
      );
    } catch {
      setApiError(
        lang === 'en'
          ? 'Network error. Please check your connection and try again.'
          : 'নেটওয়ার্ক ত্রুটি। সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{lang === 'en' ? 'Forgot Password' : 'পাসওয়ার্ড ভুলে গেছেন'}</span>
          </div>
          <h1>{lang === 'en' ? 'Forgot Password' : 'পাসওয়ার্ড ভুলে গেছেন'}</h1>
          <p>
            {lang === 'en'
              ? 'Enter your account email and we will send a password reset link.'
              : 'আপনার অ্যাকাউন্ট ইমেইল দিন, আমরা পাসওয়ার্ড রিসেট লিংক পাঠাবো।'}
          </p>
        </div>
      </section>

      <section className="section-pad login-section auth-password-section">
        <div className="container">
          <div className="login-card card reveal auth-password-card">
            <div className="login-header">
              <div className="login-icon">
                <Mail size={28} />
              </div>
              <h2>{lang === 'en' ? 'Reset Password Link' : 'রিসেট লিংক পাঠান'}</h2>
              <p className="login-desc">
                {lang === 'en'
                  ? 'We will send a secure reset link to your email.'
                  : 'আপনার ইমেইলে একটি নিরাপদ রিসেট লিংক পাঠানো হবে।'}
              </p>
            </div>

            {apiError && (
              <div className="form-alert form-alert--error">
                <AlertCircle size={16} />
                <span>{apiError}</span>
              </div>
            )}

            {successMessage && (
              <div className="form-alert form-alert--success">
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="form-group">
                <label htmlFor="forgot-email">{t('login_email')} *</label>
                <input
                  id="forgot-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className="form-control"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="example@email.com"
                />
              </div>

              <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
                {loading
                  ? (lang === 'en' ? 'Sending link...' : 'লিংক পাঠানো হচ্ছে...')
                  : <>{lang === 'en' ? 'Send Reset Link' : 'রিসেট লিংক পাঠান'} <Send size={18} /></>}
              </button>
            </form>

            <div className="auth-password-links">
              <Link to="/login">{lang === 'en' ? 'Back to login' : 'লগইনে ফিরে যান'}</Link>
              <Link to="/reset-password">{lang === 'en' ? 'Have a reset token?' : 'রিসেট টোকেন আছে?'}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
