import SectionCard from '../../../membership/shared/components/SectionCard';
import AttachmentItem from './AttachmentItem';

export default function AttachmentList({ items = [], onRemove, removable = false, title = 'Attachments' }) {
  return (
    <SectionCard title={title}>
      <div className="cnt-attachment-list">
        {items.length ? items.map((item) => (
          <AttachmentItem key={item.id || item.uuid || item.original_name} item={item} onRemove={onRemove} removable={removable} />
        )) : <div className="cnt-attachment-list__empty">No attachments available.</div>}
      </div>
    </SectionCard>
  );
}
