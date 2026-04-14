import ActionPanelCard from '../../shared/components/ActionPanelCard';

export default function CommitteeActionPanel({ committee, onEdit, onStatus, onMembers, onHierarchy, onChildren }) {
  return (
    <ActionPanelCard title="Committee Actions">
      <button type="button" className="ndm-btn ndm-btn--primary" onClick={() => onEdit(committee.id)}>Edit Committee</button>
      <button type="button" className="ndm-btn ndm-btn--warning" onClick={() => onStatus(committee)}>Change Status</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onMembers(committee.id)}>View Members</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onHierarchy(committee.id)}>View Hierarchy</button>
      <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onChildren(committee.id)}>View Child Committees</button>
    </ActionPanelCard>
  );
}
