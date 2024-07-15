import { Label } from "@radix-ui/react-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";
// import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();

  // const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [pic, setPic] = useState();
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const postDetails = (pics) => {
    if (pics === undefined) {
      toast({
        variant: "destructive",
        title: "Please select an image",
        duration: 5000,
      });
      return;
    }

    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();

      data.append("file", pics);
      data.append("upload_preset", "neochat");
      data.append("cloud_name", "dybvod0l2");

      fetch("https://api.cloudinary.com/v1_1/dybvod0l2/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          // console.log(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      toast({
        variant: "destructive",
        title: "Please select an image",
        duration: 5000,
      });
      setLoading(false);
    }
  };
  const submitHandler = async () => {
    // console.log("inside submit handler");
    // console.log(name, email, password, confirmPassword, pic);

    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast({
        variant: "destructive",
        title: "Please fill all the fields",
        duration: 5000,
      });
      setLoading(false);
      return;
    }
    // console.log("checking password");

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords do not match",
        duration: 5000,
      });
      setLoading(false);
      return;
    }
    // console.log("passwords match");

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const { data } = await axios.post(
        `https://neochat-backend.onrender.com/api/user`,
        { name, email, password, pic },
        config
      );
      toast({
        title: "Account created successfully",
        variant: "default",
        duration: 5000,
      });
      // console.log("data sent");

      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      navigate("/chats");
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
        duration: 5000,
      });
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sign Up</CardTitle>
        <CardDescription>Sign up using your email and password</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div className="relative space-y-1">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            placeholder="Renter your password"
            type={showConfirmPassword ? "text" : "password"}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          {!showConfirmPassword ? (
            <Eye
              size={24}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-8 right-4"
            />
          ) : (
            <EyeOff
              size={24}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-8 right-4"
            />
          )}
        </div>
        <div className="space-y-1">
          <Label htmlFor="profilePic">Upload profile pic</Label>
          <Input
            id="profilePic"
            type="file"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={submitHandler} disabled={loading}>
          Sign up
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;
