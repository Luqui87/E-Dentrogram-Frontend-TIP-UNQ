import "./Navbar.css";
import logo from "../../assets/Logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <>
      {token && (
        <header>
          <div onClick={() => navigate("/Home")} className="logo-section">
            <img src={logo} alt="Logo de aplicación" />
            <a>E-Dentogram</a>
          </div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </header>
      )}
    </>
  );
}

export default Navbar;
