import { Link } from "react-router-dom";

export default function MobileNav() {
  return (
    <nav className="flex md:hidden fixed bottom-0 left-0 w-full h-[80px] bg-[#f8f9fa] border-t-2 border-gray-200 z-[100] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
      {/* HOME (Active) */}
      <Link
        to="/"
        className="flex-1 flex flex-col items-center justify-center bg-[#051426] text-white"
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
        className="flex-1 flex flex-col items-center justify-center text-[#051426] hover:bg-gray-100 transition-colors"
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
