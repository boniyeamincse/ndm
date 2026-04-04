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
    year: '2017',
    en: 'National Democratic Movement (NDM) founded by Bobby Hajjaj. The seeds of a principled student wing are sown.',
    bn: 'ববি হাজ্জাজ কর্তৃক এনডিএম প্রতিষ্ঠিত। একটি নীতিনিষ্ঠ ছাত্র শাখার বীজ বপন করা হয়।',
  },
  {
    year: '2018',
    en: 'Early mobilization during national political shifts. Focus on building core leadership among university students.',
    bn: 'জাতীয় রাজনৈতিক পরিবর্তনের প্রেক্ষাপটে প্রাথমিক প্রচারণা। মূল নেতৃত্ব তৈরির ওপর গুরুত্বারোপ।',
  },
  {
    year: '2019',
    en: 'Expansion of campus units in Dhaka and key urban centers. First major advocacy for educational reforms.',
    bn: 'ঢাকা ও প্রধান শহরগুলোতে ক্যাম্পাস ইউনিটের সম্প্রসারণ। শিক্ষা সংস্কারের জন্য প্রথম বড় ধরণের প্রচারণা।',
  },
  {
    year: '2020',
    en: 'Youth-led community service and social awareness campaigns launched during the global pandemic.',
    bn: 'মহামারীর সময়ে তরুণদের নেতৃত্বে জনসেবা এবং সামাজিক সচেতনতামূলক কার্যক্রম শুরু।',
  },
  {
    year: '2021',
    en: 'Growing voice against campus oppression. Strengthening organizational structure across universities.',
    bn: 'ক্যাম্পাস নিপীড়নের বিরুদ্ধে সোচ্চার হওয়া। সাংগঠনিক কাঠামো শক্তিশালী করা।',
  },
  {
    year: '2022',
    en: 'Nationwide outreach reaching 30+ districts. Focus on training the next generation of democratic leaders.',
    bn: '৩০টিরও বেশি জেলায় দেশব্যাপী প্রচারণা। পরবর্তী প্রজন্মের গণতান্ত্রিক নেতা তৈরির লক্ষ্যে প্রশিক্ষণ।',
  },
  {
    year: '2023',
    en: 'Active participation in national movements for accountability and transparency in governance.',
    bn: 'প্রশাসনে জবাবদিহিতা ও স্বচ্ছতার দাবিতে জাতীয় আন্দোলনে সক্রিয় অংশগ্রহণ।',
  },
  {
    year: '2024',
    en: 'July–August uprising. Our members stand at the forefront of the historic student-led mass movement.',
    bn: 'জুলাই-আগস্ট অভ্যুত্থান। আমাদের সদস্যরা ঐতিহাসিক ছাত্র-গণআন্দোলনের অগ্রভাগে ছিলেন।',
  },
  {
    year: '2025',
    en: 'Rapid scaling to 50+ universities. Launch of the "Campus Democracy" initiative across Bangladesh.',
    bn: '৫০টিরও বেশি বিশ্ববিদ্যালয়ে দ্রুত সম্প্রসারণ। "ক্যাম্পাস গণতন্ত্র" উদ্যোগের সূচনা।',
  },
  {
    year: '2026',
    en: 'Today, we stand as the premier voice for student rights across 64 districts with 12,000+ active members.',
    bn: 'আজ আমরা ৬৪টি জেলায় ১২,০০০+ সক্রিয় সদস্য নিয়ে ছাত্র অধিকারের প্রধান কণ্ঠস্বর।',
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
