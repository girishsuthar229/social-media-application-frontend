"use client";
import { Formik, Form, Field } from "formik";
import { Typography, Box } from "@mui/material";
import Image from "next/image";
import images from "@/assets";
import TextFieldInput from "@/components/common/TextFieldInput";
import AppButton from "@/components/common/AppButton";
import { signUpSchema } from "@/util/validations/loginSchemas.validation";
import AuthToggle from "@/components/common/singAuthToggle";
import { ISingUpPayload } from "@/models/authInterface/singup";
import { signUpUser } from "@/services/auth-service.service";
import { STATUS_CODES } from "@/util/constanst";
import { toast } from "@/util/reactToastify";
import { IApiError } from "@/models/common.interface";
import { useRouter } from "next/navigation";

const SignUp = () => {
  const initialValues = { user_name: "", email: "", password: "" };
  const router = useRouter();

  const handleSubmit = async (values: ISingUpPayload) => {
    try {
      const response = await signUpUser(values);
      if (response?.statusCode === STATUS_CODES.success) {
        toast.success(response?.message);
        router.replace("/sign-in");
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
          Create Your Account in Few Steps.
        </Typography>
        <Typography className="typography-caption-primary">
          Fill out the form and join our community today!
        </Typography>

        {/* Create Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={signUpSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <Field
                name="user_name"
                id="user_name"
                label="Username"
                component={TextFieldInput}
              />

              <Field name="email" label="Email" component={TextFieldInput} />

              <Field
                name="password"
                id="password"
                label="Password"
                type="password"
                component={TextFieldInput}
              />

              <AppButton
                type="submit"
                label={isSubmitting ? "Sign Up..." : "Sign Up"}
                variant="outlined"
                disabled={isSubmitting}
                showSpinner={isSubmitting ? true : undefined}
              />
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SignUp;
