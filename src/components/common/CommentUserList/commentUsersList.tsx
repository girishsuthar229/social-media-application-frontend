import React, { useState } from "react";
import { CommentUserListResponse } from "@/models/commentsInterface";
import { IApiError } from "@/models/common.interface";
import { IUserResponseData } from "@/models/userInterface";
import {
  deleteCommentPostClickServices,
  userCommentOnPostServices,
} from "@/services/comments-service.service";
import { STATUS_CODES } from "@/util/constanst";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { toast } from "@/util/reactToastify";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import { FollowingsEnum } from "@/util/constanst";
import { Form, Formik } from "formik";
import { postCommentSchema } from "@/util/validations/postSchema.validation";
import { getRelativeTime } from "@/util/helper";
import { Info, Loader, SendHorizonal } from "lucide-react";
import UserListSkeleton from "../Skeleton/userListSkeleton";

interface CommentProps {
  selectedPostId: number;
  selectedPostUserId: number | null;
  comments: CommentUserListResponse[];
  onSendComment: (newComment: CommentUserListResponse) => void;
  onPostDeleteComment: (commentId: number, select_post_id: number) => void;
  currentUser: IUserResponseData | null;
  loaderComments: boolean;
}

const CommentUsersList: React.FC<CommentProps> = ({
  selectedPostId,
  selectedPostUserId,
  comments,
  onSendComment,
  onPostDeleteComment,
  currentUser,
  loaderComments,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleTooltipToggle = () => {
    setTooltipOpen(!tooltipOpen);
  };

  const handleSubmit = async (
    values: { comment: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    if (!selectedPostId) {
      return;
    }
    try {
      const response = await deleteCommentPostClickServices(commentId);
      if (response?.statusCode === STATUS_CODES.success) {
        onPostDeleteComment(commentId, selectedPostId);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  return (
    <>
      <Box className="drawer-content scrollbar">
        <div className="comments-list">
          {!loaderComments &&
            (comments.length === 0 ? (
              <Typography className="no-comments">
                No comments yet. Be the first!
              </Typography>
            ) : (
              comments.map(
                (comment: CommentUserListResponse, index: number) => (
                  <Box key={index} className="comment-drawer">
                    <UserlistWithFollowBtn
                      user={{
                        id: comment?.user?.id,
                        user_name: comment?.user?.user_name,
                        first_name: comment.user?.first_name,
                        last_name: comment.user?.last_name,
                        photo_url: comment.user?.photo_url,
                        bio: comment?.user?.bio || null,
                        is_following: comment?.user?.is_following || false,
                        follow_status:
                          comment?.user?.follow_status ||
                          FollowingsEnum.PENDING,
                      }}
                      showTimeStamp={
                        comment.created_date &&
                        getRelativeTime(comment.created_date)
                      }
                      showComment={comment?.comment || null}
                      showBio={false}
                      showFullName={false}
                      showFollowButton={false}
                      currentUser={currentUser}
                    />
                    {(currentUser?.id === comment?.user.id ||
                      currentUser?.id === selectedPostUserId) && (
                      <Box>
                        <IconButton
                          className="drawer-close-btn"
                          onClick={() => handleOnDeleteComment(comment.id)}
                        >
                          <HighlightOffIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    )}
                  </Box>
                )
              )
            ))}
          {loaderComments && (
            <UserListSkeleton
              count={3}
              showBio={true}
              showFollowButton={false}
            />
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
                        <Tooltip
                          title={errors.comment}
                          open={tooltipOpen}
                          onClick={handleTooltipToggle}
                          onMouseEnter={handleTooltipToggle}
                        >
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
    </>
  );
};

export default CommentUsersList;
