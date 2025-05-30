import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppDispatch } from "../store/hooks";
import { setUser } from "../store/auth-slice";
import apiServices from "../api/apiServices";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { loginSchema, type LoginFormValues } from "../validator/user-zod";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const mutation = useMutation({
    mutationFn: apiServices.login,
    onSuccess: (data) => {
      toast.success("Success", {
        description: data.message || "Login successful!",
      });
      dispatch(setUser(data.data));
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Login failed",
      });
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    mutation.mutate(values);
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4">
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Sign <span className="text-green-400">In</span>
          </CardTitle>
          <p className="text-center text-gray-500">
            Access your CareCollab account
          </p>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-1/2 order-2 lg:order-1">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="email">Email Address</FormLabel>
                        <FormControl>
                          <Input
                            id="email"
                            placeholder="example@domain.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="password">Password</FormLabel>
                        <FormControl>
                          <PasswordInput
                            id="password"
                            placeholder="******"
                            autoComplete="current-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={mutation.isPending}
                  className="w-full"
                >
                  {mutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Sign In
                </Button>
                <div className="text-center text-sm">
                  <Link to="/forgot-password" className="underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="text-center text-sm">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="underline hover:text-green-400 duration-150"
                  >
                    Register
                  </Link>
                </div>
              </form>
            </Form>
          </div>
          <div className="w-full lg:w-2/3 order-1 lg:order-2 bg-gradient-to-br from-green-200 to-white p-6 rounded-lg flex flex-col justify-center">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome Back to <span className="text-green-400">CareCollab</span>
            </h1>
            <p className="text-base text-gray-600 mt-2">
              Sign in to coordinate care tasks, manage schedules, and stay
              connected with your care team in real-time.
            </p>
            <svg
              className="w-full h-52 mt-4"
              viewBox="0 0 500 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M130.5 160.5L166.5 207.5L224 132.5"
                stroke="#4ADE80"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <path
                d="M369 161C369 197.882 338.882 228 302 228C265.118 228 235 197.882 235 161C235 124.118 265.118 94 302 94C338.882 94 369 124.118 369 161Z"
                fill="#4ADE80"
              />
              <path d="M302 228L302 299" stroke="#4ADE80" strokeWidth="4" />
              <path d="M79.5 299.5L320 299" stroke="#4ADE80" strokeWidth="4" />
              <circle
                cx="302"
                cy="161"
                r="67"
                fill="#4ADE80"
                fillOpacity="0.2"
              />
              <path
                d="M168 94C168 130.882 137.882 161 101 161C64.1177 161 34 130.882 34 94C34 57.1177 64.1177 27 101 27C137.882 27 168 57.1177 168 94Z"
                fill="#4ADE80"
              />
              <path d="M101 161L101 232" stroke="#4ADE80" strokeWidth="4" />
            </svg>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
