import { useEffect, useState } from 'react';

const MODAL_COPY = {
  publish: { title: 'Publish Notice', description: 'Confirm publication timing and visibility for this notice.', confirmLabel: 'Publish Notice' },
  unpublish: { title: 'Unpublish Notice', description: 'Remove this notice from visible feeds until it is published again.', confirmLabel: 'Unpublish' },
  archive: { title: 'Archive Notice', description: 'Archive this notice to close its active workflow.', confirmLabel: 'Archive Notice' },
  pin: { title: 'Pin Notice', description: 'Control whether this notice is pinned in notice listings.', confirmLabel: 'Save Pin Setting' },
  delete: { title: 'Delete Notice', description: 'Delete this notice from the current workflow.', confirmLabel: 'Delete Notice' },
  restore: { title: 'Restore Notice', description: 'Restore this notice into the workflow.', confirmLabel: 'Restore Notice' },
};

export default function NoticeWorkflowModal({ mode, notice, busy, onClose, onConfirm }) {
  const copy = MODAL_COPY[mode] || MODAL_COPY.publish;
  const [publishAt, setPublishAt] = useState(notice?.publish_at || '');
  const [isPinned, setIsPinned] = useState(Boolean(notice?.is_pinned));

  useEffect(() => {
    setPublishAt(notice?.publish_at || '');
    setIsPinned(Boolean(notice?.is_pinned));
  }, [notice]);

  function handleSubmit(event) {
    event.preventDefault();
    if (mode === 'publish') {
      onConfirm({ publish_at: publishAt });
      return;
    }
    if (mode === 'pin') {
      onConfirm({ is_pinned: isPinned });
      return;
    }
    onConfirm();
  }

  if (!notice) return null;

  return (
    <div className="ndm-modal__overlay" onClick={onClose}>
      <div className="ndm-modal" onClick={(event) => event.stopPropagation()}>
        <h3>{copy.title}</h3>
        <p>{copy.description}</p>
        <form onSubmit={handleSubmit}>
          {mode === 'publish' ? (
            <label>
              Publish At
              <input type="datetime-local" className="ndm-input" value={publishAt} onChange={(event) => setPublishAt(event.target.value)} />
            </label>
          ) : null}
          {mode === 'pin' ? (
            <label className="ndm-checkbox-row">
              <input type="checkbox" checked={isPinned} onChange={(event) => setIsPinned(event.target.checked)} />
              <span>Pin this notice</span>
            </label>
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
