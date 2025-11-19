import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert
} from '@mui/material';
import { Link } from 'react-router-dom';
import config from '../../backend.config.json'

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const showMsg = (msg) => {
    setSnackbarMsg(msg);
    setSnackbarOpen(true);
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showMsg("Please fill in both fields");
      return;
    }

    try {
      const res = await fetch(`http://localhost:${config.BACKEND_PORT}/user/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        showMsg(data.error || 'Login failed');
        return;
      }

      localStorage.setItem('token', data.token);

      showMsg('Login successful!');
    } catch (err) {
      showMsg('Network error, backend failed');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 6, display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h5" sx={{ mb: 1 }}>
        Login
      </Typography>

      <TextField
        fullWidth
        label="Email"
        onChange={EmailInput => setEmail(EmailInput.target.value)}
        value={email}
      />

      <TextField
        fullWidth
        label="Password"
        type="password"
        onChange={pwInput => setPassword(pwInput.target.value)}
        value={password}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleLogin}
        >
          Login
        </Button>

        <Button
          variant="outlined"
          fullWidth
          component={Link}
          to="/"
        >
          Cancel
        </Button>
      </Box>

      <Snackbar
        anchorOrigin={{ vertical:'top', horizontal:'right' }}
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert severity="info" onClose={handleClose}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;
