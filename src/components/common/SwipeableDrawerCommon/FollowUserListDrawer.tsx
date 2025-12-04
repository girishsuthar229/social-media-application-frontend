"use client";
import React from "react";
import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import { X } from "lucide-react";
import { IUserResponseData } from "@/models/userInterface";
import { FollowingsEnum } from "@/util/constanst";
import { FollowUserListResponse } from "@/models/followsInterface";

interface FollowUserListDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedUserId: number;
  headingContent: string;
  followUsers: FollowUserListResponse[];
  currentUser: IUserResponseData | null;
}

const FollowUserListDrawer: React.FC<FollowUserListDrawerProps> = ({
  open,
  onClose,
  selectedUserId,
  headingContent,
  followUsers,
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
            {followUsers.length === 0 ? (
              <Typography className="no-likes">Not found.</Typography>
            ) : (
              followUsers.map(
                (followUser: FollowUserListResponse, index: number) => (
                  <Box key={index}>
                    <UserlistWithFollowBtn
                      user={{
                        id: followUser?.user?.id,
                        user_name: followUser?.user?.user_name,
                        first_name: followUser?.user?.first_name,
                        last_name: followUser?.user?.last_name,
                        photo_url: followUser?.user?.photo_url,
                        bio: followUser?.user?.bio || null,
                        is_following: followUser?.user?.is_following || false,
                        follow_status:
                          followUser?.user?.follow_status ||
                          FollowingsEnum.PENDING,
                      }}
                      showBio={true}
                      showFullName={true}
                      showFollowButton={true}
                      currentUser={currentUser}
                    />
                  </Box>
                )
              )
            )}
          </div>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default FollowUserListDrawer;
