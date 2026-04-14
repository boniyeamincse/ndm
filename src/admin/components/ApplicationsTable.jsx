import { Eye, CheckCircle, XCircle, Clock, Hourglass } from 'lucide-react';

const STATUS_CONFIG = {
  pending:      { label: 'Pending',      color: '#e67e22', bg: '#fef9e7' },
  under_review: { label: 'Under Review', color: '#2980b9', bg: '#eaf4fb' },
  approved:     { label: 'Approved',     color: '#27ae60', bg: '#eafaf1' },
  rejected:     { label: 'Rejected',     color: '#c0392b', bg: '#fdedec' },
  on_hold:      { label: 'On Hold',      color: '#7f8c8d', bg: '#f2f3f4' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: '#64748b', bg: '#f1f5f9' };
  return (
    <span
      className="app-status-badge"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      {cfg.label}
    </span>
  );
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ApplicationsTable({ data, loading, onView, onAction }) {
  if (loading) {
    return (
      <div className="app-table-wrap">
        <table className="app-table">
          <thead>
            <tr>
              {['App No.', 'Name', 'Email', 'Mobile', 'District', 'Status', 'Applied', 'Actions'].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 8 }).map((_, i) => (
              <tr key={i}>
                {Array.from({ length: 8 }).map((__, j) => (
                  <td key={j}><div className="adm-skeleton" style={{ height: 18, borderRadius: 4 }} /></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="app-table-empty">
        <p>No applications found for the selected filter.</p>
      </div>
    );
  }

  return (
    <div className="app-table-wrap">
      <table className="app-table">
        <thead>
          <tr>
            <th>App No.</th>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>District</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((app) => (
            <tr key={app.id}>
              <td className="app-table__mono">{app.application_no}</td>
              <td className="app-table__name">{app.full_name}</td>
              <td className="app-table__email">{app.email || '—'}</td>
              <td>{app.mobile || '—'}</td>
              <td>{app.district_name || '—'}</td>
              <td><StatusBadge status={app.status} /></td>
              <td>{formatDate(app.created_at)}</td>
              <td>
                <div className="app-table__actions">
                  <button
                    type="button"
                    className="app-action-btn app-action-btn--view"
                    title="View detail"
                    onClick={() => onView(app)}
                  >
                    <Eye size={14} />
                  </button>

                  {app.status === 'pending' && (
                    <button
                      type="button"
                      className="app-action-btn app-action-btn--review"
                      title="Mark under review"
                      onClick={() => onAction('review', app)}
                    >
                      <Clock size={14} />
                    </button>
                  )}

                  {(app.status === 'pending' || app.status === 'under_review') && (
                    <>
                      <button
                        type="button"
                        className="app-action-btn app-action-btn--approve"
                        title="Approve"
                        onClick={() => onAction('approve', app)}
                      >
                        <CheckCircle size={14} />
                      </button>
                      <button
                        type="button"
                        className="app-action-btn app-action-btn--reject"
                        title="Reject"
                        onClick={() => onAction('reject', app)}
                      >
                        <XCircle size={14} />
                      </button>
                      <button
                        type="button"
                        className="app-action-btn app-action-btn--hold"
                        title="Put on hold"
                        onClick={() => onAction('hold', app)}
                      >
                        <Hourglass size={14} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { StatusBadge };
