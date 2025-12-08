import PostActionMenu from "@/app/home/components/postActionMenu";
import CommentUsersList from "@/components/common/CommentUserList/commentUsersList";
import LikeUserList from "@/components/common/LikeUserList/likeUserList";
import PostCardSkeleton from "@/components/common/Skeleton/postCardSkeleton";
import UserListSkeleton from "@/components/common/Skeleton/userListSkeleton";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";
import { CommentUserListResponse } from "@/models/commentsInterface";
import { IApiError } from "@/models/common.interface";
import { LikeUserListResponse } from "@/models/likesInterface";
import { AllSavedPostList } from "@/models/savedinterface";
import {
  IAnotherUserResponse,
  IUserResponseData,
} from "@/models/userInterface";
import { allCommentPostClickServices } from "@/services/comments-service.service";
import {
  allLikePostClickServices,
  likePostClickServices,
  unLikePostClickServices,
} from "@/services/likes-unlike-service.service";
import { getPostById } from "@/services/post-service.service";
import { commonFilePath, FollowingsEnum, STATUS_CODES } from "@/util/constanst";
import { getRelativeTime } from "@/util/helper";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
  DialogActions,
} from "@mui/material";
import { X, Heart, MessageCircle, Loader } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}
const CommonDialogModal = ({ open, onClose, children, title }: ModalProps) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="common-modal-dialog"
      maxWidth="lg"
      fullWidth
    >
      <DialogActions className="post-dialog-action">
        <Box className="drawer-header">
          <Typography variant="h6" className="drawer-title">
            {title}
          </Typography>
          <IconButton className="drawer-close-btn" onClick={onClose}>
            <X size={20} />
          </IconButton>
        </Box>
      </DialogActions>
      <DialogContent className="post-modal-container scrollbar">
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default CommonDialogModal;
