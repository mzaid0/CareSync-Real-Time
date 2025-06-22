import authService from "@/api/services/auth-service";
import { showToast } from "@/components/ui/showToast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { Button } from "../components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle
} from "../components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import { PasswordInput } from "../components/ui/password-input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";

// Zod schema for validation
const registerSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    contact: z.string().min(10, "Please enter a valid phone number"),
    role: z.enum(["user", "caregiver", "family_member", "admin"]),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterPage = () => {
    const navigate = useNavigate()

    const form = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            contact: "",
            role: "user",
        },
    });

    const { isPending, mutate } = useMutation({
        mutationFn: authService.register,

        onSuccess: (data) => {
            showToast("success", "Registration successful", {
                description: data.message || "You are now Registered in.",
            });
            navigate("/dashboard");
        },

        onError: (error: Error) => {
            showToast("error", "Registration failed", {
                description: error.message,
            });
        },
    });

    const onSubmit = (values: RegisterFormValues) => {
        mutate(values)
    };

    return (
        <div className="min-h-[88vh] flex items-center justify-center bg-gradient-to-br from-green-50 to-white p-4">
            <Card className="w-full max-w-4xl shadow-xl rounded-2xl overflow-hidden border-0">
                <div className="bg-green-400 p-1" />
                <div className="flex flex-col lg:flex-row">
                    {/* Left Column - Content */}
                    <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-50 to-green-100 p-8 flex flex-col justify-center">
                        <div className="text-center lg:text-left">
                            <h1 className="text-3xl font-bold text-gray-800 mb-3">
                                Welcome to <span className="text-green-400">CareCollab</span>
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Your collaborative platform for seamless care coordination,
                                schedule management, and real-time team communication.
                            </p>

                            <div className="space-y-4">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Coordinate care tasks efficiently</p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Manage schedules in real-time</p>
                                </div>

                                <div className="flex items-center space-x-3">
                                    <div className="bg-green-200 w-8 h-8 rounded-full flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-700" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <p className="text-gray-700">Stay connected with your care team</p>
                                </div>
                            </div>

                            <div className="mt-8 p-4 bg-white rounded-xl shadow-sm">
                                <div className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-1 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Tip:</span> Use your organization email if you're part of a care team.
                                        Contact support if you need help accessing your account.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="w-full lg:w-1/2 p-8">
                        <CardHeader className="p-0 mb-6">
                            <CardTitle className="text-2xl font-bold text-gray-800">
                                Create Account
                            </CardTitle>
                            <p className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-green-600 font-medium hover:text-green-500 transition-colors"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </CardHeader>

                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Full Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="name@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Password</FormLabel>
                                                <FormControl>
                                                    <PasswordInput
                                                        placeholder="••••••"
                                                        autoComplete="new-password"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="contact"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-gray-700">Phone Number</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="+1 (555) 123-4567"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="role"
                                        render={({ field }) => (
                                            <FormItem className="lg:col-span-2">
                                                <FormLabel className="text-gray-700">I am a</FormLabel>
                                                <FormControl>
                                                    <Select
                                                        onValueChange={field.onChange}
                                                        defaultValue={field.value}
                                                    >
                                                        <SelectTrigger >
                                                            <SelectValue placeholder="Select your role" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="user">Care Recipient</SelectItem>
                                                            <SelectItem value="caregiver">Professional Caregiver</SelectItem>
                                                            <SelectItem value="family_member">Family Member</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage className="text-red-500" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isPending}
                                >
                                    {isPending ? (
                                        <>
                                            <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </Button>

                                <div className="relative my-5">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-white text-gray-500">
                                            Or sign up with
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    <Button
                                        variant="outline"
                                    >
                                        Google
                                    </Button>
                                    <Button
                                        variant="outline"
                                    >
                                        Apple
                                    </Button>
                                    <Button
                                        variant="outline"
                                    >
                                        Facebook
                                    </Button>
                                </div>
                            </form>
                        </Form>

                        <p className="text-xs text-gray-500 mt-6 text-center">
                            By registering, you agree to our <br />
                            <Link to="#" className="text-green-600 hover:underline">
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link to="#" className="text-green-600 hover:underline">
                                Privacy Policy
                            </Link>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default RegisterPage;