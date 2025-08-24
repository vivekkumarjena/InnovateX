import { Link } from 'react-scroll';
import { useState } from 'react';
import './Navbar.css';
import AuthPopup from './AuthPopup';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const { user, logout } = useAuth();

  const navItems = {
    Home: 'home',
    'About Odisha': 'about-odisha',
    Attractions: 'attractions',
    Plan: 'plan',
    Store: 'store',
    'Important Links': 'important-links',
  };

  return (
    <>
      <nav className="navbar">
        <img src="/assets/logo.jpg" alt="Logo" className="logo" />

        <div className="nav-links">
          {Object.keys(navItems).map((item) => (
            <Link
              key={item}
              to={navItems[item]}
              containerId="app-scroll"
              smooth={true}
              spy={true}
              duration={600}
              offset={-70}
              className="nav-item"
              activeClass="active"
            >
              {item}
            </Link>
          ))}
        </div>

        <div className="user-auth">
          <div className="auth-item">
            <img src="/assets/notification.png" alt="Notifications" />
            <span>Notifications</span>
          </div>

          {user ? (
            <div className="auth-item" style={{ cursor: 'default' }}>
              <img src="/assets/user.png" alt="User" />
              <span>{user.email}</span>
              <button style={{ marginTop: 6 }} onClick={logout}>Logout</button>
            </div>
          ) : (
            <div className="auth-item" onClick={() => setShowAuthPopup(true)}>
              <img src="/assets/login.png" alt="User" />
              <span>Login</span>
            </div>
          )}
        </div>
      </nav>

      {showAuthPopup && <AuthPopup onClose={() => setShowAuthPopup(false)} />}
    </>
  );
};

export default Navbar;
