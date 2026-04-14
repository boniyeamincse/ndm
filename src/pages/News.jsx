import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Search, Loader2 } from 'lucide-react';
import { useLang } from '../context/LanguageContext';
import { useScrollReveal } from '../hooks/useScrollReveal';
import './News.css';

const CATEGORIES = ['all', 'campus', 'national', 'events', 'press'];

export default function News() {
  const { t, lang } = useLang();
  const [activeCat, setActiveCat] = useState('all');
  const [search, setSearch] = useState('');
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useScrollReveal();

  useEffect(() => {
    async function fetchNews() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/v1/public/news');
        const data = await res.json();
        if (data.success) {
          setNews(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch news');
        }
      } catch (err) {
        setError('Connection error. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const catLabel = cat => {
    const map = {
      all: t('news_all'), campus: t('news_campus'),
      national: t('news_national'), events: t('news_events'), press: t('news_press'),
    };
    return map[cat] || cat;
  };

  const filtered = news.filter(n => {
    const matchCat = activeCat === 'all' || (n.category && n.category.slug === activeCat) || n.cat === activeCat;
    const q = search.toLowerCase();
    const title = lang === 'en' ? (n.title_en || n.title) : (n.title_bn || n.title);
    const matchSearch = !search || title.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const featured = filtered.find(n => n.is_featured);
  const rest = filtered.filter(n => !n.is_featured);

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

          {loading ? (
            <div className="news-loading reveal">
              <Loader2 className="animate-spin" size={40} />
              <p>{lang === 'en' ? 'Loading news...' : 'সংবাদ লোড করা হচ্ছে...'}</p>
            </div>
          ) : error ? (
            <div className="news-error reveal">
              <p>{error}</p>
              <button className="btn btn-primary" onClick={() => window.location.reload()}>
                {lang === 'en' ? 'Retry' : 'পুনরায় চেষ্টা করুন'}
              </button>
            </div>
          ) : (
            <>
              {/* Featured Article */}
              {featured && (
                <article className="news-featured card reveal">
                  <div className="news-featured__img">
                    <img src={featured.featured_image_url || '/images/placeholder-news.jpg'} alt={lang === 'en' ? (featured.title_en || featured.title) : (featured.title_bn || featured.title)} loading="lazy" />
                  </div>
                  <div className="news-featured__body">
                    <div className="news-featured__meta">
                      <span className="badge badge-red">{featured.category?.name || catLabel(featured.cat)}</span>
                      <span className="news-card__date"><Calendar size={13} /> {new Date(featured.published_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                    <h2>{lang === 'en' ? (featured.title_en || featured.title) : (featured.title_bn || featured.title)}</h2>
                    <p>{lang === 'en' ? (featured.excerpt_en || featured.excerpt) : (featured.excerpt_bn || featured.excerpt)}</p>
                    <Link to={`/news/${featured.slug}`} className="btn btn-primary" style={{ marginTop: '1.25rem' }}>
                      {t('news_read_more')} <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              )}

              {/* News Grid */}
              <div className="news-grid">
                {rest.map(item => (
                  <article className="news-card card reveal" key={item.id}>
                    <div className="news-card__img">
                      <img src={item.featured_image_url || '/images/placeholder-news.jpg'} alt={lang === 'en' ? (item.title_en || item.title) : (item.title_bn || item.title)} loading="lazy" />
                      <span className="badge badge-red news-card__badge">{item.category?.name || catLabel(item.cat)}</span>
                    </div>
                    <div className="news-card__body">
                      <span className="news-card__date"><Calendar size={13} /> {new Date(item.published_at).toLocaleDateString(lang === 'bn' ? 'bn-BD' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      <h3 className="news-card__title">{lang === 'en' ? (item.title_en || item.title) : (item.title_bn || item.title)}</h3>
                      <p className="news-card__excerpt">{lang === 'en' ? (item.excerpt_en || item.excerpt) : (item.excerpt_bn || item.excerpt)}</p>
                      <Link to={`/news/${item.slug}`} className="news-card__link">{t('news_read_more')} <ArrowRight size={14} /></Link>
                    </div>
                  </article>
                ))}
              </div>

              {filtered.length === 0 && (
                <div className="news-empty reveal">
                  {lang === 'en' ? 'No articles found.' : 'কোনো নিবন্ধ পাওয়া যায়নি।'}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
