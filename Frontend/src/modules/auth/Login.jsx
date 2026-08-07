import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/Logo.jsx";
import { AuthAvatar, LoginArt } from "../../assets/LoginArt.jsx";
import { IcMail, IcLock, IcInfo, IcAlert, IcGlobe, IcCheckCircle } from "../../assets/icons.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/auth.css";

const ROLE_PRESETS = [
  
  { label: "Admin", email: "admin@adstudio.com" },
  { label: "Advertiser", email: "advertiser@puma.com" },
  { label: "Publisher", email: "publisher@adstudio.com" },
  { label: "Media-Planner", email: "mediaplanner@adstudio.com" },
  { label: "Creative", email: "creative@adstudio.com" },
  { label: "Finance", email: "financer@adstudio.com" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@adstudio.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  // email and password entered at frontend will come to here
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Enter your email and password to continue.");
      return;
    }
    setBusy(true);
    const res = await login(email, password); // this login is from auth-context
    setBusy(false);
    if (res.ok) navigate("/dashboard");
    else setError("Sign in failed. Please check your details and try again.");
  };

  return (
    <div className="auth">
      {/* Left brand panel */}
      <div className="auth-brand">
        <div className="ab-top">
          <Logo size={44} className="logo-mark" />
          <div className="bt">Ad<span>Studio</span></div>
        </div>

        <div className="ab-mid">
          <LoginArt className="ab-art" />
          <h2>Run every campaign from one <span className="hl">command center</span>.</h2>
          <p>
            Plan media, manage creative, track delivery and reconcile billing. all in a single
            workspace built for advertising teams, planners and publishers.
          </p>
          <div className="ab-stats">
            <div className="s"><div className="v">19+</div><div className="l">Tables</div></div>
            <div className="s"><div className="v">7</div><div className="l">Channels</div></div>
            <div className="s"><div className="v">6</div><div className="l">Team roles</div></div>
          </div>
        </div>

        <div className="ab-foot">
          <span><IcGlobe size={15} /> Multi-advertiser</span>
          <span><IcCheckCircle size={15} /> RBAC & audit trails</span>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-wrap">
        <div className="auth-card">
          <AuthAvatar size={76} className="auth-avatar" />
          <h1>Welcome back</h1>
          <div className="sub">Sign in to your AdStudio workspace</div>

          <form className="auth-fields" onSubmit={submit}>
            {error && (
              <div className="auth-err">
                <IcAlert size={16} /> {error}
              </div>
            )}

            <div className="field">
              <label htmlFor="email">Work email</label>
              <div className="input-icon">
                <IcMail />
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  autoComplete="username"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="password">Password</label>
              <div className="input-icon">
                <IcLock />
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <div className="auth-divider">QUICK DEMO SIGN-IN</div>
          <div className="demo-roles">
            <div className="dr-label">Tap a role to prefill credentials</div>
            <div className="role-chips">
              {ROLE_PRESETS.map((r) => (
                <button
                  key={r.label}
                  type="button"
                  className="role-chip"
                  onClick={() => { setEmail(r.email); setPassword("password"); }}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="demo-note">
            <IcInfo />
            <span>Make sure to run the backend on <b> localhost:9090 </b>
             to get the portal access.</span>
          </div>

          <div className="auth-alt">
            New to AdStudio? <Link to="/register" className="link-muted">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
