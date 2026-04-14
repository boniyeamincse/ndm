import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Leadership.css';
import CommitteeDirectory from './CommitteeDirectory';

const STRATEGY_PILLARS = [
  {
    en: 'Campus Democracy Cells in every major institution',
    bn: 'প্রতিটি প্রধান শিক্ষাপ্রতিষ্ঠানে ক্যাম্পাস ডেমোক্রেসি সেল গঠন',
  },
  {
    en: 'Leadership training pipeline from campus to district level',
    bn: 'ক্যাম্পাস থেকে জেলা পর্যায়ে নেতৃত্ব বিকাশের ধারাবাহিক কর্মসূচি',
  },
  {
    en: 'Policy-focused student campaigns based on research and data',
    bn: 'গবেষণা ও তথ্যভিত্তিক নীতিনির্ভর ছাত্র ক্যাম্পেইন পরিচালনা',
  },
  {
    en: 'Digital organizing and rapid-response communication network',
    bn: 'ডিজিটাল অর্গানাইজিং ও দ্রুত প্রতিক্রিয়ার সমন্বিত যোগাযোগ নেটওয়ার্ক',
  },
];

const DEPARTMENTS = [
  {
    en: 'Organization and Expansion Department',
    bn: 'সংগঠন ও সম্প্রসারণ বিভাগ',
  },
  {
    en: 'Student Rights and Legal Support Department',
    bn: 'ছাত্র অধিকার ও আইনি সহায়তা বিভাগ',
  },
  {
    en: 'Research and Policy Development Department',
    bn: 'গবেষণা ও নীতি উন্নয়ন বিভাগ',
  },
  {
    en: 'Media, Communication and Digital Wing',
    bn: 'মিডিয়া, যোগাযোগ ও ডিজিটাল উইং',
  },
  {
    en: 'Training and Political Education Department',
    bn: 'প্রশিক্ষণ ও রাজনৈতিক শিক্ষা বিভাগ',
  },
  {
    en: 'Cultural and Volunteer Affairs Department',
    bn: 'সাংস্কৃতিক ও স্বেচ্ছাসেবক বিষয়ক বিভাগ',
  },
];

export default function Leadership() {
  const { t, lang } = useLang();
  useScrollReveal();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_leadership')}</span>
          </div>
          <h1>{t('leader_hero_title')}</h1>
          <p>{t('leader_hero_sub')}</p>
        </div>
      </section>

      <section className="lead-submenu-wrap">
        <div className="container">
          <nav className="lead-submenu" aria-label={lang === 'en' ? 'Leadership sections' : 'নেতৃত্ব পৃষ্ঠার সেকশন'}>
            <a href="#constitution">{lang === 'en' ? 'Constitution' : 'সংবিধান'}</a>
            <a href="#strategy">{lang === 'en' ? 'Strategy' : 'কৌশল'}</a>
            <a href="#central-committee">{lang === 'en' ? 'Central Committee' : 'কেন্দ্রীয় কমিটি'}</a>
            <a href="#branches">{lang === 'en' ? 'Branches' : 'শাখাসমূহ'}</a>
            <a href="#departments">{lang === 'en' ? 'Departments' : 'বিভাগসমূহ'}</a>
          </nav>
        </div>
      </section>

      {/* Constitution */}
      <section id="constitution" className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{lang === 'en' ? 'Constitution' : 'সংবিধান'}</span>
            <h2 className="section-title">
              {lang === 'en' ? 'Organizational Constitutional Principles' : 'সাংগঠনিক সাংবিধানিক মূলনীতি'}
            </h2>
            <div className="divider" />
          </div>
          <div className="lead-highlight card reveal">
            <p>
              {lang === 'en'
                ? 'Leadership operations are guided by the constitution of Student Movement - NDM, ensuring transparency, accountability, internal democracy, and a clear code of conduct across all organizational tiers.'
                : 'ছাত্র আন্দোলন - এনডিএম এর সংবিধান অনুযায়ী নেতৃত্ব পরিচালিত হয়, যা স্বচ্ছতা, জবাবদিহিতা, অভ্যন্তরীণ গণতন্ত্র এবং সব স্তরে আচরণবিধি নিশ্চিত করে।'}
            </p>
            <Link to="/constitution" className="btn btn-outline">
              {lang === 'en' ? 'Read Constitution Page' : 'সংবিধান পৃষ্ঠা দেখুন'}
            </Link>
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section id="strategy" className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{lang === 'en' ? 'Strategy' : 'কৌশল'}</span>
            <h2 className="section-title">{lang === 'en' ? 'Leadership Strategy Framework' : 'নেতৃত্বের কৌশলগত কাঠামো'}</h2>
            <div className="divider" />
          </div>
          <div className="strategy-grid">
            {STRATEGY_PILLARS.map((item, i) => (
              <article className="strategy-card card reveal" key={i}>
                <span className="strategy-card__no">0{i + 1}</span>
                <p>{lang === 'en' ? item.en : item.bn}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Committee Directory — interactive 4-level drill-down */}
      <section id="central-committee" className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal" style={{ marginBottom: '2rem' }}>
            <span className="section-label">{lang === 'en' ? 'Committee Directory' : 'কমিটি ডিরেক্টরি'}</span>
            <h2 className="section-title">{t('leader_committee_title')}</h2>
            <div className="divider" />
          </div>
          <CommitteeDirectory lang={lang} />
        </div>
      </section>

      {/* Departments */}
      <section id="departments" className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{lang === 'en' ? 'Departments' : 'বিভাগসমূহ'}</span>
            <h2 className="section-title">
              {lang === 'en' ? 'Functional Departments' : 'কার্যকরী বিভাগসমূহ'}
            </h2>
            <div className="divider" />
          </div>
          <div className="department-grid">
            {DEPARTMENTS.map((d, i) => (
              <article className="department-card card reveal" key={i}>
                <h4>{lang === 'en' ? d.en : d.bn}</h4>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
