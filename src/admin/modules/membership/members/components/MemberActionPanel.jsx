import { useState } from 'react';
import { UserCog, UserCheck, UserMinus, Ban, Network, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import MemberStatusBadge from './MemberStatusBadge';

const STATUS_TRANSITIONS = {
  active: ['inactive', 'suspended', 'resigned', 'removed'],
  inactive: ['active', 'suspended', 'resigned', 'removed'],
  suspended: ['active', 'inactive', 'removed'],
  resigned: ['active'],
  removed: [],
};

const STATUS_LABELS = {
  active: { label: 'Activate', icon: UserCheck, variant: 'success' },
  inactive: { label: 'Mark Inactive', icon: UserMinus, variant: 'warning' },
  suspended: { label: 'Suspend', icon: Ban, variant: 'danger' },
  resigned: { label: 'Mark Resigned', icon: UserMinus, variant: 'ghost' },
  removed: { label: 'Remove Member', icon: Ban, variant: 'danger' },
};

export default function MemberActionPanel({ member, onEdit, onStatus, onViewAssignments, onViewHierarchy }) {
  const [showAllActions, setShowAllActions] = useState(false);
  const transitions = STATUS_TRANSITIONS[member?.status] || [];
  const visibleTransitions = showAllActions ? transitions : transitions.slice(0, 2);

  return (
    <aside className="ndm-action-panel" data-testid="member-action-panel">
      <div className="mem-action-panel__status">
        <span className="mem-action-panel__status-label">Current Status</span>
        <MemberStatusBadge value={member?.status} />
      </div>

      <hr className="mem-action-panel__divider" />

      <h4 className="mem-action-panel__section-title">Profile</h4>
      <div className="ndm-action-panel__grid">
        <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onEdit(member)}>
          <UserCog size={15} /> Edit Member
        </button>
      </div>

      {transitions.length > 0 ? (
        <>
          <hr className="mem-action-panel__divider" />
          <h4 className="mem-action-panel__section-title">Change Status</h4>
          <div className="ndm-action-panel__grid">
            {visibleTransitions.map((status) => {
              const cfg = STATUS_LABELS[status];
              const Icon = cfg.icon;
              return (
                <button
                  key={status}
                  type="button"
                  className={`ndm-btn ndm-btn--${cfg.variant}`}
                  onClick={() => onStatus(member, status)}
                >
                  <Icon size={14} /> {cfg.label}
                </button>
              );
            })}
            {transitions.length > 2 ? (
              <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => setShowAllActions((p) => !p)}>
                {showAllActions ? <><ChevronUp size={14} /> Show less</> : <><ChevronDown size={14} /> More actions</>}
              </button>
            ) : null}
          </div>
        </>
      ) : null}

      <hr className="mem-action-panel__divider" />
      <h4 className="mem-action-panel__section-title">Organisation</h4>
      <div className="ndm-action-panel__grid">
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onViewAssignments(member)}>
          <Briefcase size={14} /> View Assignments
        </button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onViewHierarchy(member)}>
          <Network size={14} /> View Hierarchy
        </button>
      </div>
    </aside>
  );
}
