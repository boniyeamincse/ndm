import { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Calendar, Tag, User, Eye, ArrowLeft, Rss, Share2 } from 'lucide-react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useLang } from '../../context/LanguageContext';
import { blogService } from './blogService';
import './Blog.css';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function ShareBar({ title, url }) {
  function share(platform) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const targets = {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
    };
    window.open(targets[platform], '_blank', 'noopener,noreferrer,width=620,height=450');
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      alert('Link copied!');
    } catch {
      // silently fail
    }
  }

  return (
    <div className="blog-detail__share">
      <span className="blog-detail__share-label"><Share2 size={14} /> Share</span>
      <button className="blog-share-btn blog-share-btn--fb" onClick={() => share('facebook')} aria-label="Share on Facebook">Facebook</button>
      <button className="blog-share-btn blog-share-btn--tw" onClick={() => share('twitter')} aria-label="Share on Twitter">Twitter</button>
      <button className="blog-share-btn blog-share-btn--wa" onClick={() => share('whatsapp')} aria-label="Share on WhatsApp">WhatsApp</button>
      <button className="blog-share-btn" onClick={copyLink} aria-label="Copy link">Copy Link</button>
    </div>
  );
}

function RelatedPostCard({ post }) {
  return (
    <article className="blog-related-card card">
      <Link to={`/blog/${post.slug}`} className="blog-related-card__img-link">
        <div className="blog-related-card__img">
          {post.featured_image_url
            ? <img src={post.featured_image_url} alt={post.featured_image_alt || post.title} loading="lazy" />
            : <div className="blog-card__img-placeholder"><Rss size={24} /></div>}
        </div>
      </Link>
      <div className="blog-related-card__body">
        <h4><Link to={`/blog/${post.slug}`}>{post.title}</Link></h4>
        {post.published_at && (
          <span className="blog-card__date"><Calendar size={12} /> {formatDate(post.published_at)}</span>
        )}
      </div>
    </article>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { lang } = useLang();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useScrollReveal();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    setError('');
    setPost(null);

    blogService.getBlogBySlug(slug)
      .then((data) => {
        setPost(data);
        // Load related posts from the same category
        const catId = data?.category?.id;
        return blogService.listBlogs({ per_page: 4, ...(catId ? { post_category_id: catId } : {}) })
          .then((res) => {
            setRelated(res.items.filter((p) => p.slug !== slug).slice(0, 3));
          })
          .catch(() => {});
      })
      .catch((err) => {
        if (err.status === 404) {
          setError('404');
        } else {
          setError(err.message || 'Failed to load article.');
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  // Update document title/meta
  useEffect(() => {
    if (!post) return;
    document.title = (post.meta_title || post.title) + ' — NDM Blog';
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = post.meta_description || post.excerpt || '';
  }, [post]);

  if (loading) {
    return (
      <main>
        <div className="container" style={{ padding: '4rem 1rem' }}>
          <div className="blog-detail-skeleton">
            <div className="blog-skeleton-line blog-skeleton-line--short" style={{ width: '40%', height: '1.5rem', marginBottom: '1rem' }} />
            <div className="blog-skeleton-line" style={{ height: '2.5rem', marginBottom: '.75rem' }} />
            <div className="blog-skeleton-line blog-skeleton-line--medium" style={{ height: '1rem', marginBottom: '2rem' }} />
            <div className="blog-skeleton-img" style={{ height: '400px', borderRadius: '1rem', marginBottom: '2rem' }} />
            <div className="blog-skeleton-line" />
            <div className="blog-skeleton-line" />
            <div className="blog-skeleton-line blog-skeleton-line--medium" />
          </div>
        </div>
      </main>
    );
  }

  if (error === '404') {
    return (
      <main>
        <div className="blog-error-state" style={{ minHeight: '60vh' }}>
          <Rss size={56} />
          <h2>{lang === 'bn' ? 'নিবন্ধটি পাওয়া যায়নি' : 'Article Not Found'}</h2>
          <p>{lang === 'bn' ? 'এই নিবন্ধটি প্রকাশিত হয়নি অথবা সরিয়ে দেওয়া হয়েছে।' : 'This article may not exist or has been removed.'}</p>
          <Link to="/blog" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            <ArrowLeft size={15} /> {lang === 'bn' ? 'ব্লগে ফিরুন' : 'Back to Blog'}
          </Link>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main>
        <div className="blog-error-state" style={{ minHeight: '60vh' }}>
          <p>{error}</p>
          <button className="btn btn-outline" onClick={() => navigate(-1)}>Go Back</button>
        </div>
      </main>
    );
  }

  if (!post) return null;

  const pageUrl = window.location.href;

  return (
    <main>
      <article className="blog-detail">
        {/* Header */}
        <div className="blog-detail__header">
          <div className="container">
            <div className="blog-detail__breadcrumbs">
              <Link to="/">{lang === 'bn' ? 'হোম' : 'Home'}</Link>
              <span>/</span>
              <Link to="/blog">{lang === 'bn' ? 'ব্লগ' : 'Blog'}</Link>
              <span>/</span>
              <span>{post.title}</span>
            </div>

            {post.category?.name && (
              <span className="blog-card__cat blog-detail__cat">{post.category.name}</span>
            )}

            <h1 className="blog-detail__title">{post.title}</h1>

            {post.excerpt && (
              <p className="blog-detail__excerpt">{post.excerpt}</p>
            )}

            <div className="blog-detail__byline">
              {post.author_name && (
                <span className="blog-detail__byline-item">
                  <User size={14} />
                  {post.author_name}
                </span>
              )}
              {post.published_at && (
                <span className="blog-detail__byline-item">
                  <Calendar size={14} />
                  {formatDate(post.published_at)}
                </span>
              )}
              {post.view_count > 0 && (
                <span className="blog-detail__byline-item">
                  <Eye size={14} />
                  {post.view_count.toLocaleString()} {lang === 'bn' ? 'বার পড়া হয়েছে' : 'views'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Featured image */}
        {post.featured_image_url && (
          <div className="blog-detail__cover">
            <div className="container">
              <figure className="blog-detail__cover-figure">
                <img
                  src={post.featured_image_url}
                  alt={post.featured_image_alt || post.title}
                  loading="eager"
                />
              </figure>
            </div>
          </div>
        )}

        {/* Body + Sidebar */}
        <div className="container">
          <div className="blog-detail__layout">

            {/* Main content */}
            <div className="blog-detail__main">
              <div
                className="blog-detail__content prose"
                dangerouslySetInnerHTML={{ __html: post.content || '' }}
              />

              {/* Tags */}
              {Array.isArray(post.tags) && post.tags.length > 0 && (
                <div className="blog-detail__tags">
                  <Tag size={14} />
                  {post.tags.map((tag) => (
                    <Link key={tag} to={`/blog?search=${encodeURIComponent(tag)}`} className="blog-tag-chip">
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Share */}
              <ShareBar title={post.title} url={pageUrl} />

              {/* Back */}
              <div className="blog-detail__back">
                <Link to="/blog" className="blog-back-btn">
                  <ArrowLeft size={15} />
                  {lang === 'bn' ? 'সব নিবন্ধে ফিরুন' : 'Back to All Articles'}
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="blog-detail__sidebar">
              {/* About box */}
              <div className="blog-sidebar-card card">
                <div className="blog-sidebar-card__head">
                  <img src="/images/logo/logo.jpeg" alt="NDM Logo" className="blog-sidebar-card__logo" />
                  <span>Student Movement – NDM</span>
                </div>
                <p className="blog-sidebar-card__body">
                  {lang === 'bn'
                    ? 'ছাত্র আন্দোলন-এনডিএম বাংলাদেশে গণতান্ত্রিক ও প্রগতিশীল ছাত্র রাজনীতির অগ্রপথিক।'
                    : 'Student Movement – NDM is the student wing of NDM Bangladesh, championing democratic values and youth leadership.'}
                </p>
                <Link to="/join" className="btn btn-primary btn-sm" style={{ marginTop: '.75rem' }}>
                  {lang === 'bn' ? 'যোগ দিন' : 'Join Us'}
                </Link>
              </div>

              {/* Related posts */}
              {related.length > 0 && (
                <div className="blog-sidebar-section">
                  <h3 className="blog-sidebar-section__title">
                    {lang === 'bn' ? 'সংশ্লিষ্ট নিবন্ধ' : 'Related Articles'}
                  </h3>
                  <div className="blog-related-list">
                    {related.map((p) => <RelatedPostCard key={p.slug} post={p} />)}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </article>
    </main>
  );
}
