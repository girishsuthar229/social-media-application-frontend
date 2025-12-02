"use client";
import React from "react";
import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import { LikeUserListResponse } from "@/models/likesInterface";
import { X } from "lucide-react";
import { IUserResponseData } from "@/models/userInterface";
import { FollowingsEnum } from "@/util/constanst";

interface FollowUserListDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedUserId: number;
  headingContent: string;
  users: LikeUserListResponse[];
  currentUser: IUserResponseData | null;
}

const FollowUserListDrawer: React.FC<FollowUserListDrawerProps> = ({
  open,
  onClose,
  selectedUserId,
  headingContent,
  users,
  currentUser,
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={!!selectedUserId && open}
      onClose={onClose}
      onOpen={() => {}}
      slotProps={{
        paper: {
          className: "drawer-paper-centered",
        },
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box className="drawer-wrapper">
        <Box className="drawer-header">
          <Typography variant="h6" className="drawer-title">
            {headingContent}
          </Typography>
          <IconButton className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box className="drawer-content scrollbar">
          <div className="like-user-list">
            {users.length === 0 ? (
              <Typography className="no-likes">Not found.</Typography>
            ) : (
              users.map((user: LikeUserListResponse, index: number) => (
                <Box key={index}>
                  <UserlistWithFollowBtn
                    user={{
                      id: user?.id,
                      user_name: user?.user_name,
                      first_name: user?.first_name,
                      last_name: user?.last_name,
                      photo_url: user?.photo_url,
                      bio: user?.bio || null,
                      is_following: user?.is_following || false,
                      follow_status:
                        user?.follow_status || FollowingsEnum.PENDING,
                    }}
                    showBio={true}
                    showFullName={true}
                    showFollowButton={true}
                    currentUser={currentUser}
                  />
                </Box>
              ))
            )}
          </div>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default FollowUserListDrawer;
