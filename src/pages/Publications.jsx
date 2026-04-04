import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, BookOpen, Newspaper } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Publications.css';

const PUBLICATIONS = [
  {
    id: 1, cat: 'statements',
    title_en: 'Statement on Campus Democracy — March 2026',
    title_bn: 'ক্যাম্পাস গণতন্ত্র সংক্রান্ত বিবৃতি — মার্চ ২০২৬',
    date: 'March 15, 2026',
    desc_en: 'Official position paper calling for immediate restoration of student union elections across all Bangladeshi universities.',
    desc_bn: 'বাংলাদেশের সকল বিশ্ববিদ্যালয়ে অবিলম্বে ছাত্র সংসদ নির্বাচন পুনরুদ্ধারের দাবিতে সরকারি অবস্থান পত্র।',
    icon: <FileText size={22} />,
  },
  {
    id: 2, cat: 'manifestos',
    title_en: 'Student Rights Manifesto 2026',
    title_bn: 'ছাত্র অধিকার ইশতেহার ২০২৬',
    date: 'January 1, 2026',
    desc_en: 'Comprehensive manifesto outlining our 10-point demands for student rights, academic freedom, and democratic campus governance.',
    desc_bn: 'ছাত্র অধিকার, শিক্ষার স্বাধীনতা ও গণতান্ত্রিক ক্যাম্পাস শাসনের জন্য আমাদের ১০-দফা দাবি বিশদভাবে উল্লেখ করা ইশতেহার।',
    icon: <BookOpen size={22} />,
  },
  {
    id: 3, cat: 'press',
    title_en: 'Press Release: Response to Government Education Policy',
    title_bn: 'প্রেস রিলিজ: সরকারের শিক্ষা নীতির প্রতিক্রিয়া',
    date: 'February 20, 2026',
    desc_en: 'Official response to the newly announced education reforms and NDM student movement\'s position.',
    desc_bn: 'নতুন ঘোষিত শিক্ষা সংস্কারের প্রতি সরকারি প্রতিক্রিয়া ও এনডিএম ছাত্র আন্দোলনের অবস্থান।',
    icon: <Newspaper size={22} />,
  },
  {
    id: 4, cat: 'docs',
    title_en: 'Annual Report 2025 — Student Movement NDM',
    title_bn: 'বার্ষিক প্রতিবেদন ২০২৫ — ছাত্র আন্দোলন এনডিএম',
    date: 'December 31, 2025',
    desc_en: 'Full year report detailing activities, campaigns, membership growth, and financial accountability for 2025.',
    desc_bn: '২০২৫ সালের কার্যক্রম, ক্যাম্পেইন, সদস্যপদ বৃদ্ধি ও আর্থিক জবাবদিহিতার বিস্তারিত বার্ষিক প্রতিবেদন।',
    icon: <FileText size={22} />,
  },
  {
    id: 5, cat: 'statements',
    title_en: 'Statement on July–August Uprising Commemoration',
    title_bn: 'জুলাই-আগস্ট অভ্যুত্থান স্মরণ সংক্রান্ত বিবৃতি',
    date: 'August 5, 2025',
    desc_en: 'Commemorative statement marking the 1st anniversary of the mass student uprising that changed Bangladesh.',
    desc_bn: 'বাংলাদেশ পরিবর্তনকারী গণছাত্র অভ্যুত্থানের ১ম বার্ষিকী উপলক্ষে স্মরণ বিবৃতি।',
    icon: <FileText size={22} />,
  },
  {
    id: 6, cat: 'press',
    title_en: 'Press Release: Condemning Violence Against Students in Rajshahi',
    title_bn: 'প্রেস রিলিজ: রাজশাহীতে শিক্ষার্থীদের বিরুদ্ধে সহিংসতার নিন্দা',
    date: 'October 12, 2025',
    desc_en: 'Statement condemning recent attacks on student activists and demanding accountability from authorities.',
    desc_bn: 'সম্প্রতি ছাত্র কর্মীদের উপর হামলার নিন্দা ও কর্তৃপক্ষের জবাবদিহিতার দাবিতে বিবৃতি।',
    icon: <Newspaper size={22} />,
  },
];

const CATS = ['all', 'statements', 'press', 'docs', 'manifestos'];

export default function Publications() {
  const { t, lang } = useLang();
  const [activeCat, setActiveCat] = useState('all');
  useScrollReveal();

  const catLabel = cat => ({
    all: t('pub_all'), statements: t('pub_statements'),
    press: t('pub_press'), docs: t('pub_docs'), manifestos: t('pub_manifestos'),
  }[cat] || cat);

  const filtered = activeCat === 'all' ? PUBLICATIONS : PUBLICATIONS.filter(p => p.cat === activeCat);

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{t('nav_home')}</Link><span>/</span>
            <span>{t('nav_publications')}</span>
          </div>
          <h1>{t('pub_hero_title')}</h1>
          <p>{t('pub_hero_sub')}</p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">
          {/* Category Tabs */}
          <div className="pub-filters reveal">
            {CATS.map(cat => (
              <button
                key={cat}
                className={`news-filter-btn ${activeCat === cat ? 'active' : ''}`}
                onClick={() => setActiveCat(cat)}
              >
                {catLabel(cat)}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="pub-list">
            {filtered.map((p, i) => (
              <div className="pub-item card reveal" key={p.id}>
                <div className="pub-item__icon">{p.icon}</div>
                <div className="pub-item__body">
                  <span className="badge badge-red">{catLabel(p.cat)}</span>
                  <h3>{lang === 'en' ? p.title_en : p.title_bn}</h3>
                  <p>{lang === 'en' ? p.desc_en : p.desc_bn}</p>
                  <span className="pub-item__date">{p.date}</span>
                </div>
                <a href="#" className="btn btn-outline btn-sm pub-item__download" aria-label={t('pub_download')}>
                  <Download size={15} />
                  {t('pub_download')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
