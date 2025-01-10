import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav
      className={`fixed w-full z-[100] transition-all duration-300 ${
        scrolled
          ? "py-3 bg-white/90 backdrop-blur-lg shadow-lg border-b border-gray-200/20"
          : "py-5 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 p-[2px] rotate-0 group-hover:rotate-180 transition-transform duration-500">
              <div className="w-full h-full rounded-[10px] bg-white flex items-center justify-center">
                <span className="text-xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  TH
                </span>
              </div>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              TaskHive
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${
                location.pathname === "/"
                  ? "text-indigo-600 after:scale-x-100"
                  : ""
              }`}
            >
              Tasks
            </Link>
            <Link
              to="/dashboard"
              className={`nav-link ${
                location.pathname === "/dashboard"
                  ? "text-indigo-600 after:scale-x-100"
                  : ""
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/analytics"
              className={`nav-link ${
                location.pathname === "/analytics"
                  ? "text-indigo-600 after:scale-x-100"
                  : ""
              }`}
            >
              Analytics
            </Link>
            <Link
              to="/settings"
              className={`nav-link ${
                location.pathname === "/settings"
                  ? "text-indigo-600 after:scale-x-100"
                  : ""
              }`}
            >
              Settings
            </Link>
            <button
              onClick={handleLogout}
              className="px-6 py-2.5 rounded-xl font-medium transition-all duration-300
                       bg-gradient-to-r from-red-500 to-pink-600
                       hover:from-red-600 hover:to-pink-700
                       text-white shadow-lg shadow-red-500/20
                       hover:shadow-red-500/40 hover:scale-[1.02] active:scale-98
                       ring-2 ring-transparent hover:ring-red-500/20"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden rounded-xl p-2.5 hover:bg-gray-100/50 transition-colors relative group"
          >
            <div className="w-6 h-5 flex flex-col justify-between">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className={`block h-0.5 bg-gray-600 rounded-full transform transition-all duration-300 origin-right
                    ${
                      isMenuOpen && i === 0
                        ? "rotate-45 w-6 translate-y-[7px]"
                        : ""
                    }
                    ${isMenuOpen && i === 1 ? "opacity-0 w-6" : "w-6"}
                    ${
                      isMenuOpen && i === 2
                        ? "-rotate-45 w-6 -translate-y-[7px]"
                        : ""
                    }
                    ${!isMenuOpen && i === 1 ? "w-4 group-hover:w-6" : ""}
                  `}
                ></span>
              ))}
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-500 ease-in-out ${
            isMenuOpen ? "max-h-[300px] opacity-100" : "max-h-0 opacity-0"
          } overflow-hidden`}
        >
          <div className="py-5 space-y-3">
            {[
              { to: "/", label: "Tasks" },
              { to: "/dashboard", label: "Dashboard" },
              { to: "/analytics", label: "Analytics" },
              { to: "/settings", label: "Settings" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`block nav-link-mobile ${
                  location.pathname === item.to
                    ? "text-indigo-600 bg-indigo-50"
                    : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-3 rounded-xl font-medium
                       bg-gradient-to-r from-red-500 to-pink-600
                       text-white shadow-lg shadow-red-500/20
                       active:scale-95 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
