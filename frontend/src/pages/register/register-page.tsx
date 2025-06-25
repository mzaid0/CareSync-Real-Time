import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import RegisterForm from "./components/register-form";
import AuthLeftContent from "./components/left-column-design";
import { Link } from "react-router-dom";

const RegisterPage = () => {
    return (
        <div className="min-h-[88vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
            <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0">
                <div className="bg-green-400 p-1" />
                <div className="flex flex-col lg:flex-row">
                    <AuthLeftContent />
                    <div className="w-full lg:w-1/2 p-8">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-2xl font-bold text-gray-800">Create Account</CardTitle>
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-green-600 font-medium hover:text-green-500 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </CardHeader>
                        <RegisterForm />
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;
