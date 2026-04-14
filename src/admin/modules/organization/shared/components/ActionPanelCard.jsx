export default function ActionPanelCard({ title = 'Actions', children }) {
  return (
    <aside className="ndm-action-panel org-action-panel">
      <h4>{title}</h4>
      <div className="ndm-action-panel__grid">{children}</div>
    </aside>
  );
}
