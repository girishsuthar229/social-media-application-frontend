"use client";
import React from "react";
import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import { LikeUserListResponse } from "@/models/likesInterface";
import { X } from "lucide-react";

interface LikeUserListDrawerProps {
  selectedPostId: number;
  open: boolean;
  onClose: () => void;
  users: LikeUserListResponse[];
}

const LikeUserListDrawer: React.FC<LikeUserListDrawerProps> = ({
  selectedPostId,
  open,
  onClose,
  users,
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={!!selectedPostId && open}
      onClose={onClose}
      onOpen={() => {}}
      PaperProps={{
        className: "drawer-paper-centered",
      }}
      ModalProps={{
        keepMounted: false,
      }}
    >
      <Box className="drawer-wrapper">
        <Box className="drawer-header">
          <Typography variant="h6" className="drawer-title">
            Liked by
          </Typography>
          <IconButton className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>

        <Box className="drawer-content scrollbar">
          <div className="like-user-list">
            {users.length === 0 ? (
              <Typography className="no-likes">No likes yet.</Typography>
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
                      is_following: false,
                    }}
                    showBio={true}
                    showFullName={true}
                    showFollowButton={true}
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

export default LikeUserListDrawer;
