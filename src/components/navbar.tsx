import { useState } from "react";
import { Menu } from "lucide-react";

interface NavbarProps {
  toggleSidebar: () => void;
}

export default function Navbar({ toggleSidebar }: NavbarProps) {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  return (
    <nav className="bg-green-600 shadow-md border-b border-gray-200 dark:bg-green-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo & Title */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/logo.svg" className="h-8" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
            UMKM GIS
          </span>
        </a>

        {/* Right Side: User dropdown & Mobile Menu Toggle */}
        <div className="flex items-center md:order-2 space-x-3">
          {/* User Dropdown */}
          <button
            type="button"
            className="flex text-sm bg-green-200 rounded-full focus:ring-4 focus:ring-white"
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
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">
                  User Name
                </span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                  email@example.com
                </span>
              </div>
              <ul className="py-2">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Dashboard
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Settings
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200"
                  >
                    Sign out
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-200"
            aria-controls="mobile-menu"
            aria-expanded="false"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open main menu</span>
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden w-full md:flex md:w-auto md:order-1" id="mobile-menu">
          <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-green-200 rounded-lg bg-green-50 md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-green-600">
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white bg-green-700 rounded md:bg-transparent md:text-white"
                aria-current="page"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-green-700"
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-green-700"
              >
                Services
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-green-700"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="block py-2 px-3 text-white rounded hover:bg-green-700"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
