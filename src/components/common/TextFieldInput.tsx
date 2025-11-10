"use client";
import { TextField, Skeleton, InputAdornment, IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FieldProps } from "formik";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface FieldInputProps extends FieldProps {
  label: string;
  type?: string;
  disabled: boolean;
}

const TextFieldInput: React.FC<FieldInputProps> = ({
  field,
  form,
  label,
  type = "text",
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === "password";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { name } = field;
  const { touched, errors, setFieldTouched } = form;

  const error = touched[name] && Boolean(errors[name]);
  const errorMessage =
    typeof errors[name] === "string" ? errors[name] : undefined;

  return mounted ? (
    <TextField
      disabled={disabled}
      fullWidth
      className="common-textfield-input"
      margin="normal"
      label={label}
      {...field}
      onBlur={() => setFieldTouched(name, true)}
      // 👇 Toggle between text/password dynamically
      type={isPasswordType && showPassword ? "text" : type}
      error={error}
      helperText={error ? errorMessage : ""}
      sx={{
        paddingLeft: "0px",
        ".MuiFormLabel-root:not(.MuiInputLabel-shrink)": { lineHeight: 1 },
        ".MuiInputBase-input": { padding: "12.5px 12px" },
        ".MuiOutlinedInput-root": {
          minHeight: "48px",
          display: "flex",
          alignItems: "center",
        },
      }}
      InputProps={{
        endAdornment: isPasswordType && (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShowPassword((prev) => !prev)}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  ) : (
    <Skeleton variant="rectangular" height={56} sx={{ marginBlock: 1 }} />
  );
};

export default TextFieldInput;
