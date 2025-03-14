"use client";

import React from "react";
import AuthenticationLayout from "../layout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { request } from "@/lib/axios";
import { useRouter } from "next/navigation";

const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [registerData, setRegisterData] = React.useState<{
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [errors, setErrors] = React.useState<{
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }>({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });

  const [touched, setTouched] = React.useState<{
    email: boolean;
    password: boolean;
    first_name: boolean;
    last_name: boolean;
  }>({
    email: false,
    password: false,
    first_name: false,
    last_name: false,
  });

  const [isValid, setIsValid] = React.useState<boolean>(false);

  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const validateForm = () => {
    let newErrors = { email: "", password: "", first_name: "", last_name: "" };
    let valid = true;

    // Email validation
    if (!registerData.email) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      newErrors.email = "Invalid email format.";
      valid = false;
    }

    // Password validation
    if (!registerData.password) {
      newErrors.password = "Password is required.";
      valid = false;
    } else if (registerData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      valid = false;
    }

    // First Name validation
    if (!registerData.first_name.trim()) {
      newErrors.first_name = "First Name is required.";
      valid = false;
    }

    // Last Name validation
    if (!registerData.last_name.trim()) {
      newErrors.last_name = "Last Name is required.";
      valid = false;
    }

    setErrors(newErrors);
    setIsValid(valid);
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // Validate form whenever registerData changes
  React.useEffect(() => {
    validateForm();
  }, [registerData]);

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsLoading(true);
    try {
      const response = await request.post(
        "/api/authentication/register",
        registerData
      );

      if (response.status === 201) {
        alert("Registration successful!");
        setIsLoading(false);
        router.push("/login");
      }
    } catch (error) {
      console.error("Registration Error:", error);
      setIsLoading(false);
      alert(
        (error as any).response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <AuthenticationLayout>
      <div className="w-full md:w-2/3 lg:w-1/2 rounded-2xl px-8 py-4 bg-white grid grid-cols-1 gap-4">
        <h1 className="text-center text-2xl font-semibold">Register Form</h1>
        <div className="grid grid-cols-1 gap-2">
          <label>Email</label>
          <InputText
            name="email"
            type="text"
            className="p-inputtext-sm"
            onChange={handleOnChange}
            onBlur={handleBlur}
            value={registerData.email}
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
            value={registerData.password}
          />
          {touched.password && errors.password && (
            <small className="text-red-500">{errors.password}</small>
          )}
        </div>
        <div className="flex justify-between gap-4">
          <div className="grid grid-cols-1 gap-2 w-full">
            <label>First Name</label>
            <InputText
              name="first_name"
              type="text"
              className="p-inputtext-sm"
              onChange={handleOnChange}
              onBlur={handleBlur}
              value={registerData.first_name}
            />
            {touched.first_name && errors.first_name && (
              <small className="text-red-500">{errors.first_name}</small>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 w-full">
            <label>Last Name</label>
            <InputText
              name="last_name"
              type="text"
              className="p-inputtext-sm"
              onChange={handleOnChange}
              onBlur={handleBlur}
              value={registerData.last_name}
            />
            {touched.last_name && errors.last_name && (
              <small className="text-red-500">{errors.last_name}</small>
            )}
          </div>
        </div>
        <p className="text-right text-sm">
          Already have an account?{" "}
          <span
            className="font-semibold hover:underline hover:cursor-pointer"
            onClick={() => {
              router.push("/login");
            }}
          >
            Login here
          </span>
        </p>
        <Button
          label="Register"
          onClick={handleSubmit}
          disabled={!isValid}
          severity="success"
          loading={isLoading}
        />
      </div>
    </AuthenticationLayout>
  );
};

export default RegisterForm;
