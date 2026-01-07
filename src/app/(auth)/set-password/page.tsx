"use client";
import { Formik, Form, Field } from "formik";
import { Box, Typography } from "@mui/material";
import Image from "next/image";
import images from "@/assets";
import { updatePasswordSchema } from "@/util/validations/loginSchemas.validation";
import TextFieldInput from "@/components/common/TextFieldInput";
import AppButton from "@/components/common/AppButton";
import { useEffect, useRef, useState } from "react";
import {
  updatePasswordUser,
  validateSetPasswordTokenUser,
} from "@/services/auth-service.service";
import { useRouter, useSearchParams } from "next/navigation";
import { STATUS_CODES } from "@/util/constanst";
import { toast } from "@/util/reactToastify";
import { IApiError } from "@/models/common.interface";
import { IUpdatePasswordPayload } from "@/models/authInterface/setPassword";

interface SetPasswordValues {
  newPassword: string;
  confirmPassword: string;
}

type validatesetPswTokenRes = {
  setToken: string;
  email: string;
};

const SetPasswordForm = () => {
  const initialValues = { newPassword: "", confirmPassword: "" };
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const router = useRouter();
  const [validTokenRes, setValidTokenRes] = useState<validatesetPswTokenRes>();
  const hasValidatedRef = useRef(false);

  useEffect(() => {
    const validatesetPswToken = async () => {
      hasValidatedRef.current = true;
      try {
        const response = await validateSetPasswordTokenUser({
          token: tokenParam || "",
        });

        if (
          response?.statusCode === STATUS_CODES.success &&
          response?.data?.valid
        ) {
          setValidTokenRes({
            setToken: response?.data?.setToken,
            email: response?.data?.email,
          });
        }
      } catch (err) {
        const error = err as IApiError;
        toast.error(error?.message);
        router.replace("/sign-in");
      }
    };

    if (!hasValidatedRef.current) {
      validatesetPswToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenParam]);

  const handleSubmit = async (values: SetPasswordValues) => {
    if (!validTokenRes) return router.replace("/sign-in");
    const payload: IUpdatePasswordPayload = {
      setToken: validTokenRes.setToken,
      email: validTokenRes.email,
      new_password: values?.newPassword,
      confirm_password: values?.confirmPassword,
    };
    try {
      const response = await updatePasswordUser(payload);
      if (response?.statusCode === STATUS_CODES.success) {
        toast.success(response?.message);
        router.replace("/sign-in");
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
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
        <Typography className="typography-caption">Set New Password</Typography>

        {/* Set Password Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={updatePasswordSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <Field
                name="newPassword"
                label="password"
                type="password"
                component={TextFieldInput}
              />
              <Field
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                component={TextFieldInput}
              />
              <AppButton
                type="submit"
                label={isSubmitting ? "Saving..." : "Save Password"}
                variant="contained"
                disabled={isSubmitting}
              />
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default SetPasswordForm;
