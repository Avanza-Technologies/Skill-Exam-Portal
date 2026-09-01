import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { systemApi } from '../../services/api';
import './LoginPage.css';

const DEMO_ACCOUNTS = [
  { label: 'SUPER ADMIN', username: 'testadmin', password: 'Password@123', role: 'SUPER_ADMIN', badge: 'Full Access' },
  { label: 'HR ADMIN', username: 'hradmin_test', password: 'Password@123', role: 'HR_ADMIN', badge: 'HR & Staff' },
  { label: 'MANAGER', username: 'manager_test', password: 'Password@123', role: 'MANAGER', badge: 'Approvals' },
  { label: 'EMPLOYEE', username: 'employee_test', password: 'Password@123', role: 'EMPLOYEE', badge: 'Timesheet' },
];

export default function LoginPage() {
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Register fields
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState('ROLE_EMPLOYEE');

  // Backend status
  const [serverStatus, setServerStatus] = useState({ online: true, checked: false });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      const target = location.state?.from?.pathname || '/dashboard';
      navigate(target, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  // Ping backend health
  useEffect(() => {
    let isMounted = true;
    systemApi.checkHealth().then(res => {
      if (isMounted) {
        setServerStatus({ online: res.online, checked: true });
      }
    });
    return () => { isMounted = false; };
  }, []);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password.trim()) {
      setErrorMsg('Please enter your username/email and password.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await login(usernameOrEmail.trim(), password);
      setSuccessMsg('Authenticated! Redirecting to Staff Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 400);
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg(err.message || 'Authentication failed. Please verify credentials or backend status.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!regFullName.trim() || !regEmail.trim() || !regUsername.trim() || !regPassword.trim()) {
      setErrorMsg('Please complete all registration fields.');
      return;
    }

    setErrorMsg('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      await register({
        organizationId: 1,
        fullName: regFullName.trim(),
        email: regEmail.trim(),
        username: regUsername.trim(),
        password: regPassword,
        roles: [regRole],
      });
      setSuccessMsg('Account registered successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMsg(err.message || 'Registration failed. Check if username or email already exists.');
    } finally {
      setSubmitting(false);
    }
  };

  const applyDemoCredentials = (acc) => {
    setUsernameOrEmail(acc.username);
    setPassword(acc.password);
    setActiveTab('login');
    setErrorMsg('');
  };

  return (
    <div className="nz-editorial-login-root">
      {/* Ambient background glows */}
      <div className="nz-editorial-glow-emerald" />
      <div className="nz-editorial-glow-dark" />

      {/* Top Luxury Navigation Header */}
      <header className="nz-login-nav-header">
        <div className="nz-login-nav-inner">
          <Link to="/" className="nz-login-nav-brand">
            <img src="/nsk.jpeg" alt="Networkz Systems" className="nz-login-brand-img" />
            <span className="nz-login-brand-title">NETWORKZ SYSTEMS</span>
            <span className="nz-login-brand-badge">KOLLAM CAMPUS</span>
          </Link>

          <div className="nz-login-nav-right">
            <div className={`nz-editorial-status-pill ${serverStatus.online ? 'is-online' : 'is-offline'}`}>
              <span className="nz-status-dot" />
              <span>{serverStatus.online ? 'Spring Boot :8080 Active' : 'Backend Connecting...'}</span>
            </div>

            <Link to="/" className="nz-login-back-link">
              ← Campus Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="nz-login-page-body">
        <div className="nz-login-editorial-card">
          {/* Eyebrow & Brand Header */}
          <div className="nz-login-card-header">
            <span className="nz-eyebrow">ENTERPRISE ATTENDANCE PORTAL</span>
            <h1 className="nz-login-main-title">STAFF SIGN IN</h1>
            <p className="nz-login-main-desc">
              Access your daily timesheet, shift attendance, and enterprise records.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="nz-editorial-tabs">
            <button
              type="button"
              className={`nz-editorial-tab ${activeTab === 'login' ? 'is-active' : ''}`}
              onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            >
              STAFF LOGIN
            </button>
            <button
              type="button"
              className={`nz-editorial-tab ${activeTab === 'register' ? 'is-active' : ''}`}
              onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            >
              NEW ONBOARDING
            </button>
          </div>

          {/* Alerts */}
          {errorMsg && (
            <div className="nz-editorial-alert nz-alert-danger" role="alert">
              <span className="nz-alert-symbol">!</span>
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="nz-editorial-alert nz-alert-success" role="alert">
              <span className="nz-alert-symbol">✓</span>
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1-Click Quick Demo Accounts (Editorial Pill Strip) */}
          {activeTab === 'login' && (
            <div className="nz-editorial-demo-strip">
              <div className="nz-demo-strip-label">QUICK TEST ACCOUNTS</div>
              <div className="nz-demo-strip-grid">
                {DEMO_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.username}
                    type="button"
                    className="nz-demo-account-pill"
                    onClick={() => applyDemoCredentials(acc)}
                  >
                    <span className="nz-pill-role">{acc.label}</span>
                    <span className="nz-pill-badge">{acc.badge}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Form */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="nz-editorial-form">
              <div className="nz-form-group">
                <label className="nz-form-label" htmlFor="login-username">
                  Username, Email, or Employee Code
                </label>
                <input
                  id="login-username"
                  type="text"
                  className="nz-form-input"
                  placeholder="e.g. testadmin or hradmin_test"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  autoComplete="username"
                  required
                />
              </div>

              <div className="nz-form-group">
                <div className="nz-form-label-row">
                  <label className="nz-form-label" htmlFor="login-password">
                    Password
                  </label>
                  <span className="nz-label-hint">Default: Password@123</span>
                </div>
                <div className="nz-input-pw-wrapper">
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    className="nz-form-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="nz-editorial-pw-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'HIDE' : 'SHOW'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="nz-editorial-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'AUTHENTICATING WITH SPRING BOOT...' : 'SIGN IN TO STAFF PORTAL →'}
              </button>
            </form>
          ) : (
            /* Registration Form */
            <form onSubmit={handleRegisterSubmit} className="nz-editorial-form">
              <div className="nz-form-group">
                <label className="nz-form-label" htmlFor="reg-fullname">
                  Full Name
                </label>
                <input
                  id="reg-fullname"
                  type="text"
                  className="nz-form-input"
                  placeholder="e.g. Vignesh Kumar"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  required
                />
              </div>

              <div className="nz-form-group">
                <label className="nz-form-label" htmlFor="reg-email">
                  Official Email Address
                </label>
                <input
                  id="reg-email"
                  type="email"
                  className="nz-form-input"
                  placeholder="vignesh@networkz.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="nz-form-grid-2">
                <div className="nz-form-group">
                  <label className="nz-form-label" htmlFor="reg-username">
                    Username
                  </label>
                  <input
                    id="reg-username"
                    type="text"
                    className="nz-form-input"
                    placeholder="vignesh_k"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="nz-form-group">
                  <label className="nz-form-label" htmlFor="reg-role">
                    Role
                  </label>
                  <select
                    id="reg-role"
                    className="nz-form-input nz-form-select"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="ROLE_EMPLOYEE">Standard Employee</option>
                    <option value="ROLE_MANAGER">Team Manager</option>
                    <option value="ROLE_HR_ADMIN">HR Administrator</option>
                    <option value="ROLE_SUPER_ADMIN">Super Administrator</option>
                  </select>
                </div>
              </div>

              <div className="nz-form-group">
                <label className="nz-form-label" htmlFor="reg-password">
                  Password
                </label>
                <input
                  id="reg-password"
                  type="password"
                  className="nz-form-input"
                  placeholder="Min 6 characters (e.g. Password@123)"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="nz-editorial-submit-btn"
                disabled={submitting}
              >
                {submitting ? 'CREATING ACCOUNT...' : 'REGISTER & PROCEED TO DASHBOARD →'}
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="nz-login-card-foot">
            <span>ISO 9001:2015 ACCREDITED • NETWORKZ SYSTEMS KOLLAM</span>
          </div>
        </div>
      </main>
    </div>
  );
}
