"use client";

import React from "react";
import { Button, CircularProgress, Tooltip } from "@mui/material";

interface AppButtonProps {
  label: string;
  variant?: "contained" | "outlined";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  tooltip?: string;
  disabled?: boolean;
  showSpinner?: boolean;
  fullWidth?: boolean;
  className?: string;
  textTransformNone?: boolean;
}

const AppButton: React.FC<AppButtonProps> = ({
  label,
  variant,
  onClick,
  type,
  tooltip,
  disabled,
  showSpinner,
  fullWidth = true,
  className,
  textTransformNone,
}) => {
  const btn = (
    <Button
      fullWidth={fullWidth}
      type={type}
      variant={variant}
      onClick={onClick}
      disabled={disabled}
      className={`app-btn ${variant}-btn ${className || ""} ${
        textTransformNone ? "text-transform-none" : ""
      }`}
    >
      {showSpinner && (
        <CircularProgress
          size={20}
          className="circular-progress"
          thickness={5}
        />
      )}
      {label}
    </Button>
  );

  return tooltip ? <Tooltip title={tooltip}>{btn}</Tooltip> : btn;
};

export default AppButton;
