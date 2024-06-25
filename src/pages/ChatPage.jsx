import ChatBox from "@/components/ChatBox";
import SideDrawer from "@/components/Miscellaneous/SideDrawer";
import MyChats from "@/components/MyChats";
import { Card } from "@/components/ui/card";
import { ChatContext } from "@/context/ChatProvider";
import { useContext, useState } from "react";

export default function Chat() {
  const { user } = useContext(ChatContext);
  const [fetchAgain, setFetchAgain] = useState(false);

  return (
    <div className="w-full">
      {user && <SideDrawer />}
      <Card className="flex justify-between w-full h-[90vh] p-10">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Card>
    </div>
  );
}
