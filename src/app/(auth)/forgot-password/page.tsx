"use client";
import { Formik, Form, Field } from "formik";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import { forgotPasswordSchema } from "@/util/validations/loginSchemas.validation";
import images from "@/assets";
import TextFieldInput from "@/components/common/TextFieldInput";
import AppButton from "@/components/common/AppButton";
import BackButton from "@/components/common/BackButton";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import { STATUS_CODES } from "@/util/constanst";
import { forgotPasswordUser } from "@/services/auth-service.service";
import { useRouter } from "next/navigation";

const ForgotPasswordForm = () => {
  const router = useRouter();
  const handleSubmit = async (values: { email: string }) => {
    try {
      const response = await forgotPasswordUser(values);
      if (
        response?.statusCode === STATUS_CODES.success &&
        response.data?.token
      ) {
        toast.success(response?.message);
        router.replace(`/otp-verification?token=${response.data?.token}`);
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

        {/* Welcome Messages */}
        <Typography className="typography-caption">
          Lost Access? Let’s Get You Back On Track.
        </Typography>
        <Typography className="typography-caption-primary">
          Enter your email below to reset your password.
        </Typography>

        <Box className="login-back-btn-div">
          <BackButton navigateUrl="/sign-in" labelText="Back" />
        </Box>

        {/* Forgot Password Form */}
        <Formik
          initialValues={{ email: "" }}
          validationSchema={forgotPasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <Field
                name="email"
                label="Email"
                component={TextFieldInput}
                fullWidth
              />
              <AppButton
                type="submit"
                label={isSubmitting ? "Sending..." : "Send OTP"}
                variant="contained"
                disabled={isSubmitting}
                showSpinner={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ForgotPasswordForm;
