import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight, Image } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Activities.css';

const CAMPAIGNS = [
  {
    title_en: 'Campus Democracy Initiative',
    title_bn: 'ক্যাম্পাস গণতন্ত্র উদ্যোগ',
    desc_en: 'Demanding the restoration of student union elections in all public and private universities across Bangladesh.',
    desc_bn: 'বাংলাদেশের সকল সরকারি ও বেসরকারি বিশ্ববিদ্যালয়ে ছাত্র সংসদ নির্বাচন পুনরুদ্ধারের দাবি।',
    status_en: 'Active', status_bn: 'সক্রিয়',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80',
    icon: '🗳️',
  },
  {
    title_en: 'Anti-Corruption in Education',
    title_bn: 'শিক্ষায় দুর্নীতি বিরোধী আন্দোলন',
    desc_en: 'Exposing and challenging corruption in admission processes, examination systems, and research funding.',
    desc_bn: 'ভর্তি প্রক্রিয়া, পরীক্ষা পদ্ধতি ও গবেষণা তহবিলে দুর্নীতি উন্মোচন ও প্রতিরোধ।',
    status_en: 'Active', status_bn: 'সক্রিয়',
    img: 'https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=600&q=80',
    icon: '🔍',
  },
  {
    title_en: 'Green Campus Movement',
    title_bn: 'সবুজ ক্যাম্পাস আন্দোলন',
    desc_en: 'Promoting environmental sustainability, tree-planting drives, and climate awareness on university campuses.',
    desc_bn: 'বিশ্ববিদ্যালয় ক্যাম্পাসে পরিবেশগত স্থায়িত্ব, বৃক্ষরোপণ ও জলবায়ু সচেতনতা প্রচার।',
    status_en: 'Ongoing', status_bn: 'চলমান',
    img: 'https://images.unsplash.com/photo-1542601906897-bdf0fb3f2543?w=600&q=80',
    icon: '🌱',
  },
];

const EVENTS = [
  {
    title_en: 'July Anniversary Rally 2026',
    title_bn: 'জুলাই বার্ষিকী সমাবেশ ২০২৬',
    date: 'July 5, 2026',
    location_en: 'Shaheed Minar, Dhaka',
    location_bn: 'শহীদ মিনার, ঢাকা',
    desc_en: 'Grand commemoration rally for the 2nd anniversary of the July–August 2024 uprising.',
    desc_bn: 'জুলাই-আগস্ট ২০২৪ অভ্যুত্থানের ২য় বার্ষিকী উপলক্ষে বিশাল স্মরণ সমাবেশ।',
    category: 'Rally',
  },
  {
    title_en: 'Youth Leadership Summit 2026',
    title_bn: 'যুব নেতৃত্ব সম্মেলন ২০২৬',
    date: 'May 15–16, 2026',
    location_en: 'Dhaka University, TSC Auditorium',
    location_bn: 'ঢাকা বিশ্ববিদ্যালয়, টিএসসি মিলনায়তন',
    desc_en: '2-day summit for 500+ student leaders — workshops, keynotes, and networking.',
    desc_bn: '৫০০+ ছাত্র নেতার জন্য ২ দিনের সম্মেলন — কর্মশালা, মূল বক্তৃতা ও নেটওয়ার্কিং।',
    category: 'Summit',
  },
  {
    title_en: 'Campus to Career Workshop',
    title_bn: 'ক্যাম্পাস টু ক্যারিয়ার কর্মশালা',
    date: 'April 20, 2026',
    location_en: 'BUET, Dhaka',
    location_bn: 'বুয়েট, ঢাকা',
    desc_en: 'Career skills and professional development workshop for final year students.',
    desc_bn: 'চূড়ান্ত বর্ষের শিক্ষার্থীদের জন্য ক্যারিয়ার দক্ষতা ও পেশাদার উন্নয়ন কর্মশালা।',
    category: 'Workshop',
  },
  {
    title_en: 'Debate Championship 2026',
    title_bn: 'বিতর্ক চ্যাম্পিয়নশিপ ২০২৬',
    date: 'June 8, 2026',
    location_en: 'Rajshahi University',
    location_bn: 'রাজশাহী বিশ্ববিদ্যালয়',
    desc_en: 'National inter-university debate competition on democratic reform and youth governance.',
    desc_bn: 'গণতান্ত্রিক সংস্কার ও যুব সুশাসনের উপর জাতীয় আন্তঃবিশ্ববিদ্যালয় বিতর্ক প্রতিযোগিতা।',
    category: 'Competition',
  },
];

const GALLERY_IMGS = [
  'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&q=80',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=500&q=80',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&q=80',
  'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=500&q=80',
  'https://images.unsplash.com/photo-1529070538774-1843cb3265df?w=500&q=80',
  'https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=500&q=80',
];

export default function Activities() {
  const { t, lang } = useLang();
  useScrollReveal();

  const categoryColor = cat => {
    const map = { Rally: '#c0392b', Summit: '#2980b9', Workshop: '#27ae60', Competition: '#f39c12' };
    return map[cat] || '#666';
  };

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_activities')}</span>
          </div>
          <h1>{t('act_hero_title')}</h1>
          <p>{t('act_hero_sub')}</p>
        </div>
      </section>

      {/* Campaigns */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('act_campaigns_label')}</span>
            <h2 className="section-title">{t('act_campaigns_title')}</h2>
            <div className="divider" />
          </div>
          <div className="campaigns-grid">
            {CAMPAIGNS.map((c, i) => (
              <div className="campaign-card card reveal" key={i}>
                <div className="campaign-card__img">
                  <img src={c.img} alt={lang === 'en' ? c.title_en : c.title_bn} loading="lazy" />
                  <span className="campaign-card__icon">{c.icon}</span>
                </div>
                <div className="campaign-card__body">
                  <div className="campaign-card__status">
                    <span className="badge badge-red">{lang === 'en' ? c.status_en : c.status_bn}</span>
                  </div>
                  <h3>{lang === 'en' ? c.title_en : c.title_bn}</h3>
                  <p>{lang === 'en' ? c.desc_en : c.desc_bn}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="section-pad" style={{ background: 'var(--clr-light)' }}>
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('act_events_label')}</span>
            <h2 className="section-title">{t('act_events_title')}</h2>
            <div className="divider" />
          </div>
          <div className="events-grid">
            {EVENTS.map((ev, i) => (
              <div className="event-card card reveal" key={i}>
                <div className="event-card__date-badge">
                  {ev.date.split(',')[0].split(' ').slice(0, 2).join(' ')}
                </div>
                <div className="event-card__body">
                  <span
                    className="badge"
                    style={{ background: `${categoryColor(ev.category)}18`, color: categoryColor(ev.category), marginBottom: '.5rem' }}
                  >
                    {ev.category}
                  </span>
                  <h3>{lang === 'en' ? ev.title_en : ev.title_bn}</h3>
                  <div className="event-card__meta">
                    <span><Calendar size={13} /> {ev.date}</span>
                    <span><MapPin size={13} /> {lang === 'en' ? ev.location_en : ev.location_bn}</span>
                  </div>
                  <p>{lang === 'en' ? ev.desc_en : ev.desc_bn}</p>
                  <Link to="/join" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
                    {lang === 'en' ? 'Register' : 'নিবন্ধন করুন'} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="section-pad">
        <div className="container">
          <div className="text-center reveal">
            <span className="section-label">{t('act_gallery_label')}</span>
            <h2 className="section-title">{t('act_gallery_title')}</h2>
            <div className="divider" />
          </div>
          <div className="gallery-grid">
            {GALLERY_IMGS.map((src, i) => (
              <div className="gallery-item reveal" key={i}>
                <img src={src} alt={`Gallery ${i + 1}`} loading="lazy" />
                <div className="gallery-item__overlay">
                  <Image size={28} color="white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
