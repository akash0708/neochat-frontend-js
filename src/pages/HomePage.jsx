// add zod for validation

import Signup from "@/components/Signup";
import Login from "@/components/Login";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("userInfo");
    if (user) {
      navigate("/chats");
    }
  }, [navigate]);
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Sign up</TabsTrigger>
          <TabsTrigger value="password">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          {/* --------------------------- */}
          <Signup />
          {/* ---------------------- */}
        </TabsContent>
        <TabsContent value="password">
          <Login />
        </TabsContent>
      </Tabs>
    </div>
  );
}
