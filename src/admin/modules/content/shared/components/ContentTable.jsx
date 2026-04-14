export default function ContentTable({ columns = [], rows = [], renderRow, testId = 'content-table' }) {
  return (
    <div className="ndm-table-wrap" data-testid={testId}>
      <table className="ndm-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => renderRow(row, idx))}
        </tbody>
      </table>
    </div>
  );
}
