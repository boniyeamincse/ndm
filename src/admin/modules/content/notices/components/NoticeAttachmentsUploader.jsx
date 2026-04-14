import { Upload, Paperclip } from 'lucide-react';

export default function NoticeAttachmentsUploader({ files = [], onFilesChange }) {
  function handleFiles(event) {
    const picked = Array.from(event.target.files || []);
    onFilesChange([...(files || []), ...picked]);
  }

  function removeFile(index) {
    onFilesChange((files || []).filter((_, currentIndex) => currentIndex !== index));
  }

  return (
    <div className="cnt-upload-box">
      <label className="cnt-upload-box__trigger">
        <input type="file" multiple onChange={handleFiles} className="cnt-upload-box__input" />
        <Upload size={18} />
        <span>Upload attachments</span>
      </label>
      <div className="cnt-upload-box__list">
        {(files || []).length ? files.map((file, index) => (
          <div key={`${file.name}-${index}`} className="cnt-upload-box__item">
            <div><Paperclip size={15} /> {file.name}</div>
            <button type="button" className="ndm-btn ndm-btn--ghost" onClick={() => removeFile(index)}>Remove</button>
          </div>
        )) : <div className="cnt-upload-box__empty">No new attachments selected.</div>}
      </div>
    </div>
  );
}
