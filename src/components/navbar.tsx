import { useState } from "react";
import { MapPin, Moon, Sun, Menu, User, LogOut } from "lucide-react";
import useDarkMode from "../hooks/useDarkMode";

interface NavbarProps {
  toggleSidebar: () => void;
  user: { name: string; email: string } | null;
  onLogout: () => void;
}

export default function Navbar({ toggleSidebar, user, onLogout }: NavbarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const { isDark, toggleDarkMode } = useDarkMode();

  return (
    <nav className="bg-gradient-to-r from-blue-900 to-teal-800 dark:from-gray-900 dark:to-gray-800 border-blue-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo & Title */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/logo.svg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            SIMARU
          </span>
        </a>

        {/* Right Side: User dropdown, Dark Mode Toggle & Mobile Menu Toggle */}
        <div className="flex items-center md:order-2 space-x-3">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-blue-500 hover:bg-blue-700 dark:bg-gray-700 dark:hover:bg-gray-600 transition"
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="text-yellow-400 w-5 h-5" /> : <Moon className="text-white w-5 h-5" />}
          </button>

          {/* User Dropdown */}
          {user ? (
            <div className="relative">
              <button
                type="button"
                className="flex text-sm bg-blue-200 rounded-full focus:ring-4 focus:ring-white"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <span className="sr-only">Open user menu</span>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
                  <User className="text-blue-800 w-5 h-5" />
                </div>
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 z-50 w-48 bg-white rounded-lg shadow-md dark:bg-gray-700 border dark:border-gray-600"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <div className="px-4 py-3 border-b dark:border-gray-600">
                    <p className="text-sm text-gray-900 dark:text-white font-medium truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                      {user.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onLogout();
                        setDropdownOpen(false);
                      }}
                      className="flex w-full items-center px-4 py-2 text-sm text-red-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-red-400"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-8 h-8 flex items-center justify-center">
              <User className="text-blue-800 w-5 h-5" />
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