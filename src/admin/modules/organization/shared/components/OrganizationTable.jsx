export default function OrganizationTable({ columns = [], rows = [], renderRow, testId = 'organization-table' }) {
  return (
    <div className="ndm-table-wrap" data-testid={testId}>
      <table className="ndm-table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.key}>{column.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => renderRow(row, index))}
        </tbody>
      </table>
    </div>
  );
}
