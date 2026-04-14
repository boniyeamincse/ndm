import { useState, useCallback } from 'react';
import { FileText, Download, Plus, Search, X, AlertTriangle } from 'lucide-react';
import AdminPageHeader from '../components/AdminPageHeader';
import AdminContentWrapper, { PageContainer, PageSection } from '../components/AdminContentWrapper';
import ApplicationsTable from '../components/ApplicationsTable';
import ApplicationDetailDrawer from '../components/ApplicationDetailDrawer';
import { useApplications } from '../hooks/useApplications';
import { applicationService } from '../services/applicationService';
import { useLocation } from 'react-router-dom';

const STATUS_TABS = [
  { key: '',             label: 'All' },
  { key: 'pending',      label: 'Pending' },
  { key: 'under_review', label: 'Under Review' },
  { key: 'approved',     label: 'Approved' },
  { key: 'rejected',     label: 'Rejected' },
  { key: 'on_hold',      label: 'On Hold' },
];

// Modal for reject / hold — both need a text note
function ActionModal({ action, app, onConfirm, onCancel, busy }) {
  const [note, setNote] = useState('');

  const isReject = action === 'reject';
  const title  = isReject ? 'Reject Application' : 'Put Application On Hold';
  const label  = isReject ? 'Rejection reason' : 'Note (optional)';
  const btnLabel = isReject ? 'Confirm Reject' : 'Confirm Hold';

  return (
    <div className="app-modal-overlay" onClick={onCancel}>
      <div className="app-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="app-modal__header">
          <AlertTriangle size={18} className="app-modal__icon" />
          <h3 className="app-modal__title">{title}</h3>
        </div>
        <p className="app-modal__sub">
          Application <strong>{app?.application_no}</strong> — {app?.full_name}
        </p>
        <label className="app-modal__label">{label}</label>
        <textarea
          className="app-modal__textarea"
          rows={3}
          placeholder={isReject ? 'Provide a reason…' : 'Add a note…'}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          required={isReject}
        />
        <div className="app-modal__footer">
          <button type="button" className="app-modal-btn app-modal-btn--cancel" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className={`app-modal-btn ${isReject ? 'app-modal-btn--danger' : 'app-modal-btn--warning'}`}
            onClick={() => onConfirm(note)}
            disabled={busy || (isReject && !note.trim())}
          >
            {busy ? 'Processing…' : btnLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Simple confirm modal for approve / review
function ConfirmModal({ action, app, onConfirm, onCancel, busy }) {
  const isApprove = action === 'approve';
  return (
    <div className="app-modal-overlay" onClick={onCancel}>
      <div className="app-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <div className="app-modal__header">
          <AlertTriangle size={18} className="app-modal__icon" />
          <h3 className="app-modal__title">{isApprove ? 'Approve Application?' : 'Mark as Under Review?'}</h3>
        </div>
        <p className="app-modal__sub">
          Application <strong>{app?.application_no}</strong> — {app?.full_name}
        </p>
        <div className="app-modal__footer">
          <button type="button" className="app-modal-btn app-modal-btn--cancel" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            className={`app-modal-btn ${isApprove ? 'app-modal-btn--success' : 'app-modal-btn--primary'}`}
            onClick={() => onConfirm()}
            disabled={busy}
          >
            {busy ? 'Processing…' : 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MembershipApplications() {
  const location = useLocation();
  // Allow arriving from dashboard with ?status=pending pre-selected
  const qsStatus = new URLSearchParams(location.search).get('status') || '';

  const [statusFilter, setStatusFilter] = useState(qsStatus);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [page, setPage] = useState(1);

  // Detail drawer
  const [drawerAppId, setDrawerAppId] = useState(null);

  // Action modal state
  const [modal, setModal] = useState(null); // { action, app }
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const filters = { status: statusFilter, search, page, per_page: 20 };
  const { data, meta, loading, error, reload } = useApplications(filters);

  function handleSearchSubmit(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  function handleClearSearch() {
    setSearchInput('');
    setSearch('');
    setPage(1);
  }

  function handleTabChange(key) {
    setStatusFilter(key);
    setPage(1);
  }

  function handleView(app) {
    setDrawerAppId(app.id);
  }

  function handleAction(action, app) {
    setActionError(null);
    if (action === 'approve' || action === 'review') {
      setModal({ action, app });
    } else {
      // reject / hold need a text modal
      setModal({ action, app });
    }
  }

  async function executeAction(note = '') {
    const { action, app } = modal;
    setActionBusy(true);
    setActionError(null);
    try {
      if (action === 'approve') await applicationService.approve(app.id);
      else if (action === 'review') await applicationService.review(app.id);
      else if (action === 'reject') await applicationService.reject(app.id, note);
      else if (action === 'hold') await applicationService.hold(app.id, note);

      setModal(null);
      setActionSuccess(`Application ${app.application_no} ${action}d successfully.`);
      setDrawerAppId(null);
      reload();
      setTimeout(() => setActionSuccess(null), 4000);
    } catch (err) {
      setActionError(err.message || 'Action failed. Please try again.');
    } finally {
      setActionBusy(false);
    }
  }

  const needsNote = modal?.action === 'reject' || modal?.action === 'hold';

  return (
    <AdminContentWrapper>
      <PageContainer>
        <AdminPageHeader
          title="Membership Applications"
          subtitle={`${meta.total.toLocaleString()} total application${meta.total !== 1 ? 's' : ''}`}
          breadcrumbs={[
            { label: 'Admin', path: '/admin/dashboard' },
            { label: 'Organization' },
            { label: 'Membership Applications' },
          ]}
          actions={(
            <button type="button" className="adm-page-action">
              <Download size={16} />
              <span>Export</span>
            </button>
          )}
        />

        {actionSuccess && (
          <div className="app-toast app-toast--success">{actionSuccess}</div>
        )}
        {actionError && (
          <div className="app-toast app-toast--error">{actionError}</div>
        )}

        <PageSection>
          {/* Filter toolbar */}
          <div className="app-toolbar">
            {/* Status tabs */}
            <div className="app-status-tabs">
              {STATUS_TABS.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  className={`app-status-tab ${statusFilter === tab.key ? 'app-status-tab--active' : ''}`}
                  onClick={() => handleTabChange(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <form className="app-search" onSubmit={handleSearchSubmit}>
              <Search size={15} className="app-search__icon" />
              <input
                type="text"
                className="app-search__input"
                placeholder="Search by name, email, mobile…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              {searchInput && (
                <button type="button" className="app-search__clear" onClick={handleClearSearch} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Error banner */}
          {error && (
            <div className="app-error-banner">
              <AlertTriangle size={16} />
              Failed to load applications: {error}
            </div>
          )}

          {/* Table */}
          <ApplicationsTable
            data={data}
            loading={loading}
            onView={handleView}
            onAction={handleAction}
          />

          {/* Pagination */}
          {meta.last_page > 1 && (
            <div className="app-pagination">
              <button
                type="button"
                className="app-pagination__btn"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="app-pagination__info">
                Page {meta.current_page} of {meta.last_page}
                {' '}<span className="app-pagination__total">({meta.total.toLocaleString()} total)</span>
              </span>
              <button
                type="button"
                className="app-pagination__btn"
                disabled={page >= meta.last_page}
                onClick={() => setPage((p) => p + 1)}
              >
                Next →
              </button>
            </div>
          )}
        </PageSection>
      </PageContainer>

      {/* Detail Drawer */}
      {drawerAppId && (
        <ApplicationDetailDrawer
          appId={drawerAppId}
          onClose={() => setDrawerAppId(null)}
          onAction={handleAction}
        />
      )}

      {/* Action Modal */}
      {modal && (needsNote ? (
        <ActionModal
          action={modal.action}
          app={modal.app}
          onConfirm={executeAction}
          onCancel={() => { setModal(null); setActionError(null); }}
          busy={actionBusy}
        />
      ) : (
        <ConfirmModal
          action={modal.action}
          app={modal.app}
          onConfirm={executeAction}
          onCancel={() => { setModal(null); setActionError(null); }}
          busy={actionBusy}
        />
      ))}
    </AdminContentWrapper>
  );
}
