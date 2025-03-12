"use client"; // Ensure this is at the top of your component

import { useState, useEffect } from "react";
import { Box, Button, Typography, Grid } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import TextboxControl from "../../controls/textbox"; // Your custom TextboxControl
import ToggleControl from "../../controls/Toggle"; // Your custom ToggleControl
import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router

export default function UserProfile() {
  const [name, setName] = useState(""); // Name state
  const [address, setAddress] = useState(""); // Address state
  const [mobile, setMobile] = useState(""); // Mobile state
  const [email, setEmail] = useState(""); // Email state
  const [password, setPassword] = useState(""); // Password state
  const [isActive, setIsActive] = useState(true); // Active toggle state
  const [imageFile, setImageFile] = useState(null); // Image file state
  const [imagePreview, setImagePreview] = useState(null); // Image preview URL state
  const [imageData, setImageData] = useState({ url: "", cloudinaryId: "", type: "" }); // Cloudinary image data state
  const [users, setUsers] = useState([]); // State to store user records
  const [columns, setColumns] = useState([]); // State to store dynamic columns

  const router = useRouter(); // Optional, for navigating after saving

  // Fetch user records on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    console.log("Columns:", columns); // Check the columns structure
  }, [columns]);

  // Fetch user records from the API
  const fetchUsers = async () => {
    try {
      console.log("API Call: Fetching users...");
      const response = await fetch("/api/user");
      
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      console.log("Fetched Data:", data);

      if (data.length > 0) {
        setUsers(data);

        // Dynamically generate columns based on the first record's keys
        const firstRecord = data[0];
        const dynamicColumns = Object.keys(firstRecord).map((key) => ({
          field: key,
          headerName: key.charAt(0).toUpperCase() + key.slice(1), // Capitalize the first letter
          width: 150, // Default width
          editable: true, // Allow editing
        }));

        setColumns(dynamicColumns);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      alert("Failed to fetch user records");
    }
  };

  // Handle image file input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile); // Attach the file to FormData

    try {
      // Make the POST request to the API endpoint
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok && data.url) {
        // Handle success: image is uploaded, save the URL and other data
        setImageData({
          url: data.url,
          cloudinaryId: data.public_id,
          type: data.type,
        });
      } else {
        alert("Image upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Image upload failed");
    }
  };

  // Function to save user data (POST)
  const handleSave = async () => {
    try {
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
          profileImage: imageData,
          isMailSent: 0,  // Include Cloudinary image data
        }),
      });

      const data = await response.json();
      if (data.message) {
        alert(data.message); // Display success message
        fetchUsers(); // Refresh the user list
        router.push("/profile"); // Redirect to profile page (optional)
      } else {
        alert("Failed to save the user details");
      }
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save user details");
    }
  };

  // Function to delete a user record
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/user/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("User deleted successfully");
        fetchUsers(); // Refresh the user list
      } else {
        alert("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: "1200px", width: "100%", margin: "auto" }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        User Profile
      </Typography>

      {/* Two-column layout using Grid */}
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextboxControl
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ToggleControl
            label="Is Active"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
        </Grid>
      </Grid>

      {/* Profile Picture Section */}
      <Box sx={{ marginTop: 2 }}>
        <Typography variant="body1">Profile Picture</Typography>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginTop: 10 }}
        />
        {/* Show image preview */}
        {imagePreview && (
          <Box sx={{ marginTop: 2 }}>
            <img src={imagePreview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 200 }} />
          </Box>
        )}
      </Box>

      {/* Buttons for Save */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={uploadImageToCloudinary} // Upload image when saving
          sx={{ marginRight: 2 }}
        >
          Upload Image
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
        >
          Save
        </Button>
      </Box>

      <Box sx={{ height: 400, width: "100%", marginTop: 4 }}>
        <DataGrid
          rows={users}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          checkboxSelection
          disableSelectionOnClick
        />
      </Box>
    </Box>
  );
}
