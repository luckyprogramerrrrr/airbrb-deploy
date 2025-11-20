// ListingForm.jsx
import { Box, Typography, TextField, Button } from "@mui/material";
import { Link } from "react-router-dom";

const ListingForm = ({
  formtitle,

  title,
  street,
  city,
  stateVal,
  postcode,
  price,
  type,
  bathrooms,
  bedrooms,
  amenities,

  setTitle,
  setStreet,
  setCity,
  setStateVal,
  setPostcode,
  setPrice,
  setType,
  setBathrooms,
  setBedrooms,
  setAmenities,

  onSubmit,
  submitLabel = "Save",
  showBack = true,
}) => {
  return (
    <Box
      sx={{
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h4">{formtitle} Listing</Typography>

      <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <TextField label="Street" value={street} onChange={(e) => setStreet(e.target.value)} />
      <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} />
      <TextField label="State" value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
      <TextField label="Postcode" type="number" value={postcode} onChange={(e) => setPostcode(e.target.value)} />

      <TextField label="Price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
      <TextField label="Type" value={type} onChange={(e) => setType(e.target.value)} />
      <TextField label="Bathrooms" type="number" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} />
      <TextField label="Bedrooms" type="number" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} />
      <TextField label="Amenities" value={amenities} onChange={(e) => setAmenities(e.target.value)} />

      <Button variant="contained" onClick={onSubmit}>
        {submitLabel}
      </Button>

      {showBack && (
        <Button variant="outlined" component={Link} to="/host">
          Back
        </Button>
      )}
    </Box>
  );
};

export default ListingForm;
