import React from "react";
import { useAuth } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axios";
import { Loader } from "lucide-react";

import { useUserStore } from "@/stores/useUserStore";

const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState<boolean>(true);
  const { checkAdmin } = useUserStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken();
        updateApiToken(token);
        if (token) {
          await checkAdmin();
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        updateApiToken(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, [getToken, checkAdmin]); // Add checkAdmin to dependencies

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-[#3333CC] animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthProvider;
