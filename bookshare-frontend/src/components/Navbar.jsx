import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Navbar() {

  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for token in localStorage (key used by api.js)
    const token = localStorage.getItem("bookshare_token");
    setIsLoggedIn(!!token);
    
    // Check if user is admin
    const user = api.getStoredUser();
    setIsAdmin(user && user.role === "ADMIN");
  }, []);

  // Listen for custom auth events from other components
  useEffect(() => {
    const handleAuthChange = () => {
      const token = localStorage.getItem("bookshare_token");
      setIsLoggedIn(!!token);
      
      // Check if user is admin
      const user = api.getStoredUser();
      setIsAdmin(user && user.role === "ADMIN");
    };

    window.addEventListener("auth-change", handleAuthChange);
    return () => window.removeEventListener("auth-change", handleAuthChange);
  }, []);
 
const navLinks = [
  { name: "Browse Books", path: "/books" },
  { name: "How It Works", path: "/#how" },
  { name: "Features", path: "/#features" },
  { name: "About", path: "/#about" }
];
  const handleLogout = () => {
    // Clear the correct localStorage keys used by api.js
    localStorage.removeItem("bookshare_token");
    localStorage.removeItem("bookshare_user");
    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("auth-change"));
    window.location.href = "/";
  };
<Link to="/" className="text-decoration-none"></Link>
  return (
    <nav style={{
      background: "#FFFFFF",
      borderBottom: "2px solid #FEFF86",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 2px 16px rgba(254,255,134,0.25)"
    }}>

      <div className="container-fluid px-4 px-lg-5 d-flex align-items-center justify-content-between" style={{ minHeight: 68 }}>

        {/* Logo */}
        <a href="/" className="text-decoration-none">
          <div style={{ fontFamily:"Georgia,serif", fontWeight:900, fontSize:"1.3rem", color:"#1A1A1A"}}>
            Book<span style={{borderBottom:"3px solid #FEFF86"}}>Cycle</span>
          </div>
        </a>

        {/* Desktop Links */}
        <ul className="d-none d-lg-flex list-unstyled mb-0 gap-2 align-items-center">
  {navLinks.map(link => (
    <li key={link.name}>
      <Link
        to={link.path}
        style={{
          padding:"8px 16px",
          borderRadius:8,
          fontSize:"0.87rem",
          fontWeight:600,
          color:"#333",
          textDecoration:"none"
        }}
      >
        {link.name}
      </Link>
    </li>
  ))}
</ul>

        {/* RIGHT SIDE */}
        <div className="d-none d-lg-flex gap-2 align-items-center">

          {!isLoggedIn ? (
            <>
              <a href="/login" onClick={handleLogout} style={{
                padding:"9px 22px",
                borderRadius:8,
                border:"2px solid #1A1A1A",
                color:"#1A1A1A",
                fontWeight:700,
                fontSize:"0.85rem",
                textDecoration:"none"
              }}>
                Login
              </a>

              <a href="/login" style={{
                padding:"9px 22px",
                borderRadius:8,
                background:"#FEFF86",
                border:"2px solid #E0E000",
                color:"#1A1A1A",
                fontWeight:700,
                fontSize:"0.85rem",
                textDecoration:"none"
              }}>
                Get Started
              </a>
            </>
          ) : (
            <>
              {/* Admin Link */}
              {isAdmin && (
                <a href="/admin" style={{
                  padding:"8px 16px",
                  borderRadius:8,
                  background:"#1A1A1A",
                  color:"#FEFF86",
                  fontWeight:700,
                  fontSize:"0.85rem",
                  textDecoration:"none"
                }}>
                  Admin
                </a>
              )}
            
              {/* Profile */}
              <a href="/profile" title="Profile">
                <div style={{
                  width:38,
                  height:38,
                  borderRadius:"50%",
                  background:"#FEFF86",
                  display:"flex",
                  alignItems:"center",
                  justifyContent:"center",
                  fontSize:"1.1rem"
                }}>
                  👨‍💻
                </div>
              </a>

              {/* Logout */}
              <button
                onClick={handleLogout}
                style={{
                  padding:"8px 18px",
                  borderRadius:8,
                  border:"2px solid #1A1A1A",
                  background:"transparent",
                  fontWeight:700
                }}
              >
                Logout
              </button>
            </>
          )}

        </div>

        {/* Mobile menu button */}
        <button
          className="d-lg-none border-0 bg-transparent"
          onClick={() => setIsOpen(!isOpen)}
        >
          ☰
        </button>

      </div>

    </nav>
  );
}