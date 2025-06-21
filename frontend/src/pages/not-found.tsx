import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelope, FaHome, FaQuestionCircle, FaSearch } from "react-icons/fa";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const NotFoundPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [search, setSearch] = useState("");

    return (
        <div className="min-h-[75vh] flex bg-gray-50 relative">
            <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="text-center space-y-6 max-w-lg"
                >
                    {/* Animated Icon */}
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                    >
                        <FaQuestionCircle
                            className="text-green-400 text-8xl mx-auto"
                            aria-hidden="true"
                        />
                    </motion.div>

                    {/* Text */}
                    <h1 className="text-5xl font-bold text-green-400">404</h1>
                    <h2 className="text-2xl font-semibold text-gray-700">
                        Oops! Page Not Found
                    </h2>
                    <p className="text-gray-500">
                        The page{" "}
                        <i className="font-mono text-red-400">{location.pathname}</i>{" "}
                        doesn’t exist or you don’t have access to it.
                    </p>

                    {/* Search Bar */}
                    <form
                        className="flex gap-2 max-w-md mx-auto"
                        onSubmit={(e) => {
                            e.preventDefault();
                            // Handle search if you implement it
                        }}
                    >
                        <Input
                            placeholder="Search for something else..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            aria-label="Search"
                            className="flex-1"
                        />
                        <Button type="submit" aria-label="Search">
                            <FaSearch className="mr-2" /> Search
                        </Button>
                    </form>

                    {/* Navigation Options */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button onClick={() => navigate("/")} aria-label="Go to Home">
                            <FaHome className="mr-2" /> Go to Dashboard
                        </Button>
                        <Button variant="outline" aria-label="Report an Issue">
                            <FaEnvelope className="mr-2" /> Report Issue
                        </Button>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default NotFoundPage;
