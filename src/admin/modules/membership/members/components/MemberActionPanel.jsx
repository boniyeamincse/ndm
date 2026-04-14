export default function MemberActionPanel({ member, onEdit, onStatus, onViewAssignments, onViewHierarchy }) {
  return (
    <div className="ndm-action-panel" data-testid="member-action-panel">
      <h4>Member Actions</h4>
      <div className="ndm-action-panel__grid">
        <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onEdit(member)}>
          Edit Member
        </button>
        <button type="button" className="ndm-btn ndm-btn--warning" onClick={() => onStatus(member, 'inactive')}>
          Update Status
        </button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onViewAssignments(member)}>
          View Assignments
        </button>
        <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onViewHierarchy(member)}>
          View Hierarchy
        </button>
      </div>
    </div>
  );
}
