import { useEffect, useState } from 'react';

const MODAL_COPY = {
  publish: {
    title: 'Publish Post',
    description: 'Confirm publication. Public visibility rules will apply once the post is published.',
    confirmLabel: 'Publish Post',
  },
  unpublish: {
    title: 'Unpublish Post',
    description: 'This will remove the post from public feeds until it is published again.',
    confirmLabel: 'Unpublish',
  },
  archive: {
    title: 'Archive Post',
    description: 'Archive this post to remove it from active editorial workflows.',
    confirmLabel: 'Archive Post',
  },
  delete: {
    title: 'Delete Post',
    description: 'This action should be used carefully. The post will be marked for removal.',
    confirmLabel: 'Delete Post',
  },
  restore: {
    title: 'Restore Post',
    description: 'Restore this post back into the editorial workflow.',
    confirmLabel: 'Restore Post',
  },
  feature: {
    title: 'Feature Settings',
    description: 'Control whether this post is featured and eligible for homepage placement.',
    confirmLabel: 'Save Feature Settings',
  },
};

export default function PostWorkflowModal({ mode, post, busy, onClose, onConfirm }) {
  const copy = MODAL_COPY[mode] || MODAL_COPY.publish;
  const [publishAt, setPublishAt] = useState(post?.published_at || '');
  const [isFeatured, setIsFeatured] = useState(Boolean(post?.is_featured));
  const [allowOnHomepage, setAllowOnHomepage] = useState(Boolean(post?.allow_on_homepage));

  useEffect(() => {
    setPublishAt(post?.published_at || '');
    setIsFeatured(Boolean(post?.is_featured));
    setAllowOnHomepage(Boolean(post?.allow_on_homepage));
  }, [post]);

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === 'publish') {
      onConfirm({ publish_at: publishAt });
      return;
    }
    if (mode === 'feature') {
      onConfirm({ is_featured: isFeatured, allow_on_homepage: allowOnHomepage });
      return;
    }
    onConfirm();
  }

  if (!post) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
        <form onSubmit={handleSubmit}>
          {mode === 'publish' ? (
            <label>
              Publish time
              <input
                type="datetime-local"
                className="ndm-input"
                value={publishAt}
                onChange={(event) => setPublishAt(event.target.value)}
              />
            </label>
          ) : null}
          {mode === 'feature' ? (
            <div className="cnt-form__toggles">
              <label className="ndm-checkbox-row">
                <input type="checkbox" checked={isFeatured} onChange={(event) => setIsFeatured(event.target.checked)} />
                <span>Feature this post</span>
              </label>
              <label className="ndm-checkbox-row">
                <input type="checkbox" checked={allowOnHomepage} onChange={(event) => setAllowOnHomepage(event.target.checked)} />
                <span>Allow on homepage</span>
              </label>
            </div>
          ) : null}
          <div className="ndm-modal__actions">
            <button type="button" className="ndm-btn ndm-btn--ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="ndm-btn ndm-btn--primary" disabled={busy}>{busy ? 'Saving...' : copy.confirmLabel}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
