import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import TextboxControl from "../controls/textbox"; // Your custom TextboxControl
import ToggleControl from "../controls/Toggle"; // Your custom ToggleControl
import RadioButtonControl from "../controls/RadioButtonControl"; // Your custom RadioButtonControl
import { useRouter } from "next/router"; // to handle navigation (optional)

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
      alert(data.message); // Display success message
      router.push("/port"); // Redirect to a port listing page (optional)
    } else {
      alert("Failed to save the port details");
    }
  };

  // Function to get port data (GET)
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
  const handleDelete = async () => {
    if (!portId) {
      alert("Please provide a valid Port ID");
      return;
    }

    const response = await fetch(`/api/port?id=${portId}`, {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message); // Display success message
      setPortCode(""); // Clear fields after deletion
      setPortName("");
      setIsActive(true);
      setSelectedOption("api");
      setApiUrl("");
      setAuthUrl("");
      setDbName("");
      setConnectionString("");
    } else {
      alert("Failed to delete the port details");
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "650px", width: "100%", margin: "auto" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Port Configuration
      </Typography>

      {/* Port Code and Port Name */}
      <TextboxControl
        label="Port Code"
        value={portCode}
        onChange={(e) => setPortCode(e.target.value)}
      />
      <TextboxControl
        label="Port Name"
        value={portName}
        onChange={(e) => setPortName(e.target.value)}
      />

      {/* Active Toggle */}
      <ToggleControl
        label="Is Active"
        checked={isActive}
        onChange={(e) => setIsActive(e.target.checked)}
      />

      {/* Connection Type Radio Buttons (API/Database) */}
      <RadioButtonControl
        label="Connection Type"
        value={selectedOption}
        onChange={handleRadioChange}
        options={[
          { value: "api", label: "REST API" },
          { value: "database", label: "Database" },
        ]}
      />

      {/* Conditionally Render API or Database fields */}
      {selectedOption === "api" ? (
        <>
          <TextboxControl
            label="API URL"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <TextboxControl
            label="Auth URL"
            value={authUrl}
            onChange={(e) => setAuthUrl(e.target.value)}
          />
        </>
      ) : (
        <>
          <TextboxControl
            label="Database Name"
            value={dbName}
            onChange={(e) => setDbName(e.target.value)}
          />
          <TextboxControl
            label="Connection String"
            value={connectionString}
            onChange={(e) => setConnectionString(e.target.value)}
          />
        </>
      )}

      {/* Port ID Input for GET and DELETE operations */}
      <TextboxControl
        label="Port ID"
        value={portId}
        onChange={(e) => setPortId(e.target.value)}
        placeholder="Enter Port ID to retrieve or delete"
      />

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
          Get
        </Button>
        <Button
          variant="outlined"
          color="error"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}
