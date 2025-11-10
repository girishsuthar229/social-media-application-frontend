"use client";
import { Formik, Form, Field } from "formik";
import { Typography, Box } from "@mui/material";
import { signInSchema } from "@/util/validations/loginSchemas.validation";
import Image from "next/image";
import images from "@/assets";
import Link from "next/link";
import TextFieldInput from "@/components/common/TextFieldInput";
import AppButton from "@/components/common/AppButton";
import AuthToggle from "@/components/common/singAuthToggle";
import { toast } from "react-toastify";
import { ILoginPayload } from "@/models/authInterface/login";
import { localStorageKeys, STATUS_CODES } from "@/util/constanst";
import { IApiError } from "@/models/common.interface";
import { loginUser } from "@/services/auth-service.service";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SignIn = () => {
  const router = useRouter();
  const initialValues = { user_name: "", password: "" };

  const handleSubmit = async (values: ILoginPayload) => {
    try {
      const response = await loginUser(values);

      if (
        response?.statusCode === STATUS_CODES.success &&
        response.data?.accessToken
      ) {
        localStorage.setItem(
          localStorageKeys.ACCESS_TOKEN,
          response.data?.accessToken
        );
        localStorage.setItem(
          localStorageKeys.TOKEN_EXPIRES_AT,
          response.data?.tokenExpiresIn.toString()
        );
        toast.success(response?.message);
        router.push("/home");
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message || "Something went wrong.");
    }
  };

  return (
    <Box className="login-page">
      <Box className="login-card">
        <div className="decorCircleTop" />
        <div className="decorCircleBottom" />
        {/* Logo Section */}
        <Box className="logo-with-text">
          <Image
            width={80}
            height={80}
            src={images.icLogo}
            alt="Logo"
            className="img-fluid"
            priority
          />
          <Typography
            variant="subtitle1"
            align="left"
            paddingInlineEnd={"1rem"}
            gutterBottom
            className="app-title"
          >
            Linking You to the World
          </Typography>
        </Box>

        {/* Auth Toggle */}
        <AuthToggle />

        {/* Welcome Messages */}
        <Typography className="typography-caption">
          Welcome Back! Let's Get You Signed In.
        </Typography>
        <Typography className="typography-caption-primary">
          Sign in with your credentials to continue.
        </Typography>

        {/* Login Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={signInSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <Field
                name="user_name"
                id="user_name"
                label="Username"
                component={TextFieldInput}
                disabled={isSubmitting}
              />

              <Field
                name="password"
                id="password"
                label="Password"
                type="password"
                component={TextFieldInput}
                disabled={isSubmitting}
              />

              <div className="forgot-link-div">
                <Link href={"/forgot-password"} className="as-link-styling">
                  Forgot Password?
                </Link>
              </div>

              <AppButton
                type="submit"
                label={isSubmitting ? "Signing In..." : "Sign In"}
                variant="contained"
                disabled={isSubmitting}
                showSpinner={isSubmitting ? true : undefined}
                fullWidth
              />
              <Typography
                variant="body2"
                sx={{ marginTop: "25px", textAlign: "center" }}
              >
                Don't have an account?{" "}
                <Link href="/sign-up" className="as-link-styling">
                  Create Account
                </Link>
              </Typography>
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignIn;
