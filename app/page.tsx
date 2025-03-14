"use client";

import { authenticatedRequest } from "@/lib/axios";
import React from "react";
import { useRouter } from "next/navigation";
import UpdateUser from "@/components/UpdateUser";

export interface User {
  email: string;
  first_name: string;
  last_name: string;
}

export default function Home() {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const router = useRouter();

  React.useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authenticatedRequest.get("api/user");
        setUser(response.data);
      } catch (error) {
        console.error("Fetch User Error:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {user && (
        <div className="flex justify-center items-center h-screen bg-black">
          <div className="grid grid-cols-1 gap-4 bg-white px-8 py-6 rounded-2xl">
            <h1 className="text-2xl font-semibold">
              {user ? `Welcome, ${user.email}` : "No user found."}
            </h1>
            <UpdateUser
              oldFirstName={user.first_name}
              oldLastName={user.last_name}
              setOldUser={setUser}
            />
          </div>
        </div>
      )}
    </>
  );
}
