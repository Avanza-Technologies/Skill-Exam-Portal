import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import NetworkzHome from './networkz/NetworkzHome.jsx'
import CyberSecurityLanding from './networkz/CyberSecurityLanding.jsx'
import DigitalMarketingLanding from './networkz/DigitalMarketingLanding.jsx'
import LoginPage from './components/auth/LoginPage.jsx'
import StaffDashboard from './components/dashboard/StaffDashboard.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#070b14',
        color: '#94a3b8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'sans-serif'
      }}>
        Authenticating session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

// ── DevTools guard — only active on /exam route ───────────────────────────
if (typeof window !== 'undefined' && window.location.pathname.startsWith('/exam')) {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('selectstart', (e) => e.preventDefault());
  document.addEventListener('dragstart', (e) => e.preventDefault());

  document.addEventListener('keydown', (e) => {
    if (
      e.key === 'F12' ||
      (e.ctrlKey && e.shiftKey && ['i','I','j','J','c','C'].includes(e.key)) ||
      (e.ctrlKey && ['u','U','s','S','h','H'].includes(e.key))
    ) {
      e.preventDefault();
      return false;
    }
  });

  setInterval(() => {
    const t0 = +new Date();
    // eslint-disable-next-line no-debugger
    debugger;
    if (+new Date() - t0 > 100) {
      document.body.innerHTML =
        '<div style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;font-size:18px;font-weight:bold;color:#ef4444;">DevTools detected. Access restricted.</div>';
    }
  }, 1000);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Networkz Systems cinematic experience — flagship route */}
          <Route path="/" element={<NetworkzHome />} />

          {/* Spring Boot Staff & Employee Authentication */}
          <Route path="/login" element={<LoginPage />} />

          {/* Spring Boot Staff Dashboard / Landing Page */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portal"
            element={
              <ProtectedRoute>
                <StaffDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dedicated Cyber Security & Ethical Hacking Course Landing Page */}
          <Route path="/cybersecurity" element={<CyberSecurityLanding />} />
          <Route path="/cyber-security" element={<CyberSecurityLanding />} />
          <Route path="/cyber" element={<CyberSecurityLanding />} />
          <Route path="/ethical-hacking" element={<CyberSecurityLanding />} />

          {/* Dedicated Digital Marketing Professional Course Landing Page */}
          <Route path="/digital-marketing" element={<DigitalMarketingLanding />} />
          <Route path="/digitalmarketing" element={<DigitalMarketingLanding />} />
          <Route path="/dm" element={<DigitalMarketingLanding />} />

          {/* Existing exam portal — preserved as a sub-route */}
          <Route path="/exam" element={<App />} />
          <Route path="/exam/*" element={<App />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)

