import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IcMenu, IcSearch, IcBell, IcChevronDown, IcUser, IcSettings, IcLogout } from "../assets/icons.jsx";
import { getPortalByPath } from "../config/portals.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ENDPOINTS } from "../api/endpoints.js";
import apiClient from "../api/apiClient.js";
import { MOCK_NOTIFICATIONS } from "../data/mockData.js";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Navbar({ onBurger }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const portal = getPortalByPath(location.pathname);
  const [unread, setUnread] = useState(() => MOCK_NOTIFICATIONS.filter((n) => n.status === "Unread").length);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (!user?.userId) return;
    let cancelled = false;
    apiClient.get(`${ENDPOINTS.notificationsUnreadCount}?userId=${user.userId}`)
      .then((res) => { if (!cancelled) setUnread(res?.unreadCount ?? 0); })
      .catch(() => {}); // backend unreachable -> keep the mock-derived count
    return () => { cancelled = true; };
  }, [user?.userId]);

  const handleProfileButton = () => {
    setMenuOpen(false);
    navigate("/profile");
  }

  return (
    <header className="navbar">
      <button className="nav-burger" onClick={onBurger} aria-label="Toggle menu">
        <IcMenu />
      </button>

      <div className="nav-title">
        <div className="crumb">{portal ? portal.section : "AdStudio"}</div>
        <h1>{portal ? portal.label : "AdStudio"}</h1>
      </div>

      <div className="nav-search">
      </div>

      <div className="nav-actions">
        <button className="icon-btn" onClick={() => navigate("/notifications")} aria-label="Notifications">
          <IcBell />
          {unread > 0 && <span className="nub">{unread}</span>}
        </button>

        <div className={`nav-user ${menuOpen ? "open" : ""}`} ref={menuRef} onClick={() => setMenuOpen((o) => !o)}>
          <div className="av">{initials(user?.name || "AS")}</div>
          <div className="who">
            <div className="nm">{user?.name || "AdStudio User"}</div>
            <div className="rl">{user?.role || "Member"}</div>
          </div>
          <IcChevronDown size={16} />

          {menuOpen && (
            <div className="menu-pop" onClick={(e) => e.stopPropagation()}>
              <div className="mp-head">
                <div className="nm">{user?.name}</div>
                <div className="em">{user?.email}</div>
              </div>
              <button className="menu-item" onClick={handleProfileButton}><IcUser /> My profile</button>
              <button className="menu-item"><IcSettings /> Settings</button>
              <button className="menu-item danger" onClick={() => { setMenuOpen(false); logout(); }}>
                <IcLogout /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
