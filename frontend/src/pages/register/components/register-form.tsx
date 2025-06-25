import authService from "@/api/services/auth-service";
import { showToast } from "@/components/ui/showToast";
import { useAuthStore } from "@/store/user-store";
import { registerSchema, type RegisterFormValues } from "@/validator/user-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const RegisterForm = () => {
    const navigate = useNavigate();

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
            const { data: user, token } = data;
            useAuthStore.getState().login(user, token);
            showToast("success", "Registration successful", {
                description: data.message || "You are now Registered.",
            });
            navigate("/dashboard");
        },
        onError: (error: Error) => {
            showToast("error", "Registration failed", {
                description: error.message,
            });
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-5">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Full Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="John Doe" {...field} />
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
                                    <Input placeholder="name@example.com" {...field} />
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
                                    <PasswordInput placeholder="••••••" autoComplete="new-password" {...field} />
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
                                    <Input placeholder="+1 (555) 123-4567" {...field} />
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
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
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

                <Button type="submit" disabled={isPending}>
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
                        <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline">Google</Button>
                    <Button variant="outline">Apple</Button>
                    <Button variant="outline">Facebook</Button>
                </div>

                <p className="text-xs text-gray-500 mt-6 text-center">
                    By registering, you agree to our <br />
                    <Link to="#" className="text-green-600 hover:underline">Terms of Service</Link> and{" "}
                    <Link to="#" className="text-green-600 hover:underline">Privacy Policy</Link>
                </p>
            </form>
        </Form>
    );
};

export default RegisterForm;
