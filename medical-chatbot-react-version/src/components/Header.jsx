import { useNavigate } from "react-router-dom";
import { FaHeartCirclePlus } from "react-icons/fa6";
import api from "../api";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Unable to end the server session:", error);
    } finally {
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="px-4 py-3 text-bg-dark shadow-sm">
      <div className="container-fluid">
        <div className="d-flex align-items-center justify-content-between">

          {/* Left section */}
          <div className="d-flex align-items-center gap-2">
            <FaHeartCirclePlus size={34} />
            <h2 className="m-0 fw-bold">Your Personal Health Assistant</h2>
          </div>

          {/* Right section */}
          <div className="d-flex align-items-center gap-3">

            <button
              onClick={handleLogout}
              type="button"
              className="btn btn-warning px-4"
            >
              Logout
            </button>

          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;