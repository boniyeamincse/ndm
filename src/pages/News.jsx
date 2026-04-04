import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './News.css';

const ALL_NEWS = [
  {
    id: 7, cat: 'campus',
    date: 'April 4, 2026',
    title_en: 'Student NDM photo story published from campus movement',
    title_bn: 'ক্যাম্পাস আন্দোলন থেকে স্টুডেন্ট এনডিএম ফটো স্টোরি প্রকাশ',
    excerpt_en: 'A new visual story highlighting student participation in democratic organizing has been added to the NDM news feed.',
    excerpt_bn: 'গণতান্ত্রিক সংগঠনে শিক্ষার্থীদের অংশগ্রহণ তুলে ধরে একটি নতুন ভিজ্যুয়াল স্টোরি এনডিএম নিউজ ফিডে যুক্ত হয়েছে।',
    img: '/images/photo/student_ndm.jpg',
    featured: false,
  },
  {
    id: 1, cat: 'campus',
    date: 'March 28, 2026',
    title_en: 'Student Movement NDM holds mass rally at Dhaka University',
    title_bn: 'ঢাকা বিশ্ববিদ্যালয়ে ছাত্র আন্দোলন এনডিএম-এর বিশাল সমাবেশ',
    excerpt_en: 'Thousands of students gathered at TSC demanding free and fair elections and an end to campus political violence.',
    excerpt_bn: 'হাজার হাজার শিক্ষার্থী টিএসসিতে জড়ো হয়ে অবাধ ও সুষ্ঠু নির্বাচন ও ক্যাম্পাস রাজনৈতিক সহিংসতা বন্ধের দাবি জানায়।',
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80',
    featured: true,
  },
  {
    id: 2, cat: 'national',
    date: 'March 20, 2026',
    title_en: 'NDM Student Wing expands to 30 new universities',
    title_bn: 'এনডিএম ছাত্র শাখা ৩০টি নতুন বিশ্ববিদ্যালয়ে সম্প্রসারিত',
    excerpt_en: 'Following the July uprising, the student wing established active chapters across every major university.',
    excerpt_bn: 'জুলাই অভ্যুত্থানের পর প্রতিটি প্রধান বিশ্ববিদ্যালয়ে সক্রিয় শাখা প্রতিষ্ঠা।',
    img: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=700&q=80',
    featured: false,
  },
  {
    id: 3, cat: 'events',
    date: 'March 12, 2026',
    title_en: 'Youth Leadership Summit 2026 — Registration Open',
    title_bn: 'যুব নেতৃত্ব সম্মেলন ২০২৬ — নিবন্ধন শুরু',
    excerpt_en: 'Join 500+ student leaders from across Bangladesh for a two-day summit on democracy and governance.',
    excerpt_bn: 'গণতন্ত্র ও সুশাসনের উপর দুই দিনের সম্মেলনে ৫০০+ ছাত্র নেতার সাথে যোগ দিন।',
    img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=700&q=80',
    featured: false,
  },
  {
    id: 4, cat: 'press',
    date: 'March 5, 2026',
    title_en: 'Press Release: NDM Student Wing rejects harassment of student activists',
    title_bn: 'প্রেস রিলিজ: এনডিএম ছাত্র শাখা ছাত্র কর্মীদের হয়রানি প্রত্যাখ্যান করে',
    excerpt_en: 'Official statement condemning targeted harassment and demanding immediate protection of student rights.',
    excerpt_bn: 'লক্ষ্যভিত্তিক হয়রানির নিন্দা ও ছাত্র অধিকারের তাৎক্ষণিক সুরক্ষার দাবিতে সরকারি বিবৃতি।',
    img: 'https://images.unsplash.com/photo-1589578228447-e1a4e481c6c8?w=700&q=80',
    featured: false,
  },
  {
    id: 5, cat: 'campus',
    date: 'February 18, 2026',
    title_en: 'Anti-Corruption workshop at BUET draws 400 students',
    title_bn: 'বুয়েটে দুর্নীতি বিরোধী কর্মশালায় ৪০০ শিক্ষার্থী',
    excerpt_en: 'A full-day workshop exposing systemic corruption in education admissions and examinations.',
    excerpt_bn: 'শিক্ষা ভর্তি ও পরীক্ষায় প্রাতিষ্ঠানিক দুর্নীতি উন্মোচনে একদিনের কর্মশালা।',
    img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=700&q=80',
    featured: false,
  },
  {
    id: 6, cat: 'national',
    date: 'February 10, 2026',
    title_en: 'Student Movement joins National Democracy March in Dhaka',
    title_bn: 'ছাত্র আন্দোলন ঢাকায় জাতীয় গণতন্ত্র মার্চে যোগ দেয়',
    excerpt_en: 'Thousands walked from Shahbag to Press Club demanding electoral reform and democratic accountability.',
    excerpt_bn: 'হাজার হাজার মানুষ শাহবাগ থেকে প্রেস ক্লাব পর্যন্ত নির্বাচনী সংস্কার ও গণতান্ত্রিক জবাবদিহিতার দাবিতে পদযাত্রা করে।',
    img: 'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?w=700&q=80',
    featured: false,
  },
];

const CATEGORIES = ['all', 'campus', 'national', 'events', 'press'];

export default function News() {
  const { t, lang } = useLang();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  useScrollReveal();

  const catLabel = cat => {
    const map = {
      all: t('news_all'), campus: t('news_campus'),
      national: t('news_national'), events: t('news_events'), press: t('news_press'),
    };
    return map[cat] || cat;
  };

  const filtered = ALL_NEWS.filter(n => {
    const matchCat = activeCat === 'all' || n.cat === activeCat;
    const q = search.toLowerCase();
    const title = lang === 'en' ? n.title_en : n.title_bn;
    const matchSearch = !search || title.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.find(n => n.featured);
  const rest = filtered.filter(n => !n.featured);

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_news')}</span>
          </div>
          <h1>{t('news_hero_title')}</h1>
          <p>{t('news_hero_sub')}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          {/* Filters */}
          <div className="news-controls reveal">
            <div className="news-filters">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`news-filter-btn ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                >
                  {catLabel(cat)}
                </button>
              ))}
            </div>
            <div className="news-search">
              <Search size={16} />
              <input
                type="search"
                placeholder={t('news_search_placeholder')}
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label={t('news_search_placeholder')}
              />
            </div>
          </div>

          {/* Featured Article */}
          {featured && (
            <article className="news-featured card reveal">
              <div className="news-featured__img">
                <img src={featured.img} alt={lang === 'en' ? featured.title_en : featured.title_bn} loading="lazy" />
              </div>
              <div className="news-featured__body">
                <div className="news-featured__meta">
                  <span className="badge badge-red">{catLabel(featured.cat)}</span>
                  <span className="news-card__date"><Calendar size={13} /> {featured.date}</span>
                </div>
                <h2>{lang === 'en' ? featured.title_en : featured.title_bn}</h2>
                <p>{lang === 'en' ? featured.excerpt_en : featured.excerpt_bn}</p>
                <a href="#" className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                  {t('news_read_more')} <ArrowRight size={16} />
                </a>
              </div>
            </article>
          )}

          {/* News Grid */}
          <div className="news-grid">
            {rest.map(item => (
              <article className="news-card card reveal" key={item.id}>
                <div className="news-card__img">
                  <img src={item.img} alt={lang === 'en' ? item.title_en : item.title_bn} loading="lazy" />
                  <span className="badge badge-red news-card__badge">{catLabel(item.cat)}</span>
                </div>
                <div className="news-card__body">
                  <span className="news-card__date"><Calendar size={13} /> {item.date}</span>
                  <h3 className="news-card__title">{lang === 'en' ? item.title_en : item.title_bn}</h3>
                  <p className="news-card__excerpt">{lang === 'en' ? item.excerpt_en : item.excerpt_bn}</p>
                  <a href="#" className="news-card__link">{t('news_read_more')} <ArrowRight size={14} /></a>
                </div>
              </article>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="news-empty reveal">
              {lang === 'en' ? 'No articles found.' : 'কোনো নিবন্ধ পাওয়া যায়নি।'}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
