import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Tag, Search, ArrowRight, Rss, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLang } from '../../context/LanguageContext';
import { blogService } from './blogService';
import './Blog.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function FeaturedHero({ post }) {
  if (!post) return null;
  return (
    <article className="blog-hero card reveal">
      <div className="blog-hero__img">
        {post.featured_image_url
          ? <img src={post.featured_image_url} alt={post.featured_image_alt || post.title} loading="eager" />
          : <div className="blog-hero__img-placeholder"><Rss size={48} /></div>}
        <span className="blog-hero__badge">Featured</span>
      </div>
      <div className="blog-hero__body">
        {post.category?.name && (
          <span className="blog-card__cat">{post.category.name}</span>
        )}
        <h2 className="blog-hero__title">{post.title}</h2>
        {post.excerpt && <p className="blog-hero__excerpt">{post.excerpt}</p>}
        <div className="blog-card__meta">
          {post.author_name && <span className="blog-card__author">By {post.author_name}</span>}
          {post.published_at && <span className="blog-card__date"><Calendar size={13} /> {formatDate(post.published_at)}</span>}
        </div>
        <Link to={`/blog/${post.slug}`} className="btn btn-primary blog-hero__cta">
          Read Article <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}

function BlogCard({ post }) {
  return (
    <article className="blog-card card reveal">
      <Link to={`/blog/${post.slug}`} className="blog-card__img-link">
        <div className="blog-card__img">
          {post.featured_image_url
            ? <img src={post.featured_image_url} alt={post.featured_image_alt || post.title} loading="lazy" />
            : <div className="blog-card__img-placeholder"><Rss size={32} /></div>}
          {post.category?.name && (
            <span className="blog-card__cat-badge">{post.category.name}</span>
          )}
        </div>
      </Link>
      <div className="blog-card__body">
        <div className="blog-card__meta">
          {post.author_name && <span className="blog-card__author">By {post.author_name}</span>}
          {post.published_at && <span className="blog-card__date"><Calendar size={12} /> {formatDate(post.published_at)}</span>}
        </div>
        <h3 className="blog-card__title">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt && <p className="blog-card__excerpt">{post.excerpt}</p>}
        {Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="blog-card__tags">
            <Tag size={12} />
            {post.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="blog-tag-chip">{tag}</span>
            ))}
          </div>
        )}
        <Link to={`/blog/${post.slug}`} className="blog-card__read-more">
          Read More <ArrowRight size={14} />
        </Link>
      </div>
    </article>
  );
}

function PaginationBar({ meta, onPage }) {
  if (!meta || meta.last_page <= 1) return null;
  const pages = Array.from({ length: meta.last_page }, (_, i) => i + 1);
  return (
    <div className="blog-pagination">
      <button
        className="blog-pagination__btn"
        disabled={meta.current_page === 1}
        onClick={() => onPage(meta.current_page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`blog-pagination__btn ${p === meta.current_page ? 'blog-pagination__btn--active' : ''}`}
          onClick={() => onPage(p)}
          aria-label={`Page ${p}`}
          aria-current={p === meta.current_page ? 'page' : undefined}
        >
          {p}
        </button>
      ))}
      <button
        className="blog-pagination__btn"
        disabled={meta.current_page === meta.last_page}
        onClick={() => onPage(meta.current_page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}

export default function Blog() {
  const { lang } = useLang();
  const [searchParams, setSearchParams] = useSearchParams();
  const [posts, setPosts] = useState([]);
  const [meta, setMeta] = useState(null);
  const [categories, setCategories] = useState([]);
  const [featuredPosts, setFeaturedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCat, setActiveCat] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useScrollReveal();

  // Load categories once
  useEffect(() => {
    blogService.listCategories().then(setCategories).catch(() => {});
    blogService.listFeatured({ per_page: 1 }).then(setFeaturedPosts).catch(() => {});
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { per_page: 9, page, sort_by: 'published_at', sort_dir: 'desc' };
      if (search.trim()) params.search = search.trim();
      if (activeCat) params.post_category_id = activeCat;
      const result = await blogService.listBlogs(params);
      setPosts(result.items);
      setMeta(result.meta);
    } catch (err) {
      setError(err.message || 'Failed to load blog posts.');
    } finally {
      setLoading(false);
    }
  }, [page, search, activeCat]);

  useEffect(() => {
    fetchPosts();
    // Sync URL params
    const params = {};
    if (search.trim()) params.search = search.trim();
    if (activeCat) params.category = activeCat;
    if (page > 1) params.page = page;
    setSearchParams(params, { replace: true });
  }, [fetchPosts]);

  function handleSearch(e) {
    e.preventDefault();
    setPage(1);
  }

  function handleCategoryChange(catId) {
    setActiveCat(catId);
    setPage(1);
  }

  function handlePage(p) {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const featuredPost = featuredPosts[0] || null;
  const gridPosts = featuredPost
    ? posts.filter((p) => p.slug !== featuredPost.slug)
    : posts;

  return (
    <main>
      {/* Page hero */}
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb">
            <Link to="/">{lang === 'bn' ? 'হোম' : 'Home'}</Link>
            <span>/</span>
            <span>{lang === 'bn' ? 'ব্লগ' : 'Blog'}</span>
          </div>
          <h1>{lang === 'bn' ? 'ব্লগ ও নিবন্ধ' : 'Blog & Articles'}</h1>
          <p>
            {lang === 'bn'
              ? 'ছাত্র আন্দোলন এনডিএম-এর বিশ্লেষণ, মতামত এবং সংগঠনের কণ্ঠস্বর।'
              : 'Analysis, opinion, and the organizational voice of Student Movement – NDM Bangladesh.'}
          </p>
        </div>
      </section>

      <section className="section-pad">
        <div className="container">

          {/* Controls bar */}
          <div className="blog-controls reveal">
            {/* Category filters */}
            <div className="blog-filters">
              <button
                className={`blog-filter-btn ${activeCat === '' ? 'active' : ''}`}
                onClick={() => handleCategoryChange('')}
              >
                {lang === 'bn' ? 'সব' : 'All'}
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`blog-filter-btn ${String(activeCat) === String(cat.id) ? 'active' : ''}`}
                  onClick={() => handleCategoryChange(String(cat.id))}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Search */}
            <form className="blog-search" onSubmit={handleSearch}>
              <Search size={16} />
              <input
                type="search"
                placeholder={lang === 'bn' ? 'নিবন্ধ খুঁজুন...' : 'Search articles...'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search blog"
              />
              <button type="submit" className="blog-search__submit" aria-label="Search">
                <ArrowRight size={15} />
              </button>
            </form>
          </div>

          {/* Featured post */}
          {!search && !activeCat && page === 1 && <FeaturedHero post={featuredPost} />}

          {/* Loading skeleton */}
          {loading && (
            <div className="blog-skeleton-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="blog-skeleton-card">
                  <div className="blog-skeleton-img" />
                  <div className="blog-skeleton-body">
                    <div className="blog-skeleton-line blog-skeleton-line--short" />
                    <div className="blog-skeleton-line" />
                    <div className="blog-skeleton-line blog-skeleton-line--medium" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error state */}
          {!loading && error && (
            <div className="blog-error-state">
              <p>{error}</p>
              <button className="btn btn-outline" onClick={fetchPosts}>
                {lang === 'bn' ? 'আবার চেষ্টা করুন' : 'Try Again'}
              </button>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && posts.length === 0 && (
            <div className="blog-empty-state reveal">
              <Rss size={48} />
              <h3>{lang === 'bn' ? 'কোনো নিবন্ধ পাওয়া যায়নি' : 'No articles found'}</h3>
              <p>
                {lang === 'bn'
                  ? 'ভিন্ন অনুসন্ধান বা ফিল্টার ব্যবহার করুন।'
                  : 'Try a different search term or category filter.'}
              </p>
              {(search || activeCat) && (
                <button className="btn btn-outline" onClick={() => { setSearch(''); setActiveCat(''); setPage(1); }}>
                  {lang === 'bn' ? 'ফিল্টার সাফ করুন' : 'Clear Filters'}
                </button>
              )}
            </div>
          )}

          {/* Blog grid */}
          {!loading && !error && gridPosts.length > 0 && (
            <div className="blog-grid">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && <PaginationBar meta={meta} onPage={handlePage} />}

        </div>
      </section>
    </main>
  );
}
