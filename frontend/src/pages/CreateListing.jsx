import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Msgsnackbar from "../components/Msgsnackbar";
import ListingForm from "../components/ListingForm";
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
    <>
      <ListingForm
        formtitle="Creat"
        title={title} setTitle={setTitle}
        street={street} setStreet={setStreet}
        city={city} setCity={setCity}
        stateVal={state} setStateVal={setState}
        postcode={postcode} setPostcode={setPostcode}
        price={price} setPrice={setPrice}
        type={type} setType={setType}
        bathrooms={bathrooms} setBathrooms={setBathrooms}
        bedrooms={bedrooms} setBedrooms={setBedrooms}
        amenities={amenities} setAmenities={setAmenities}
        onSubmit={handleCreate}
        submitLabel="Create"
      />

      <Msgsnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={snackbarSeverity}
        onClose={onClose}
      />
    </>
  );
};

export default CreateListing;
