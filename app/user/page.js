'use client'; // Ensure this is at the top of your component

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import TextboxControl from "../controls/textbox"; // Your custom TextboxControl
import ToggleControl from "../controls/Toggle"; // Your custom ToggleControl
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
  const [imageData, setImageData] = useState({ url: '', cloudinaryId: '', type: '' }); // Cloudinary image data state

  const router = useRouter(); // Optional, for navigating after saving

  // Handle image file input and preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file)); // Preview the image
    }
  };

  // Function to upload the image to Cloudinary via API route
  const uploadImageToCloudinary = async () => {
    if (!imageFile) {
      alert("Please select an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", imageFile); // Attach the file to FormData
  
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
  };

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
        profileImage: imageData, // Include Cloudinary image data
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

      {/* Profile Picture */}
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
    </Box>
  );
}
