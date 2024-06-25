/* eslint-disable react/prop-types */
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserListItem = ({ user, handleFunction }) => {
  return (
    <Card
      className="flex items-center px-4 hover:bg-slate-100"
      onClick={handleFunction}
    >
      <Avatar>
        <AvatarImage src="" />
        <AvatarFallback className="">
          {user.name[0].toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
        <CardDescription>{user.email}</CardDescription>
      </CardHeader>
    </Card>
  );
};

export default UserListItem;
