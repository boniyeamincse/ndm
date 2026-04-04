import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Users, Lightbulb, Globe, Award, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Join.css';

const BENEFITS = [
  { icon: <Users size={24} />, en: 'Connect with 12,000+ like-minded student activists', bn: '১২,০০০+ সমমনা ছাত্র কর্মীর সাথে সংযুক্ত হন' },
  { icon: <Lightbulb size={24} />, en: 'Access leadership training, workshops & seminars', bn: 'নেতৃত্ব প্রশিক্ষণ, কর্মশালা ও সেমিনারে অ্যাক্সেস পান' },
  { icon: <Globe size={24} />, en: 'Participate in national campaigns & rallies', bn: 'জাতীয় আন্দোলন ও সমাবেশে অংশগ্রহণ করুন' },
  { icon: <Award size={24} />, en: 'Build your leadership portfolio for your career', bn: 'আপনার ক্যারিয়ারের জন্য নেতৃত্বের পোর্টফোলিও তৈরি করুন' },
  { icon: <CheckCircle2 size={24} />, en: 'Be part of building a democratic Bangladesh', bn: 'গণতান্ত্রিক বাংলাদেশ গড়ার অংশ হন' },
  { icon: <Globe size={24} />, en: 'Network with lawyers, journalists, and civil society', bn: 'আইনজীবী, সাংবাদিক ও সুশীল সমাজের সাথে নেটওয়ার্ক করুন' },
];

const VOLUNTEER_ROLES = [
  { en: 'Campus Organizer', bn: 'ক্যাম্পাস সংগঠক' },
  { en: 'Social Media Manager', bn: 'সোশ্যাল মিডিয়া ম্যানেজার' },
  { en: 'Graphic Designer', bn: 'গ্রাফিক ডিজাইনার' },
  { en: 'Content Writer', bn: 'কন্টেন্ট রাইটার' },
  { en: 'Event Coordinator', bn: 'ইভেন্ট কোঅর্ডিনেটর' },
  { en: 'Legal Advocate', bn: 'আইন প্রবর্তক' },
];

const DISTRICTS = [
  'Dhaka','Chittagong','Rajshahi','Khulna','Sylhet','Barisal','Mymensingh','Rangpur',
  'Comilla','Noakhali','Jessore','Bogra','Dinajpur','Faridpur','Tangail','Pabna',
];

export default function Join() {
  const { t, lang } = useLang();
  useScrollReveal();

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    university: '', dept: '', year: '', district: '', why: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      setForm({ name: '', email: '', phone: '', university: '', dept: '', year: '', district: '', why: '' });
    }, 1200);
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_join')}</span>
          </div>
          <h1>{t('join_hero_title')}</h1>
          <p>{t('join_hero_sub')}</p>
        </div>
      </section>

      {/* Why Join */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('join_why_label')}</span>
            <h2 className="section-title">{t('join_why_title')}</h2>
            <div className="divider" />
          </div>
          <div className="benefits-grid">
            {BENEFITS.map((b, i) => (
              <div className="benefit-card card reveal" key={i} style={{ transitionDelay: `${i * 0.07}s` }}>
                <div className="benefit-card__icon">{b.icon}</div>
                <p>{lang === 'en' ? b.en : b.bn}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form & Volunteer */}
      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container join-layout">
          {/* Membership Form */}
          <div className="join-form-wrap reveal">
            <h2>{t('join_form_title')}</h2>
            <div className="divider divider-left" style={{ marginBottom: '2rem' }} />

            {submitted ? (
              <div className="join-success">
                <CheckCircle2 size={48} color="var(--clr-primary)" />
                <h3>{t('join_success')}</h3>
                <p>{lang === 'en'
                  ? 'We will contact you within 48 hours with next steps.'
                  : 'আমরা ৪৮ ঘণ্টার মধ্যে পরবর্তী পদক্ষেপ নিয়ে আপনার সাথে যোগাযোগ করব।'}
                </p>
                <button className="btn btn-outline" onClick={() => setSubmitted(false)}>
                  {lang === 'en' ? 'Submit Another' : 'আরও একটি জমা দিন'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="join-form" noValidate>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="join-name">{t('join_fname')} *</label>
                    <input id="join-name" name="name" type="text" className="form-control"
                      value={form.name} onChange={handleChange} required
                      placeholder={lang === 'en' ? 'Your full name' : 'আপনার পূর্ণ নাম'} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="join-email">{t('join_email')} *</label>
                    <input id="join-email" name="email" type="email" className="form-control"
                      value={form.email} onChange={handleChange} required
                      placeholder="example@email.com" />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="join-phone">{t('join_phone')} *</label>
                    <input id="join-phone" name="phone" type="tel" className="form-control"
                      value={form.phone} onChange={handleChange} required
                      placeholder="+880 17XX-XXXXXX" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="join-uni">{t('join_university')} *</label>
                    <input id="join-uni" name="university" type="text" className="form-control"
                      value={form.university} onChange={handleChange} required
                      placeholder={lang === 'en' ? 'University / College name' : 'বিশ্ববিদ্যালয় / কলেজের নাম'} />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="join-dept">{t('join_dept')}</label>
                    <input id="join-dept" name="dept" type="text" className="form-control"
                      value={form.dept} onChange={handleChange}
                      placeholder={lang === 'en' ? 'e.g. Computer Science' : 'যেমন: কম্পিউটার বিজ্ঞান'} />
                  </div>
                  <div className="form-group">
                    <label htmlFor="join-year">{t('join_year')} *</label>
                    <select id="join-year" name="year" className="form-control" value={form.year} onChange={handleChange} required>
                      <option value="">{lang === 'en' ? 'Select year' : 'বছর বেছে নিন'}</option>
                      {['join_year_1','join_year_2','join_year_3','join_year_4','join_year_masters'].map(k => (
                        <option key={k} value={k}>{t(k)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="join-district">{t('join_district')} *</label>
                  <select id="join-district" name="district" className="form-control" value={form.district} onChange={handleChange} required>
                    <option value="">{lang === 'en' ? 'Select district' : 'জেলা বেছে নিন'}</option>
                    {DISTRICTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="join-why">{t('join_why_join')}</label>
                  <textarea id="join-why" name="why" className="form-control"
                    value={form.why} onChange={handleChange}
                    placeholder={lang === 'en' ? 'Tell us why...' : 'আমাদের বলুন কেন...'} />
                </div>
                <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: '100%' }}>
                  {loading
                    ? (lang === 'en' ? 'Submitting...' : 'জমা হচ্ছে...')
                    : <>{t('join_submit')} <ArrowRight size={18} /></>}
                </button>
              </form>
            )}
          </div>

          {/* Volunteer Sidebar */}
          <div className="volunteer-sidebar reveal">
            <h3>{t('join_vol_title')}</h3>
            <div className="divider divider-left" style={{ marginBottom: '1.5rem' }} />
            <div className="vol-roles">
              {VOLUNTEER_ROLES.map((r, i) => (
                <div className="vol-role" key={i}>
                  <ArrowRight size={14} style={{ color: 'var(--clr-primary)', flexShrink: 0 }} />
                  <span>{lang === 'en' ? r.en : r.bn}</span>
                </div>
              ))}
            </div>
            <p style={{ marginTop: '1.5rem', fontSize: '.9rem', color: 'var(--clr-text-muted)', lineHeight: 1.7 }}>
              {lang === 'en'
                ? 'Fill out the membership form and indicate your interest in volunteering in the "Why do you want to join?" field.'
                : '"কেন যোগ দিতে চান?" ক্ষেত্রে স্বেচ্ছাসেবক হওয়ার আগ্রহ উল্লেখ করে সদস্যপদ ফর্ম পূরণ করুন।'}
            </p>
            <div className="volunteer-cta">
              <p className="text-white" style={{ fontWeight: 700, marginBottom: '.5rem' }}>
                {lang === 'en' ? 'Already a member?' : 'ইতিমধ্যে সদস্য?'}
              </p>
              <a href="mailto:studentmovement@ndmbd.org" className="btn btn-white btn-sm">
                {lang === 'en' ? 'Contact Us' : 'যোগাযোগ করুন'}
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
