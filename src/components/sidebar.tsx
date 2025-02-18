import { Home, Map, Users, ShoppingCart, Menu } from "lucide-react";

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
  return (
    <div
      className={`fixed inset-y-0 left-0 bg-green-900 text-white shadow-lg transition-all duration-300 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } ${isMinimized ? "w-16" : "w-64"} md:translate-x-0`}
    >
      {/* Header Sidebar */}
      <div className="p-4 flex items-center justify-between">
        <h1 className={`text-xl font-bold ${isMinimized ? "hidden" : "block"}`}>
          UMKM GIS
        </h1>
        <button onClick={toggleMinimize} className="hidden md:block">
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* Menu Sidebar */}
      <nav className="mt-4">
        {[
          { name: "Dashboard", icon: <Home className="w-5 h-5" /> },
          { name: "Peta UMKM", icon: <Map className="w-5 h-5" /> },
          { name: "Pengguna", icon: <Users className="w-5 h-5" /> },
          { name: "Transaksi", icon: <ShoppingCart className="w-5 h-5" /> },
        ].map((item, index) => (
          <a
            key={index}
            href="#"
            className="flex items-center px-4 py-3 hover:bg-green-700"
          >
            {item.icon}
            <span className={`ml-3 ${isMinimized ? "hidden" : "block"}`}>
              {item.name}
            </span>
          </a>
        ))}
      </nav>
    </div>
  );
}
