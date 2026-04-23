import { publicApi } from '../../services/publicApi';

const BLOG_BASE = '/public/blogs';
const POSTS_BASE = '/public/posts';
const FEATURED_BASE = '/public/featured-posts';
const CATEGORIES_BASE = '/public/post-categories';

/**
 * List published blog posts (content_type=blog).
 * @param {Object} params - { search, post_category_id, featured_only, sort_by, sort_dir, per_page, page }
 */
async function listBlogs(params = {}) {
  const path = publicApi.withQuery(BLOG_BASE, params);
  const payload = await publicApi.request(path);
  // API returns { success, data: { data: [...], meta: {...} } }
  const raw = payload?.data ?? payload;
  const items = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
  const meta = raw?.meta ?? {
    current_page: 1,
    last_page: 1,
    per_page: items.length,
    total: items.length,
  };
  return { items, meta };
}

/**
 * Get a single published blog post by slug.
 */
async function getBlogBySlug(slug) {
  const payload = await publicApi.request(`${POSTS_BASE}/${encodeURIComponent(slug)}`);
  return payload?.data ?? payload;
}

/**
 * List featured published posts.
 */
async function listFeatured(params = {}) {
  const path = publicApi.withQuery(FEATURED_BASE, { ...params, content_type: 'blog' });
  const payload = await publicApi.request(path);
  const raw = payload?.data ?? payload;
  return Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
}

/**
 * List active post categories.
 */
async function listCategories() {
  const payload = await publicApi.request(CATEGORIES_BASE);
  const raw = payload?.data ?? payload;
  return Array.isArray(raw) ? raw : [];
}

export const blogService = { listBlogs, getBlogBySlug, listFeatured, listCategories };
