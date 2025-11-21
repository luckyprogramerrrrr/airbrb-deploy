import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
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
  TextField,
} from "@mui/material";
import config from "../../backend.config.json";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const HostListings = ({ showMsg }) => {
  const navigate = useNavigate();
  const email = localStorage.getItem("email");

  //list
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  //publish/unpublish
  const [pubOpen, setPubOpen] = useState(false);
  const [pubId, setPubId] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const openPublishDialog = (id) => {
    setPubId(id);
    setStartDate("");
    setEndDate("");
    setPubOpen(true);
  };

  const closePublishDialog = () => {
    setPubOpen(false);
    setPubId(null);
    setStartDate("");
    setEndDate("");
  };


  //delete dialog(dialog not in listing.map())
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const openDeleteDialog = (id) => {
    setDeleteId(id);
    setDeleteOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteOpen(false);
    setDeleteId(null);
  };

  const fetchListings = async () => {
    try {
      const res = await fetch(`http://localhost:${config.BACKEND_PORT}/listings`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(data.error || "Failed to load listings", "error");
        return;
      }

      if (!Array.isArray(data.listings)) {
        showMsg("Invalid listings data from server", "error");
        return;
      }

      //fliter the array
      const mylist = data.listings.filter((l) => l.owner === email);

      //fetch the detail for each id(return array)
      const detaillist = await Promise.all(
        mylist.map(async (summary) => {
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

      setListings(detaillist.filter(Boolean));
    } catch (_err) {
      showMsg("Network error", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/listings/${deleteId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(data.error || "Failed to delete listing", "error");
        closeDeleteDialog();
        return;
      }

      showMsg("Listing deleted!", "success");
      closeDeleteDialog();
      fetchListings();

    } catch {
      showMsg("Network error", "error");
      closeDeleteDialog();
    }
  };

  //publish
  const handlePublish = async () => {
    if (!startDate || !endDate) {
      showMsg("Please select both start and end dates", "error");
      return;
    }

    const body = {
      availability: [
        { start: startDate, end: endDate }
      ]
    };

    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/listings/publish/${pubId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(data.error || "Failed to publish listing", "error");
        return;
      }

      showMsg("Listing published!", "success");
      closePublishDialog();
      fetchListings();

    } catch {
      showMsg("Network error", "error");
    }
  };

  //unpublish
  const handleUnpublish = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/listings/unpublish/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(data.error || "Failed to unpublish listing", "error");
        return;
      }

      showMsg("Listing unpublished!", "success");
      fetchListings();

    } catch {
      showMsg("Network error", "error");
    }
  };

  // login guard
  if (!token) {
    return <Navigate to="/" replace />;
  }

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

                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => openDeleteDialog(listing.id)}
                  >
                      Delete
                  </Button>

                  {listing.published ? (
                    <Button
                      variant="contained"
                      color="warning"
                      onClick={() => handleUnpublish(listing.id)}
                    >
                        Unpublish
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => openPublishDialog(listing.id)}
                    >
                        Publish
                    </Button>
                  )}

                </Stack>
              </CardContent>
            </Card>
          );
        })}
      </Stack>
        
      {/* delete confirm */}
      <Dialog
        open={deleteOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          {"Delete this listing?"}
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="delete-dialog-description">
              This action cannot be undone. Are you sure you want to delete this listing?
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button onClick={closeDeleteDialog}>Cancel</Button>
          <Button color="error" onClick={handleDelete} autoFocus>
              Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* publish dialog  */}
      <Dialog open={pubOpen} onClose={closePublishDialog}>
        <DialogTitle>Publish Listing</DialogTitle>

        <DialogContent>
          <DialogContentText>
              Select a date range for availability.
          </DialogContentText>

          <TextField
            margin="dense"
            label="Start Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            margin="dense"
            label="End Date"
            type="date"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={closePublishDialog}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handlePublish}>
              Publish
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default HostListings;
