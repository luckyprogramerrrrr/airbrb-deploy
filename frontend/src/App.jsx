import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Public pages
import Landing from './pages/Landing';
import Listings from './pages/Listings';
import ViewListing from './pages/ViewListing';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Host pages
import HostListings from './pages/HostListings';
import CreateListing from './pages/CreateListing';
import EditListing from './pages/EditListing';
import HostBookingManage from './pages/HostBookingManage';

const App = () => {
    return (
      <BrowserRouter>
        <Routes>

          {/* Landing + Listings */}
          <Route path="/" element={<Landing />} />
          <Route path="/listings" element={<Listings />} />
          <Route path="/listing/:id" element={<ViewListing />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/host" element={<HostListings />} />
          <Route path="/host/new" element={<CreateListing />} />
          <Route path="/host/edit/:id" element={<EditListing />} />
          <Route path="/host/manage/:id" element={<HostBookingManage />} />

        </Routes>
      </BrowserRouter>
    );
  };

export default App;
