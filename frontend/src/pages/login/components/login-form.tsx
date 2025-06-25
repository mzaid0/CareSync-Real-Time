import { PasswordInput } from "@/components/ui/password-input";
import { showToast } from "@/components/ui/showToast";
import { useAuthStore } from "@/store/user-store";
import { loginSchema, type LoginFormValues } from "@/validator/user-validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import authService from "@/api/services/auth-service";

const LoginForm = () => {
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: "" },
    });

    const { isPending, mutate } = useMutation({
        mutationFn: authService.login,
        onSuccess: (data) => {
            const { token, data: user } = data;
            useAuthStore.getState().login(user, token);
            showToast("success", "Login successful", { description: data.message || "You are now logged in." });
            navigate("/dashboard");
        },
        onError: (error: Error) => {
            showToast("error", "Login failed", { description: error.message || "Invalid email or password." });
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => mutate(values))} className="space-y-5">
                <div className="space-y-4">
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
                                <div className="flex justify-between items-center">
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-500 transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                                <FormControl>
                                    <PasswordInput placeholder="••••••" {...field} />
                                </FormControl>
                                <FormMessage className="text-red-500" />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? <><Loader2 className="h-5 w-5 animate-spin mr-2" />Signing in...</> : "Sign In"}
                </Button>
            </form>
        </Form>
    );
};

export default LoginForm;
