import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Button,
  Rating,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import config from "../../backend.config.json";

const Landing = ({ showMsg }) => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const fetchListings = async () => {
    try {
      const res = await fetch(`http://localhost:${config.BACKEND_PORT}/listings`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(data.error || "Failed to load listings", "error");
        return;
      }

      const all = data.listings || [];

      const detaillist = await Promise.all(
        all.map(async (summary) => {
          const res2 = await fetch(
            `http://localhost:${config.BACKEND_PORT}/listings/${summary.id}`
          );
          const data2 = await res2.json().catch(() => ({}));

          if (!res2.ok) {
            showMsg(data2.error || "Failed to load listing detail", "error");
            return null;
          }

          return { id: summary.id, ...data2.listing };
        })
      );

      const published = detaillist.filter((l) => l && l.published === true);
      //orgin data(publish)
      setListings(published);
      //display data
      setFiltered(published);

    } catch {
      showMsg("Network error", "error");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchListings();
  }, []);

  const handleSearch = () => {
    let res = [...listings];

    // default search: title OR city
    if (search.trim()) {
      const s = search.toLowerCase();
      res = res.filter(
        (l) =>
          l.title.toLowerCase().includes(s) ||
          l.address.city.toLowerCase().includes(s)
      );
    }

    // price filter
    if (minPrice) {
      res = res.filter((l) => l.price >= Number(minPrice));
    }
    if (maxPrice) {
      res = res.filter((l) => l.price <= Number(maxPrice));
    }

    setFiltered(res);
  };

  if (loading) {
    return (
      <Typography sx={{ mt: 4, textAlign: "center" }}>Loading...</Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Listings
      </Typography>

      {/* Search Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="Search Title or City"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          label="Min Price"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />

        <Button variant="contained" onClick={handleSearch}>
          Search
        </Button>
      </Stack>

      {/* Results */}
      <Stack spacing={3}>
        {filtered.map((listing) => {
          const reviewCount = listing.reviews?.length || 0;
          const avgRating =
            reviewCount > 0
              ? listing.reviews.reduce((s, r) => s + (r.rating || 0), 0) / reviewCount
              : 0;

          return (
            <Card
              key={listing.id}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                cursor: "pointer",
              }}
              onClick={() => navigate(`/listing/${listing.id}`)} //detail page
            >
              <CardMedia
                component="img"
                sx={{ width: { xs: "100%", sm: 200 }, height: 150 }}
                image={listing.thumbnail}
              />
              <CardContent>
                <Typography variant="h5">{listing.title}</Typography>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Rating value={avgRating} readOnly />
                  <Typography sx={{ ml: 1 }}>({reviewCount} reviews)</Typography>
                </Box>

                <Typography sx={{ mt: 1, fontWeight: "bold" }}>
                  ${listing.price} / night
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
};

export default Landing;
