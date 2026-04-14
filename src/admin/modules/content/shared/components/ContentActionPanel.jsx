export default function ContentActionPanel({ title = 'Actions', children }) {
  return (
    <aside className="ndm-action-panel cnt-action-panel">
      <h4>{title}</h4>
      <div className="ndm-action-panel__grid">{children}</div>
    </aside>
  );
}
