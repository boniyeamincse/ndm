import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, AlertCircle, Mail, Lock, UserPlus } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Join.css';

export default function Join() {
  const { t, lang } = useLang();
  const navigate = useNavigate();
  useScrollReveal();

  const [form, setForm] = useState({ email: '', password: '', password_confirmation: '' });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = e => {
    setFieldErrors(fe => ({ ...fe, [e.target.name]: undefined }));
    setApiError(null);
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSocialLogin = provider => {
    window.location.href = `/api/v1/auth/social/${provider.toLowerCase()}/redirect`;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setApiError(null);
    setFieldErrors({});

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
          password_confirmation: form.password_confirmation,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success !== false) {
        localStorage.setItem('ndm_token', json.data?.token || '');
        localStorage.setItem('ndm_user', JSON.stringify(json.data?.user || {}));
        window.dispatchEvent(new Event('auth-changed'));
        navigate('/member/profile-setup', { replace: true });
        return;
      }

      if (res.status === 422) {
        const errs = json.errors || {};
        setFieldErrors({
          email: errs.email?.[0],
          password: errs.password?.[0],
          password_confirmation: errs.password_confirmation?.[0],
        });
      }

      setApiError(
        json.message ||
          (lang === 'en'
            ? 'Could not create account. Please try again.'
            : 'অ্যাকাউন্ট তৈরি করা যায়নি। আবার চেষ্টা করুন।'),
      );
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
            <span>{t('nav_join')}</span>
          </div>
          <h1>{lang === 'en' ? 'Create Your Account' : 'আপনার অ্যাকাউন্ট তৈরি করুন'}</h1>
          <p>
            {lang === 'en'
              ? 'Easy registration: email and password first, profile details later.'
              : 'সহজ রেজিস্ট্রেশন: আগে ইমেইল ও পাসওয়ার্ড, পরে প্রোফাইল তথ্য পূরণ করুন।'}
          </p>
        </div>
      </section>

      <section className="section-pad join-simple-section">
        <div className="container">
          <div className="join-simple-card card reveal">
            <div className="join-simple-head">
              <div className="join-simple-icon">
                <UserPlus size={28} />
              </div>
              <h2>{lang === 'en' ? 'Quick Registration' : 'দ্রুত রেজিস্ট্রেশন'}</h2>
              <p>
                {lang === 'en'
                  ? 'Create account now. Complete your full member profile right after signup.'
                  : 'এখন অ্যাকাউন্ট তৈরি করুন। সাইনআপের পরেই পূর্ণ প্রোফাইল সম্পন্ন করুন।'}
              </p>
            </div>

            {(apiError || fieldErrors._form) && (
              <div className="form-alert form-alert--error">
                <AlertCircle size={16} />
                <span>{fieldErrors._form || apiError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="join-simple-form" noValidate>
              <div className="form-group">
                <label htmlFor="join-email">{t('join_email')} *</label>
                <div className="input-icon-wrap">
                  <Mail size={16} />
                  <input
                    id="join-email"
                    name="email"
                    type="email"
                    className="form-control"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="example@email.com"
                  />
                </div>
                {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="join-password">{lang === 'en' ? 'Password' : 'পাসওয়ার্ড'} *</label>
                <div className="input-icon-wrap">
                  <Lock size={16} />
                  <input
                    id="join-password"
                    name="password"
                    type="password"
                    className="form-control"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder={lang === 'en' ? 'Minimum 8 characters' : 'কমপক্ষে ৮ অক্ষর'}
                  />
                </div>
                {fieldErrors.password && <span className="field-error">{fieldErrors.password}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="join-password-confirm">{lang === 'en' ? 'Confirm Password' : 'পাসওয়ার্ড নিশ্চিত করুন'} *</label>
                <div className="input-icon-wrap">
                  <Lock size={16} />
                  <input
                    id="join-password-confirm"
                    name="password_confirmation"
                    type="password"
                    className="form-control"
                    value={form.password_confirmation}
                    onChange={handleChange}
                    required
                    placeholder={lang === 'en' ? 'Re-enter password' : 'পাসওয়ার্ড আবার লিখুন'}
                  />
                </div>
                {fieldErrors.password_confirmation && (
                  <span className="field-error">{fieldErrors.password_confirmation}</span>
                )}
              </div>

              <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                {loading
                  ? (lang === 'en' ? 'Creating account...' : 'অ্যাকাউন্ট তৈরি হচ্ছে...')
                  : <>{lang === 'en' ? 'Create Account' : 'অ্যাকাউন্ট তৈরি করুন'} <ArrowRight size={18} /></>}
              </button>
            </form>

            <div className="join-simple-divider">
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

            <p className="join-simple-foot">
              {lang === 'en' ? 'Already have an account?' : 'ইতিমধ্যে অ্যাকাউন্ট আছে?'}{' '}
              <Link to="/login">{t('nav_login')}</Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
