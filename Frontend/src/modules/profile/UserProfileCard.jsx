import React, { useContext } from "react";
import "./UserProfileCard.css";
import { useAuth } from "../../context/AuthContext";

/**
 * UserProfileCard.jsx
 * ---------------------------------------------------------------------------
 * Static (no animation/motion), stylish sky-blue & white profile card.
 *
 * Consumes { user, logout } from AuthContext.
 *
 * `user` fields match the JPA entity exactly:
 *   userId, name, role, email, password, phone, accountId, status
 *
 * NOTE: `password` is intentionally NEVER read or rendered here — it is a
 * BCrypt hash and must never reach the UI, matching the entity's own
 * "never store the raw password" intent on the backend.
 * ---------------------------------------------------------------------------
 */

// Builds initials from the single `name` field:
// "Arun Kumar" -> "AK"   |   "Arun" -> "A"
const getInitials = (fullName) => {
  if (!fullName || typeof fullName !== "string") return "";
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "";
  const first = parts[0].charAt(0).toUpperCase();
  if (parts.length > 1) {
    const second = parts[1].charAt(0).toUpperCase();
    return `${first}${second}`;
  }
  return first;
};

// "CAMPAIGN_MANAGER" -> "Campaign Manager"
const formatLabel = (value) => {
  if (!value || typeof value !== "string") return "N/A";
  return value
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Maps the `status` enum (UserStatus) to a badge style + label
const getStatusMeta = (status) => {
  switch ((status || "").toUpperCase()) {
    case "ACTIVE":
      return { label: "Active", className: "badge-green" };
    case "INACTIVE":
      return { label: "Inactive", className: "badge-gray" };
    case "SUSPENDED":
      return { label: "Suspended", className: "badge-red" };
    case "BLOCKED":
      return { label: "Blocked", className: "badge-red" };
    case "PENDING":
      return { label: "Pending", className: "badge-amber" };
    default:
      return { label: status ? formatLabel(status) : "Unknown", className: "badge-gray" };
  }
};


const UserProfileCard = () => {
   const {user,  logout}= useAuth();
  // const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    // Sample function as requested — replace with real logout logic.
    console.log("Logout button clicked — sample logout function executed.");
    if (typeof logout === "function") {
      logout();
    }
  };

  if (!user) {
    return (
      <div className="profile-card profile-card--empty">
        <p>No user data available.</p>
      </div>
    );
  }

  const initials = getInitials(user.name);
  const statusMeta = getStatusMeta("Active");

  return (
    <div className="profile-card">
      <span className="corner-bracket corner-bracket--tl" aria-hidden="true" />
      <span className="corner-bracket corner-bracket--br" aria-hidden="true" />
      <span className="watermark-bolt" aria-hidden="true">⚡</span>

      <div className="profile-header">
        <div className="avatar-frame">
          <span className="avatar-hex" aria-hidden="true" />
          <div className="avatar-circle" aria-label={`User initials ${initials}`}>
            <span>{initials}</span>
          </div>
        </div>

        <h2 className="profile-name">{user.name}</h2>

        <span className="role-badge">
          <span className="bolt-icon" aria-hidden="true">⚡</span>
          {formatLabel(user.role)}
        </span>
      </div>

      <div className="profile-divider" />

      <div className="profile-details">
        <div className="detail-row">
          <span className="detail-icon" aria-hidden="true">✉</span>
          <div className="detail-text">
            <span className="detail-label">Email</span>
            <span className="detail-value" title={user.email}>
              {user.email}
            </span>
          </div>
        </div>

        {user.phone && (
          <div className="detail-row">
            <span className="detail-icon" aria-hidden="true">📞</span>
            <div className="detail-text">
              <span className="detail-label">Phone</span>
              <span className="detail-value">{user.phone}</span>
            </div>
          </div>
        )}

        <div className="badge-grid">
          <div className="badge-item">
            <span className="badge-item-label">Status</span>
            <span className={`status-pill ${statusMeta.className}`}>
              <span className="status-dot" aria-hidden="true" />
              {statusMeta.label}
            </span>
          </div>

         
        </div>

        <div className="meta-strip">
          <span className="meta-chip">User ID: {user.userId}</span>
          {user.accountId != null && (
            <span className="meta-chip">Account ID: {user.accountId}</span>
          )}
        </div>
      </div>

      <div className="profile-divider" />

      <button type="button" className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default UserProfileCard;
