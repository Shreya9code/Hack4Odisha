import { NavLink } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import {
  BarChart3,
  Package,
  Calendar,
  FileText,
  QrCode,
  TrendingUp,
  Megaphone,
  Recycle,
  User,
  Phone,
  Plus,
  Scan,
  Home,
  Play,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const { user, isLoaded } = useUser();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Auto-close sidebar on mobile when resizing to larger screens
      if (!mobile && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    
    if (isLoaded && user) {
      setUserName(
        user.fullName || user.primaryEmailAddress?.emailAddress || "User"
      );
      const role = localStorage.getItem("userRole");
      setUserRole(role || "");
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isLoaded, user, isOpen]);

  // Role-based menu items
  const getMenuItems = () => {
    const baseItems = [
      { path: "/dashboard", label: "Dashboard", icon: BarChart3 },
      { path: "/inventory", label: "Inventory", icon: Package },
      { path: "/contact", label: "Contact", icon: Phone },
    ];

    switch (userRole) {
      case "donor":
        return [
          ...baseItems,
          { path: "/qr-generator", label: "Generate QR", icon: QrCode },
          { path: "/campaigns", label: "Campaigns", icon: Megaphone },
        ];
      case "vendor":
        return [
          ...baseItems,
          { path: "/compliance", label: "Compliance", icon: FileText },
          { path: "/analytics", label: "Analytics", icon: TrendingUp },
        ];
      case "company":
        return [
          ...baseItems,
          { path: "/compliance", label: "Compliance", icon: FileText },
          { path: "/analytics", label: "Analytics", icon: TrendingUp },
          { path: "/campaigns", label: "Campaigns", icon: Megaphone },
        ];
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  return (
    <>
      {/* Mobile menu button */}
      <button
        className={`fixed top-4 left-4 z-50 md:hidden p-2 rounded-md !bg-emerald-600 text-white ${
          isOpen ? "hidden" : "block"
        }`}
        onClick={() => setIsOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed md:relative z-40 h-screen !bg-white shadow-lg border-r border-emerald-200 transition-all duration-300 flex flex-col ${
          isOpen ? "w-64" : "w-0 md:w-16"
        }`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-emerald-200 flex items-center justify-between min-h-[64px]">
          <div className="flex items-center">
            <Recycle className="w-6 h-6 mr-2 text-emerald-700" />
            {isOpen && (
              <h1 className="text-emerald-700 font-bold text-xl">
                E-Waste Raah
              </h1>
            )}
          </div>
          <button
            className="p-1 rounded-md hover:!bg-emerald-100"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 flex-1 overflow-y-auto">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `flex items-center gap-3 p-2 rounded-lg transition-colors ${
                        isActive
                          ? "!bg-emerald-100 text-emerald-700 font-semibold border-r-2 border-emerald-500"
                          : "text-gray-700 hover:!bg-emerald-50 hover:text-emerald-600"
                      }`
                    }
                    onClick={() => isMobile && setIsOpen(false)}
                  >
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    {isOpen && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        {userRole && isOpen && (
          <div className="p-4 !bg-emerald-50 rounded-lg border border-emerald-200 mx-4 mb-4">
            <h3 className="font-semibold text-emerald-700 mb-3">
              Quick Actions
            </h3>
            {userRole === "company" && (
              <>
                <NavLink
                  to="/analytics"
                  className="w-full !bg-purple-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:!bg-purple-700 transition-colors mb-2"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </NavLink>
              </>
            )}
            {userRole === "donor" && (
              <>
                <NavLink
                  to="/qr-generator"
                  className="w-full !bg-emerald-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:!bg-emerald-700 transition-colors mb-2"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR Code
                </NavLink>
              </>
            )}
            {userRole === "vendor" && (
              <>
                <NavLink
                  to="/schedule"
                  className="w-full !bg-blue-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:!bg-blue-700 transition-colors mb-2"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Pickups
                </NavLink>
                <NavLink
                  to="/analytics"
                  className="w-full !bg-purple-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:!bg-purple-700 transition-colors mb-2"
                  onClick={() => isMobile && setIsOpen(false)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </NavLink>
              </>
            )}
            <NavLink
              to="/inventory"
              className="w-full !bg-gray-600 text-white py-2 px-3 rounded-lg text-sm flex items-center justify-center hover:!bg-gray-700 transition-colors"
              onClick={() => isMobile && setIsOpen(false)}
            >
              <Package className="w-4 h-4 mr-2" />
              View Inventory
            </NavLink>
          </div>
        )}

        {/* User Info */}
        {userRole && (
          <div className="p-4 border-t border-emerald-200 !bg-emerald-50 flex items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full !bg-emerald-200 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-emerald-600" />
              </div>
              {isOpen && (
                <div className="ml-3 overflow-hidden">
                  <p className="text-sm font-medium text-emerald-700 truncate">
                    {userName}
                  </p>
                  <p className="text-xs text-emerald-600">
                    {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 !bg-black opacity-25 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;