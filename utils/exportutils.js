// utils/exportUtils.js
import * as XLSX from 'xlsx';

export const exportDataGridToCsv = (selectedRows, rows, columns) => {
  const selectedData = rows.filter((row) => selectedRows.includes(row.id));
  const csvContent = selectedData.map((row) =>
    columns.map((col) => row[col.field] || "").join(",")
  );
  const csvFile = new Blob([csvContent.join("\n")], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(csvFile);
  downloadLink.download = "data.csv";
  downloadLink.click();
};

export const exportDataGridToExcel = (selectedRows, rows, columns) => {
  const selectedData = rows.filter((row) => selectedRows.includes(row.id));
  const worksheet = XLSX.utils.json_to_sheet(selectedData, {
    header: columns.map((col) => col.headerName),
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, "data.xlsx");
};
