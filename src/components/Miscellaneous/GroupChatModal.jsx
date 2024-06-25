import { useContext, useState } from "react";
import { useToast } from "../ui/use-toast";
import { ChatContext } from "@/context/ChatProvider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "../ui/button";
import axios from "axios";
import UserBadgeItem from "../User/UserBadgeItem";
import { Card } from "../ui/card";
import UserListItem from "../UserListItem";

// eslint-disable-next-line react/prop-types
export const GroupChatModal = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const { user, chats, setChats } = useContext(ChatContext);

  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        variant: "destructive",
        title: "User already added",
        duration: 2000,
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
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
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        variant: "destructive",
        title: "Please fill in all fields",
        duration: 2000,
      });

      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `https://neochat-backend.onrender.com/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      setOpen(false);

      toast({
        variant: "default",
        title: "Chat created successfully",
        duration: 2000,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: error.response.data.message,
        duration: 2000,
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Button onClick={() => setOpen(!open)}>{children}</Button>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Group Chat</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Chat Name
              </Label>
              <Input
                id="name"
                className="col-span-3"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Add Users
              </Label>
              <Input
                id="username"
                className="col-span-3"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
          <Card className="w-full flex flex-wrap border-0 outline-none gap-2">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Card>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
          <DialogFooter>
            <Button onClick={handleSubmit}>Create Chat</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
