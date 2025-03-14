"use client";

import React from "react";
import AuthenticationLayout from "../layout";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { request } from "@/lib/axios";
import { useRouter } from "next/navigation";

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();

  const [email, setEmail] = React.useState<string>();

  const [error, setError] = React.useState<string>();

  const [touched, setTouched] = React.useState<boolean>(false);

  const [isValid, setIsValid] = React.useState<boolean>(false);

  const validateForm = () => {
    let errorMessage = "";
    if (!email) {
      errorMessage = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errorMessage = "Invalid email format.";
    }

    if (errorMessage !== error) setError(errorMessage);
    setIsValid(errorMessage === "");
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
  };

  const handleBlur = () => {
    setTouched(true);
  };

  // Validate form whenever registerData changes
  React.useEffect(() => {
    validateForm();
  }, [email]);

  const handleSubmit = async () => {
    if (!isValid) return;
  
    try {
      await request.post("/api/authentication/send-reset-password", { email });
      alert("Send email reset password successfully!");
    } catch (error) {
      console.error("Login Error:", error);
      alert((error as any).response?.data?.message || "Request failed. Please try again.");
    }
  };

  return (
    <AuthenticationLayout>
      <div className="w-full md:w-2/3 lg:w-1/2 rounded-2xl px-8 py-4 bg-white grid grid-cols-1 gap-4">
        <h1 className="text-center text-2xl font-semibold">
          Forgot Password Form
        </h1>
        <div className="grid grid-cols-1 gap-2">
          <label>Email</label>
          <InputText
            name="email"
            type="text"
            className="p-inputtext-sm"
            onChange={handleOnChange}
            onBlur={handleBlur}
            value={email}
          />
          {touched && error && <small className="text-red-500">{error}</small>}
        </div>

        <Button
          label="Send Request Reset Password"
          onClick={handleSubmit}
          disabled={!isValid}
          severity="success"
        />
      </div>
    </AuthenticationLayout>
  );
};

export default ForgotPasswordForm;
