"use client";

import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface AuthProps {
  children: ReactNode;
}

const AuthenticationLayout: React.FC<AuthProps> = ({ children }) => {
  const authorization = localStorage.getItem("authorization");
  const router = useRouter();

  React.useEffect(() => {
    if (authorization) {
      router.push("/");
    }
  }, [authorization])

  return (
    <>
      <div className="flex h-screen items-center justify-center bg-black w-full">
        {children}
      </div>
    </>
  );
};

export default AuthenticationLayout;
