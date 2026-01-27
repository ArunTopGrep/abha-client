import React, { useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import { ApiProvider } from './context/ApiContext';
import RegistrationAuth from './pages/RegistrationAuth';
import AbhaStepper from './pages/AbhaStepper';
import ApiContext from './context/ApiContext';
import AbhaProfilePage from './pages/AbhaProfilePage';

function AuthInitializer({ children }) {
  const { setAccessToken, setPublicKey } = useContext(ApiContext);
  const [loading, setLoading] = useState(true);
  const url = process.env.REACT_APP_BASE_URL
  console.log("BASE URL:", url);

  async function getSession() {
    try {
      const r = await fetch(`${url}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const json = await r.json();
      const maybe = (json && json.token) ? json.token : json;
      const access = maybe && (maybe.accessToken || maybe.access_token || maybe.token);

      if (access) {
        setAccessToken(access);
        localStorage.setItem('accessToken', access);
        return access;
      }
    } catch (err) {
      console.error("Session Error:", err);
    }
    return null;
  }

  async function getCert(token) {
    try {
      const headers = { authorization: 'Bearer ' + token };
      const r = await fetch(`${url}/cert`, { method: 'GET', headers });
      const json = await r.json();
      let key = json?.publicKey || json?.public_key || json?.certificate || json;

      if (key) {
        const keyStr = typeof key === 'string' ? key : JSON.stringify(key);
        setPublicKey(keyStr);
        localStorage.setItem('publicKey', keyStr);
      }
    } catch (err) {
      console.error("Cert Error:", err);
    }
  }

  useEffect(() => {
    const init = async () => {
      const existingToken = localStorage.getItem('accessToken');
      const existingKey = localStorage.getItem('publicKey');

      if (!existingToken) {
        const newToken = await getSession();
        if (newToken) await getCert(newToken);
      } else {
        setAccessToken(existingToken);
        if (!existingKey) await getCert(existingToken);
        else setPublicKey(existingKey);
      }
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="app-loader">Initializing ABDM Session...</div>;

  return children;
}

function Home() {
  const navigate = useNavigate();
  const { setAccessToken, setPublicKey } = useContext(ApiContext);
  const [loading, setLoading] = useState(false);
  const url = process.env.REACT_APP_BASE_URL

  async function getSession() {
    setLoading(true);
    try {
      const r = await fetch(`${url}/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const json = await r.json();

      const maybe = (json && json.token) ? json.token : json;
      const access = maybe && (maybe.accessToken || maybe.access_token || maybe.token);

      if (access) {
        setAccessToken(access);
        localStorage.setItem('accessToken', access);
        return access;
      }
    } catch (err) {
      console.error("Session Error:", err);
    } finally {
      setLoading(false);
    }
    return null;
  }

  async function getCert(tokenOverride) {
    setLoading(true);
    try {
      const token = localStorage.getItem('accessToken')

      if (!token) {
        console.warn("No token available for cert API");
        return;
      }

      const headers = { authorization: 'Bearer ' + token };
      const r = await fetch(`${url}/cert`, { method: 'GET', headers });

      const json = await r.json();
      let key = null;
      if (json && typeof json === 'object') key = json.publicKey || json.public_key || json.certificate || null;
      if (!key && typeof json === 'string') key = json;

      if (key) {
        const keyStr = typeof key === 'string' ? key : JSON.stringify(key);
        setPublicKey(keyStr);
        localStorage.setItem('publicKey', keyStr);
      }
    } catch (err) {
      console.error("Cert Error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const existingToken = localStorage.getItem('accessToken');
      const existingKey = localStorage.getItem('publicKey');

      if (!existingToken) {

        const newToken = await getSession();

        if (newToken) {
          await getCert(newToken);
        }
      } else if (!existingKey) {
        await getCert(existingToken);
      }
    };

    initializeAuth();
  }, []);

  return (
    <div className="home-card">
      {loading && <div className="loader">Refreshing Security Credentials...</div>}
      <div className="page-container">
        <div className="home-hero">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(90deg,#7c3aed,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✨</div>
              <div style={{ fontSize: 12, color: '#7dd3fc', fontWeight: 700 }}>WELCOME</div>
            </div>
            <h2 className="page-title">Welcome to <span style={{ fontWeight: 800 }}>ABDM Client</span></h2>
            <div className="lead">A premium, low-code interface for exploring ABDM API collections and flows. Seamlessly integrate health data services with our intuitive platform.</div>

            <div style={{ display: 'flex', gap: 12, marginTop: 18 }}>
              <button className="btn" onClick={() => navigate('/registration-auth')}>Get Started</button>
              <a className="btn secondary" href="https://abdm.gov.in:8081/uploads/sandbox_guidelines_b39bcce23e.pdf" target="_blank" rel="noopener noreferrer">View Documentation</a>
            </div>
          </div>

          <div className="overview-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#93c5fd' }}>OVERVIEW</div>
              <div style={{ width: 10, height: 10, borderRadius: 10, background: '#06b6d4' }} />
            </div>
            <h3 style={{ marginTop: 8, marginBottom: 6, color: '#7dd3fc' }}>ABDM Client</h3>
            <div style={{ color: '#9fb4d9', fontSize: 13 }}>A playground for ABDM integrations — session management, certificates, and enrolment flows.</div>

            <div style={{ marginTop: 12 }}>
              <div className="item">📚 <span>API Collections</span></div>
              <div className="item">⚡ <span>Quick Testing</span></div>
              <div className="item">🛡️ <span>Secure Sessions</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  const isRegistrationFlow = () => {
    const path = location.pathname;
    return path === '/registration-auth' ||
      path === '/create-abha' ||
      path === '/abha-profile';
  };

  return (
    <div className="App app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <div className="account">
            <div className="avatar">AB</div>
            <div className="account-details">
              <div className="account-name">ABDM Client</div>
              <div className="account-meta">Sandbox Environment</div>
              <div className="account-details">Designed by TopGrep</div>
            </div>
          </div>
        </div>
        <div className="topbar-right">
          <div className="top-actions">
            <button className="btn">Switch Account</button>
          </div>
        </div>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-brand">
            <div className="logo" />
            <h1>ABDM</h1>
          </div>
          <nav className="App-nav">
            <ul>
              <li><NavLink to="/" end>Home</NavLink></li>
              <li>
                <NavLink
                  to="/registration-auth"
                  className={isRegistrationFlow() ? 'active' : ''}
                >
                  Registration & Auth
                </NavLink>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/registration-auth" element={<RegistrationAuth />} />
            <Route path="/create-abha" element={<AbhaStepper />} />
            <Route path="/abha-profile" element={<AbhaProfilePage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <Router>
      <ApiProvider>
        <AuthInitializer>
          <App />
        </AuthInitializer>
      </ApiProvider>
    </Router>
  );
}

export default AppWrapper;