import React from 'react';
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
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Link } from 'react-router-dom';
import { features, type Feature } from '@/constants/feature-data';

// Icon Mapping
const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaTasks,
    FaCalendarAlt,
    FaPills,
    FaExclamationTriangle,
    FaFileAlt,
    FaBell,
    FaUsers,
    FaSearch,
};

const FeaturesPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
            <main className="max-w-6xl mx-auto px-4 py-12 space-y-16">
                {/* Hero Section */}
                <section className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="mb-8"
                    >
                        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <FaTasks className="text-green-400 text-4xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Discover Care<span className="text-green-400">Sync</span> Features
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Explore the powerful tools that make CareSync the ultimate solution for collaborative caregiving.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button>
                            <Link to="/signup">Try Now</Link>
                        </Button>
                    </motion.div>
                </section>

                {/* Features Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Features</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Comprehensive tools designed to simplify caregiving and enhance coordination.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature: Feature, index: number) => {
                            const IconComponent = iconMap[feature.iconKey];
                            return (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.4, delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                >
                                    <Card className="border-green-100 hover:border-green-300 transition-all">
                                        <CardContent className="pt-6">
                                            <div className="bg-green-100 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                                                {IconComponent && <IconComponent className="text-green-400 text-xl" />}
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                                            <p className="text-gray-600 mb-2">{feature.description}</p>
                                            <p className="text-green-600 font-medium">{feature.benefit}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Call to Action Section */}
                <section>
                    <Card className="border-green-100 bg-green-50 text-center">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-gray-900">
                                Ready to Simplify Caregiving?
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <p className="text-gray-600 max-w-md mx-auto">
                                Join thousands of families and caregivers using CareSync to coordinate care effortlessly.
                            </p>
                            <Button>
                                <Link to="/signup">Get Started</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default FeaturesPage;