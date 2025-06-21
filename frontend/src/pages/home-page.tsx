import { Button } from "../components/ui/button";
import { motion } from "framer-motion";
import { FEATURES } from "../constants/features";
import { Link } from "react-router-dom";

const HomePage = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <main className="flex-1">
                <section className="max-w-6xl mx-auto px-6 py-20">
                    <div className="flex flex-col md:flex-row items-center gap-12">
                        <motion.div
                            className="flex-1 space-y-6"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <h1 className="text-4xl md:text-4xl font-bold text-gray-900 leading-tight">
                                Collaborative Caregiving
                                <br />
                                <span className="text-green-400">Made Simple</span>
                            </h1>
                            <p className="text-lg text-gray-600 max-w-xl">
                                Coordinate care schedules, manage tasks, and stay connected with
                                your care team in one unified platform.
                            </p>
                            <div className="flex gap-4">
                                <Link to="/login">
                                    <Button className="px-8 py-4">Get Started</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" className="px-8 py-4">
                                        See Demo
                                    </Button>
                                </Link>
                            </div>
                        </motion.div>

                        <motion.div
                            className="flex-1 grid grid-cols-2 gap-8"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {FEATURES.map(({ icon: Icon, label }, index) => (
                                <div
                                    key={index}
                                    className="p-6 rounded-xl bg-white border border-gray-100 hover:border-green-100 hover:bg-green-50 transition-all"
                                >
                                    <div className="text-green-400 mb-4">
                                        <Icon className="w-12 h-12" />
                                    </div>
                                    <p className="font-medium text-gray-900">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                <section className="bg-gray-50 py-20">
                    <div className="max-w-6xl mx-auto px-6">
                        <motion.div
                            className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                        >
                            <p className="text-2xl text-gray-600 italic mb-4">
                                <span className="text-green-400 text-4xl">"</span>
                                CareSync transformed how our family manages caregiving
                                responsibilities. The coordination became effortless.
                                <span className="text-green-400 text-4xl">"</span>
                            </p>
                        </motion.div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default HomePage;
