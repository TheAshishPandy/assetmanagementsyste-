import { DataGrid } from "@mui/x-data-grid"; // Import DataGrid from MUI
import React from "react";
import { Button, Menu, MenuItem, IconButton } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print"; // Import print icon
import { GridToolbar } from '@mui/x-data-grid';
import { exportDataGridToCsv, exportDataGridToExcel } from '@/utils/exportutils'; // Placeholder for export functions

const DataGridcomponent = ({
  rows,
  columns,
  onEdit,
  onDelete,
  enableCheckbox = false,
  enablePrintExport = false,
}) => {
  // State for managing dropdown menu visibility
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedRows, setSelectedRows] = React.useState([]);

  // Handle the dropdown menu opening and closing
  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle checkbox selection
  const handleSelectionChange = (newSelection) => {
    setSelectedRows(newSelection.rowIds);
  };

  // Add Action Column
  const actionColumn = {
    field: "actions",
    headerName: "Actions",
    width: 200,
    renderCell: (params) => {
      return (
        <>
          {/* Edit Button */}
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => onEdit(params.row.id)}
            sx={{ marginRight: 1 }}
          >
            Edit
          </Button>

          {/* Delete Button */}
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => onDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      );
    },
  };

  // Add the action column to the columns array
  const updatedColumns = [actionColumn, ...columns];

  return (
    <div style={{ height: 400, width: "100%" }}>
      {/* Conditionally Render Export and Print Button */}
      {enablePrintExport && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
          <IconButton
            onClick={handleMenuClick}
            color="primary"
          >
            <PrintIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                exportDataGridToCsv(selectedRows, rows, columns);
                handleMenuClose();
              }}
            >
              Export to CSV
            </MenuItem>
            <MenuItem
              onClick={() => {
                exportDataGridToExcel(selectedRows, rows, columns);
                handleMenuClose();
              }}
            >
              Export to Excel
            </MenuItem>
            <MenuItem
              onClick={() => {
                window.print(); // Print the current page
                handleMenuClose();
              }}
            >
              Print
            </MenuItem>
          </Menu>
        </div>
      )}

      {/* Conditionally Render DataGrid with Checkbox Selection */}
      <DataGrid
        rows={rows}
        columns={updatedColumns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        checkboxSelection={enableCheckbox}
        onSelectionModelChange={handleSelectionChange}
        selectionModel={selectedRows}
        components={{ Toolbar: GridToolbar }}  // Optional, for built-in grid toolbar
      />
    </div>
  );
};

export default DataGridcomponent;

