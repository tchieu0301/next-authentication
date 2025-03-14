"use client";

import React from "react";
import AuthenticationLayout from "../layout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { request } from "@/lib/axios";
import { useRouter } from "next/navigation";

const LoginForm: React.FC = () => {
  const router = useRouter();

  const [loginData, setLoginData] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });

  const [touched, setTouched] = React.useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });

  const [isValid, setIsValid] = React.useState<boolean>(false);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const validateForm = () => {
    let newErrors = { email: "", password: "" };
    let valid = true;

    // Email validation
    if (!loginData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(loginData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    // Password validation
    if (!loginData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (loginData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  React.useEffect(() => {
    validateForm();
  }, [loginData]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const response = await request.post(
        "/api/authentication/login",
        loginData
      );
      localStorage.setItem("authorization", "Bearer " + response.data.token);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      if (response.status === 200) {
        setIsLoading(false);

        alert("Login successful!");
        // Optionally, redirect the user to login page
        router.push("/")
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Login Error:", error);
      alert(
        (error as any).response?.data?.message ||
          "Login failed. Please try again."
      );
    }
  };

  return (
    <AuthenticationLayout>
      <div className="w-full md:w-2/3 lg:w-1/2 rounded-2xl px-8 py-4 bg-white grid grid-cols-1 gap-4">
        <h1 className="text-center text-2xl font-semibold">Login Form</h1>
        <div className="grid grid-cols-1 gap-2">
          <label>Email</label>
          <InputText
            name="email"
            type="text"
            className="p-inputtext-sm"
            onChange={handleOnChange}
            onBlur={handleBlur}
            value={loginData.email}
          />
          {touched.email && errors.email && (
            <small className="text-red-500">{errors.email}</small>
          )}
        </div>
        <div className="grid grid-cols-1 gap-2">
          <label>Password</label>
          <InputText
            name="password"
            type="password"
            className="p-inputtext-sm"
            onChange={handleOnChange}
            onBlur={handleBlur}
            value={loginData.password}
          />
          {touched.password && errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}
        </div>
        <div className="flex justify-between">
          <p
            className="text-sm font-semibold hover:underline hover:cursor-pointer"
            onClick={() => {
              router.push("/forgot-password");
            }}
          >
            Forgot password?
          </p>
          <p className="text-sm">
            Don't have any account yet?{" "}
            <span
              className="font-semibold hover:underline hover:cursor-pointer"
              onClick={() => {
                router.push("/register");
              }}
            >
              Register here
            </span>
          </p>
        </div>
        <Button
          label="Login"
          onClick={handleSubmit}
          disabled={!isValid}
          severity="success"
          loading={isLoading}
        />
      </div>
    </AuthenticationLayout>
  );
};

export default LoginForm;
