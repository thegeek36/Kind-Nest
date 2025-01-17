import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

// Component imports
import Footer from './components/Footer';
import Loader from './components/Loader';

// Lazy-loaded pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const StaffLogin = React.lazy(() => import('./pages/StaffLogin'));
const NotFound = React.lazy(() => import('./pages/NotFound')); // New NotFound page

const App = () => {
  return (
    <HelmetProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Suspense fallback={<Loader />}>
              <Routes>
                {/* Main landing page */}
                <Route path="/" element={<Home />} />

                {/* Staff login page */}
                <Route path="/staff-login" element={<StaffLogin />} />

                {/* 404 Not Found page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
};

export default App;
