import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast({
        variant: "destructive",
        title: "Please enter all fields",
        duration: 3000,
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `https://neochat-backend.onrender.com/api/user/login`,
        { email, password },
        config
      );

      toast({
        variant: "default",
        title: "Login Successful",
        duration: 3000,
      });

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
        duration: 3000,
      });
      setLoading(false);
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            placeholder="john@gmail.com"
            // value={}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div className="relative space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            className="pr-12"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {!showPassword ? (
            <Eye
              size={24}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-8 right-4"
            />
          ) : (
            <EyeOff
              size={24}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-8 right-4"
            />
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={submitHandler} disabled={loading}>
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Login;
