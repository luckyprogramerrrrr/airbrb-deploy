import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react';

// Components
import Navbar from './components/Navbar';
import Msgsnackbar from './components/Msgsnackbar';

// Public pages
import Landing from './pages/Landing';
import Listings from './pages/Listings';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Host pages
import HostListings from './pages/HostListings';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';

const App = () => {
  // Global snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('info');

  const showMsg = (msg, severity = 'info') => {
    setSnackbarMsg(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const onClose = () => setSnackbarOpen(false);

  return (
    <BrowserRouter>
      {/* Navbar receives showMsg so it can display errors */}
      <Navbar showMsg={showMsg} />

      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/listings" element={<Listings />} />

        {/* Auth */}
        <Route path="/login" element={<Login showMsg={showMsg} />} />
        <Route path="/register" element={<Register showMsg={showMsg} />} />

        {/* Host actions */}
        <Route path="/host" element={<HostListings showMsg={showMsg} />} />
        <Route path="/host/new" element={<CreateListing showMsg={showMsg} />} />
        <Route path="/host/:id" element={<EditListing showMsg={showMsg} />} />
      </Routes>

      {/* Global Snackbar */}
      <Msgsnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        severity={snackbarSeverity}
        onClose={onClose}
      />
    </BrowserRouter>
  );
};

export default App;
