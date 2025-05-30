import { motion } from "framer-motion";
import { FaEnvelope, FaHome, FaQuestionCircle, FaSearch } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-[75vh] flex bg-gray-50 relative">
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-6 max-w-lg"
        >
          {/* 404 Icon */}
          <motion.div
            animate={{
              rotate: [0, 10, -10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            <FaQuestionCircle
              className="text-green-400 text-8xl mx-auto"
              aria-hidden="true"
            />
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-900">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700">
            Oops! Page Not Found
          </h2>
          <p className="text-gray-500">
            The page{" "}
            <i className="font-mono text-red-400">{location.pathname}</i>{" "}
            doesn’t exist or you don’t have access to it.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 max-w-md mx-auto">
            <Input
              placeholder="Search for something else..."
              value=""
              aria-label="Search for content"
              className="flex-1"
            />
            <Button aria-label="Search">
              <FaSearch /> Search
            </Button>
          </div>

          {/* Navigation Options */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/")}
              aria-label="Return to Dashboard"
            >
              <FaHome className="mr-2" /> Go to Dashboard
            </Button>
            <Button variant="outline" aria-label="Report issue">
              <FaEnvelope className="mr-2" /> Report Issue
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default NotFoundPage;
