"use client";

import { useState } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import TextboxControl from "../../controls/textbox"; // Your custom TextboxControl
import ToggleControl from "../../controls/Toggle"; // Your custom ToggleControl
import { useRouter } from "next/navigation"; // ✅ Use next/navigation instead of next/router

export default function RoleManagement() {
  const [roleName, setRoleName] = useState(""); // Role name state
  const [isActive, setIsActive] = useState(true); // Active toggle state

  const router = useRouter(); // ✅ Now works correctly

  // Function to save role data (POST)
  const handleSave = async () => {
    const response = await fetch("/api/role", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roleName,
        isActive,
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message);
      router.push("/roles"); // ✅ Navigate using next/navigation
    } else {
      alert("Failed to save the role details");
    }
  };

  // Function to get role data (GET)
  const handleGet = async () => {
    const response = await fetch("/api/role");
    const data = await response.json();

    if (data) {
      // Update state with retrieved data
      setRoleName(data.roleName);
      setIsActive(data.isActive);
    } else {
      alert("Role data not found");
    }
  };

  // Function to delete role data (DELETE)
  const handleDelete = async () => {
    const response = await fetch("/api/role", {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message); // Display success message
      setRoleName(""); // Clear fields after deletion
      setIsActive(true);
    } else {
      alert("Failed to delete the role details");
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "650px", width: "100%", margin: "auto" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Role Management
      </Typography>

      {/* Two-column layout using Grid */}
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <TextboxControl
            label="Role Name"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <ToggleControl
            label="Is Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
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
    </Box>
  );
}
