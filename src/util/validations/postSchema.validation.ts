import * as Yup from "yup";

export const createPostSchema = Yup.object().shape({
  content: Yup.string()
    .required("Content is required")
    .min(1, "Content cannot be empty")
    .max(5000, "Content must not exceed 5000 characters")
    .test(
      "content-whitespace",
      "Content cannot be only whitespace",
      (value) => {
        return value ? value.trim().length > 0 : false;
      }
    ),

  post_image: Yup.mixed()
    .required("Image is required")
    .test("fileExists", "Please select an image", (value) => {
      return !!value;
    })
    .test("fileSize", "Image size must be less than 10MB", (value) => {
      if (!value) return false;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return value.size <= 10 * 1024 * 1024;
      }
      return false;
    })
    .test(
      "fileType",
      "Only image files are allowed (JPG, PNG, JPEG)",
      (value) => {
        if (!value) return false;
        if (typeof value === "string") return true;
        if (value instanceof File) {
          return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
        }
        return false;
      }
    ),

  comment: Yup.string()
    .max(2000, "Comment must not exceed 2000 characters")
    .nullable(),
});

export const updatePostSchema = Yup.object().shape({
  content: Yup.string()
    .min(1, "Content cannot be empty")
    .max(5000, "Content must not exceed 5000 characters")
    .required("Content is required"),

  post_image: Yup.mixed()
    .nullable()
    .test("fileSize", "Image size must be less than 10MB", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true; // URL
      if (value instanceof File) {
        return value.size <= 10 * 1024 * 1024; // 10MB
      }
      return true;
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true; // URL
      if (value instanceof File) {
        return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
      }
      return true;
    }),

  comment: Yup.string()
    .max(2000, "Comment must not exceed 2000 characters")
    .nullable(),
});

export const postCommentSchema = Yup.object().shape({
  comment: Yup.string()
    .required("Comment is required")
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment must not exceed 2000 characters")
    .trim(),
});
