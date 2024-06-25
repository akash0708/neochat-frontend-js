/* eslint-disable react/prop-types */
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatProvider";
import { CirclePlusIcon } from "lucide-react";
import ChatLoading from "./Miscellaneous/ChatLoading";
import { getSender } from "@/config/ChatLogic";
import { GroupChatModal } from "./Miscellaneous/GroupChatModal";

export default function MyChats({ fetchAgain }) {
  const [loggedUser, setLoggedUser] = useState();
  const { user, chats, setChats, selectedChat, setSelectedChat } =
    useContext(ChatContext);
  const { toast } = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://neochat-backend.onrender.com/api/chat`,
        config
      );

      setChats(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to load chats",
        duration: 2000,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  return (
    <div
      className={`${
        selectedChat ? "hidden" : "flex"
      } md:flex flex-col items-center p-3 w-full md:w-[31%] bg-slate-100 gap-2`}
    >
      <div className="flex w-full justify-between items-center">
        My Chats
        {/* <GroupChat Modal */}
        <GroupChatModal>
          <span className="mr-2">New Group Chat</span>
          <CirclePlusIcon size={24} />
        </GroupChatModal>
        {/* groupchat modal */}
      </div>
      <div className="flex flex-col w-full h-full overflow-y-hidden">
        {chats ? (
          <div className="overflow-y-scroll flex flex-col gap-2">
            {chats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
                className={`p-3 rounded ${
                  selectedChat === chat
                    ? "bg-[#000000] text-white"
                    : "bg-[#cfcfcf] text-black"
                }`}
              >
                <p>
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </p>
                {chat.latestMessage && (
                  <p className="text-xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
    </div>
  );
}
