import React, { useState } from 'react'
import { navLinks, styles } from '../assets/dummyadmin'
import { GiChefToque } from "react-icons/gi";
import { FiMenu, FiX } from 'react-icons/fi';
import { NavLink, Link, useNavigate } from 'react-router-dom';

const Navbar = () => {

  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    localStorage.removeItem('loginData');
    window.location.href = import.meta.env.VITE_FRONTEND_URL || '/';
  };


  return (
    <nav className={styles.navWrapper}>
      <div className={styles.navContainer}>
        {/* Make logo clickable and link to dashboard */}
        <Link to="/dashboard" className={styles.logoSection}>
          <GiChefToque className={styles.logoIcon} />
          <span className={styles.logoText}>Admin Panel</span>
        </Link>

        <button onClick={() => setMenuOpen(!menuOpen)}
          className={styles.menuButton}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>

        <div className={styles.desktopMenu}>
          {navLinks.map(link => (
            <NavLink key={link.name} to={link.href} className={({ isActive }) =>
              `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
              {link.icon}
              <span>
                {link.name}
              </span>
            </NavLink>
          ))}

          <button onClick={handleLogout} className={`${styles.navLinkBase} border-amber-900/30 text-amber-100 hover:border-amber-500 hover:bg-amber-900/20`}>
            <FiX className="border-amber-900/30 text-amber-100 hover:border-amber-500 hover:bg-amber-900/20" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/*FOR MOBILE VIEW */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <NavLink key={link.name} to={link.href}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `${styles.navLinkBase} ${isActive ? styles.navLinkActive : styles.navLinkInactive}`}>
              {link.icon}
              <span>
                {link.name}
              </span>
            </NavLink>
          ))}

          <button onClick={() => {
            setMenuOpen(false);
            handleLogout();
          }} className={`${styles.navLinkBase} border-amber-900/30 text-amber-100 hover:border-amber-500 hover:bg-amber-900/20`}>
            <FiX className="border-amber-900/30 text-amber-100 hover:border-amber-500 hover:bg-amber-900/20"/>
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar