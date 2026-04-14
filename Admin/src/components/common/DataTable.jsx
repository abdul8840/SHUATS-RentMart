const DataTable = ({ columns, data, loading, emptyMessage = 'No data found' }) => {
  if (loading) {
    return (
      <div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            {columns.map((col, i) => (
              <th key={i}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={row._id || rowIndex}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>
                  {col.render ? col.render(row) : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;