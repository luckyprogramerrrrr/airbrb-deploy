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

  // Address split into correct structure
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");

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
    // Minimal required fields
    if (!title || !street || !city || !price) {
      showMsg("Title, street, city, and price are required", "info");
      return;
    }

    const createform = {
      title,
      address: {
        street,
        city,
        state,
        postcode: Number(postcode),
      },
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
        body: JSON.stringify(createform),
      });

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || "Create failed", "error");
        return;
      }

      showMsg("Listing created!", "success");

      setTimeout(() => navigate("/host"), 800);
    } catch {
      showMsg("Network error", "error");
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h4">Create Listing</Typography>

      {/* Title */}
      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />

      {/* Correct Address fields */}
      <TextField label="Street" value={street} onChange={(e) => setStreet(e.target.value)} fullWidth />
      <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
      <TextField label="State" value={state} onChange={(e) => setState(e.target.value)} fullWidth />
      <TextField label="Postcode" type="number" value={postcode} onChange={(e) => setPostcode(e.target.value)} fullWidth />

      {/* Other metadata fields */}
      <TextField label="Price(per night)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} fullWidth />
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
