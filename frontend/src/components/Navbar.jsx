import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static" color="default" sx={{ px: 2 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>

        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          AirBrB
        </Typography>

        <div>
          <Button component={Link} to="/login" color="inherit">
            Login
          </Button>
          <Button component={Link} to="/register" color="inherit">
            Register
          </Button>
        </div>

      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
