import { FileText, FileImage, FileArchive, FileSpreadsheet, File } from 'lucide-react';
import { formatDateTime, formatFileSize } from '../utils/contentFormatters';

function resolveIcon(type) {
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'image'].includes(type)) return FileImage;
  if (['pdf', 'doc', 'docx'].includes(type)) return FileText;
  if (['xls', 'xlsx', 'csv'].includes(type)) return FileSpreadsheet;
  if (['zip', 'rar', '7z'].includes(type)) return FileArchive;
  return File;
}

export default function AttachmentItem({ item, onRemove, removable = false }) {
  const Icon = resolveIcon(item.file_type);

  return (
    <div className="cnt-attachment-item">
      <div className="cnt-attachment-item__icon"><Icon size={18} /></div>
      <div className="cnt-attachment-item__body">
        <div className="cnt-attachment-item__name">{item.original_name}</div>
        <div className="cnt-attachment-item__meta">{formatFileSize(item.file_size)} · {formatDateTime(item.uploaded_at)}</div>
      </div>
      <div className="cnt-attachment-item__actions">
        <a className="ndm-btn ndm-btn--ghost" href={item.url || '#'} target="_blank" rel="noreferrer">View</a>
        {removable ? <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => onRemove?.(item)}>Delete</button> : null}
      </div>
    </div>
  );
}
