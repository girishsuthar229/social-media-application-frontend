/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers";
import { useField, useFormikContext } from "formik";
import dayjs, { Dayjs } from "dayjs";

interface MuiDatePickerProps<> {
  name: string;
  id?: string;
  label: string;
  defaultValue?: Dayjs | null;
  onChange?: (value: Dayjs | null) => void;
  disabled?: boolean;
  width?: number | string;
  value?: Dayjs | null;
  dateFormat?: string;
  minDate?: Dayjs;
  withTime?: boolean;
  ampm?: boolean;
  disableFuture?: boolean;
  minSelectableDate?: Dayjs;
  maxSelectableDate?: Dayjs;
  error?: boolean;
  helperText?: string;
  required?: boolean;
}

export default function MuiDatePicker<FormValues = unknown>({
  name,
  id,
  label,
  defaultValue,
  onChange,
  disabled = false,
  value,
  dateFormat = "DD/MM/YYYY",
  minDate,
  withTime,
  ampm = false,
  disableFuture,
  minSelectableDate,
  maxSelectableDate,
  error: externalError,
  helperText: externalHelperText,
  required,
}: MuiDatePickerProps) {
  const formik = useFormikContext<FormValues>();
  const [field] = useField(name);

  const currentError = id && formik.errors ? (formik.errors as any)[id] : null;

  const currentTouched =
    id && formik.touched ? (formik.touched as any)[id] : false;

  const hasError =
    externalError !== undefined
      ? externalError
      : Boolean(currentTouched && currentError);

  const errorMessage =
    externalHelperText ||
    (currentTouched && currentError && typeof currentError === "string"
      ? currentError
      : "");

  let parsedValue = null;
  const currentValue = value !== undefined ? value : field.value;

  if (currentValue) {
    if (dayjs.isDayjs(currentValue)) {
      parsedValue = currentValue;
    } else if (dayjs(currentValue).isValid()) {
      parsedValue = dayjs(currentValue);
    }
  }

  const handleDateChange = (newValue: Dayjs | null) => {
    if (id) {
      formik.setFieldTouched(id, true);
    } else {
      formik.setFieldTouched(name, true);
    }

    if (onChange) {
      onChange(newValue);
    } else {
      if (newValue && dayjs(newValue).isValid()) {
        formik.setFieldValue(name, newValue.toISOString());
      } else {
        formik.setFieldValue(name, null);
      }
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {withTime ? (
        <DateTimePicker
          label={required ? `${label}*` : label}
          disabled={disabled}
          value={parsedValue}
          onChange={handleDateChange}
          format={dateFormat}
          defaultValue={defaultValue}
          ampm={ampm}
          disableFuture={disableFuture}
          minDateTime={minSelectableDate || minDate}
          maxDateTime={maxSelectableDate}
          slotProps={{
            textField: {
              fullWidth: true,
              error: hasError,
              helperText: errorMessage,
              className: "custom-date-picker",
            },
            popper: {
              className: "custom-date-picker-dialog",
            },
          }}
          sx={{
            paddingLeft: "0px",
            ".MuiFormLabel-root:not(.MuiInputLabel-shrink)": { lineHeight: 1 },
            ".MuiInputBase-input": { padding: "12.5px 12px" },
            ".MuiPickersOutlinedInput-root ": {
              height: "48px",
              minHeight: "48px",
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      ) : (
        <DatePicker
          label={label}
          disabled={disabled}
          value={parsedValue}
          onChange={handleDateChange}
          format={dateFormat}
          defaultValue={defaultValue}
          minDate={minSelectableDate || minDate}
          maxDate={maxSelectableDate}
          disableFuture={disableFuture}
          slotProps={{
            textField: {
              fullWidth: true,
              error: hasError,
              helperText: errorMessage,
              className: "custom-date-picker",
            },
            popper: {
              className: "custom-date-picker-dialog",
            },
          }}
          sx={{
            paddingLeft: "0px",
            ".MuiFormLabel-root:not(.MuiInputLabel-shrink)": { lineHeight: 1 },
            ".MuiInputBase-input": { padding: "12.5px 12px" },
            ".MuiPickersOutlinedInput-root ": {
              height: "48px",
              minHeight: "48px",
              display: "flex",
              alignItems: "center",
            },
          }}
        />
      )}
    </LocalizationProvider>
  );
}
