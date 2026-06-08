import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/slices/authSlice";
import type { AppDispatch, RootState } from "../../store";
import { showSuccessToast } from "../../utils/toast";

export default function MobileNav({
  variant = "public",
}: {
  variant?: "public" | "auth";
}) {
  const location = useLocation();
  const path = location.pathname.toLowerCase();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { token } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    showSuccessToast("Logged out securely.", 3000);
    navigate("/signin");
  };

  if (token) {
    return (
      <nav className="flex md:hidden fixed bottom-0 left-0 w-full h-[70px] bg-neutral-900 border-t border-neutral-800 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3)]">
        {/* STATISTICS */}
        <Link
          to="/statistics"
          className={`flex-1 flex flex-col items-center justify-center transition-colors border-r border-neutral-800 ${
            path === "/statistics"
              ? "bg-white text-neutral-900"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <path d="M3 3v18h18" />
            <path d="m19 9-5 5-4-4-3 3" />
          </svg>
          <span className="text-[0.55rem] font-bold tracking-widest uppercase inter">
            STATS
          </span>
        </Link>

        {/* INVENTORY */}
        <Link
          to="/inventory"
          className={`flex-1 flex flex-col items-center justify-center transition-colors border-r border-neutral-800 ${
            path === "/inventory"
              ? "bg-white text-neutral-900"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.29 7 12 12 20.71 7" />
            <line x1="12" y1="22" x2="12" y2="12" />
          </svg>
          <span className="text-[0.55rem] font-bold tracking-widest uppercase inter">
            INV
          </span>
        </Link>

        {/* HISTORY */}
        <Link
          to="/history"
          className={`flex-1 flex flex-col items-center justify-center transition-colors border-r border-neutral-800 ${
            path === "/history"
              ? "bg-white text-neutral-900"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
            <path d="M8 14h.01" />
            <path d="M12 14h.01" />
            <path d="M16 14h.01" />
            <path d="M8 18h.01" />
            <path d="M12 18h.01" />
            <path d="M16 18h.01" />
          </svg>
          <span className="text-[0.55rem] font-bold tracking-widest uppercase inter">
            HISTORY
          </span>
        </Link>

        {/* ORDER */}
        <Link
          to="/order"
          className={`flex-1 flex flex-col items-center justify-center transition-colors border-r border-neutral-800 ${
            path === "/order"
              ? "bg-white text-neutral-900"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
            <polyline points="10 9 9 9 8 9" />
          </svg>
          <span className="text-[0.55rem] font-bold tracking-widest uppercase inter">
            ORDER
          </span>
        </Link>

        {/* PROFILE */}
        <Link
          to="/profile"
          className={`flex-1 flex flex-col items-center justify-center transition-colors border-r border-neutral-800 ${
            path === "/profile"
              ? "bg-white text-neutral-900"
              : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-[0.55rem] font-bold tracking-widest uppercase inter">
            PROFILE
          </span>
        </Link>

        {/* LOGOUT */}
        <Link
          tabIndex={-1}
          to="/signin"
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mb-1"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className="text-[0.55rem] font-bold tracking-widest uppercase inter">
            LOGOUT
          </span>
        </Link>
      </nav>
    );
  }

  // PUBLIC VARIANT
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 w-full h-[80px] bg-[#f8f9fa] border-t-2 border-gray-200 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {/* HOME (Active) */}
      <Link
        to="/"
        className={`flex-1 flex flex-col items-center justify-center transition-colors ${
          path === "/" || path === "/home"
            ? "bg-[#051426] text-white"
            : "text-[#051426] hover:bg-gray-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-1"
        >
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        <span className="text-[0.65rem] font-bold tracking-widest uppercase inter">
          HOME
        </span>
      </Link>

      {/* PRICING */}
      <a
        href="#pricing"
        className="flex-1 flex flex-col items-center justify-center text-[#051426] border-r border-gray-200 hover:bg-gray-100 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-1"
        >
          <rect x="2" y="6" width="20" height="12" rx="2"></rect>
          <circle cx="12" cy="12" r="2"></circle>
          <path d="M6 12h.01M18 12h.01"></path>
        </svg>
        <span className="text-[0.65rem] font-bold tracking-widest uppercase inter">
          PRICING
        </span>
      </a>

      {/* SIGN UP */}
      <Link
        to="/signup"
        className={`flex-1 flex flex-col items-center justify-center transition-colors border-r border-gray-200 ${
          path === "/signup"
            ? "bg-[#051426] text-white"
            : "text-[#051426] hover:bg-gray-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-1"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <polyline points="9 12 12 15 16 9"></polyline>
        </svg>
        <span className="text-[0.65rem] font-bold tracking-widest uppercase inter">
          SIGN UP
        </span>
      </Link>

      {/* LOGIN */}
      <Link
        to="/signin"
        className={`flex-1 flex flex-col items-center justify-center transition-colors ${
          path === "/signin"
            ? "bg-[#051426] text-white"
            : "text-[#051426] hover:bg-gray-100"
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mb-1"
        >
          <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
          <polyline points="10 17 15 12 10 7"></polyline>
          <line x1="15" y1="12" x2="3" y2="12"></line>
        </svg>
        <span className="text-[0.65rem] font-bold tracking-widest uppercase inter">
          LOGIN
        </span>
      </Link>
    </nav>
  );
}
