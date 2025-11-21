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
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";


const Landing = ({ showMsg }) => {
  const navigate = useNavigate();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);

  const [filterType, setFilterType] = useState(""); 
  const [sortOrder, setSortOrder] = useState(""); 
  const [search, setSearch] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [minBedrooms, setMinBedrooms] = useState("");
  const [maxBedrooms, setMaxBedrooms] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");


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

      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Filter Type</InputLabel>
          <Select
            value={filterType}
            label="Filter Type"
            onChange={(e) => {
              setFilterType(e.target.value);
              setSortOrder(""); 
            }}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="price">Price Range</MenuItem>
            <MenuItem value="bedrooms">Bedrooms Range</MenuItem>
            <MenuItem value="rating">Rating Sort</MenuItem>
            <MenuItem value="date">Date Range</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Search Controls */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        
        {/* default search */}
        <TextField
          label="Search (title or city)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 200 }}
        />

        {/* Price */}
        {filterType === "price" && (
          <>
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
            <Button
              variant={sortOrder === "asc" ? "contained" : "outlined"}
              onClick={() => setSortOrder("asc")}
            >
              ↑
            </Button>
            <Button
              variant={sortOrder === "desc" ? "contained" : "outlined"}
              onClick={() => setSortOrder("desc")}
            >
              ↓
            </Button>
          </>
        )}

        {/* Bedrooms */}
        {filterType === "bedrooms" && (
          <>
            <TextField
              label="Min Bedrooms"
              type="number"
              value={minBedrooms}
              onChange={(e) => setMinBedrooms(e.target.value)}
            />
            <TextField
              label="Max Bedrooms"
              type="number"
              value={maxBedrooms}
              onChange={(e) => setMaxBedrooms(e.target.value)}
            />
            <Button
              variant={sortOrder === "asc" ? "contained" : "outlined"}
              onClick={() => setSortOrder("asc")}
            >
              ↑
            </Button>
            <Button
              variant={sortOrder === "desc" ? "contained" : "outlined"}
              onClick={() => setSortOrder("desc")}
            >
              ↓
            </Button>
          </>
        )}

        {/* Rating */}
        {filterType === "rating" && (
          <>
            <Button
              variant={sortOrder === "asc" ? "contained" : "outlined"}
              onClick={() => setSortOrder("asc")}
            >
              Rating ↑
            </Button>
            <Button
              variant={sortOrder === "desc" ? "contained" : "outlined"}
              onClick={() => setSortOrder("desc")}
            >
              Rating ↓
            </Button>
          </>
        )}

        {/* Date Range */}
        {filterType === "date" && (
          <>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

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
