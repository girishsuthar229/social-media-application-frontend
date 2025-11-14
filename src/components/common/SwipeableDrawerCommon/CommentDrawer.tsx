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
import { STATUS_CODES } from "@/util/constanst";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { UseUserContext } from "@/components/protected-route/protectedRoute";

interface CommentDrawerProps {
  selectedPostId: number;
  selectedPostUserId: number;
  open: boolean;
  onClose: () => void;
  comments: CommentUserListResponse[];
  onSendComment: (newComment: CommentUserListResponse) => void;
  onPostDeleteComment: (deleteComment: CommentUserListResponse) => void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  selectedPostId,
  selectedPostUserId,
  open,
  onClose,
  comments,
  onSendComment,
  onPostDeleteComment,
}) => {
  const { currentUser } = UseUserContext();
  const handleSubmit = async (
    values: { comment: string },
    { resetForm }: any
  ) => {
    if (!selectedPostId || !values.comment.trim()) {
      return;
    }
    try {
      const response = await userCommentOnPostServices(selectedPostId, values);
      if (response?.statusCode === STATUS_CODES.success && response.data) {
        onSendComment(response.data);
        resetForm();
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const handleOnDeleteComment = async (commentId: number) => {
    if (selectedPostId) {
      return;
    }
    try {
      const response = await deleteCommentPostClickServices(commentId);
      if (response?.statusCode === STATUS_CODES.success && response.data) {
        onPostDeleteComment(response.data);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  return (
    <SwipeableDrawer
      anchor="bottom"
      open={!!selectedPostId && open}
      onClose={onClose}
      onOpen={() => {}}
      ModalProps={{
        keepMounted: false,
      }}
      PaperProps={{
        className: "drawer-paper-centered",
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
        <Box className="drawer-content scrollbar">
          <div className="comments-list">
            {comments.length === 0 ? (
              <Typography className="no-comments">
                No comments yet. Be the first!
              </Typography>
            ) : (
              comments.map(
                (comment: CommentUserListResponse, index: number) => (
                  <Box key={index} className="comment-item">
                    <UserlistWithFollowBtn
                      user={{
                        id: comment?.user?.id,
                        user_name: comment?.user?.user_name,
                        first_name: comment.user?.first_name,
                        last_name: comment.user?.last_name,
                        photo_url: comment.user?.photo_url,
                        bio: comment?.comment || null,
                        is_following: false,
                      }}
                      showBio={true}
                      showFullName={false}
                      showFollowButton={false}
                    />
                    {(currentUser?.id === comment?.user.id ||
                      currentUser?.id === selectedPostUserId) && (
                      <IconButton
                        className="delete-icon"
                        onClick={() => handleOnDeleteComment(comment.id)}
                      >
                        <HighlightOffIcon />
                      </IconButton>
                    )}
                  </Box>
                )
              )
            )}
          </div>
        </Box>
        {/* Comment Input */}
        <Formik
          initialValues={{ comment: "" }}
          validationSchema={postCommentSchema}
          onSubmit={handleSubmit}
        >
          {({
            isSubmitting,
            values,
            handleChange,
            handleBlur,
            touched,
            errors,
            isValid,
          }) => (
            <Form className="comment-input-container">
              <TextField
                name="comment"
                fullWidth
                variant="outlined"
                placeholder="Write a comment..."
                size="small"
                value={values.comment}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.comment && Boolean(errors.comment)}
                slotProps={{
                  input: {
                    endAdornment:
                      touched.comment && errors.comment ? (
                        <InputAdornment position="end">
                          <Tooltip title={errors.comment}>
                            <Info size={18} color="#f44336" />
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                  },
                }}
                className="comment-input common-textfield-input"
              />
              <IconButton
                type="submit"
                disabled={isSubmitting || !isValid}
                className="send-btn"
              >
                {isSubmitting ? (
                  <Loader size={20} className="loading-spinner" />
                ) : (
                  <SendHorizonal size={20} />
                )}
              </IconButton>
            </Form>
          )}
        </Formik>
      </Box>
    </SwipeableDrawer>
  );
};

export default CommentDrawer;
