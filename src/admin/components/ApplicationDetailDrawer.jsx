import { X, User, Mail, Phone, MapPin, GraduationCap, Calendar, CheckCircle, XCircle, Clock, Hourglass, ExternalLink } from 'lucide-react';
import { useApplicationDetail } from '../hooks/useApplications';
import { StatusBadge } from './ApplicationsTable';
import { useNavigate } from 'react-router-dom';

function Field({ label, value }) {
  return (
    <div className="app-drawer__field">
      <span className="app-drawer__field-label">{label}</span>
      <span className="app-drawer__field-value">{value || '—'}</span>
    </div>
  );
}

function FieldGroup({ title, children }) {
  return (
    <div className="app-drawer__group">
      <h4 className="app-drawer__group-title">{title}</h4>
      {children}
    </div>
  );
}

function StatusTimeline({ history = [] }) {
  const STEP_COLORS = {
    pending:      '#e67e22',
    under_review: '#2980b9',
    approved:     '#27ae60',
    rejected:     '#c0392b',
    on_hold:      '#7f8c8d',
  };
  return (
    <ol className="app-timeline">
      {history.map((step, i) => (
        <li key={step.id ?? i} className="app-timeline__step">
          <span
            className="app-timeline__dot"
            style={{ background: STEP_COLORS[step.new_status] || '#64748b' }}
          />
          <div className="app-timeline__body">
            <p className="app-timeline__status">{step.new_status?.replace('_', ' ')}</p>
            {step.note && <p className="app-timeline__note">{step.note}</p>}
            <span className="app-timeline__meta">
              {step.changed_by ? `${step.changed_by} · ` : ''}
              {new Date(step.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ApplicationDetailDrawer({ appId, onClose, onAction }) {
  const { data, loading, error } = useApplicationDetail(appId);
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      <div className="app-drawer-overlay" onClick={onClose} aria-hidden="true" />

      <aside className="app-drawer" role="dialog" aria-modal="true" aria-label="Application Detail">
        <div className="app-drawer__header">
          <div>
            <h2 className="app-drawer__title">Application Detail</h2>
            {data && <p className="app-drawer__subtitle">{data.application_no}</p>}
          </div>
          <button type="button" className="adm-icon-button" onClick={onClose} aria-label="Close drawer">
            <X size={18} />
          </button>
        </div>

        <div className="app-drawer__body">
          {loading && (
            <div className="app-drawer__loading">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="adm-skeleton" style={{ height: 18, marginBottom: 12, width: i % 3 === 0 ? '60%' : '100%' }} />
              ))}
            </div>
          )}

          {error && (
            <p className="app-drawer__error">Failed to load: {error}</p>
          )}

          {data && !loading && (
            <>
              {/* Status strip */}
              <div className="app-drawer__status-strip">
                <StatusBadge status={data.status} />
                {data.member && (
                  <button
                    type="button"
                    className="app-drawer__member-link"
                    onClick={() => navigate(`/admin/members/${data.member.id}`)}
                  >
                    <ExternalLink size={12} />
                    View Member Profile
                  </button>
                )}
              </div>

              {/* Quick actions */}
              {(data.status === 'pending' || data.status === 'under_review') && (
                <div className="app-drawer__quick-actions">
                  {data.status === 'pending' && (
                    <button
                      type="button"
                      className="app-drawer-action app-drawer-action--review"
                      onClick={() => onAction('review', data)}
                    >
                      <Clock size={14} /> Mark Under Review
                    </button>
                  )}
                  <button
                    type="button"
                    className="app-drawer-action app-drawer-action--approve"
                    onClick={() => onAction('approve', data)}
                  >
                    <CheckCircle size={14} /> Approve
                  </button>
                  <button
                    type="button"
                    className="app-drawer-action app-drawer-action--reject"
                    onClick={() => onAction('reject', data)}
                  >
                    <XCircle size={14} /> Reject
                  </button>
                  <button
                    type="button"
                    className="app-drawer-action app-drawer-action--hold"
                    onClick={() => onAction('hold', data)}
                  >
                    <Hourglass size={14} /> Hold
                  </button>
                </div>
              )}

              {/* Personal */}
              <FieldGroup title="Personal Information">
                <Field label="Full Name" value={data.full_name} />
                <Field label="Father's Name" value={data.father_name} />
                <Field label="Mother's Name" value={data.mother_name} />
                <Field label="Gender" value={data.gender} />
                <Field label="Date of Birth" value={data.date_of_birth} />
                <Field label="Blood Group" value={data.blood_group} />
                <Field label="National ID" value={data.national_id} />
              </FieldGroup>

              {/* Contact */}
              <FieldGroup title="Contact">
                <Field label="Email" value={data.email} />
                <Field label="Mobile" value={data.mobile} />
                <Field label="Emergency Contact" value={data.emergency_contact_name} />
                <Field label="Emergency Phone" value={data.emergency_contact_phone} />
              </FieldGroup>

              {/* Education */}
              <FieldGroup title="Education">
                <Field label="Institution" value={data.educational_institution} />
                <Field label="Department" value={data.department} />
                <Field label="Academic Year" value={data.academic_year} />
                <Field label="Student ID" value={data.student_id} />
                <Field label="Occupation" value={data.occupation} />
              </FieldGroup>

              {/* Address */}
              <FieldGroup title="Address">
                <Field label="Division" value={data.division_name} />
                <Field label="District" value={data.district_name} />
                <Field label="Upazila" value={data.upazila_name} />
                <Field label="Union" value={data.union_name} />
                <Field label="Post Office" value={data.post_office} />
                <Field label="Village / Area" value={data.village_area} />
                <Field label="Address Line" value={data.address_line} />
              </FieldGroup>

              {/* Motivation */}
              {data.motivation && (
                <FieldGroup title="Motivation">
                  <p className="app-drawer__motivation">{data.motivation}</p>
                </FieldGroup>
              )}

              {/* Rejection reason */}
              {data.rejection_reason && (
                <div className="app-drawer__rejection">
                  <p className="app-drawer__rejection-label">Rejection Reason</p>
                  <p>{data.rejection_reason}</p>
                </div>
              )}

              {/* Timeline */}
              {data.status_history?.length > 0 && (
                <FieldGroup title="Status History">
                  <StatusTimeline history={data.status_history} />
                </FieldGroup>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  );
}
