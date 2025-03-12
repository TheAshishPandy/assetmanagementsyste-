import * as React from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, Button } from '@mui/material';
import * as XLSX from 'xlsx';

const columns = [
  { field: 'id', headerName: 'ID', width: 90, hideable: false },
  { field: 'firstName', headerName: 'First name', width: 150, editable: true },
  { field: 'lastName', headerName: 'Last name', width: 150, editable: true },
  { field: 'age', headerName: 'Age', type: 'number', width: 110, editable: true },
  { field: 'fullName', headerName: 'Full name', description: 'This column is not sortable.', sortable: false, width: 160 },
  { field: 'status', headerName: 'Status', type: 'singleSelect', valueOptions: ['Active', 'Inactive'], editable: true },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35, status: 'Active' },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42, status: 'Inactive' },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45, status: 'Active' },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16, status: 'Active' },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null, status: 'Inactive' },
];

export default function FullFeatureDataGrid() {
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Handle Excel Export
  const handleExcelExport = () => {
    const selectedData = rows.filter((row) => selectedRows.includes(row.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'exported_data.xlsx');
  };

  // Handle CSV Export
  const handleCSVExport = () => {
    const selectedData = rows.filter((row) => selectedRows.includes(row.id));
    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'exported_data.csv';
    link.click();
  };

  // Handle Print
  const handlePrint = () => {
    const printWindow = window.open('', '', 'height=600,width=800');
    printWindow.document.write('<html><head><title>Print Data</title></head><body>');
    printWindow.document.write('<h1>Exported Data</h1>');
    printWindow.document.write('<table border="1">');

    // Add table headers
    printWindow.document.write('<tr>');
    columns.forEach((column) => {
      printWindow.document.write(`<th>${column.headerName}</th>`);
    });
    printWindow.document.write('</tr>');

    // Add table rows
    rows.forEach((row) => {
      printWindow.document.write('<tr>');
      columns.forEach((column) => {
        printWindow.document.write(`<td>${row[column.field]}</td>`);
      });
      printWindow.document.write('</tr>');
    });

    printWindow.document.write('</table></body></html>');
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Box sx={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        components={{ Toolbar: GridToolbar }}
        experimentalFeatures={{ newEditingApi: true }}
        checkboxSelection
        onRowSelectionModelChange={(newSelection) => setSelectedRows(newSelection)}
        pagination
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        sortingMode="client"
        filterMode="client"
        autoHeight
        columnVisibilityModel={{ fullName: false }}
        pinnedColumns={{ left: ['id'] }}
        localeText={{
          toolbarExport: 'Export to Excel',
          toolbarFilters: 'Filters',
          toolbarDensity: 'Density',
        }}
        getAggregationPosition={(params) => (params.field === 'age' ? 'footer' : null)}
        groupingColDef={{ headerName: 'Group' }}
        onSortModelChange={(model) => console.log('Sort Model:', model)}
        onFilterModelChange={(model) => console.log('Filter Model:', model)}
      />
      <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
        <Button variant="contained" onClick={handleExcelExport}>
          Export to Excel
        </Button>
        <Button variant="contained" onClick={handleCSVExport}>
          Export to CSV
        </Button>
        <Button variant="contained" onClick={handlePrint}>
          Print
        </Button>
      </Box>
    </Box>
  );
}