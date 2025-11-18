import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Landing from './pages/Landing';
import Listings from './pages/Listings';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Host pages
import HostListings from './pages/HostListings';
import CreateListing from './pages/CreateListing';
import Navbar from './components/Navbar';

const App = () => {
    return (
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Landing + Listings */}
          <Route path="/" element={<Landing />} />
          <Route path="/listings" element={<Listings />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/host" element={<HostListings />} />
          <Route path="/host/new" element={<CreateListing />} />

        </Routes>
      </BrowserRouter>
    );
  };

export default App;
