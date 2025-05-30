import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "../components/ui/select";
import { Loader2 } from "lucide-react";
import apiServices from "../api/apiServices";
import { registerSchema, type RegisterFormValues } from "../validator/user-zod";

const RegisterPage = () => {
  const navigate = useNavigate();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      contactNumber: "",
      role: "user",
    },
  });

  const mutation = useMutation({
    mutationFn: apiServices.register,
    onSuccess: (data) => {
      toast.success("Success", {
        description: data.message || "Registration successful!",
      });
      navigate("/dashboard");
    },
    onError: (error: Error) => {
      toast.error("Error", {
        description: error.message || "Registration failed",
      });
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    mutation.mutate({
      name: values.fullName,
      email: values.email,
      password: values.password,
      contact: values.contactNumber,
      role: values.role,
    });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <Card className="w-2/3">
        <CardHeader>
          <CardTitle className="text-3xl text-center">
            Get <span className="text-green-400">Started</span>
          </CardTitle>
          <p className="text-center text-gray-500">
            Create your free account in 30 seconds
          </p>
        </CardHeader>
        <CardContent className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 space-y-6 bg-gradient-to-br from-green-200 to-white p-6 rounded-lg">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome to <span className="text-green-400">CareCollab</span>
            </h1>
            <p className="text-base text-gray-600">
              Join our collaborative caregiving platform to seamlessly
              coordinate care tasks, manage schedules, and stay connected with
              your care team.
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
          <div className="w-full lg:w-1/2">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid gap-4">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="fullName">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            id="fullName"
                            placeholder="John Doe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                            autoComplete="new-password"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contactNumber"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="contactNumber">
                          Contact Number
                        </FormLabel>
                        <FormControl>
                          <Input
                            id="contactNumber"
                            placeholder="+1234567890"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel htmlFor="role">Select Role</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">User</SelectItem>
                              <SelectItem value="caregiver">
                                Caregiver
                              </SelectItem>
                              <SelectItem value="family_member">
                                Family Member
                              </SelectItem>
                            </SelectContent>
                          </Select>
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
                  Register
                </Button>
              </form>
            </Form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline hover:text-green-400 duration-150"
              >
                Log In
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
