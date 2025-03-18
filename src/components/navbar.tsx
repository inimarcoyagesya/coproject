import { useState } from "react";
import { MapPin, Moon, Sun, Menu } from "lucide-react"; // Mengganti icon Menu menjadi MapPin
import useDarkMode from "../hooks/useDarkMode"; // Sesuaikan path

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-teal-800 dark:from-gray-900 dark:to-gray-800 border-blue-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo & Title */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/logo.svg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            UMKM GIS
          </span>
        </a>

        {/* Right Side: User dropdown, Dark Mode Toggle & Mobile Menu Toggle */}
        <div className="flex items-center md:order-2 space-x-3">

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
          >
            {isDark ? <Sun className="text-yellow-400 w-5 h-5" /> : <Moon className="text-white w-5 h-5" />}
          </button>

          {/* User Dropdown */}
          <button
            type="button"
            className="flex text-sm bg-blue-200 rounded-full focus:ring-4 focus:ring-white"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          >
            <span className="sr-only">Open user menu</span>
            <img
              className="w-8 h-8 rounded-full"
              src="/pp.png"
              alt="User Photo"
            />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-4 top-16 z-50 w-48 bg-white rounded-lg shadow-md dark:bg-gray-700">
              {/* Dropdown Content */}
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-200"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
