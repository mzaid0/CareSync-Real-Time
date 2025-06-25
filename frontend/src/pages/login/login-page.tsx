import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoginForm from "./components/login-form";
import AuthRightContent from "./components/right-column-design";
import { Link } from "react-router-dom";

const LoginPage = () => {
    return (
        <div className="min-h-[88vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
            <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0">
                <div className="bg-green-400 p-1" />
                <div className="flex flex-col lg:flex-row">
                    <div className="w-full lg:w-1/2 p-8">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-2xl font-bold text-gray-800">Welcome Back</CardTitle>
                            <p className="text-gray-600">Sign in to continue to your account</p>
                        </CardHeader>

                        <LoginForm />

                        <div className="text-center text-sm text-gray-600 mt-4">
                            Don't have an account?{" "}
                            <Link to="/register" className="font-medium text-green-600 hover:text-green-500 transition-colors">
                                Create account
                            </Link>
                        </div>

                        <div className="relative my-5">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300" />
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <Button variant="outline">Google</Button>
                            <Button variant="outline">GitHub</Button>
                        </div>
                    </div>

                    <AuthRightContent />
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
