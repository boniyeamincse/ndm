import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Users, BookOpen, Megaphone, Shield,
  ChevronRight, Calendar, Eye, Star
} from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Home.css';

/* ─── Static data ─── */
const NEWS_ITEMS = [
  {
    id: 1,
    category_en: 'Campus', category_bn: 'ক্যাম্পাস',
    date: 'March 28, 2026',
    title_en: 'Student Movement NDM holds mass rally at Dhaka University',
    title_bn: 'ঢাকা বিশ্ববিদ্যালয়ে ছাত্র আন্দোলন এনডিএম-এর বিশাল সমাবেশ',
    excerpt_en: 'Thousands of students gathered at TSC demanding free and fair elections and an end to campus political violence.',
    excerpt_bn: 'হাজার হাজার শিক্ষার্থী টিএসসিতে জড়ো হয়ে অবাধ ও সুষ্ঠু নির্বাচন এবং ক্যাম্পাস রাজনৈতিক সহিংসতা বন্ধের দাবি জানায়।',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
  },
  {
    id: 2,
    category_en: 'National', category_bn: 'জাতীয়',
    date: 'March 20, 2026',
    title_en: 'NDM Student Wing expands to 30 new universities',
    title_bn: 'এনডিএম ছাত্র শাখা ৩০টি নতুন বিশ্ববিদ্যালয়ে সম্প্রসারিত',
    excerpt_en: 'Following the July uprising, the student wing has established active chapters across every major public and private university.',
    excerpt_bn: 'জুলাই অভ্যুত্থানের পর ছাত্র শাখা প্রতিটি প্রধান সরকারি ও বেসরকারি বিশ্ববিদ্যালয়ে সক্রিয় শাখা প্রতিষ্ঠা করেছে।',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&q=80',
  },
  {
    id: 3,
    category_en: 'Events', category_bn: 'ইভেন্ট',
    date: 'March 12, 2026',
    title_en: 'Youth Leadership Summit 2026 — Registration Open',
    title_bn: 'যুব নেতৃত্ব সম্মেলন ২০২৬ — নিবন্ধন শুরু',
    excerpt_en: 'Join 500+ student leaders from across Bangladesh for a two-day summit on democracy, governance, and youth activism.',
    excerpt_bn: 'গণতন্ত্র, শাসন ও যুব সক্রিয়তার উপর দুই দিনের সম্মেলনে বাংলাদেশ জুড়ে ৫০০+ ছাত্র নেতার সাথে যোগ দিন।',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
  },
];

const LEADERS = [
  {
    name_en: 'Masud Rana Jewel', name_bn: 'মাসুদ রানা জুয়েল',
    role_en: 'President, Central Committee', role_bn: 'সভাপতি, কেন্দ্রীয় কমিটি',
    university_en: 'Dhaka University', university_bn: 'ঢাকা বিশ্ববিদ্যালয়',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  },
  {
    name_en: 'Nasrin Akter', name_bn: 'নাসরিন আক্তার',
    role_en: 'General Secretary', role_bn: 'সাধারণ সম্পাদক',
    university_en: 'BUET', university_bn: 'বুয়েট',
    img: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&q=80',
  },
  {
    name_en: 'Karim Hossain', name_bn: 'করিম হোসেন',
    role_en: 'Joint Secretary', role_bn: 'যুগ্ম সম্পাদক',
    university_en: 'Chittagong University', university_bn: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80',
  },
];

const COUNTDOWN_TARGET = new Date('2026-07-05T00:00:00');

function useCountdown(target) {
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });
  useEffect(() => {
    const tick = () => {
      const diff = target - Date.now();
      if (diff <= 0) { setTime({ d: 0, h: 0, m: 0, s: 0 }); return; }
      setTime({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);
  return time;
}

export default function Home() {
  const { t, lang } = useLang();
  useScrollReveal();
  const countdown = useCountdown(COUNTDOWN_TARGET);
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);

  const handleNewsletter = e => {
    e.preventDefault();
    if (email) { setSubbed(true); setEmail(''); }
  };

  return (
    <main className="home">
      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__bg">
          <div className="hero__overlay" />
          <img
            src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&q=80"
            alt="Students marching"
            className="hero__img"
          />
        </div>
        <div className="container hero__content">
          <span className="section-label hero__badge reveal">{t('hero_label')}</span>
          <h1 className="hero__title reveal">
            {t('hero_title')}<br />
            <span className="hero__title-accent">{t('hero_title_accent')}</span>
          </h1>
          <p className="hero__subtitle reveal">{t('hero_subtitle')}</p>
          <div className="hero__ctas reveal">
            <Link to="/join" className="btn btn-primary btn-lg">
              {t('hero_cta_primary')} <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-white btn-lg">
              {t('hero_cta_secondary')}
            </Link>
          </div>
          {/* Stats */}
          <div className="hero__stats reveal">
            {[
              { val: '12,000+', key: 'hero_stat1' },
              { val: '85+', key: 'hero_stat2' },
              { val: '64', key: 'hero_stat3' },
              { val: '2+', key: 'hero_stat4' },
            ].map(s => (
              <div className="hero__stat" key={s.key}>
                <span className="hero__stat-val">{s.val}</span>
                <span className="hero__stat-label">{t(s.key)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hero__scroll-hint" aria-hidden="true">
          <span />
        </div>
      </section>

      {/* ── ABOUT STRIP ── */}
      <section className="home-about section-pad">
        <div className="container home-about__inner">
          <div className="home-about__img-wrap reveal">
            <img
              src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=700&q=80"
              alt="Students"
            />
            <div className="home-about__img-badge">
              <Star size={16} />
              <span>{lang === 'en' ? 'Est. 2024' : 'প্রতিষ্ঠিত ২০২৪'}</span>
            </div>
          </div>
          <div className="home-about__text">
            <span className="section-label reveal">{t('home_about_label')}</span>
            <h2 className="section-title reveal">{t('home_about_title')}</h2>
            <div className="divider divider-left reveal" />
            <p className="reveal">{t('home_about_body')}</p>
            <Link to="/about" className="btn btn-primary reveal" style={{ marginTop: '1.5rem' }}>
              {t('home_about_cta')} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="highlights section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('highlights_label')}</span>
            <h2 className="section-title">{t('highlights_title')}</h2>
            <div className="divider" />
          </div>
          <div className="grid-4" style={{ marginTop: '2rem' }}>
            {[
              { icon: <Megaphone size={28} />, titleK: 'highlight1_title', bodyK: 'highlight1_body' },
              { icon: <Users size={28} />, titleK: 'highlight2_title', bodyK: 'highlight2_body' },
              { icon: <Shield size={28} />, titleK: 'highlight3_title', bodyK: 'highlight3_body' },
              { icon: <BookOpen size={28} />, titleK: 'highlight4_title', bodyK: 'highlight4_body' },
            ].map((h, i) => (
              <div className="highlight-card reveal card" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="highlight-card__icon">{h.icon}</div>
                <h3 className="highlight-card__title">{t(h.titleK)}</h3>
                <p className="highlight-card__body">{t(h.bodyK)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COUNTDOWN ── */}
      <section className="countdown-section">
        <div className="container countdown-inner">
          <div className="reveal">
            <span className="section-label" style={{ background: 'rgba(255,255,255,.15)', color: '#fff' }}>
              {lang === 'en' ? 'Upcoming Event' : 'আসন্ন ইভেন্ট'}
            </span>
            <h2 className="section-title text-white" style={{ marginTop: '.5rem' }}>
              {lang === 'en' ? 'July Anniversary Rally 2026' : 'জুলাই বার্ষিকী সমাবেশ ২০২৬'}
            </h2>
            <p style={{ color: 'rgba(255,255,255,.75)', marginBottom: '2rem' }}>
              {lang === 'en'
                ? 'Join us for the 2nd anniversary commemoration of the July–August uprising.'
                : 'জুলাই-আগস্ট অভ্যুত্থানের ২য় বার্ষিকী স্মরণ অনুষ্ঠানে আমাদের সাথে যোগ দিন।'}
            </p>
          </div>
          <div className="countdown-boxes reveal">
            {[
              { val: countdown.d, label: lang === 'en' ? 'Days' : 'দিন' },
              { val: countdown.h, label: lang === 'en' ? 'Hours' : 'ঘণ্টা' },
              { val: countdown.m, label: lang === 'en' ? 'Minutes' : 'মিনিট' },
              { val: countdown.s, label: lang === 'en' ? 'Seconds' : 'সেকেন্ড' },
            ].map((c, i) => (
              <div className="countdown-box" key={i}>
                <span className="countdown-val">{String(c.val).padStart(2, '0')}</span>
                <span className="countdown-label">{c.label}</span>
              </div>
            ))}
          </div>
          <Link to="/activities" className="btn btn-white btn-lg reveal" style={{ marginTop: '2rem' }}>
            <Calendar size={18} />
            {lang === 'en' ? 'View All Events' : 'সব ইভেন্ট দেখুন'}
          </Link>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="section-pad">
        <div className="container">
          <div className="home-news-header reveal">
            <div>
              <span className="section-label">{t('home_news_label')}</span>
              <h2 className="section-title">{t('home_news_title')}</h2>
              <div className="divider divider-left" />
            </div>
            <Link to="/news" className="btn btn-outline">{t('home_news_cta')} <ArrowRight size={16} /></Link>
          </div>
          <div className="grid-3" style={{ marginTop: '1.5rem' }}>
            {NEWS_ITEMS.map(item => (
              <article className="news-card card reveal" key={item.id}>
                <div className="news-card__img">
                  <img src={item.img} alt={lang === 'en' ? item.title_en : item.title_bn} loading="lazy" />
                  <span className="badge badge-red news-card__badge">
                    {lang === 'en' ? item.category_en : item.category_bn}
                  </span>
                </div>
                <div className="news-card__body">
                  <span className="news-card__date">
                    <Calendar size={13} /> {item.date}
                  </span>
                  <h3 className="news-card__title">
                    {lang === 'en' ? item.title_en : item.title_bn}
                  </h3>
                  <p className="news-card__excerpt">
                    {lang === 'en' ? item.excerpt_en : item.excerpt_bn}
                  </p>
                  <Link to="/news" className="news-card__link">
                    {t('news_read_more')} <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP SPOTLIGHT ── */}
      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('home_leader_label')}</span>
            <h2 className="section-title">{t('home_leader_title')}</h2>
            <div className="divider" />
          </div>
          <div className="grid-3" style={{ marginTop: '2rem' }}>
            {LEADERS.map((l, i) => (
              <div className="leader-card card reveal" key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="leader-card__img">
                  <img src={l.img} alt={lang === 'en' ? l.name_en : l.name_bn} loading="lazy" />
                </div>
                <div className="leader-card__body">
                  <h3>{lang === 'en' ? l.name_en : l.name_bn}</h3>
                  <span className="badge badge-red">{lang === 'en' ? l.role_en : l.role_bn}</span>
                  <p style={{ fontSize: '.85rem', color: 'var(--clr-text-muted)', marginTop: '.5rem' }}>
                    {lang === 'en' ? l.university_en : l.university_bn}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center" style={{ marginTop: '2.5rem' }}>
            <Link to="/leadership" className="btn btn-primary">
              {t('home_leader_cta')} <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── JOIN CTA ── */}
      <section className="join-cta">
        <div className="join-cta__bg" aria-hidden="true" />
        <div className="container join-cta__content reveal">
          <h2 className="section-title text-white" style={{ fontSize: 'clamp(1.8rem,4vw,3rem)' }}>
            {t('cta_title')}
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', maxWidth: 600, margin: '1rem auto 2rem', fontSize: '1.05rem' }}>
            {t('cta_subtitle')}
          </p>
          <div className="join-cta__btns">
            <Link to="/join" className="btn btn-white btn-lg">{t('cta_btn1')} <ArrowRight size={18} /></Link>
            <Link to="/join" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,.5)', color: '#fff' }}>
              {t('cta_btn2')}
            </Link>
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter-section section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container newsletter-inner reveal">
          <div className="newsletter-text">
            <h3>{t('newsletter_title')}</h3>
            <p>{t('newsletter_body')}</p>
          </div>
          {subbed ? (
            <div className="newsletter-success">
              ✓ {lang === 'en' ? 'Thank you for subscribing!' : 'সাবস্ক্রাইব করার জন্য ধন্যবাদ!'}
            </div>
          ) : (
            <form className="newsletter-form" onSubmit={handleNewsletter}>
              <input
                type="email"
                className="form-control"
                placeholder={t('newsletter_placeholder')}
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                aria-label={t('newsletter_placeholder')}
              />
              <button type="submit" className="btn btn-primary">{t('newsletter_btn')}</button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
