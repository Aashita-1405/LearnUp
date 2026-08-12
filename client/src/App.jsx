import { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

function App() {
  const [view, setView] = useState('signup');
  const [auth, setAuth] = useState({ user: null, token: null });
  const [signupData, setSignupData] = useState({ name: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem('learnup-auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAuth(parsed);
      setView('profile');
    }
  }, []);

  const handleSignup = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(signupData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed');
      }

      localStorage.setItem('learnup-auth', JSON.stringify({ user: data.user, token: data.token }));
      setAuth({ user: data.user, token: data.token });
      setView('profile');
      setMessage('Sign up successful!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('learnup-auth', JSON.stringify({ user: data.user, token: data.token }));
      setAuth({ user: data.user, token: data.token });
      setView('profile');
      setMessage('Login successful!');
    } catch (error) {
      setMessage(error.message);
    }
  };

  const fetchProfile = async () => {
    if (!auth.token) return;

    try {
      const response = await fetch(`${API_URL}/profile`, {
        method: 'GET',
        credentials: 'include',
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load protected page');
      }

      setProfile(data);
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    if (view === 'profile' && auth.user) {
      fetchProfile();
    }
  }, [view, auth.user]);

  const logout = () => {
    localStorage.removeItem('learnup-auth');
    setAuth({ user: null, token: null });
    setProfile(null);
    setView('login');
    setMessage('You have been logged out');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">LearnUp</div>
        <nav>
          <button className={view === 'signup' ? 'active' : ''} onClick={() => setView('signup')}>Sign Up</button>
          <button className={view === 'login' ? 'active' : ''} onClick={() => setView('login')}>Login</button>
          <button className={view === 'profile' ? 'active' : ''} onClick={() => { if (auth.user) setView('profile'); }}>Protected Page</button>
        </nav>
      </header>

      <main className="card-wrap">
        {view === 'signup' && (
          <form className="auth-card" onSubmit={handleSignup}>
            <h2>Create account</h2>
            <input
              type="text"
              placeholder="Full name"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
            <button type="submit">Sign Up</button>
            <p className="switch-text">Already have an account? <button type="button" className="inline-btn" onClick={() => setView('login')}>Login</button></p>
          </form>
        )}

        {view === 'login' && (
          <form className="auth-card" onSubmit={handleLogin}>
            <h2>Welcome back</h2>
            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
            <button type="submit">Login</button>
            <p className="switch-text">Need an account? <button type="button" className="inline-btn" onClick={() => setView('signup')}>Sign Up</button></p>
          </form>
        )}

        {view === 'profile' && auth.user && (
          <div className="profile-card">
            <h2>Protected page</h2>
            <p>Welcome, {auth.user.name}</p>
            <p>Email: {auth.user.email}</p>
            <button onClick={logout}>Logout</button>
            {profile && (
              <div className="profile-box">
                <h3>Authentication status</h3>
                <p>{profile.message}</p>
                <pre>{JSON.stringify(profile.user, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </main>

      {message && <div className="message-box">{message}</div>}
    </div>
  );
}

export default App;
