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
import { userCommentOnPostServices } from "@/services/comments-service.service";
import { STATUS_CODES } from "@/util/constanst";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";

interface CommentDrawerProps {
  selectedPostId: number;
  open: boolean;
  onClose: () => void;
  comments: CommentUserListResponse[];
  onSendComment: (comment: string) => void;
}

const CommentDrawer: React.FC<CommentDrawerProps> = ({
  selectedPostId,
  open,
  onClose,
  comments,
  onSendComment,
}) => {
  const [commentText, setCommentText] = useState("");
  const handleSubmit = async (
    values: { comment: string },
    { resetForm }: any
  ) => {
    console.log("commen on selectedPostId:::", selectedPostId);
    console.log("commen on post", values);
    if (!selectedPostId || !values.comment.trim()) {
      return;
    }
    try {
      const response = await userCommentOnPostServices(
        selectedPostId,
        values.comment
      );
      if (response?.statusCode === STATUS_CODES.success) {
        resetForm();
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
          <div className="comment-section">
            <div className="comments-list">
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="comment-item">
                    <strong>{comment.user_name}</strong>
                    <p>{comment?.comment}</p>
                  </div>
                ))
              ) : (
                <p className="no-comments">No comments yet. Be the first!</p>
              )}
            </div>

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
                    onClick={() => {
                      if (commentText.trim()) {
                        onSendComment(commentText);
                        setCommentText("");
                      }
                    }}
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
          </div>
        </Box>
      </Box>
    </SwipeableDrawer>
  );
};

export default CommentDrawer;
