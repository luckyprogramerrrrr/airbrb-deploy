import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';

const Navbar = ({ showMsg }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedIn = Boolean(token);

  const handleLogout = async () => {
    try {
      const res = await fetch(
        `http://localhost:${config.BACKEND_PORT}/user/auth/logout`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        showMsg(`Logout failed: ${data.error || "Unknown error"}`, "error");
        return;
      }

      // Clear session
      localStorage.removeItem("token");
      localStorage.removeItem("email");

      showMsg("Logged out successfully", "success");
      navigate("/");
    } catch (_err) {
      showMsg("Network error while logging out", "error");
    }
  };

  return (
    <AppBar position="static" color="default" sx={{ px: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold", cursor: "pointer", textDecoration: "none"}} component={Link}to="/">
          AirBrB
        </Typography>

        <div>
          {!loggedIn && (
            <>
              <Button component={Link} to="/login" color="inherit">
                Login
              </Button>
              <Button component={Link} to="/register" color="inherit">
                Register
              </Button>
            </>
          )}

          {loggedIn && (
            <>
              <Button component={Link} to="/listings" color="inherit">
                All Listings
              </Button>

              <Button component={Link} to="/host" color="inherit">
                Host Listings
              </Button>

              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
