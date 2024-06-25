/* eslint-disable react/prop-types */
import { Badge } from "@/components/ui/badge";
import { CircleX } from "lucide-react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge className="flex gap-1 px-3 py-1" onClick={handleFunction}>
      {user.name}
      {/* {admin === user._id && <span> (Admin)</span>} */}
      <CircleX size={16} />
    </Badge>
  );
};

export default UserBadgeItem;
