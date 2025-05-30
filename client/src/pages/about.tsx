import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import {
  FaBell,
  FaCalendarAlt,
  FaEnvelope,
  FaFileAlt,
  FaGithub,
  FaHeartbeat,
  FaLinkedin,
  FaPills,
  FaTasks,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { z } from "zod";

// Zod Schema for Contact Form Validation
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

// Types
interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface Notification {
  type: "task" | "appointment" | "medication" | "alert";
  message: string;
}

// Animation Variants
const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  hover: { scale: 1.02, y: -5, transition: { duration: 0.2 } },
};

const AboutPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    message: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [realTimeNotifications, setRealTimeNotifications] = useState<
    Notification[]
  >([
    { type: "task", message: "Care plan updated by Sarah!" },
    { type: "appointment", message: "New appointment scheduled for 3 PM." },
    { type: "medication", message: "Medication reminder sent to John." },
  ]);

  // Simulate real-time notifications
  const notifications: Notification[] = [
    { type: "task", message: "Care plan updated by Sarah!" },
    { type: "appointment", message: "New appointment scheduled for 3 PM." },
    { type: "medication", message: "Medication reminder sent to John." },
    { type: "alert", message: "Emergency alert resolved." },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification =
        notifications[Math.floor(Math.random() * notifications.length)];
      setRealTimeNotifications((prev) => [
        newNotification,
        ...prev.slice(0, 2),
      ]);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const handleContactSubmit = async () => {
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      setFormErrors({
        name: errors.name?.[0],
        email: errors.email?.[0],
        message: errors.message?.[0],
      });
      toast.error("Please fix the form errors");
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Hero Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className=" rounded-xl p-8 text-center relative"
        >
          <div className="absolute inset-0 opacity-10 bg-[url('/heartbeat.svg')] bg-repeat bg-contain" />

          <h1 className="text-3xl font-bold text-gray-800">
            Care <span className="text-green-400">Sync</span>
          </h1>
          <p className="mt-3 text-sm text-gray-600 max-w-2xl mx-auto">
            Empowering caregivers and families with a real-time platform for
            seamless care coordination.
          </p>
          <motion.div variants={cardVariants} whileHover="hover">
            <Link to="/features">
              <Button
                className="mt-4 bg-green-500 hover:bg-green-600 text-white text-sm py-2 px-6 rounded-lg"
                aria-label="Explore CareSync features"
              >
                Explore Features
              </Button>
            </Link>
          </motion.div>
        </motion.section>

        {/* Mission Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <FaHeartbeat /> Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                CareSync is dedicated to transforming caregiving through secure,
                real-time tools that connect caregivers, families, and patients,
                ensuring no one cares alone.
              </p>
            </CardContent>
          </Card>
        </motion.section>

        {/* Features Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <FaTasks /> What We Offer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: <FaTasks size={20} />,
                    title: "Care Plans",
                    desc: "Dynamic scheduling for daily tasks.",
                  },
                  {
                    icon: <FaCalendarAlt size={20} />,
                    title: "Appointments",
                    desc: "Effortless medical visit management.",
                  },
                  {
                    icon: <FaPills size={20} />,
                    title: "Medications",
                    desc: "Precise tracking and reminders.",
                  },
                  {
                    icon: <FaBell size={20} />,
                    title: "Alerts",
                    desc: "Instant emergency notifications.",
                  },
                  {
                    icon: <FaFileAlt size={20} />,
                    title: "Files",
                    desc: "Secure document sharing.",
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-start gap-3"
                  >
                    <div className="text-green-500">{feature.icon}</div>
                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-gray-600">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Real-Time Activity */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <FaBell /> Real-Time Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {realTimeNotifications.map((note, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 bg-green-50 rounded-lg flex items-start gap-3 border border-green-100"
                  >
                    {note.type === "task" && (
                      <FaTasks className="text-green-500 text-sm" />
                    )}
                    {note.type === "appointment" && (
                      <FaCalendarAlt className="text-blue-500 text-sm" />
                    )}
                    {note.type === "medication" && (
                      <FaPills className="text-green-500 text-sm" />
                    )}
                    {note.type === "alert" && (
                      <FaBell className="text-red-500 text-sm" />
                    )}
                    <p className="text-sm text-gray-800">{note.message}</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Developer Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200 mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500 text-center justify-center">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="/zaid.png" alt="Muhammad Zaid" />
                  <AvatarFallback className="bg-green-400 text-white">
                    MZ
                  </AvatarFallback>
                </Avatar>
                Meet the Developer
              </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Muhammad Zaid
              </h3>
              <p className="text-sm text-green-500 mt-1">
                Full-Stack Developer
              </p>
              <p className="text-sm text-gray-600 mt-2 max-w-md mx-auto">
                A Software Engineering graduate from the University of Sialkot,
                Muhammad Zaid built CareSync to revolutionize caregiving with
                real-time technology.
              </p>
              <div className="flex justify-center gap-2 mt-4 flex-wrap">
                {[
                  "React",
                  "Node.js",
                  "MongoDB",
                  "Socket.IO",
                  "Redis",
                  "Docker",
                ].map((tech) => (
                  <Badge
                    key={tech}
                    className="bg-green-100 text-green-800 text-xs py-0.5 px-2"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-4">
                <motion.a
                  href="https://linkedin.com/in/zaidazmat"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600"
                  variants={cardVariants}
                  whileHover="hover"
                  aria-label="Visit Muhammad Zaid's LinkedIn"
                >
                  <FaLinkedin size={20} />
                </motion.a>
                <motion.a
                  href="https://github.com/mzaid0"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-500 hover:text-green-600"
                  variants={cardVariants}
                  whileHover="hover"
                  aria-label="Visit Muhammad Zaid's GitHub"
                >
                  <FaGithub size={20} />
                </motion.a>
              </div>
            </CardContent>
          </Card>
        </motion.section>

        {/* Contact Section */}
        <motion.section
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
        >
          <Card className="bg-white rounded-xl shadow-sm border border-gray-200  mx-auto">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2 text-green-500">
                <FaEnvelope /> Connect with Us
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="rounded-lg border-gray-200 text-sm"
                    aria-label="Enter your name"
                  />
                  {formErrors.name && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.name}
                    </p>
                  )}
                </div>
                <div>
                  <Input
                    placeholder="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="rounded-lg border-gray-200 text-sm"
                    aria-label="Enter your email"
                  />
                  {formErrors.email && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.email}
                    </p>
                  )}
                </div>
                <div>
                  <textarea
                    placeholder="Message"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full p-3 rounded-lg border border-gray-200 text-sm focus:ring-green-400 focus:border-green-400"
                    aria-label="Enter your message"
                    rows={4}
                  />
                  {formErrors.message && (
                    <p className="text-red-500 text-xs mt-1">
                      {formErrors.message}
                    </p>
                  )}
                </div>
                <motion.div variants={cardVariants} whileHover="hover">
                  <Button
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm py-2 rounded-lg flex items-center justify-center gap-2"
                    onClick={handleContactSubmit}
                    disabled={isSubmitting}
                    aria-label="Send message"
                  >
                    {isSubmitting ? (
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          className="opacity-25"
                        />
                        <path
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                          className="opacity-75"
                        />
                      </svg>
                    ) : (
                      <FaEnvelope size={16} />
                    )}
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.section>
      </main>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </div>
  );
};

export default AboutPage;
