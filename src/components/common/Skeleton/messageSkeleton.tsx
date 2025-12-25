import React from "react";
import { Box, Skeleton } from "@mui/material";

interface MessageSkeletonProps {
  count?: number;
  showMessage?: boolean;
  showTime?: boolean;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({
  count = 2,
  showMessage = true,
  showTime = true,
}) => {
  const skeletonArray = Array.from({ length: count });
  return (
    <Box className={`messages-area`}>
      {skeletonArray.map((_, index) => {
        const isMe = index % 2 === 0;
        return (
          <Box
            key={index}
            className={`message-wrapper ${isMe ? "me" : "them"}`}
          >
            <Box>
              {showMessage && (
                <Skeleton
                  variant="text"
                  width={100}
                  height={20}
                  className="skeleton-text"
                />
              )}
              {showTime && (
                <Skeleton
                  variant="text"
                  width="40%"
                  height={15}
                  className="skeleton-time"
                />
              )}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default MessageSkeleton;
