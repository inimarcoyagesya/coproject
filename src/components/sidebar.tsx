import { Home, Map, Users, ShoppingCart, Menu, ChevronDown, ChevronUp, UserCircle, Building2, Cog, Calendar } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; // Animasi!

interface SidebarProps {
  isMinimized: boolean;
  isOpen: boolean;
  toggleMinimize: () => void;
  toggleSidebar: () => void;
}

export default function Sidebar({
  isMinimized,
  isOpen,
  toggleMinimize,
  toggleSidebar,
}: SidebarProps) {
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  return (
    <div
      className={`fixed inset-y-0 left-0 text-white shadow-lg border-r transition-all duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} 
      ${isMinimized ? "w-16" : "w-64"} md:translate-x-0
      bg-gradient-to-b from-blue-900 to-teal-800 dark:from-gray-900 dark:to-gray-800 border-blue-800 dark:border-gray-700`}
    >
      {/* Header Sidebar */}
      <div className="p-4 flex items-center justify-between">
        <h1
          className={`text-xl font-bold tracking-wide ${
            isMinimized ? "hidden" : "block"
          }`}
        >
          UMKM GIS
        </h1>
        <button
          onClick={toggleMinimize}
          className="hidden md:block hover:bg-blue-700 dark:hover:bg-gray-700 p-1 rounded transition-colors"
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Menu Sidebar */}
      <nav className="mt-4">
        {[
          { name: "Dashboard", icon: <Home className="w-5 h-5 text-teal-200" />, href: "/" },
          { name: "Peta UMKM", icon: <Map className="w-5 h-5 text-teal-200" />, href: "#" },
          { name: "Transaksi", icon: <ShoppingCart className="w-5 h-5 text-teal-200" />, href: "#" },
        ].map((item, index) => (
          <a
            key={index}
            href={item.href}
            className="flex items-center px-4 py-3 hover:bg-blue-700 dark:hover:bg-gray-700 hover:text-white transition-colors"
          >
            {item.icon}
            <span className={`ml-3 font-medium ${isMinimized ? "hidden" : "block"}`}>
              {item.name}
            </span>
          </a>
        ))}

        {/* Admin Dropdown */}
        <div className="mt-2">
          <button
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className="w-full flex items-center px-4 py-3 hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
          >
            <Users className="w-5 h-5 text-teal-200" />
            <span className={`ml-3 flex-1 text-left font-medium ${isMinimized ? "hidden" : "block"}`}>
              Admin
            </span>
            {!isMinimized && (
              <span>
                {isAdminOpen ? (
                  <ChevronUp className="w-4 h-4 text-teal-200" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-teal-200" />
                )}
              </span>
            )}
          </button>

          {/* Smooth Dropdown with AnimatePresence */}
          <AnimatePresence>
            {isAdminOpen && !isMinimized && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="ml-8 mt-1 overflow-hidden"
              >
                <a
                  href="/users"
                  className="flex items-center px-2 py-2 text-sm rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <UserCircle className="w-4 h-4 text-teal-200" />
                  <span className="ml-2 font-medium">User Page</span>
                </a>
                <a
                  href="/rooms"
                  className="flex items-center px-2 py-2 text-sm rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <Building2 className="w-4 h-4 text-teal-200" />
                  <span className="ml-2 font-medium">Room Page</span>
                </a>
                <a
                  href="/facilities"
                  className="flex items-center px-2 py-2 text-sm rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <Cog className="w-4 h-4 text-teal-200" />
                  <span className="ml-2 font-medium">Facilities Page</span>
                </a>
                <a
                  href="/bookings"
                  className="flex items-center px-2 py-2 text-sm rounded hover:bg-blue-700 dark:hover:bg-gray-700 transition-colors"
                >
                  <Calendar className="w-4 h-4 text-teal-200" />
                  <span className="ml-2 font-medium">Bookings Page</span>
                </a>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
    </div>
  );
}
