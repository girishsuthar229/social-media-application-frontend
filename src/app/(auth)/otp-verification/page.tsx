"use client";
import { Box, Typography, TextField, Grid, Skeleton } from "@mui/material";
import Image from "next/image";
import images from "@/assets";
import AppButton from "@/components/common/AppButton";
import { useEffect, useRef, useState } from "react";
import { Common, STATUS_CODES } from "@/util/constanst";
import { formatTimeMinAndSec } from "@/util/helper";
import Link from "next/link";
import { toast } from "@/util/reactToastify";
import {
  validateTokenUser,
  verifyOtpUser,
} from "@/services/auth-service.service";
import { IVerifyOtpPayload } from "@/models/authInterface/setPassword";
import { useRouter, useSearchParams } from "next/navigation";
import { IApiError } from "@/models/common.interface";
import { jwtDecode } from "jwt-decode";
import BackButton from "@/components/common/BackButton";

const OtpVerificationForm = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState<number>(0);
  const searchParams = useSearchParams();
  const tokenParam = searchParams.get("token");
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [timerError, setTimerError] = useState<string>("");
  const hasValidatedRef = useRef(false);
  useEffect(() => {
    const validateToken = async () => {
      hasValidatedRef.current = true;
      try {
        const response = await validateTokenUser({ token: tokenParam || "" });
        if (
          response?.statusCode === STATUS_CODES.success &&
          response?.data?.valid
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const decodedToken: any = jwtDecode(tokenParam || "");
          const exprTimeInSec = decodedToken.exp;
          const currentTimeInSec = Math.floor(Date.now() / 1000);
          const remainingTime = exprTimeInSec - currentTimeInSec;
          const remainingTimeInSeconds = Math.max(0, remainingTime);
          setTimer(remainingTimeInSeconds);
          setToken(tokenParam);
        }
      } catch (err) {
        const error = err as IApiError;
        toast.error(error?.message);
        router.replace("/sign-in");
      }
    };
    setMounted(true);
    if (!hasValidatedRef.current) {
      validateToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (timer === 0) return;
    const intervalId = setInterval(() => {
      setTimer((prevCountdown) => {
        if (prevCountdown <= 1) {
          setTimerError("Your OTP has expired. Please request a new one.");
          clearInterval(intervalId);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    const firstInput = document.getElementById("otp-input-0");
    if (firstInput) {
      (firstInput as HTMLInputElement).focus();
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value;
    const digitsRegExp = Common.RegularExpression.DigitsRegularExp;

    if (!digitsRegExp.test(value)) {
      return;
    }

    setError(null);
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);

    if (value && index < otp.length - 1) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace") {
      const updatedOtp = [...otp];
      if (otp[index] === "" && index > 0) {
        const prevInput = document.getElementById(`otp-input-${index - 1}`);
        updatedOtp[index - 1] = "";
        if (prevInput) (prevInput as HTMLInputElement).focus();
      } else {
        updatedOtp[index] = "";
      }
      setOtp(updatedOtp);

      const isAllEmpty = updatedOtp.every((digit) => digit === "");
      if (isAllEmpty) {
        setError("Please enter OTP");
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === otp.length) {
      const updatedOtp = pasteData.slice(0, otp.length).split("");
      setOtp(updatedOtp);
      setError(null);
      const lastInput = document.getElementById(`otp-input-${otp.length - 1}`);
      if (lastInput) (lastInput as HTMLInputElement).focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join("");

    if (enteredOtp.trim() === "" || enteredOtp == null) {
      setError("Please enter OTP");
      return;
    }
    if (enteredOtp.length < 6) {
      setError("OTP must be exactly 6 digits");
      return;
    }
    if (enteredOtp.length === 6) {
      const values: IVerifyOtpPayload = {
        token: token ? token : "",
        otp: enteredOtp,
      };
      try {
        setIsSubmitting(true);
        const response = await verifyOtpUser(values);
        if (
          response?.statusCode === STATUS_CODES.success &&
          response?.data?.verified === true
        ) {
          toast.success(response?.message || "OTP Verifiy successfully");
          router.replace(`/set-password?token=${response.data?.token}`);
          setError(null);
          setIsSubmitting(false);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
        setIsSubmitting(false);
      }
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
          Almost There! Enter the Code We’ve Sent You.
        </Typography>
        <Typography className="typography-caption-primary">
          Check your inbox and enter the code to proceed.
        </Typography>

        {/* Set Password Form */}
        <Box className="login-form">
          <Box className="login-form-nested-box">
            <Grid container spacing={2}>
              {otp.map((value, index) => (
                <Grid size={{ xs: 4, sm: 2 }} key={index}>
                  {mounted ? (
                    <TextField
                      id={`otp-input-${index}`}
                      value={value}
                      onChange={(e) =>
                        handleChange(
                          e as React.ChangeEvent<HTMLInputElement>,
                          index
                        )
                      }
                      onKeyDown={(e) =>
                        handleBackspace(
                          e as React.KeyboardEvent<HTMLInputElement>,
                          index
                        )
                      }
                      onPaste={handlePaste}
                      variant="outlined"
                      error={Boolean(error)}
                      slotProps={{
                        htmlInput: {
                          maxLength: 1,
                        },
                      }}
                      sx={{
                        width: "100%",
                        height: "100%",
                        "& input": {
                          textAlign: "center",
                        },
                        "& .MuiOutlinedInput-root": {
                          "&.Mui-focused fieldset": {
                            borderColor: "#f36527",
                          },
                          "&:hover:not(.Mui-error) fieldset": {
                            borderColor: "#f36527",
                          },
                        },
                      }}
                    />
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      height={56}
                      sx={{ marginBlock: 1 }}
                    />
                  )}
                </Grid>
              ))}
            </Grid>
          </Box>
          {error && (
            <Box sx={{ textAlign: "center" }}>
              <Typography variant="body2" color="error">
                {error}
              </Typography>
            </Box>
          )}

          <AppButton
            type="submit"
            onClick={handleSubmit}
            label={isSubmitting ? "Verifying..." : "Verify OTP"}
            variant="contained"
            disabled={isSubmitting}
            showSpinner={isSubmitting}
          />
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2" color={`${timerError ? "error" : ""}`}>
              {timerError ? (
                timerError
              ) : (
                <>
                  <span>Your OTP will expire in:</span>
                  <strong>{formatTimeMinAndSec(timer)}</strong>
                </>
              )}
            </Typography>
          </Box>
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Link href={"/sign-in"}>
              <BackButton navigateUrl="/sign-in" labelText=" Back to Login" />
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default OtpVerificationForm;
