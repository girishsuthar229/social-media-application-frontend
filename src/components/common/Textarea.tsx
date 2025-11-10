"use client";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

type TextareaProps = {
  id: string;
  maxLength?: number;
  rows?: number;
  name?: string;
  value?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  className?: string;
  placeholder?: string;
};

const Textarea = ({
  id,
  maxLength,
  rows,
  name,
  value,
  disabled,
  onChange,
  onBlur,
  className,
  placeholder,
}: TextareaProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const trimmed = e.target.value.trimStart(); // remove leading spaces
    const newEvent = {
      ...e,
      target: { ...e.target, value: trimmed, name: e.target.name },
    };
    onChange?.(newEvent as React.ChangeEvent<HTMLTextAreaElement>);
  };

  const handleTrimOnBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    const trimmed = e.target.value.trim(); // full trim on blur
    const newEvent = {
      ...e,
      target: { ...e.target, value: trimmed, name: e.target.name },
    };
    onBlur?.(newEvent as React.FocusEvent<HTMLTextAreaElement>);
  };

  return mounted ? (
    <textarea
      id={id}
      name={name}
      rows={rows}
      disabled={disabled}
      maxLength={maxLength}
      value={value ?? ""}
      onChange={handleChange}
      onBlur={handleTrimOnBlur}
      placeholder={placeholder}
      className={`common-content-textarea ${className || ""}`}
    />
  ) : (
    <Skeleton variant="rectangular" width="100%" height={100} />
  );
};

export default Textarea;
