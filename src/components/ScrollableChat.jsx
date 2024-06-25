/* eslint-disable react/prop-types */
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "@/config/ChatLogic";
import { ChatContext } from "@/context/ChatProvider";
import { useContext } from "react";
import ScrollableFeed from "react-scrollable-feed";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ScrollableChat({ messages }) {
  const { user } = useContext(ChatContext);

  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div style={{ display: "flex" }} key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              isLastMessage(messages, i, user._id)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar>
                      <AvatarImage src="" alt="@shadcn" />
                      <AvatarFallback>
                        {m.sender.name[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{m.sender.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <span
              style={{
                backgroundColor: `${
                  m.sender._id === user._id ? "#000000" : "#FFFFFF"
                }`,
                color: `${m.sender._id === user._id ? "#FFFFFF" : "#000000"}`,
                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                marginTop: isSameUser(messages, m, i, user._id) ? 3 : 10,
                borderRadius: "20px",
                padding: "5px 15px",
                maxWidth: "75%",
              }}
            >
              {m.content}
            </span>
          </div>
        ))}
    </ScrollableFeed>
  );
}
