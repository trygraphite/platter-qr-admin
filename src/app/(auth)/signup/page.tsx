"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, User, Phone, Loader2, Globe } from "lucide-react";
import { useApi } from "@/network";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const signupSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    country: z.string().optional(),
  });

type SignupFormData = z.infer<typeof signupSchema>;

const Signup = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const { accountApi } = useApi();
  const { setUser } = useAuthStore();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const [phoneValue, setPhoneValue] = React.useState("");
  const [selectedCountry, setSelectedCountry] = React.useState("ng");

  const signupMutation = useMutation({
    mutationFn: accountApi.createAccount,
    onSuccess: (response) => {
      const userData = response.data.data;
      setUser({ ...userData, accountType: userData.accountType ?? "" });
      toast.success("Account created successfully!", {
        description: "Welcome to Platter QR!",
      });
      router.push("/dashboard");
    },
    onError: (error: import("axios").AxiosError) => {
      toast.error("Signup failed", {
        description:
          (error.response?.data as { message?: string })?.message ||
          "Please check your information and try again.",
      });
    },
  });

  const onSubmit = (data: SignupFormData) => {
    signupMutation.mutate({
      ...data,
      country: selectedCountry,
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">
          Create an account
        </CardTitle>
        <CardDescription className="text-center">
          Enter your information to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstname">First Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="firstname"
                  placeholder="John"
                  className="pl-10 placeholder:opacity-70"
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="text-sm text-red-500">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastname">Last Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="lastname"
                  placeholder="Doe"
                  className="pl-10 placeholder:opacity-70"
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && (
                <p className="text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="pl-10 placeholder:opacity-70"
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative w-full">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <PhoneInput
                country={selectedCountry}
                value={phoneValue}
                onChange={(phone, data) => {
                  setPhoneValue(phone);
                  setValue("phone", phone); // Sync with react-hook-form
                  if (data && "countryCode" in data) {
                    setSelectedCountry((data as any).countryCode);
                  }
                }}
                inputClass="!pl-16 placeholder:opacity-70" // for left padding and reduced opacity
                containerClass="w-full"
                inputStyle={{ width: "100%" }}
                containerStyle={{ width: "100%" }}
                inputProps={{
                  name: "phone",
                  required: true,
                  autoFocus: false,
                }}
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="country"
                placeholder="Nigeria"
                className="pl-10 placeholder:opacity-70"
                {...register("country")}
              />
            </div>
            {errors.country && (
              <p className="text-sm text-red-500">{errors.country.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                className="pl-10 pr-10 placeholder:opacity-70"
                {...register("password")}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={signupMutation.isPending}
          >
            {signupMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              "Create account"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Signup;
