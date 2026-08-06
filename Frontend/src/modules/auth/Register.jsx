import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../../assets/Logo.jsx";
import { AuthAvatar, LoginArt } from "../../assets/LoginArt.jsx";
import { IcMail, IcLock, IcUser, IcPhone, IcAlert, IcGlobe, IcCheckCircle, IcInfo } from "../../assets/icons.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import "../../styles/auth.css";

const ROLES = [
  "BRAND_ADVERTISER",
    "MEDIA_PLANNER",
    "CREATIVE_MANAGER",
    "DELIVERY_PUBLISHER",
    "FINANCE_EXECUTIVE",
    "ADMIN"
];

export default function Register() {
  const { register } = useAuth();


  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: ROLES[0], password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.");
      return;
    }
    setBusy(true);
    // Dummy register -> sign in (backend optional).
    console.log("here-------------");
    
    const res = await register(form.name, form.email, form.phone, form.role, form.password);
    setBusy(false);
    if (res.ok) navigate("/login");
    else{ 
      
        console.log("Registration failed.----------------");

      setError("Could not create the account. Please try again."+res.error);
    }
  };

  return (
    <div className="auth">
      <div className="auth-brand">
        <div className="ab-top">
          <Logo size={44} className="logo-mark" />
          <div className="bt">Ad<span>Studio</span></div>
        </div>
        <div className="ab-mid">
          <LoginArt className="ab-art" />
          <h2>Join the team and ship <span className="hl">campaigns faster</span>.</h2>
          <p>
            Create your AdStudio account to plan media, manage creative approvals, monitor
            delivery pacing and keep billing reconciled end to end.
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

      <div className="auth-form-wrap">
        <div className="auth-card">
          <AuthAvatar size={72} className="auth-avatar" />
          <h1>Create your account</h1>
          <div className="sub">Set up your AdStudio workspace profile</div>

          <form className="auth-fields" onSubmit={submit}>
            {error && (
              <div className="auth-err"><IcAlert size={16} /> {error}</div>
            )}

            <div className="field">
              <label>Full name</label>
              <div className="input-icon">
                <IcUser />
                <input className="input" value={form.name} onChange={set("name")} placeholder="Jane Doe" />
              </div>
            </div>

            <div className="field">
              <label>Work email</label>
              <div className="input-icon">
                <IcMail />
                <input type="email" className="input" value={form.email} onChange={set("email")} placeholder="you@company.com" />
              </div>
            </div>

            <div className="form-grid">
              <div className="field">
                <label>Phone</label>
                <div className="input-icon">
                  <IcPhone />
                  <input className="input" value={form.phone} onChange={set("phone")} placeholder="+1 555 000 0000" />
                </div>
              </div>
              <div className="field">
                <label>Role</label>
                <select className="select" value={form.role} onChange={set("role")}>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="input-icon">
                <IcLock />
                <input type="password" className="input" value={form.password} onChange={set("password")} placeholder="Create a password" />
              </div>
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="demo-note">
            <IcInfo />
            <span>Make sure to run the backend on <b>localhost:9090</b> to get the portal access.</span>
          </div>

          <div className="auth-alt">
            Already have an account? <Link to="/login" className="link-muted">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
