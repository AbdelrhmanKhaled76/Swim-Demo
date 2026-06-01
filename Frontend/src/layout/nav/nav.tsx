import React from "react";
import Button from "../../components/button/button";
import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="hidden md:flex w-full h-[90px] bg-white items-center justify-between px-6 md:px-12 border-b-2 border-gray-100 sticky top-0 z-[100] shadow-sm">
      {/* Left: Logo Placeholder */}
      <div className="w-[180px] h-[45px] bg-gray-400"></div>

      {/* Center/Right: Navigation Links */}
      <div className="hidden md:flex gap-4">
        <Link to="/">
          <Button
            variant="outline"
            className="!border-gray-300 !text-[#051426] hover:!bg-gray-50 !px-6 flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            HOME
          </Button>
        </Link>
        <Button
          variant="outline"
          className="!border-gray-300 !text-[#051426] hover:!bg-gray-50 !px-6 flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="6" width="20" height="12" rx="2"></rect>
            <circle cx="12" cy="12" r="2"></circle>
            <path d="M6 12h.01M18 12h.01"></path>
          </svg>
          PRICING
        </Button>
      </div>

      {/* Right: Auth Buttons */}
      <div className="flex gap-4">
        <Link to="/signin">
          <Button
            variant="primary"
            className="!bg-[#051426] hover:!bg-[#0a2342] !px-8"
          >
            LOGIN
          </Button>
        </Link>

        <Link to="/signup">
          <Button
            variant="primary"
            className="!bg-[#051426] hover:!bg-[#0a2342] !px-8 hidden sm:block"
          >
            SIGN UP
          </Button>
        </Link>
      </div>
    </nav>
  );
}
