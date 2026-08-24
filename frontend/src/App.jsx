import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GlobalLayout from './components/organisms/GlobalLayout';
import LandingPage from './pages/LandingPage';
import OwnerDashboard from './pages/OwnerDashboard';
import VetWorkstation from './pages/VetWorkstation';
import ShelterHub from './pages/ShelterHub';
import ShopCatalog from './pages/ShopCatalog';
import NotFound from './pages/NotFound';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />

        {/* App Routes wrapped in the Global Layout */}
        <Route element={<GlobalLayout />}>
          <Route path="/dashboard" element={<OwnerDashboard />} />
          <Route path="/vet" element={<VetWorkstation />} />
          <Route path="/shelter" element={<ShelterHub />} />
          <Route path="/shop" element={<ShopCatalog />} />
        </Route>

        {/* Catch-all 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
