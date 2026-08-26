import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import GlobalLayout from './components/organisms/GlobalLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import OwnerDashboard from './pages/OwnerDashboard';
import VetHub from './pages/VetHub';
import ShelterHub from './pages/ShelterHub';
import ShopCatalog from './pages/ShopCatalog';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          {/* App Routes wrapped in the Global Layout */}
          <Route element={<GlobalLayout />}>
            <Route path="/dashboard" element={<OwnerDashboard />} />
            <Route path="/vet" element={<VetHub />} />
            <Route path="/shelter" element={<ShelterHub />} />
            <Route path="/shop" element={<ShopCatalog />} />
          </Route>

          {/* Catch-all 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
