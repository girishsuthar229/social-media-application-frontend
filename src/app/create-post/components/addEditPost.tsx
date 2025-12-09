import AppButton from "@/components/common/AppButton";
import BackButton from "@/components/common/BackButton";
import Textarea from "@/components/common/Textarea";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { IApiError } from "@/models/common.interface";
import { getPostById } from "@/services/post-service.service";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import { createPostSchema } from "@/util/validations/postSchema.validation";
import { Close, EmojiEmotions, LocationOn, People } from "@mui/icons-material";
import { Avatar, Box, Grid, IconButton, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { ImageIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export interface AddEditPostData {
  user_id: number;
  content: string;
  post_image: File | string | null;
  comment: string;
}
interface AddEditPostProps {
  postId?: number | null;
  onCanceModalClick?: () => void;
  onAddPostClick?: (addPostdata: AddEditPostData) => void;
  onEditPostClick?: (postId: number, editData: AddEditPostData) => void;
  postLoading: boolean;
}

const AddEditPost: React.FC<AddEditPostProps> = ({
  postId,
  onCanceModalClick,
  onAddPostClick,
  onEditPostClick,
  postLoading,
}) => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { currentUser } = UseUserContext();
  const [initialValues, setInitialValues] = useState<AddEditPostData>({
    user_id: currentUser?.id || 0,
    content: "",
    post_image: null,
    comment: "",
  });

  const handleImageSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue("post_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = (setFieldValue: any) => {
    setImagePreview("");
    setFieldValue("post_image", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (values: AddEditPostData) => {
    if (postId && onEditPostClick) {
      onEditPostClick(postId, values);
    }
    if (!postId && onAddPostClick) {
      onAddPostClick(values);
    }
  };

  const loadUserPostById = async (postId: number) => {
    try {
      const res = await getPostById(postId);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        const normilizeData: AddEditPostData = {
          user_id: res?.data?.user?.id,
          content: res?.data?.content,
          post_image: res?.data?.image_url,
          comment: res?.data?.self_comment || "",
        };
        setImagePreview(commonFilePath + res?.data?.image_url);
        setInitialValues(normilizeData);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    if (postId) {
      loadUserPostById(postId);
    }
  }, [postId]);

  return (
    <Box className="create-post-container scrollbar">
      {!postId && (
        <Box className="create-post-header">
          <BackButton labelText="Back" onClick={() => router.back()} />
        </Box>
      )}

      <Formik
        initialValues={initialValues}
        validationSchema={createPostSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form className="create-post-form">
            {/* User Info */}
            <Box className="post-user-info">
              <Avatar
                src={`${commonFilePath}${currentUser?.photo_url}`}
                alt={currentUser?.user_name}
                className="user-avatar"
              />
              <Box className="post-user-details">
                <Typography className="post-user-name">
                  {currentUser?.first_name} {currentUser?.last_name}
                </Typography>
                <Typography className="post-user-username">
                  @{currentUser?.user_name}
                </Typography>
              </Box>
            </Box>

            <Box className="post-actions-section">
              <Grid container spacing={1.5} className="post-action-buttons">
                {/* Left Side - Photo / Image */}
                <Grid
                  size={{ xs: 12, sm: 9, md: 9, lg: 9 }}
                  className="left-actions-grid"
                >
                  {imagePreview ? (
                    <div className="image-preview-container">
                      {!!!postId && (
                        <IconButton
                          onClick={() => handleRemoveImage(setFieldValue)}
                          className="remove-image-button"
                        >
                          <Close />
                        </IconButton>
                      )}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="image-preview"
                      />
                    </div>
                  ) : (
                    <div className="photo-action-container">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        onChange={(e) => handleImageSelect(e, setFieldValue)}
                        style={{ display: "none" }}
                        id="image-upload"
                      />
                      <label
                        htmlFor="image-upload"
                        className="action-icon-button-photo"
                      >
                        <ImageIcon className="action-icon" />
                        <span className="action-label">
                          Click here to upload an image for your post
                        </span>
                      </label>
                    </div>
                  )}
                </Grid>

                {/* Right Side - Other Actions */}
                <Grid
                  size={{ xs: 12, sm: 3, md: 3, lg: 3 }}
                  className="right-actions-grid"
                >
                  <button
                    type="button"
                    className="action-icon-button"
                    onClick={() => toast.info("Emoji picker coming soon!")}
                  >
                    <EmojiEmotions className="action-icon" />
                    <span className="action-label">Feeling</span>
                  </button>

                  <button
                    type="button"
                    className="action-icon-button"
                    onClick={() => toast.info("Location picker coming soon!")}
                  >
                    <LocationOn className="action-icon" />
                    <span className="action-label">Location</span>
                  </button>

                  <button
                    type="button"
                    className="action-icon-button"
                    onClick={() => toast.info("Tag people coming soon!")}
                  >
                    <People className="action-icon" />
                    <span className="action-label">Tag</span>
                  </button>
                </Grid>
              </Grid>
              {Boolean(errors.post_image) && touched.post_image && (
                <Typography variant="caption" color="error">
                  {errors.post_image}
                </Typography>
              )}
            </Box>

            {/* Content Textarea */}
            <Box className="post-content-section">
              <Textarea
                placeholder="What's on your mind?"
                className="post-comment-textarea"
                name="content"
                id="content"
                value={values.content}
                onChange={(e) => setFieldValue("content", e.target.value)}
                maxLength={300}
                rows={4}
              />
              {errors.content && touched.content && (
                <Typography variant="caption" color="error">
                  {errors.content}
                </Typography>
              )}
            </Box>
            {/* Comment/Caption Section */}
            <Box className="post-comment-section">
              <Typography className="section-label">
                Add a comment (optional)
              </Typography>
              <Textarea
                placeholder="Add your thoughts..."
                className="post-comment-textarea"
                name="comment"
                id="comment"
                value={values.comment}
                onChange={(e) => setFieldValue("comment", e.target.value)}
                rows={1}
              />
              {errors.comment && touched.comment && (
                <Typography variant="caption" color="error">
                  {errors.comment}
                </Typography>
              )}
            </Box>

            {/* Submit Button */}
            <Box className="post-submit-section">
              {postId ? (
                <>
                  <AppButton
                    type="button"
                    label={"Cancel"}
                    variant="outlined"
                    disabled={
                      postLoading || (!values.content && !values.post_image)
                    }
                    showSpinner={false}
                    onClick={onCanceModalClick}
                  />
                  <AppButton
                    type="submit"
                    label={postLoading ? "Updating..." : "Update"}
                    variant="contained"
                    disabled={
                      postLoading || (!values.content && !values.post_image)
                    }
                    showSpinner={postLoading}
                  />
                </>
              ) : (
                <AppButton
                  type="submit"
                  label={postLoading ? "Posting..." : "Post"}
                  variant="contained"
                  disabled={
                    postLoading || (!values.content && !values.post_image)
                  }
                  showSpinner={postLoading}
                  fullWidth
                />
              )}
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default AddEditPost;
