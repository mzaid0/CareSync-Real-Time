import { Button } from "./ui/button";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="border-t border-gray-100 bg-white">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Copyright */}
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} <span className="font-semibold">CareSync</span>. All rights reserved.
                    </p>

                    {/* Links */}
                    <nav className="flex gap-6 mt-4 md:mt-0">
                        <Link to="/privacy-policy" aria-label="Privacy Policy">
                            <Button variant="link" className="text-gray-600 hover:text-green-500 text-sm">
                                Privacy Policy
                            </Button>
                        </Link>
                        <Link to="/terms-of-service" aria-label="Terms of Service">
                            <Button variant="link" className="text-gray-600 hover:text-green-500 text-sm">
                                Terms of Service
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
