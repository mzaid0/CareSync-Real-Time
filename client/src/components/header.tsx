import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="bg-white/30 backdrop-blur-sm  sticky top-0 z-50"
    >
      <div className=" mx-auto sm:px-6 lg:px-20 shadow-sm w-full">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.05 }} className="flex-shrink-0">
            <Link to="/" className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Care<span className="text-green-400">Sync</span>
              </h1>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/features">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-green-400 text-base font-medium"
              >
                Features
              </Button>
            </Link>
            <Link to="/about">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-green-400 text-base font-medium"
              >
                About
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-green-400 text-base font-medium"
              >
                Dashboard
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <Button
              variant="ghost"
              onClick={toggleMobileMenu}
              className="text-gray-600 hover:text-green-400"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <motion.div
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{
          height: isMobileMenuOpen ? "auto" : 0,
          opacity: isMobileMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        <nav className="flex flex-col items-center py-4 bg-white/30 backdrop-blur-sm border-t border-gray-100">
          <Link to="/features" onClick={toggleMobileMenu}>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-green-400 w-full text-left py-2"
            >
              Features
            </Button>
          </Link>
          <Link to="/about" onClick={toggleMobileMenu}>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-green-400 w-full text-left py-2"
            >
              About
            </Button>
          </Link>
          <Link to="/dashboard" onClick={toggleMobileMenu}>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-green-400 w-full text-left py-2"
            >
              Dashboard
            </Button>
          </Link>
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default Header;
