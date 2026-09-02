import { useState, type FormEvent } from "react";
import PortfolioManager from "./PortfolioManager";

const SESSION_KEY = "portfolio-manage-access";
const ADMIN_USERNAME = "administrator";
const ADMIN_PASSWORD = "Orangtua";

export default function ManageAccess() {
  const [isAllowed, setIsAllowed] = useState(() => sessionStorage.getItem(SESSION_KEY) === "granted");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "granted");
      setIsAllowed(true);
      return;
    }
    setError("Username atau password tidak sesuai.");
    setPassword("");
  };

  if (isAllowed) return <PortfolioManager standalone />;

  return (
    <main className="manage-login-page">
      <form className="manage-login-card" onSubmit={login}>
        <div className="manage-login-icon"><i className="fa-solid fa-lock" aria-hidden="true" /></div>
        <p className="manager-eyebrow">Restricted area</p>
        <h1>Portfolio manager</h1>
        <p>Masuk untuk mengelola project dan experience.</p>
        <label>Username<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" required autoFocus /></label>
        <label>Password<input type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" required /></label>
        {error && <p className="manage-login-error" role="alert">{error}</p>}
        <button type="submit">Sign in <i className="fa-solid fa-arrow-right" aria-hidden="true" /></button>
        <a href="/">← Back to portfolio</a>
      </form>
    </main>
  );
}
