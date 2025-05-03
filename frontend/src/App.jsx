import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Component imports
import Footer from './components/Footer';
import Loader from './components/Loader';

// Lazy-loaded pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const StaffLogin = React.lazy(() => import('./pages/StaffLogin'));
const StaffRegister = React.lazy(() => import('./pages/StaffRegister'));
const DashboardLayout = React.lazy(() => import('./pages/DashboardLayout'));
const InventoryDetails = React.lazy(() => import('./pages/InventoryDetails'));
const OrphanDetails = React.lazy(() => import('./pages/OrphanDetails'));
const DonorsList = React.lazy(() => import('./pages/DonorsList'));
const Events = React.lazy(() => import('./pages/Events'));
const Donations = React.lazy(() => import('./pages/Donations'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
const UserList = React.lazy(() => import('./pages/UserProfile'));


const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={
                <>
                  <main className="flex-grow">
                    <Home />
                  </main>
                  {/* <Footer /> */}
                </>
              } />
              <Route path="/staff-login" element={
                <>
                  <main className="flex-grow">
                    <StaffLogin />
                  </main>
                  <Footer />
                </>
              } />
              <Route path="/staff-register" element={
                <>
                  <main className="flex-grow">
                    <StaffRegister />
                  </main>
                  <Footer />
                </>
              } />

              {/* Dashboard routes - nested within DashboardLayout */}
              <Route path="dashboard" element={<DashboardLayout />}>
                <Route path="inventory" element={<InventoryDetails />} />
                <Route path="orphans" element={<OrphanDetails />} />
                <Route path="donors" element={<DonorsList />} />
                <Route path="events" element={<Events />} /> 
                <Route path="donations" element={<Donations />} /> 
                <Route path="userinfo" element={<UserList />} />
              </Route>

              {/* 404 Not Found page */}
              <Route path="*" element={
                <>
                  <main className="flex-grow">
                    <NotFound />
                  </main>
                  <Footer />
                </>
              } />
            </Routes>
          </Suspense>
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;