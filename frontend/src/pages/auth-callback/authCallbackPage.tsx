import { Loader } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Card, CardContent } from "@/components/ui/card";
import axiosInstance from "@/lib/axios";
import { useUser } from "@clerk/clerk-react";

function AuthCallbackPage() {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempt = useRef(false);

  useEffect(() => {
    const syncUser = async () => {
      if (!isLoaded || !user || syncAttempt.current) return;
      try {
        syncAttempt.current = true;

        await axiosInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.log("Error syncing user:", error);
      } finally {
        navigate("/");
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-full bg-[#1f1f4d] flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-[#2a2a80] border-[#3333CC] shadow-lg">
        <CardContent className="flex flex-col items-center gap-4 pt-6">
          <Loader className="size-6 text-[#66ccff] animate-spin" />
          <h3 className="text-white text-xl font-bold">Đang đăng nhập...</h3>
          <p className="text-gray-300 text-sm">
            Đang chuyển hướng, vui lòng đợi...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default AuthCallbackPage;
