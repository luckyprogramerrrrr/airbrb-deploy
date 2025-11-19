import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import config from '../../backend.config.json';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedIn = Boolean(token);

  const handleLogout = async () => {
    try {
      await fetch(`http://localhost:${config.BACKEND_PORT}/user/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        onsole.warn("Logout error:", data.error);
      }
    } catch {
      // Logout on client side regardless of network failure
    }

    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar position="static" color="default" sx={{ px: 2 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
