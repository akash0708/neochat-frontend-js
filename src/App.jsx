// import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/HomePage";
import Chat from "./pages/ChatPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <div>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chats" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;
