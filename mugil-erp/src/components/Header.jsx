import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleSignOut = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const username = user?.username || "User";
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="erp-header">
      <div className="erp-logo">
        <h2>Mugil ERP</h2>
      </div>

      <div className="erp-user-section">
        <div className="user-avatar">
          {initial}
        </div>

        <span className="user-name">
          {username}
        </span>

        <button
          className="logout-btn"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}