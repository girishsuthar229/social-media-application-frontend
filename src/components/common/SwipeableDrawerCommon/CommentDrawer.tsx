"use client";
import React from "react";
import {
  Box,
  IconButton,
  Typography,
  SwipeableDrawer,
} from "@mui/material";
import { X } from "lucide-react";
import { CommentUserListResponse } from "@/models/commentsInterface";
import { IUserResponseData } from "@/models/userInterface";
import CommentUsersList from "../CommentUserList/commentUsersList";

interface CommentDrawerProps {
  selectedPostId: number;
  selectedPostUserId: number | null;
  open: boolean;
  onClose: () => void;
  comments: CommentUserListResponse[];
  onSendComment: (newComment: CommentUserListResponse) => void;
  onPostDeleteComment: (commentId: number, select_post_id: number) => void;
  currentUser: IUserResponseData | null;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  selectedPostId,
  selectedPostUserId,
  open,
  onClose,
  comments,
  onSendComment,
  onPostDeleteComment,
  currentUser,
}) => {
  return (
    <SwipeableDrawer
      anchor="bottom"
      open={!!selectedPostId && open}
      onClose={onClose}
      onOpen={() => {}}
      ModalProps={{
        keepMounted: false,
      }}
      slotProps={{
        paper: {
          className: "drawer-paper-centered",
        },
      }}
    >
      <Box className="drawer-wrapper">
        <Box className="drawer-header">
          <Typography variant="h6" className="drawer-title">
            Comments
          </Typography>
          <IconButton className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>
        <Box className="user-list-comment-drawwer scrollbar">
          <CommentUsersList
            selectedPostId={selectedPostId}
            selectedPostUserId={selectedPostUserId}
            comments={comments}
            onSendComment={onSendComment}
            onPostDeleteComment={onPostDeleteComment}
            currentUser={currentUser}
          />
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default CommentDrawer;
