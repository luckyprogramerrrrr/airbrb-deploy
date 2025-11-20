// src/pages/CreateListing.jsx
import { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Msgsnackbar from "../components/Msgsnackbar";
import config from "../../backend.config.json";

const CreateListing = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Basic fields
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState("");
  const [type, setType] = useState("");
  const [bathrooms, setBathrooms] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [amenities, setAmenities] = useState("");

  // Snackbar
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("info");

  const showMsg = (msg, severity = "info") => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };
  const onClose = () => setSnackbarOpen(false);

  const defaultThumbnail =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  const handleCreate = async () => {
    if (!title || !address || !price) {
      showMsg("Title, address, and price are required", "info");
      return;
    }
    // api form
    const payload = {
      title,
      address,
      price: Number(price),
      thumbnail: defaultThumbnail,
      metadata: {
        type,
        bathrooms: Number(bathrooms),
        bedrooms: Number(bedrooms),
        amenities,
      },
    };

    try {
      const res = await fetch(`http://localhost:${config.BACKEND_PORT}/listings/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Create failed", "error");
        return;
      }

      showMsg("Listing created!", "success");
      setTimeout(() => navigate("/host"), 1000);
    } catch {
      showMsg("Network error", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Create Listing</Typography>

      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
      <TextField label="Address" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
      <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
      <TextField label="Property Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth />
      <TextField label="Bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} fullWidth />
      <TextField label="Bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} fullWidth />
      <TextField label="Amenities (comma separated)" value={amenities} onChange={(e) => setAmenities(e.target.value)} fullWidth />

      <Button variant="contained" onClick={handleCreate}>
        Create
      </Button>

      <Msgsnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={snackbarSeverity}
        onClose={onClose}
      />
    </Box>
  );
};

export default CreateListing;
