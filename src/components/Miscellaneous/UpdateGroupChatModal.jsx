/* eslint-disable react/prop-types */
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import { useContext, useState } from "react";
import { ChatContext } from "@/context/ChatProvider";
import { useToast } from "../ui/use-toast";
import { EyeIcon } from "lucide-react";
import UserBadgeItem from "../User/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserListItem";

export default function UpdateGroupChatModal({
  fetchAgain,
  setFetchAgain,
  fetchMessages,
}) {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { toast } = useToast();
  const { user, selectedChat, setSelectedChat } = useContext(ChatContext);

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        `https://neochat-backend.onrender.com/api/chat/rename`,
        { chatId: selectedChat._id, chatName: groupChatName },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
        duration: 5000,
      });
      setRenameLoading(false);
    }
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
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
      // console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.response.data.message,
        duration: 2000,
      });
      setLoading(false);
    }
  };

  const handleAddUser = async (userToAdd) => {
    if (selectedChat.users.find((u) => u._id === userToAdd._id)) {
      toast({
        variant: "destructive",
        title: "User already added",
        duration: 2000,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        variant: "destructive",
        title: "You are not the admin of this group",
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
      const { data } = await axios.put(
        `https://neochat-backend.onrender.com/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: userToAdd._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: error.response.data.message,
        duration: 5000,
      });
      setLoading(false);
    }
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only admins can remove someone!",
        variant: "destructive",
        duration: 5000,
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
      const { data } = await axios.put(
        `https://neochat-backend.onrender.com/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: error.response.data.message,
        duration: 5000,
        variant: "destructive",
      });
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button variant="outline" onClick={() => setOpen(!open)}>
          <EyeIcon size={24} />
        </Button>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{selectedChat.chatName}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Rename
              </Label>
              <Input
                id="rename"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Add User to Group
              </Label>
              <Input
                id="addUser"
                onChange={(e) => handleSearch(e.target.value)}
                className="col-span-3"
              />
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="flex flex-col">
                  {searchResult?.slice(0, 4).map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleAddUser(user)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="w-full flex flex-wrap border-0 outline-none gap-2">
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </div>
          <DialogFooter>
            <Button disabled={renameLoading} onClick={handleRename}>
              Save changes
            </Button>
            <Button variant="destructive" onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
