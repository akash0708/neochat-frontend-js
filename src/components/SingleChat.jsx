/* eslint-disable react/prop-types */
import { getSender } from "@/config/ChatLogic";
import { ChatContext } from "@/context/ChatProvider";
import { ArrowLeft, SendHorizonalIcon } from "lucide-react";
import { useContext, useEffect, useState } from "react";
// import ProfileModal from "./Miscellaneous/ProfileModal";
import UpdateGroupChatModal from "./Miscellaneous/UpdateGroupChatModal";
import Spinner from "./Miscellaneous/Spinner";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
// eslint-disable-next-line no-unused-vars
import { useToast, toast } from "./ui/use-toast";
import ScrollableChat from "./ScrollableChat";
import io from "socket.io-client";

const ENDPOINT = `https://neochat-backend.onrender.com`;
var socket, selectedChatCompare;

export default function SingleChat({ fetchAgain, setFetchAgain }) {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    useContext(ChatContext);

  const { toast } = useToast();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://neochat-backend.onrender.com/api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => {
      setSocketConnected(true);
    });
    socket.on("typing", () => {
      setIsTyping(true);
    });
    socket.on("stop typing", () => {
      setIsTyping(false);
    });
  }, []);

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      if (
        !selectedChatCompare || // if chat is not selected or doesn't match current chat
        selectedChatCompare._id !== newMessageRecieved.chat._id
      ) {
        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageRecieved]);
      }
    });
  });

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id);
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          `https://neochat-backend.onrender.com/api/message`,
          {
            content: newMessage,
            chatId: selectedChat,
          },
          config
        );
        // console.log(data);

        socket.emit("new message", data);
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          variant: "destructive",
          title: error.response.data.message,
          duration: 2000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;

    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };

  return (
    <>
      {selectedChat ? (
        <>
          <div className="flex items-center justify-between w-full">
            <ArrowLeft
              size={24}
              onClick={() => {
                setSelectedChat("");
              }}
              className="cursor-pointer flex md:hidden"
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                {/* <ProfileModal></ProfileModal> */}
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                {
                  <UpdateGroupChatModal
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                }
              </>
            )}
          </div>
          <div className="flex flex-col justify-end w-full h-full overflow-y-hidden rounded-lg bg-slate-200">
            {/* messages here */}
            {loading ? (
              <div className="w-20 h-20 mx-auto">
                <Spinner size={12} />
              </div>
            ) : (
              <div className="flex flex-col overflow-y-scroll px-1">
                {/* messages */}
                <ScrollableChat messages={messages} />
              </div>
            )}
            <div
              className="flex flex-col space-x-2 mt-3"
              onKeyDown={sendMessage}
            >
              {isTyping && <p className="text-xs block">Typing...</p>}
              <div className="flex w-full items-center justify-center space-x-2 mt-3">
                <Input
                  type="text"
                  placeholder="Start typing..."
                  onChange={typingHandler}
                  value={newMessage}
                />
                <Button onClick={sendMessage}>
                  <SendHorizonalIcon size={16} />
                </Button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center h-full w-full">
          <h1 className="text-xl">Click on a user to start chatting</h1>
        </div>
      )}
    </>
  );
}
