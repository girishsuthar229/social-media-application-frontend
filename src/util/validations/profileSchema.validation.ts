import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
  user_name: Yup.string()
    .required("Username is required")
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must not exceed 30 characters")
    .matches(
      /^[a-zA-Z0-9_]+$/,
      "Username can only contain letters, numbers, and underscores"
    ),

  first_name: Yup.string()
    // .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "First name can only contain letters")
    .nullable(),
  last_name: Yup.string()
    // .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .matches(/^[a-zA-Z\s]+$/, "Last name can only contain letters")
    .nullable(),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .max(100, "Email must not exceed 100 characters"),

  bio: Yup.string().max(500, "Bio must not exceed 500 characters").nullable(),

  mobile_number: Yup.string()
    .matches(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/,
      "Invalid mobile number format"
    )
    .min(10, "Mobile number must be at least 10 digits")
    .max(15, "Mobile number must not exceed 15 digits")
    .nullable(),

  birth_date: Yup.date()
    .nullable()
    .max(new Date(), "Birth date cannot be in the future")
    .test("age", "You must be at least 13 years old", function (value) {
      if (!value) return true; // Allow empty values
      const cutoff = new Date();
      cutoff.setFullYear(cutoff.getFullYear() - 13);
      return value <= cutoff;
    }),

  address: Yup.string()
    .max(200, "Address must not exceed 200 characters")
    .nullable(),

  is_private: Yup.boolean().nullable(),

  user_image: Yup.mixed()
    .nullable()
    .test("fileSize", "Image size should be less than 5MB", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    })
    .test("fileType", "Please select a valid image file", (value) => {
      if (!value) return true;
      if (typeof value === "string") return true;
      if (value instanceof File) {
        return ["image/jpeg", "image/jpg", "image/png"].includes(value.type);
      }
      return true;
    }),
});

// Optional: Validation schema for profile picture only
export const profilePictureSchema = Yup.object().shape({
  user_image: Yup.mixed()
    .required("Profile picture is required")
    .test("fileSize", "File size is too large (max 5MB)", (value) => {
      if (value instanceof File) {
        return value.size <= 5 * 1024 * 1024;
      }
      return true;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (value instanceof File) {
        return [
          "image/jpeg",
          "image/jpg",
          "image/png",
          "image/gif",
          "image/webp",
        ].includes(value.type);
      }
      return true;
    }),
});

// Optional: Validation for password change
export const passwordChangeSchema = Yup.object().shape({
  current_password: Yup.string()
    .required("Current password is required")
    .min(8, "Password must be at least 8 characters"),

  new_password: Yup.string()
    .required("New password is required")
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must not exceed 100 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    )
    .notOneOf(
      [Yup.ref("current_password")],
      "New password must be different from current password"
    ),

  confirm_password: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("new_password")], "Passwords must match"),
});
