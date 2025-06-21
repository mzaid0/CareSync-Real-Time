import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FaHeartbeat,
    FaTasks,
    FaCalendarAlt,
    FaPills,
    FaBell,
    FaFileAlt,
    FaEnvelope,
    FaLinkedin,
    FaGithub,
} from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { features, developerInfo, notifications } from "@/constants/about-data";

const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    FaTasks,
    FaCalendarAlt,
    FaPills,
    FaBell,
    FaFileAlt,
    FaLinkedin,
    FaGithub,
};

const notificationIconMap = {
    task: FaTasks,
    appointment: FaCalendarAlt,
    medication: FaPills,
    alert: FaBell,
};

const AboutPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleContactSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Thank you ${formData.name}! Your message has been sent.`);
        setFormData({ name: "", email: "", message: "" });
    };

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
                            <FaHeartbeat className="text-green-400 text-4xl" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Care<span className="text-green-400">Sync</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Empowering caregivers and families with seamless care coordination
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button >
                            <Link to="/features">Explore Features</Link>
                        </Button>
                    </motion.div>
                </section>

                {/* Mission Section */}
                <section className="max-w-4xl mx-auto">
                    <Card className="border-green-100">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <FaHeartbeat className="text-green-400 text-xl" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">Our Mission</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 text-lg">
                                CareSync is dedicated to transforming caregiving with secure, real-time tools that
                                connect caregivers, families, and patients. We believe in creating technology that
                                makes care coordination effortless and effective.
                            </p>
                        </CardContent>
                    </Card>
                </section>

                {/* Features Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Powerful features designed to streamline care coordination and improve patient outcomes
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => {
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
                                            <p className="text-gray-600">{feature.desc}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Notifications Section */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Notifications</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {notifications.map((notification, index) => {
                            const IconComponent = notificationIconMap[notification.type];
                            return (
                                <Card key={index} className="border-green-100">
                                    <CardContent className="pt-6 flex items-center gap-4">
                                        {IconComponent && <IconComponent className="text-green-400 text-xl" />}
                                        <p className="text-gray-600">{notification.message}</p>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </section>

                {/* Developer Section */}
                <section>
                    <Card className="border-green-100">
                        <CardContent className="pt-8">
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">Meet the Developer</h2>
                                <Avatar className="w-24 h-24 mx-auto mb-4 p-2 text-green-400 text-lg font-semibold">
                                    <AvatarImage src={developerInfo.avatarSrc} alt={developerInfo.name} />
                                    <AvatarFallback>{developerInfo.avatarFallback}</AvatarFallback>
                                </Avatar>
                                <h3 className="text-xl font-bold text-green-400">{developerInfo.name}</h3>
                                <p className="text-gray-600">{developerInfo.title}</p>
                            </div>

                            <p className="text-gray-700 text-center mb-8">{developerInfo.description}</p>

                            <div className="flex flex-wrap justify-center gap-2 mb-8">
                                {developerInfo.techStack.map((tech, index) => (
                                    <Badge key={index} variant="secondary">{tech}</Badge>
                                ))}
                            </div>

                            <div className="flex justify-center gap-6">
                                {developerInfo.socialLinks.map((link, index) => {
                                    const IconComponent = iconMap[link.iconKey];
                                    return (
                                        <a
                                            key={index}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-600 hover:text-green-400 transition-colors"
                                            aria-label={link.ariaLabel}
                                        >
                                            {IconComponent && <IconComponent className="text-2xl" />}
                                        </a>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Contact Section */}
                <section>
                    <Card className="border-green-100">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-3 rounded-lg">
                                    <FaEnvelope className="text-green-400 text-xl" />
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">Connect with Us</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleContactSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-gray-700 mb-2">Your Name</label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="John Smith"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-gray-700 mb-2">Your Email</label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-gray-700 mb-2">Your Message</label>
                                    <Textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows={5}
                                        placeholder="How can we help you?"
                                        required
                                    />
                                </div>

                                <Button type="submit" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
};

export default AboutPage;