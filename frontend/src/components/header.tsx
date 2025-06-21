import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { NAV_LINKS } from "@/constants/hreader";

const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

    const toggleMobileMenu = () => setIsMobileMenuOpen((prev) => !prev);

    return (
        <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="bg-white/30 backdrop-blur-sm sticky top-0 z-50 shadow-sm"
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-20">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center">
                        <motion.h1
                            whileHover={{ scale: 1.05 }}
                            className="text-xl sm:text-2xl font-bold text-gray-900"
                        >
                            Care<span className="text-green-400">Sync</span>
                        </motion.h1>
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        {NAV_LINKS.map(({ label, path }) => (
                            <Link key={path} to={path}>
                                <Button
                                    variant="ghost"
                                    className="text-gray-600 hover:text-green-400 text-base font-medium"
                                >
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            onClick={toggleMobileMenu}
                            className="text-gray-600 hover:text-green-400"
                            aria-label="Toggle menu"
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

            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.nav
                        className="md:hidden flex flex-col items-center py-4 bg-white/80 backdrop-blur-sm border-t border-gray-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        {NAV_LINKS.map(({ label, path }) => (
                            <Link key={path} to={path} onClick={() => setIsMobileMenuOpen(false)}>
                                <Button
                                    variant="ghost"
                                    className="text-gray-600 hover:text-green-400 w-full text-left py-2"
                                >
                                    {label}
                                </Button>
                            </Link>
                        ))}
                    </motion.nav>
                )}
            </AnimatePresence>
        </motion.header>
    );
};

export default Header;
