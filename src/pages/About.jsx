import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './About.css';

const VALUES = [
  { icon: '🗳️', key: 'val1' },
  { icon: '⚖️', key: 'val2' },
  { icon: '🤝', key: 'val3' },
  { icon: '💎', key: 'val4' },
  { icon: '🚀', key: 'val5' },
  { icon: '☮️', key: 'val6' },
];

const TIMELINE = [
  {
    year: '2024',
    en: 'July–August uprising shakes Bangladesh. Students lead the historic mass movement demanding democratic accountability.',
    bn: 'জুলাই-আগস্ট অভ্যুত্থান বাংলাদেশকে কাঁপিয়ে দেয়। শিক্ষার্থীরা গণতান্ত্রিক জবাবদিহিতার দাবিতে ঐতিহাসিক গণআন্দোলনের নেতৃত্ব দেয়।',
  },
  {
    year: '2024 (Late)',
    en: 'Student Movement – NDM formally established as the student wing of National Democratic Movement under the leadership of Bobby Hajjaj.',
    bn: 'ববি হাজ্জাজের নেতৃত্বে জাতীয় গণতান্ত্রিক আন্দোলনের ছাত্র শাখা হিসেবে ছাত্র আন্দোলন – এনডিএম আনুষ্ঠানিকভাবে প্রতিষ্ঠিত হয়।',
  },
  {
    year: '2025',
    en: "Rapid expansion to over 50 universities. Major campaigns on campus democracy, anti-corruption, and students' rights.",
    bn: '৫০টিরও বেশি বিশ্ববিদ্যালয়ে দ্রুত সম্প্রসারণ। ক্যাম্পাস গণতন্ত্র, দুর্নীতি বিরোধী ও শিক্ষার্থীদের অধিকার নিয়ে বড় আন্দোলন।',
  },
  {
    year: '2026',
    en: 'Present across 64 districts with 85+ university chapters and 12,000+ active members. Youth Leadership Summit launched.',
    bn: '৬৪ জেলায় উপস্থিতি, ৮৫+ বিশ্ববিদ্যালয় শাখা এবং ১২,০০০+ সক্রিয় সদস্য। যুব নেতৃত্ব সম্মেলন চালু।',
  },
];

export default function About() {
  const { t, lang } = useLang();
  useScrollReveal();

  return (
    <main>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link>
            <span>/</span>
            <span>{t('nav_about')}</span>
          </div>
          <h1>{t('about_hero_title')}</h1>
          <p>{t('about_hero_sub')}</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-pad">
        <div className="container about-mv-grid">
          <div className="about-mv-card about-mv-card--mission reveal">
            <span className="section-label">{t('about_mission_label')}</span>
            <h2>{t('about_mission_title')}</h2>
            <div className="divider divider-left" />
            <p>{t('about_mission_body')}</p>
          </div>
          <div className="about-mv-card about-mv-card--vision reveal">
            <span className="section-label" style={{ background: 'rgba(243,156,18,.1)', color: 'var(--clr-accent)' }}>
              {t('about_vision_label')}
            </span>
            <h2>{t('about_vision_title')}</h2>
            <div className="divider divider-left" style={{ background: 'linear-gradient(90deg,var(--clr-accent),var(--clr-primary))' }} />
            <p>{t('about_vision_body')}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container text-center">
          <span className="section-label reveal">{t('about_values_label')}</span>
          <h2 className="section-title reveal">{t('about_values_title')}</h2>
          <div className="divider reveal" />
          <div className="values-grid">
            {VALUES.map((v, i) => (
              <div className="value-pill reveal" key={i} style={{ transitionDelay: `${i * 0.08}s` }}>
                <span className="value-pill__icon">{v.icon}</span>
                <span>{t(v.key)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('about_history_label')}</span>
            <h2 className="section-title">{t('about_history_title')}</h2>
            <div className="divider" />
          </div>
          <div className="timeline">
            {TIMELINE.map((item, i) => (
              <div className={`timeline-item reveal ${i % 2 === 0 ? '' : 'timeline-item--right'}`} key={i}>
                <div className="timeline-dot" />
                <div className="timeline-card">
                  <span className="timeline-year">{item.year}</span>
                  <p>{lang === 'en' ? item.en : item.bn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NDM Relationship */}
      <section className="section-pad about-ndm-section">
        <div className="container about-ndm-inner">
          <div className="reveal">
            <span className="section-label">{t('about_ndm_label')}</span>
            <h2 className="section-title">{t('about_ndm_title')}</h2>
            <div className="divider divider-left" />
            <p style={{ marginBottom: '1.5rem' }}>{t('about_ndm_body')}</p>
            <a
              href="https://ndmbd.org"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {lang === 'en' ? 'Visit NDM Bangladesh' : 'এনডিএম বাংলাদেশ দেখুন'} <ArrowRight size={16} />
            </a>
          </div>
          <div className="about-ndm-card reveal">
            <div className="about-ndm-logo">
              <img src="/images/logo/logo.jpeg" alt="NDM Logo" className="about-ndm-logo-img" />
            </div>
            <h3>{lang === 'en' ? 'National Democratic Movement' : 'জাতীয় গণতান্ত্রিক আন্দোলন'}</h3>
            <p>{lang === 'en' ? 'Bangladesh' : 'বাংলাদেশ'}</p>
            <div className="about-ndm-stats">
              <div>
                <strong>253,664+</strong>
                <span>{lang === 'en' ? 'Members' : 'সদস্য'}</span>
              </div>
              <div>
                <strong>{lang === 'en' ? 'Bobby Hajjaj' : 'ববি হাজ্জাজ'}</strong>
                <span>{lang === 'en' ? 'Chairman' : 'চেয়ারম্যান'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-pad text-center" style={{ background: 'var(--clr-dark)' }}>
        <div className="container reveal">
          <h2 className="section-title text-white">{t('cta_title')}</h2>
          <p style={{ color: 'rgba(255,255,255,.7)', margin: '1rem auto 2rem', maxWidth: 500 }}>
            {t('cta_subtitle')}
          </p>
          <Link to="/join" className="btn btn-primary btn-lg">
            {t('cta_btn1')} <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
