/* eslint-disable react/prop-types */
import { ChatContext } from "@/context/ChatProvider";
import { useContext } from "react";
import SingleChat from "./SingleChat";

export default function ChatBox({ fetchAgain, setFetchAgain }) {
  const { selectedChat } = useContext(ChatContext);

  return (
    <div
      className={`${
        selectedChat ? "flex" : "hidden"
      } md:flex items-center flex-col p-3 w-full md:w-[68%] rounded bg-slate-100`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
}
