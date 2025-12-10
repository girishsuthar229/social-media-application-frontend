"use client";
import React from "react";
import { Box, IconButton, SwipeableDrawer, Typography } from "@mui/material";
import { LikeUserListResponse } from "@/models/likesInterface";
import { X } from "lucide-react";
import { IUserResponseData } from "@/models/userInterface";
import LikeUserList from "../LikeUserList/likeUserList";

interface LikeUserListDrawerProps {
  selectedPostId: number;
  open: boolean;
  onClose: () => void;
  currentUser: IUserResponseData | null;
  likedUsers: LikeUserListResponse[];
}

const LikeUserListDrawer: React.FC<LikeUserListDrawerProps> = ({
  selectedPostId,
  open,
  onClose,
  currentUser,
  likedUsers,
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={!!selectedPostId && open}
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
            Liked by
          </Typography>
          <IconButton className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>
        <Box className="user-list-likes-drawwer scrollbar">
          <LikeUserList likedUsers={likedUsers} currentUser={currentUser} />
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default LikeUserListDrawer;
