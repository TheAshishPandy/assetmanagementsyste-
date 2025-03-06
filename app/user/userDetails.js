import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import TextboxControl from "../controls/textbox"; // Your custom TextboxControl
import ToggleControl from "../controls/Toggle"; // Your custom ToggleControl
import { useRouter } from "next/router"; // to handle navigation (optional)

export default function UserProfile() {
  const [name, setName] = useState(""); // Name state
  const [address, setAddress] = useState(""); // Address state
  const [mobile, setMobile] = useState(""); // Mobile state
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [isActive, setIsActive] = useState(true); // Active toggle state

  const router = useRouter(); // Optional, for navigating after saving

  // Function to save user data (POST)
  const handleSave = async () => {
    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        address,
        mobile,
        email,
        password,
        isActive,
      }),
    });

    const data = await response.json();
    if (data.message) {
      alert(data.message); // Display success message
      router.push("/profile"); // Redirect to profile page (optional)
    } else {
      alert("Failed to save the user details");
    }
  };

  // Function to get user data (GET)
  const handleGet = async () => {
    const response = await fetch("/api/user");
    const data = await response.json();

    if (data) {
      // Update state with retrieved data
      setName(data.name);
      setAddress(data.address);
      setMobile(data.mobile);
      setEmail(data.email);
      setPassword(data.password);
      setIsActive(data.isActive);
    } else {
      alert("User data not found");
    }
  };

  // Function to delete user data (DELETE)
  const handleDelete = async () => {
    const response = await fetch("/api/user", {
      method: "DELETE",
    });

    const data = await response.json();

    if (data.message) {
      alert(data.message); // Display success message
      setName(""); // Clear fields after deletion
      setAddress("");
      setMobile("");
      setEmail("");
      setPassword("");
      setIsActive(true);
    } else {
      alert("Failed to delete the user details");
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "650px", width: "100%", margin: "auto" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        User Profile
      </Typography>

      {/* Name, Address, Mobile, and Email */}
      <TextboxControl
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <TextboxControl
        label="Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <TextboxControl
        label="Mobile"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <TextboxControl
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Password */}
      <TextboxControl
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Active Toggle */}
      <ToggleControl
        label="Is Active"
        checked={isActive}
        onChange={(e) => setIsActive(e.target.checked)}
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
