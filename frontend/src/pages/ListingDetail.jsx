import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Stack,
  Divider,
} from "@mui/material";
import config from "../../backend.config.json";

export default function ListingDetail({ showMsg }) {
  const { id } = useParams();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = async () => {
    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/listings/${id}`
      );
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(data.error || "Failed to load listing detail", "error");
        return;
      }

      setListing({ id, ...data.listing });
    } catch {
      showMsg("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) return <Typography>Loading...</Typography>;
  if (!listing) return <Typography>No listing found.</Typography>;

  const {
    title,
    address,
    price,
    thumbnail,
    metadata,
    reviews = [],
  } = listing;

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        {title}
      </Typography>

      {/* Image */}
      <Card sx={{ mb: 3 }}>
        {thumbnail ? (
          <CardMedia
            component="img"
            image={thumbnail}
            alt="thumbnail"
            sx={{ height: 300, objectFit: "cover" }}
          />
        ) : (
          <CardContent>No image available</CardContent>
        )}
      </Card>

      {/* Basic Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6">Information</Typography>
          <Divider sx={{ my: 1 }} />

          <Typography>
            <b>Address:</b> {address?.street}, {address?.city},{" "}
            {address?.state}, {address?.postcode}
          </Typography>

          <Typography sx={{ mt: 1 }}>
            <b>Price:</b> ${price} / night
          </Typography>

          {metadata && (
            <>
              <Typography sx={{ mt: 1 }}>
                <b>Bedrooms:</b> {metadata.bedrooms}
              </Typography>
              <Typography>
                <b>Bathrooms:</b> {metadata.bathrooms}
              </Typography>
              <Typography>
                <b>Property type:</b> {metadata.propertyType}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Reviews */}
      <Card sx={{ mb: 5 }}>
        <CardContent>
          <Typography variant="h6">Reviews</Typography>
          <Divider sx={{ my: 1 }} />

          {reviews.length === 0 && <Typography>No reviews yet.</Typography>}

          {reviews.map((r, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography>
                  {r.rating} — <b>{r.author}</b>
              </Typography>
              <Typography>{r.comment}</Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
