export default function ReportDataTable({ columns = [], rows = [] }) {
  return (
    <div className="ndm-table-wrap">
      <table className="ndm-table">
        <thead>
          <tr>
            {columns.map((column) => <th key={column.key}>{column.label}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={row.id || row.request_no || row.application_no || row.post_no || row.notice_no || `${index}`}>
              {columns.map((column) => <td key={column.key}>{row[column.key] ?? '—'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
