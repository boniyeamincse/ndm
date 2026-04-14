import { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Login.css';

export default function Login() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const location = useLocation();
  useScrollReveal();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const from = location.state?.from?.pathname || '/member/dashboard';

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const socialError = params.get('social_error');
    const next = params.get('next');

    if (socialError) {
      setApiError(lang === 'en' ? 'Social login failed. Please try again.' : 'সোশ্যাল লগইন ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
      return;
    }

    if (!token) {
      return;
    }

    localStorage.setItem('ndm_token', token);
    window.dispatchEvent(new Event('auth-changed'));

    if (next === 'profile-setup') {
      navigate('/member/profile-setup', { replace: true });
      return;
    }

    navigate('/member/dashboard', { replace: true });
  }, [location.search, navigate, lang]);

  const handleSocialLogin = provider => {
    window.location.href = `/api/v1/auth/social/${provider.toLowerCase()}/redirect`;
  };

  const handleChange = e => {
    setFieldErrors(fe => ({ ...fe, [e.target.name]: undefined }));
    setApiError(null);
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ login: form.email.trim(), password: form.password }),
      });

      const json = await res.json();

      if (res.ok && json.success !== false) {
        // Persist token and user
        const user = json.data?.user || json.user || {};
        localStorage.setItem('ndm_token', json.data?.token || json.token || '');
        localStorage.setItem('ndm_user', JSON.stringify(user));
        window.dispatchEvent(new Event('auth-changed'));
        setSuccess(true);

        // Route admins to the admin dashboard, members to member dashboard
        const adminRoles = ['superadmin', 'admin', 'moderator'];
        const userRoles = Array.isArray(user.roles) ? user.roles : [user.role_type].filter(Boolean);
        const isAdmin = userRoles.some(r => adminRoles.includes(r));
        const destination = isAdmin
          ? '/admin/dashboard'
          : from === '/admin/dashboard' ? '/member/dashboard' : from;
        setTimeout(() => navigate(destination, { replace: true }), 800);
      } else if (res.status === 422) {
        const errs = json.errors || {};
        const mapped = {};
        if (errs.login) mapped.email = errs.login[0];
        if (errs.email) mapped.email = errs.email[0];
        if (errs.password) mapped.password = errs.password[0];
        setFieldErrors(mapped);
        setApiError(json.message || (lang === 'en' ? 'Please correct the errors below.' : 'নিচের ত্রুটিগুলি সংশোধন করুন।'));
      } else if (res.status === 401 || res.status === 403) {
        setApiError(
          json.message ||
          (lang === 'en' ? 'Invalid credentials. Please try again.' : 'ভুল তথ্য। আবার চেষ্টা করুন।'),
        );
      } else {
        setApiError(
          json.message ||
          (lang === 'en' ? 'Something went wrong. Please try again.' : 'কিছু একটা ভুল হয়েছে। আবার চেষ্টা করুন।'),
        );
      }
    } catch {
      setApiError(
        lang === 'en'
          ? 'Network error. Please check your connection and try again.'
          : 'নেটওয়ার্ক ত্রুটি। আপনার সংযোগ পরীক্ষা করুন এবং আবার চেষ্টা করুন।',
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
            <span>{t('login_title')}</span>
          </div>
          <h1>{t('login_title')}</h1>
          <p>{t('login_sub')}</p>
        </div>
      </section>

      <section className="section-pad login-section">
        <div className="container">
          <div className="login-card card reveal">

            {success ? (
              <div className="login-success">
                <CheckCircle2 size={48} color="var(--clr-primary)" />
                <h3>{lang === 'en' ? 'Login successful!' : 'লগইন সফল হয়েছে!'}</h3>
                <p>{lang === 'en' ? 'Redirecting you…' : 'রিডাইরেক্ট হচ্ছে…'}</p>
              </div>
            ) : (
              <>
                <div className="login-header">
                  <div className="login-icon">
                    <LogIn size={28} />
                  </div>
                  <h2>{t('login_title')}</h2>
                  <p className="login-desc">{t('login_desc')}</p>
                </div>

                {apiError && (
                  <div className="form-alert form-alert--error">
                    <AlertCircle size={16} />
                    <span>{apiError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="login-form" noValidate>
                  <div className="form-group">
                    <label htmlFor="login-email">{t('login_email')} *</label>
                    <input
                      id="login-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      className={`form-control${fieldErrors.email ? ' form-control--error' : ''}`}
                      value={form.email}
                      onChange={handleChange}
                      required
                      placeholder="example@email.com"
                    />
                    {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">{t('login_password')} *</label>
                    <div className="pw-wrap">
                      <input
                        id="login-password"
                        name="password"
                        type={showPw ? 'text' : 'password'}
                        autoComplete="current-password"
                        className={`form-control${fieldErrors.password ? ' form-control--error' : ''}`}
                        value={form.password}
                        onChange={handleChange}
                        required
                        placeholder={lang === 'en' ? 'Your password' : 'আপনার পাসওয়ার্ড'}
                      />
                      <button
                        type="button"
                        className="pw-toggle"
                        onClick={() => setShowPw(s => !s)}
                        aria-label={showPw ? 'Hide password' : 'Show password'}
                      >
                        {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
                  </div>

                  <div className="login-meta">
                    <Link to="/forgot-password" className="login-forgot">
                      {t('login_forgot')}
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg login-btn"
                    disabled={loading}
                  >
                    {loading
                      ? (lang === 'en' ? 'Signing in…' : 'সাইন ইন হচ্ছে…')
                      : <>{t('login_submit')} <LogIn size={18} /></>}
                  </button>
                </form>

                <div className="join-simple-divider" style={{ marginTop: '1rem' }}>
                  <span>{lang === 'en' ? 'or continue with' : 'অথবা চালিয়ে যান'}</span>
                </div>
                <div className="social-login-grid">
                  <button type="button" className="btn btn-outline social-btn" onClick={() => handleSocialLogin('Google')}>
                    Google
                  </button>
                  <button type="button" className="btn btn-outline social-btn" onClick={() => handleSocialLogin('Facebook')}>
                    Facebook
                  </button>
                </div>

                <p className="login-signup">
                  {t('login_no_account')}{' '}
                  <Link to="/join">{t('login_join_link')}</Link>
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
