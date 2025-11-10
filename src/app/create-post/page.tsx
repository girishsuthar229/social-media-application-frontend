"use client";
import { useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import { Box, Avatar, Typography, IconButton, Grid } from "@mui/material";
import {
  Image as ImageIcon,
  Close,
  EmojiEmotions,
  LocationOn,
  People,
} from "@mui/icons-material";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import BackButton from "@/components/common/BackButton";
import AppButton from "@/components/common/AppButton";
import { createPost } from "@/services/post-service.service";
import { createPostSchema } from "@/util/validations/postSchema.validation";
import Textarea from "@/components/common/Textarea";
import { UseUserContext } from "@/components/protected-route/protectedRoute";

interface CreatePostData {
  user_id: number | null;
  content: string;
  post_image: File | null;
  comment: string;
}

const CreatePost = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const { currentUser } = UseUserContext();

  const initialValues: CreatePostData = {
    user_id: currentUser?.id || null,
    content: "",
    post_image: null,
    comment: "",
  };

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

  const handleSubmit = async (values: CreatePostData) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof CreatePostData];
      if (value !== null && value !== undefined) {
        if (key === "post_image") {
          if (value instanceof File) {
            formData.append(key, value);
          }
          return;
        } else {
          formData.append(key, String(value));
        }
      }
    });
    try {
      const response = await createPost(formData);
      if (response?.statusCode === STATUS_CODES.success) {
        toast.success("Post created successfully!");
        router.push("/home");
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message || "Failed to create post");
    }
  };

  return (
    <Box className="create-post-container scrollbar">
      <Box className="create-post-header">
        <BackButton labelText="Back" onClick={() => router.back()} />
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={createPostSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ isSubmitting, setFieldValue, values, errors, touched }) => (
          <Form className="create-post-form">
            {/* User Info */}
            <Box className="post-user-info">
              <Avatar
                src={`${commonFilePath}${currentUser?.photo_url}`}
                alt={currentUser?.user_name}
                className="post-user-avatar"
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
                      <IconButton
                        onClick={() => handleRemoveImage(setFieldValue)}
                        className="remove-image-button"
                      >
                        <Close />
                      </IconButton>
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
              <AppButton
                type="submit"
                label={isSubmitting ? "Posting..." : "Post"}
                variant="contained"
                disabled={
                  isSubmitting || (!values.content && !values.post_image)
                }
                showSpinner={isSubmitting}
                className="post-submit-button"
                fullWidth
              />
            </Box>
          </Form>
        )}
      </Formik>
    </Box>
  );
};

export default CreatePost;
