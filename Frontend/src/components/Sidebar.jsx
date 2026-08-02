import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Logo from "../assets/Logo.jsx";
import { IcLock } from "../assets/icons.jsx";
import { PORTALS, SECTION_ORDER } from "../config/portals.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function initials(name = "") {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}

export default function Sidebar({ open, onNavigate }) {
  const { isPortalAllowed, user } = useAuth();
    const navigate = useNavigate();
    
  const handleProfileButton = () => {
    navigate("/profile");
  }

  return (
    <aside className={`sidebar ${open ? "open" : ""}`}>
      <div className="sb-brand">
        <Logo size={40} className="logo-mark" />
        <div>
          <div className="bt">Ad<span>Studio</span></div>
          <div className="bs">Campaign Suite</div>
        </div>
      </div>

      <nav className="sb-scroll">
        {SECTION_ORDER.map((section) => {
          const items = PORTALS.filter((p) => p.section === section);
          if (!items.length) return null;
          return (
            <div key={section}>
              <div className="sb-section">{section}</div>
              {items.map((p) => {
                const allowed = isPortalAllowed(p.key);
                return (
                  <NavLink
                    key={p.key}
                    to={p.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `sb-link ${isActive ? "active" : ""} ${allowed ? "" : "locked"}`
                    }
                    title={allowed ? p.label : `${p.label} — not authorized`}
                  >
                    <p.Icon className="ic" />
                    <span>{p.label}</span>
                    {!allowed && <IcLock className="lock" />}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </nav>

      <div className="sb-foot">
        <div className="sb-user" onClick={handleProfileButton}>
          <div className="av">{initials(user?.name || "AS")}</div>
          <div className="info">
            <div className="nm">{user?.name || "AdStudio User"}</div>
            <div className="rl">{user?.role || "Member"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
