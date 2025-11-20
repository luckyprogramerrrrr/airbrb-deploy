import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Rating,
  Stack,
} from "@mui/material";
import config from "../../backend.config.json";

const HostListings = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchListings = async () => {
    const res = await fetch(`http://localhost:${config.BACKEND_PORT}/listings`);
    const data = await res.json();
    if (!res.ok) return;

    // filter the array
    const mylist = data.listings.filter((l) => l.owner === email);

    //Fetch details for each ID(return array)
    const detaillist = await Promise.all(
      mylist.map(async (summary) => {
        const res2 = await fetch(
          `http://localhost:${config.BACKEND_PORT}/listings/${summary.id}`
        );
        const detail = await res2.json();
        return { id: summary.id, ...detail.listing };
      })
    );

    setListings(detaillist);
    setLoading(false);
  };

  useEffect(() => {
    fetchListings();
  }, []);

  if (loading) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Your Listings
      </Typography>

      {/* Create Button */}
      <Button
        variant="contained"
        sx={{ mb: 3 }}
        onClick={() => navigate("/host/new")}
      >
        Create New Listing
      </Button>

      <Stack spacing={3}>
        {/* create card for every record */}
        {listings.map((listing) => {
          const reviewCount = listing.reviews?.length || 0;
          // caculate avg rating
          const avgRating =
            reviewCount > 0? listing.reviews.reduce(
                  (sum, r) => sum + (r.rating || 0),
                  0
                ) / reviewCount
              : 0;

          const beds = listing.metadata?.bedrooms || 0;
          const baths = listing.metadata?.bathrooms || 0;
          const type = listing.metadata?.type || "Unknown";

          return (
            <Card
              key={listing.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                boxShadow: 3,
              }}
            >
              <CardMedia
                component="img"
                sx={{
                  width: { xs: "100%", sm: 200 },
                  height: 150,
                  objectFit: "cover",
                }}
                image={listing.thumbnail}
                alt={listing.title}
              />

              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h4">{listing.title}</Typography>
                <Typography variant="h6">{type}</Typography>

                <Typography sx={{ mt: 1 }}>
                  Beds: {beds} · Bathrooms: {baths}
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Rating value={avgRating} precision={0.5} readOnly />
                  <Typography sx={{ ml: 1 }}>
                    ({reviewCount} reviews)
                  </Typography>
                </Box>

                <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                  ${listing.price} / night
                </Typography>

                <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => navigate(`/host/${listing.id}`)}
                  >
                    Edit
                  </Button>

                  <Button variant="contained" color="error">
                    Delete
                  </Button>

                  {listing.published ? (
                    <Button variant="contained" color="warning">
                      Unpublish
                    </Button>
                  ) : (
                    <Button variant="contained" color="success">
                      Publish
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default HostListings;
