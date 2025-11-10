import * as Yup from "yup";
import { Common } from "../constanst";

export const signUpSchema = Yup.object({
  user_name: Yup.string()
    .required("Username is required")
    .matches(
      Common.RegularExpression.UsernameRegex,
      "Username must contain at least one number and only letters and numbers, no spaces"
    ),
  email: Yup.string()
    .email("Invalid email")
    .max(50, "Email must be at most 50 characters")
    .matches(Common.RegularExpression.EmailRegularExp, "Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 characters")
    .required("Password is required")
    .matches(
      Common.RegularExpression.PasswordRegularExp,
      "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
});

export const signInSchema = Yup.object({
  user_name: Yup.string()
    .required("Username is required")
    .matches(
      Common.RegularExpression.UsernameRegex,
      "Username must contain at least one number and only letters and numbers, no spaces"
    ),
  password: Yup.string()
    .required("Password is required")
    .matches(
      Common.RegularExpression.PasswordRegularExp,
      "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email")
    .max(50, "Email must be at most 50 characters")
    .matches(Common.RegularExpression.EmailRegularExp, "Invalid email")
    .required("Email is required"),
});

export const updatePasswordSchema = Yup.object({
  newPassword: Yup.string()
    .min(6)
    .required("New password is required")
    .matches(
      Common.RegularExpression.PasswordRegularExp,
      "Password must be at least 8 characters long and include 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character"
    ),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});

// export const otpVerification = Yup.object({
//   otp: Yup.string()
//     .length(6, "OTP must be exactly 6 digits.")
//     // .matches(/^\d{6}$/, "OTP must be exactly 6 digits")
//     .matches(/^[0-9]+$/, "OTP must only contain digits.")
//     .required("OTP is required."),
// });
