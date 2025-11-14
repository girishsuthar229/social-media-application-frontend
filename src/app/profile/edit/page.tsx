"use client";
import { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import {
  Typography,
  Box,
  Avatar,
  Switch,
  FormControlLabel,
} from "@mui/material";
import { Camera } from "@mui/icons-material";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import { updateProfileData, userDetail } from "@/services/user-service.service";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import TextFieldInput from "@/components/common/TextFieldInput";
import AppButton from "@/components/common/AppButton";
import { profileSchema } from "@/util/validations/profileSchema.validation";
import BackButton from "@/components/common/BackButton";
import { useRouter } from "next/navigation";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import moment from "moment";
import { regionDateAndTime } from "@/util/helper";
import dayjs, { Dayjs } from "dayjs";
import MuiDatePicker from "@/components/common/DatePicker/page";
import Textarea from "@/components/common/Textarea";

export interface EidtUserProfileData {
  id: number | null;
  user_name: string;
  first_name: string;
  last_name: string;
  email: string;
  bio: string;
  mobile_number: string;
  user_image: File | string | null;
  birth_date: string | null;
  role_id: number | null;
  address?: string | null;
  is_private?: boolean;
}

const ProfileEditMode = () => {
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();
  const { currentUser, handlerUserDetailApi } = UseUserContext();
  const [imagePreview, setImagePreview] = useState<string>("");
  const [initialValues, setInitialValues] = useState<EidtUserProfileData>({
    id: null,
    user_name: "",
    first_name: "",
    last_name: "",
    email: "",
    bio: "",
    mobile_number: "",
    user_image: null,
    birth_date: "",
    role_id: null,
    address: null,
    is_private: false,
  });

  useEffect(() => {
    if (currentUser) {
      setInitialValues({
        id: currentUser?.id || null,
        user_name: currentUser.user_name || "",
        first_name: currentUser.first_name || "",
        last_name: currentUser.last_name || "",
        email: currentUser.email || "",
        bio: currentUser.bio || "",
        mobile_number: currentUser.mobile_number || "",
        user_image: currentUser.photo_url || null,
        birth_date: currentUser.birth_date
          ? moment(currentUser.birth_date).format(
              regionDateAndTime().DATE_FORMAT
            )
          : null,
        role_id: currentUser.role_id || null,
        address: currentUser?.address || null,
        is_private: currentUser?.is_private || false,
      });
      setImagePreview(`${commonFilePath}${currentUser?.photo_url}` || "");
      setEditMode(true);
    }
  }, [currentUser]);

  const handleSubmit = async (values: EidtUserProfileData) => {
    const formData = new FormData();
    Object.keys(values).forEach((key) => {
      const value = values[key as keyof EidtUserProfileData];
      if (value !== null && value !== undefined) {
        if (key === "user_image") {
          if (value instanceof File) {
            formData.append(key, value);
          }
          return;
        } else {
          formData.append(key, String(value));
        }
      }
    });

    try {
      const response = await updateProfileData(formData);
      if (response?.statusCode === STATUS_CODES.success) {
        setEditMode(false);
        router.push("/profile");
        handlerUserDetailApi();
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message || "Failed to update profile");
    }
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: any
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFieldValue("user_image", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <Box className="profile-page scrollbar">
      <Box className="profile-card scrollbar">
        <div className="decorCircleTop" />
        {/* Header */}
        <Box className="profile-header">
          <BackButton labelText="Back" onClick={() => router.back()} />
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={profileSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({
            isSubmitting,
            setFieldValue,
            setFieldTouched,
            handleBlur,
            errors,
            touched,
            values,
          }) => (
            <Form className="profile-form">
              {/* Avatar Section */}
              <Box className="avatar-section">
                <Box className="avatar-wrapper">
                  <Avatar
                    src={imagePreview}
                    alt={values.user_name}
                    className="edit-profile-avatar"
                  />

                  <label htmlFor="user_image" className="avatar-overlay">
                    <Camera />
                    <input
                      id="user_image"
                      name="user_image"
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      onChange={(e) => handleImageChange(e, setFieldValue)}
                      style={{ display: "none" }}
                    />
                  </label>
                </Box>
                {editMode && (
                  <Typography variant="caption" className="avatar-hint">
                    Click to change profile picture
                  </Typography>
                )}
                {Boolean(errors.user_image) && (
                  <Typography variant="caption" color="error">
                    {errors.user_image}
                  </Typography>
                )}
              </Box>

              {/* Form Fields */}
              <Box className="form-grid">
                {/* Username */}
                <Box className="form-field">
                  <Field
                    name="user_name"
                    label="Username"
                    component={TextFieldInput}
                    disabled={true}
                    fullWidth
                  />
                </Box>

                {/* First Name */}
                <Box className="form-field">
                  <Field
                    name="first_name"
                    label="First Name"
                    component={TextFieldInput}
                    disabled={!editMode}
                    fullWidth
                  />
                </Box>

                {/* Last Name */}
                <Box className="form-field">
                  <Field
                    name="last_name"
                    label="Last Name"
                    component={TextFieldInput}
                    disabled={!editMode}
                    fullWidth
                  />
                </Box>

                {/* Email */}
                <Box className="form-field">
                  <Field
                    name="email"
                    label="Email"
                    type="email"
                    component={TextFieldInput}
                    disabled={!editMode}
                    fullWidth
                  />
                </Box>

                {/* Mobile Number */}
                <Box className="form-field">
                  <Field
                    name="mobile_number"
                    label="Mobile Number"
                    component={TextFieldInput}
                    disabled={!editMode}
                    fullWidth
                  />
                </Box>

                {/* Birth Date */}
                <Box className="form-field">
                  <Field
                    name="birth_date"
                    label="Birth Date"
                    id="birth_date"
                    variant="outlined"
                    value={
                      values?.birth_date ? dayjs(values?.birth_date) : null
                    }
                    onChange={(value: Dayjs | null) => {
                      setFieldValue("birth_date", value ? value : null);
                    }}
                    onBlur={() => setFieldTouched("birth_date", true)}
                    dateFormat={regionDateAndTime()?.DATE_FORMAT}
                    component={MuiDatePicker}
                    disableFuture
                    error={touched.birth_date && Boolean(errors.birth_date)}
                    helperText={touched.birth_date && errors.birth_date}
                    required
                  />
                </Box>

                {/* Bio */}
                <Box className="form-field full-width">
                  <Field
                    name="bio"
                    label="Bio"
                    component={TextFieldInput}
                    disabled={!editMode}
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Box>

                {/* Address */}
                <Box className="form-field full-width">
                  <Textarea
                    placeholder="Address"
                    name="address"
                    id="address"
                    value={values?.address ? values?.address : undefined}
                    disabled={!editMode}
                    onChange={(e) => setFieldValue("address", e.target.value)}
                    onBlur={handleBlur}
                    maxLength={300}
                    rows={3}
                  />
                </Box>

                {/* Private Account Toggle */}
                <Box className="form-field full-width">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={values?.is_private}
                        onChange={(e) =>
                          setFieldValue("is_private", e.target.checked)
                        }
                        disabled={!editMode}
                        className="switch-button"
                      />
                    }
                    label="Private Account"
                    className="switch-label"
                  />
                </Box>
              </Box>

              {editMode && (
                <Box className="button-group">
                  <Box>
                    <AppButton
                      type="submit"
                      label={isSubmitting ? "Saving..." : "Save Changes"}
                      variant="contained"
                      disabled={isSubmitting}
                      showSpinner={isSubmitting}
                      textTransformNone
                    />
                  </Box>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

export default ProfileEditMode;
