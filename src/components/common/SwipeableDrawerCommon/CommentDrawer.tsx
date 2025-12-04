"use client";
import React, { useState } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  SwipeableDrawer,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import { Info, Loader, SendHorizonal, X } from "lucide-react";
import { Form, Formik } from "formik";
import { postCommentSchema } from "@/util/validations/postSchema.validation";
import { CommentUserListResponse } from "@/models/commentsInterface";
import {
  deleteCommentPostClickServices,
  userCommentOnPostServices,
} from "@/services/comments-service.service";
import { FollowingsEnum, STATUS_CODES } from "@/util/constanst";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { getRelativeTime } from "@/util/helper";
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
        <CommentUsersList
          selectedPostId={selectedPostId}
          selectedPostUserId={selectedPostUserId}
          comments={comments}
          onSendComment={onSendComment}
          onPostDeleteComment={onPostDeleteComment}
          currentUser={currentUser}
        />
      </Box>
    </SwipeableDrawer>
  );
};

export default CommentDrawer;
