import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, FileText, BookOpen, Newspaper, Loader2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './Publications.css';

const CATS = ['all', 'statements', 'press', 'docs', 'manifestos'];

export default function Publications() {
  const { t, lang } = useLang();
  const [activeCat, setActiveCat] = useState('all');
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useScrollReveal();

  useEffect(() => {
    async function fetchPublications() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/v1/public/blogs'); // We'll use blogs endpoint for publications
        const data = await res.json();
        if (data.success) {
          setPublications(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch publications');
        }
      } catch (err) {
        setError('Connection error. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchPublications();
  }, []);

  const catLabel = cat => ({
    all: t('pub_all'), statements: t('pub_statements'),
    press: t('pub_press'), docs: t('pub_docs'), manifestos: t('pub_manifestos'),
  }[cat] || cat);

  const getIcon = (type) => {
    switch (type) {
      case 'statement': return <FileText size={22} />;
      case 'press_release': return <Newspaper size={22} />;
      case 'blog': return <BookOpen size={22} />;
      default: return <FileText size={22} />;
    }
  };

  const filtered = activeCat === 'all' 
    ? publications 
    : publications.filter(p => (p.category && p.category.slug === activeCat) || p.content_type === activeCat);

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

          {loading ? (
            <div className="news-loading reveal">
              <Loader2 className="animate-spin" size={40} />
              <p>{lang === 'en' ? 'Loading publications...' : 'প্রকাশনা লোড করা হচ্ছে...'}</p>
            </div>
          ) : error ? (
            <div className="news-error reveal">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                {lang === 'en' ? 'Retry' : 'পুনরায় চেষ্টা করুন'}
              </button>
            </div>
          ) : (
            /* List */
            <div className="pub-list">
              {filtered.map((p, i) => (
                <div className="pub-item card reveal" key={p.id}>
                  <div className="pub-item__icon">{getIcon(p.content_type)}</div>
                  <div className="pub-item__body">
                    <span className="badge badge-red">{p.category?.name || catLabel(p.content_type)}</span>
                    <h3>{lang === 'en' ? (p.title_en || p.title) : (p.title_bn || p.title)}</h3>
                    <p>{lang === 'en' ? (p.excerpt_en || p.excerpt) : (p.excerpt_bn || p.excerpt)}</p>
                    <span className="pub-item__date">{new Date(p.published_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                  </div>
                  <Link to={`/news/${p.slug}`} className="btn btn-outline btn-sm pub-item__download">
                    <BookOpen size={15} />
                    {lang === 'en' ? 'Read More' : 'আরও পড়ুন'}
                  </Link>
                </div>
              ))}

              {filtered.length === 0 && (
                <div className="news-empty reveal">
                  {lang === 'en' ? 'No publications found.' : 'কোনো প্রকাশনা পাওয়া যায়নি।'}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
