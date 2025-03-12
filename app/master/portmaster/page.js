// pages/port/PortMaster.js
'use client'
import { useState, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import TextboxControl from "../../controls/textbox"; // Your custom TextboxControl
import ToggleControl from "../../controls/Toggle"; // Your custom ToggleControl
import RadioButtonControl from "../../controls/RadioButtonControl"; // Your custom RadioButtonControl
import { useRouter } from "next/navigation"; // to handle navigation (optional)
import DataGrid from "@/app/_components/datagrid"; // Import the DataGrid component

export default function PortMaster() {
  const [portCode, setPortCode] = useState(""); // Port Code state
  const [portName, setPortName] = useState(""); // Port Name state
  const [isActive, setIsActive] = useState(true); // Active toggle state
  const [selectedOption, setSelectedOption] = useState("api"); // Default connection type (api or database)
  const [apiUrl, setApiUrl] = useState(""); // API URL state
  const [authUrl, setAuthUrl] = useState(""); // Auth URL state
  const [dbName, setDbName] = useState(""); // Database Name state
  const [connectionString, setConnectionString] = useState(""); // Connection String state
  const [portId, setPortId] = useState(""); // Port ID for get and delete operations
  const [portData, setPortData] = useState([]); // Port records to display in DataGrid

  const router = useRouter(); // Optional, for navigating after saving

  // Handle the radio button change (API or Database)
  const handleRadioChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Function to save port data (POST)
  const handleSave = async () => {
    const response = await fetch(`/api/port?id=${portId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        portCode,
        portName,
        isActive,
        connectionType: selectedOption,
        apiUrl,
        authUrl,
        dbName,
        connectionString,
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message);
      fetchAllPorts();
    } else {
      alert("Failed to save the port details");
    }
  };

  const handleGet = async () => {
    if (!portId) {
      alert("Please provide a valid Port ID");
      return;
    }

    const response = await fetch(`/api/port?id=${portId}`);
    const data = await response.json();

    if (data) {
      // Update state with retrieved data
      setPortCode(data.portCode);
      setPortName(data.portName);
      setIsActive(data.isActive);
      setSelectedOption(data.connectionType);
      setApiUrl(data.apiUrl);
      setAuthUrl(data.authUrl);
      setDbName(data.dbName);
      setConnectionString(data.connectionString);
    } else {
      alert("Port data not found");
    }
  };

  // Function to delete port data (DELETE)
  const handleDelete = async (portId) => {
    const response = await fetch(`/api/port?id=${portId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message); // Display success message
      fetchAllPorts(); // Refresh port data
    } else {
      alert("Failed to delete the port details");
    }
  };

  // Function to edit port data (this can be customized as needed)
  const handleEdit = async (portId) => {
    // Fetch the port data by ID for editing
    const response = await fetch(`/api/port?id=${portId}`);
    const data = await response.json();

    if (data) {
      // Pre-populate the form with the existing port details
      setPortId(data._id); // Set the current port ID
      setPortCode(data.portCode);
      setPortName(data.portName);
      setIsActive(data.isActive);
      setSelectedOption(data.connectionType);
      setApiUrl(data.apiUrl);
      setAuthUrl(data.authUrl);
      setDbName(data.dbName);
      setConnectionString(data.connectionString);
    } else {
      alert("Port data not found");
    }
  };

  // Fetch all ports data for the DataGrid
  const fetchAllPorts = async () => {
    const response = await fetch("/api/port");
    const data = await response.json();

    // Map the data to include a unique 'id' field
    const formattedData = data?.ports?.map((port) => ({
      id: port._id,  // Use _id as the unique id
      ...port,
    }));

    setPortData(formattedData || []);
  };

  useEffect(() => {
    fetchAllPorts(); // Fetch ports when the component mounts
  }, []);

  const columns = [
    { field: "portCode", headerName: "Port Code", width: 180 },
    { field: "portName", headerName: "Port Name", width: 200 },
    { field: "isActive", headerName: "Active", width: 120, type: "boolean" },
    { field: "connectionType", headerName: "Connection Type", width: 180 },
    { field: "apiUrl", headerName: "API URL", width: 200 },
    { field: "authUrl", headerName: "Auth URL", width: 200 },
    { field: "dbName", headerName: "Database Name", width: 200 },
    { field: "connectionString", headerName: "Connection String", width: 200 }
  ];

  return (
    <Box sx={{ padding: 3, maxWidth: "100%", width: "100%", margin: "auto" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Port Configuration
      </Typography>

      {/* Grid container for inputs */}
      <Grid container spacing={2}>
        {/* Port Code and Port Name */}
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Port Code"
            value={portCode}
            onChange={(e) => setPortCode(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Port Name"
            value={portName}
            onChange={(e) => setPortName(e.target.value)}
          />
        </Grid>

        {/* Conditionally Render API or Database fields */}
        {selectedOption === "api" ? (
          <>
            <Grid item xs={12} sm={6}>
              <TextboxControl
                label="API URL"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextboxControl
                label="Auth URL"
                value={authUrl}
                onChange={(e) => setAuthUrl(e.target.value)}
              />
            </Grid>
          </>
        ) : (
          <>
            <Grid item xs={12} sm={6}>
              <TextboxControl
                label="Database Name"
                value={dbName}
                onChange={(e) => setDbName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextboxControl
                label="Connection String"
                value={connectionString}
                onChange={(e) => setConnectionString(e.target.value)}
              />
            </Grid>
          </>
        )}

        {/* Active Toggle */}
        <Grid item xs={12} sm={6}>
          <ToggleControl
            label="Is Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </Grid>

        {/* Connection Type Radio Buttons (API/Database) */}
        <Grid item xs={12} sm={6}>
          <RadioButtonControl
            label="Connection Type"
            value={selectedOption}
            onChange={handleRadioChange}
            options={[
              { value: "api", label: "REST API" },
              { value: "database", label: "Database" },
            ]}
          />
        </Grid>
      </Grid>

      {/* Buttons for Save, Get, and Delete */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          sx={{ marginRight: 2 }}
        >
          Save
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleGet}
          sx={{ marginRight: 2 }}
        >
          Reset
        </Button>
      </Box>

      {/* Displaying Port Data in DataGrid */}
      <DataGrid rows={portData} columns={columns} onEdit={handleEdit} onDelete={handleDelete} enablePrintExport={true}/>
    </Box>
  );
}
