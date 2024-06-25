import { useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BellIcon, SearchIcon } from "lucide-react";
import { ChatContext } from "@/context/ChatProvider";
import ProfileModal from "./ProfileModal";
import { useNavigate } from "react-router-dom";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserListItem";
import Spinner from "./Spinner";
import { getSender } from "@/config/ChatLogic";

const SideDrawer = () => {
  const {
    user,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = useContext(ChatContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        variant: "destructive",
        title: "Please enter a search term",
        duration: 2000,
      });
      return;
    }
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `https://neochat-backend.onrender.com/api/user?search=${search}`,
        config
      );
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
        duration: 2000,
      });
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        `https://neochat-backend.onrender.com/api/chat`,
        { userId },
        config
      );

      console.log(data);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);

      setLoadingChat(false);
      setOpen(false);
    } catch (error) {
      console.log(error);

      toast({
        variant: "destructive",
        title: error.message,
        duration: 2000,
      });
    }
  };

  return (
    <div className="flex justify-between items-center px-2 py-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="lg"
              className="flex gap-2"
              onClick={() => setOpen((open) => !open)}
            >
              <SearchIcon size={16} />
              <span>Search</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Search Users</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <span>neochat</span>

      <Menubar className="border-0">
        <MenubarMenu>
          <MenubarTrigger>
            {notification.length > 0 ? (
              <div className="w-4 h-4 rounded-full bg-red-500 text-white flex items-center justify-center">
                {notification.length}
              </div>
            ) : (
              <></>
            )}
            <BellIcon size={24} />
          </MenubarTrigger>
          <MenubarContent>
            {!notification.length && <MenubarItem>No new messages</MenubarItem>}
            {notification.map((notif) => (
              <MenubarItem
                key={notif._id}
                onClick={() => {
                  setSelectedChat(notif.chat);
                  setNotification(notification.filter((n) => n !== notif));
                }}
              >
                {notif.chat.isGroupChat
                  ? `New Message in ${notif.chat.chatName}`
                  : `New Message from ${getSender(user, notif.chat.users)}`}
              </MenubarItem>
            ))}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>
            <Avatar>
              <AvatarImage src="" alt="@shadcn" />
              <AvatarFallback>{user.name[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </MenubarTrigger>
          <MenubarContent className="">
            <MenubarItem>
              <ProfileModal>My Profile</ProfileModal>
            </MenubarItem>

            <MenubarSeparator />
            <MenubarItem onClick={logoutHandler}>Logout</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>

      <Drawer open={open} onOpenChange={setOpen} direction="left">
        <DrawerContent className="h-screen w-[30%] px-2">
          <DrawerHeader className="flex flex-col gap-4 ">
            <DrawerTitle>Search Users</DrawerTitle>
            <DrawerDescription className="flex flex-row gap-1">
              <Input
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button className="r rounded-full">
                <SearchIcon onClick={handleSearch} />
              </Button>
            </DrawerDescription>
          </DrawerHeader>
          {loading ? (
            <ChatLoading />
          ) : (
            searchResults.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => accessChat(user._id)}
              />
            ))
          )}
          {loadingChat && <Spinner size={16} />}
        </DrawerContent>
      </Drawer>
    </div>
  );
};
export default SideDrawer;
