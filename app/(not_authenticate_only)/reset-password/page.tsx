"use client";

import React from "react";
import AuthenticationLayout from "../layout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { request } from "@/lib/axios";
import { useRouter, useSearchParams } from "next/navigation";

const ResetPasswordForm: React.FC = () => {
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = React.useState<string>();

  const [error, setError] = React.useState<string>();

  const [touched, setTouched] = React.useState<boolean>(false);

  const [isValid, setIsValid] = React.useState<boolean>(false);

  const validateForm = () => {
    let errorMessage = "";
    if (!password) {
      errorMessage = "Password is required.";
    } else if (password.length < 6) {
      errorMessage = "Password must be at least 6 characters.";
    }

    if (errorMessage !== error) setError(errorMessage);
    setIsValid(errorMessage === "");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  // Validate form whenever registerData changes
  React.useEffect(() => {
    validateForm();
  }, [password]);

  const handleSubmit = async () => {
    if (!isValid) return;

    try {
      await request.post("/api/authentication/reset-password", {
        password: password,
        resetPasswordToken: token,
      });
      alert("Reset password successfully!");
      router.push("/login")
    } catch (error) {
      console.error("Reset Password Error:", error);
      alert(
        (error as any).response?.data?.message ||
          "Request failed. Please try again."
      );
    }
  };

  return (
    <AuthenticationLayout>
      <div className="w-full md:w-2/3 lg:w-1/2 rounded-2xl px-8 py-4 bg-white grid grid-cols-1 gap-4">
        <h1 className="text-center text-2xl font-semibold">
          Reset Password Form
        </h1>
        <div className="grid grid-cols-1 gap-2">
          <label>New Password</label>
          <InputText
            name="Password"
            type="password"
            className="p-inputtext-sm"
            onChange={handleOnChange}
            onBlur={handleBlur}
            value={password}
          />
          {touched && error && <small className="text-red-500">{error}</small>}
        </div>

        <Button
          label="Reset Password"
          onClick={handleSubmit}
          disabled={!isValid}
          severity="success"
        />
      </div>
    </AuthenticationLayout>
  );
};

export default ResetPasswordForm;
