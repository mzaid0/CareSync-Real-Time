import { motion } from "framer-motion";
import {
  FaBell,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaFileAlt,
  FaPills,
  FaSearch,
  FaTasks,
  FaUsers,
} from "react-icons/fa";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

// Features Data (Based on PDF pages 8, 21)
const features = [
  {
    title: "Care Plans",
    description:
      "Create and manage personalized care plans with tasks and schedules.",
    icon: <FaTasks className="text-green-500 text-4xl" />,
    benefit: "Streamlines caregiving for patients and families.",
  },
  {
    title: "Appointments",
    description: "Schedule and track appointments with calendar integration.",
    icon: <FaCalendarAlt className="text-green-500 text-4xl" />,
    benefit: "Never miss a doctor visit or therapy session.",
  },
  {
    title: "Medications",
    description: "Manage medication schedules and track adherence.",
    icon: <FaPills className="text-green-500 text-4xl" />,
    benefit: "Ensures timely medication with alerts.",
  },
  {
    title: "Emergency Alerts",
    description: "Receive and resolve critical alerts for urgent care needs.",
    icon: <FaExclamationTriangle className="text-green-500 text-4xl" />,
    benefit: "Quick response to health emergencies.",
  },
  {
    title: "Files",
    description: "Store and access medical reports and documents securely.",
    icon: <FaFileAlt className="text-green-500 text-4xl" />,
    benefit: "Centralized document management.",
  },
  {
    title: "Notifications",
    description: "Stay updated with real-time alerts and messages.",
    icon: <FaBell className="text-green-500 text-4xl" />,
    benefit: "Keeps everyone in the loop.",
  },
  {
    title: "Family Sharing",
    description: "Invite family members to collaborate on care plans.",
    icon: <FaUsers className="text-green-500 text-4xl" />,
    benefit: "Brings families together for shared caregiving.",
  },
  {
    title: "Global Search",
    description:
      "Find care plans, appointments, and more with powerful search.",
    icon: <FaSearch className="text-green-500 text-4xl" />,
    benefit: "Quick access to all your data.",
  },
];

const FeaturesPage = () => {
  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-16 space-y-12">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Our Features
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore the powerful tools that make Collaborative Caregiving
            Planner the ultimate solution for caregiving.
          </p>
          <Button
            className="mt-6 bg-green-500 hover:bg-green-600 text-white"
            aria-label="Try now"
          >
            Try Now
          </Button>
        </motion.section>

        {/* Features Grid */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      {feature.icon}
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {feature.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{feature.description}</p>
                    <p className="text-green-600 mt-2 font-medium">
                      {feature.benefit}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <Card className="bg-green-50 border border-green-200 text-center">
          <CardContent className="py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Simplify Caregiving?
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Join thousands of families and caregivers using our platform to
              coordinate care effortlessly.
            </p>
            <Button
              className="bg-green-500 hover:bg-green-600 text-white"
              aria-label="Get started"
            >
              Get Started
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default FeaturesPage;