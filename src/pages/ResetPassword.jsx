import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { KeyRound, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Login.css';
import './AuthPassword.css';

export default function ResetPassword() {
  const { t, lang } = useLang();
  const location = useLocation();
  const navigate = useNavigate();
  useScrollReveal();

  const [form, setForm] = useState({
    email: '',
    token: '',
    password: '',
    password_confirmation: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token') || '';
    const email = params.get('email') || '';
    if (!token && !email) {
      return;
    }
    setForm(prev => ({ ...prev, token: prev.token || token, email: prev.email || email }));
  }, [location.search]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFieldErrors(prev => ({ ...prev, [name]: undefined }));
    setApiError(null);
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setFieldErrors({});
    setSuccessMessage('');

    try {
      const res = await fetch('/api/v1/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          token: form.token.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        const message = json.message || (lang === 'en'
          ? 'Password has been reset successfully. Redirecting to login...'
          : 'পাসওয়ার্ড সফলভাবে রিসেট হয়েছে। লগইনে নেওয়া হচ্ছে...');
        setSuccessMessage(message);
        setTimeout(() => navigate('/login?reset=success', { replace: true }), 1100);
        return;
      }

      if (res.status === 422) {
        const errs = json.errors || {};
        setFieldErrors({
          email: errs.email?.[0],
          token: errs.token?.[0],
          password: errs.password?.[0],
          password_confirmation: errs.password_confirmation?.[0],
        });
        setApiError(json.message || (lang === 'en'
          ? 'Please fix the highlighted fields.'
          : 'হাইলাইট করা ঘরগুলো ঠিক করুন।'));
        return;
      }

      setApiError(
        json.message ||
        (lang === 'en'
          ? 'Could not reset password. Please try again.'
          : 'পাসওয়ার্ড রিসেট করা যায়নি। আবার চেষ্টা করুন।'),
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
            <span>{lang === 'en' ? 'Reset Password' : 'পাসওয়ার্ড রিসেট'}</span>
          </div>
          <h1>{lang === 'en' ? 'Reset Password' : 'পাসওয়ার্ড রিসেট'}</h1>
          <p>
            {lang === 'en'
              ? 'Enter your token, account email, and your new password.'
              : 'টোকেন, ইমেইল এবং নতুন পাসওয়ার্ড দিন।'}
          </p>
        </div>
      </section>

      <section className="section-pad login-section auth-password-section">
        <div className="container">
          <div className="login-card card reveal auth-password-card">
            <div className="login-header">
              <div className="login-icon">
                <KeyRound size={28} />
              </div>
              <h2>{lang === 'en' ? 'Set New Password' : 'নতুন পাসওয়ার্ড সেট করুন'}</h2>
              <p className="login-desc">
                {lang === 'en'
                  ? 'Use the reset token from your email to securely set a new password.'
                  : 'ইমেইল থেকে পাওয়া টোকেন ব্যবহার করে নিরাপদে নতুন পাসওয়ার্ড সেট করুন।'}
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
                <label htmlFor="reset-email">{t('login_email')} *</label>
                <input
                  id="reset-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`form-control${fieldErrors.email ? ' form-control--error' : ''}`}
                  value={form.email}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reset-token">{lang === 'en' ? 'Reset Token' : 'রিসেট টোকেন'} *</label>
                <input
                  id="reset-token"
                  name="token"
                  type="text"
                  className={`form-control${fieldErrors.token ? ' form-control--error' : ''}`}
                  value={form.token}
                  onChange={handleChange}
                  required
                />
                {fieldErrors.token && <span className="field-error">{fieldErrors.token}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reset-password">{lang === 'en' ? 'New Password' : 'নতুন পাসওয়ার্ড'} *</label>
                <div className="pw-wrap">
                  <input
                    id="reset-password"
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`form-control${fieldErrors.password ? ' form-control--error' : ''}`}
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowPw(prev => !prev)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="reset-password-confirm">{lang === 'en' ? 'Confirm Password' : 'পাসওয়ার্ড নিশ্চিত করুন'} *</label>
                <div className="pw-wrap">
                  <input
                    id="reset-password-confirm"
                    name="password_confirmation"
                    type={showConfirmPw ? 'text' : 'password'}
                    autoComplete="new-password"
                    className={`form-control${fieldErrors.password_confirmation ? ' form-control--error' : ''}`}
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="pw-toggle"
                    onClick={() => setShowConfirmPw(prev => !prev)}
                    aria-label={showConfirmPw ? 'Hide confirmation password' : 'Show confirmation password'}
                  >
                    {showConfirmPw ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {fieldErrors.password_confirmation && <span className="field-error">{fieldErrors.password_confirmation}</span>}
              </div>

              <button type="submit" className="btn btn-primary btn-lg login-btn" disabled={loading}>
                {loading
                  ? (lang === 'en' ? 'Resetting password...' : 'পাসওয়ার্ড রিসেট হচ্ছে...')
                  : (lang === 'en' ? 'Reset Password' : 'পাসওয়ার্ড রিসেট করুন')}
              </button>
            </form>

            <div className="auth-password-links">
              <Link to="/forgot-password">{lang === 'en' ? 'Need a reset link?' : 'রিসেট লিংক দরকার?'}</Link>
              <Link to="/login">{lang === 'en' ? 'Back to login' : 'লগইনে ফিরে যান'}</Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
