import { Eye, GitBranch, Pencil, RefreshCcw, Trash2, Users } from 'lucide-react';
import CommitteeStatusBadge from '../../shared/components/CommitteeStatusBadge';
import CommitteeTypeBadge from '../../shared/components/CommitteeTypeBadge';
import CommitteeLocationBlock from '../../shared/components/CommitteeLocationBlock';
import OrganizationTable from '../../shared/components/OrganizationTable';

function formatDate(value) {
  return value ? new Date(value).toLocaleDateString() : '—';
}

export default function CommitteeTable({ items, onView, onEdit, onStatus, onDelete, onTree, onChildren }) {
  return (
    <OrganizationTable
      columns={[
        { key: 'select', label: ' ' },
        { key: 'committee_no', label: 'Committee No' },
        { key: 'name', label: 'Committee Name' },
        { key: 'type', label: 'Committee Type' },
        { key: 'parent', label: 'Parent Committee' },
        { key: 'location', label: 'Location' },
        { key: 'status', label: 'Status' },
        { key: 'current', label: 'Current' },
        { key: 'start_date', label: 'Start Date' },
        { key: 'actions', label: 'Actions' },
      ]}
      rows={items}
      testId="committees-table"
      renderRow={(item) => (
        <tr key={item.id}>
          <td><input type="checkbox" aria-label={`select-${item.committee_no}`} /></td>
          <td className="ndm-table__mono">{item.committee_no}</td>
          <td>{item.name}</td>
          <td><CommitteeTypeBadge value={item.committee_type_name} /></td>
          <td>{item.parent_name || 'Root Committee'}</td>
          <td><CommitteeLocationBlock committee={item} /></td>
          <td><CommitteeStatusBadge value={item.status} /></td>
          <td>{item.is_current ? <span className="org-pill org-pill--green">Current</span> : <span className="org-pill org-pill--slate">Past</span>}</td>
          <td>{formatDate(item.start_date)}</td>
          <td>
            <div className="ndm-table__actions">
              <button type="button" className="ndm-icon-btn" onClick={() => onView(item.id)} aria-label="View committee"><Eye size={16} /></button>
              <button type="button" className="ndm-icon-btn" onClick={() => onEdit(item.id)} aria-label="Edit committee"><Pencil size={16} /></button>
              <button type="button" className="ndm-icon-btn ndm-icon-btn--warning" onClick={() => onStatus(item)} aria-label="Change committee status"><RefreshCcw size={16} /></button>
              <button type="button" className="ndm-icon-btn" onClick={() => onChildren(item.id)} aria-label="View child committees"><Users size={16} /></button>
              <button type="button" className="ndm-icon-btn" onClick={() => onTree(item.id)} aria-label="Open committee tree"><GitBranch size={16} /></button>
              <button type="button" className="ndm-icon-btn ndm-icon-btn--danger" onClick={() => onDelete(item)} aria-label="Delete committee"><Trash2 size={16} /></button>
            </div>
          </td>
        </tr>
      )}
    />
  );
}
