"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Tooltip,
  Typography,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { Form, Formik } from "formik";
import { chatMessageSchema } from "@/util/validations/postSchema.validation";
import {
  Info,
  Loader,
  SendHorizonal,
  Paperclip,
  Camera,
  MapPin,
  X,
} from "lucide-react";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";
import {
  commonFilePath,
  MESSAGE_SENT_STATUS,
  STATUS_CODES,
  STATUS_ERROR,
} from "@/util/constanst";
import { toast } from "@/util/reactToastify";
import { IApiError } from "@/models/common.interface";
import { getAnotherUserProfile } from "@/services/user-service.service";
import { IAnotherUserResponse } from "@/models/userInterface";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import BackButton from "@/components/common/BackButton";
import useSocket from "@/util/socket";
import {
  getAllMessages,
  userSendMessageServices,
  editMessageService,
  deleteMessageService,
} from "@/services/message-services.service";
import { IUserMessage } from "@/models/messageInterface";
import { getRelativeTime } from "@/util/helper";
import MessageSkeleton from "@/components/common/Skeleton/messageSkeleton";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useChatMessagesHook } from "../useChatMessagesHook";
import ConfirmationDialog from "@/components/common/ConfirmationModal/confirmationModal";
import { BorderColorOutlined, DeleteOutlineRounded } from "@mui/icons-material";

const ChatView: React.FC = () => {
  const { currentUser } = UseUserContext();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || null;
  const [selectedUser, setSelectedUser] = useState<IAnotherUserResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    name: string;
  } | null>(null);
  const [editingMessage, setEditingMessage] = useState<IUserMessage | null>(
    null
  );
  const [menuAnchor, setMenuAnchor] = useState<{
    element: HTMLElement;
    message: IUserMessage;
  } | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [activeMessage, setActiveMessage] = useState<any>(null);
  const handleTooltipToggle = () => {
    setTooltipOpen(!tooltipOpen);
  };
  const socket = useSocket(currentUser?.id.toString());
  const {
    messages,
    setMessages,
    typingUser,
    handleSendMsg,
    handleEditMessage,
    handleDeleteMessage,
    handleTyping,
    handleReadMessage,
  } = useChatMessagesHook({
    currentUserId: currentUser?.id,
    selectedUserId: selectedUser?.id,
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation({
              latitude,
              longitude,
              name: data.display_name || "Unknown location",
            });
            toast.success("Location captured successfully");
          } catch (error) {
            setLocation({
              latitude,
              longitude,
              name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            });
          }
        },
        (error) => {
          toast.error("Failed to get location: " + error.message);
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleSendMessage = async (
    values: { inputMessage: string },
    { resetForm }: any
  ) => {
    if (
      !selectedUser ||
      !socket ||
      (!values.inputMessage.trim() && !selectedFile && !location)
    ) {
      return;
    }
    try {
      const fileType = selectedFile
        ? selectedFile.type.startsWith("image/")
          ? "image"
          : selectedFile.type.startsWith("video/")
          ? "video"
          : selectedFile.type.startsWith("audio/")
          ? "audio"
          : "document"
        : undefined;

      const payload = {
        sender_id: currentUser?.id.toString() || "",
        receiver_id: selectedUser?.id.toString() || "",
        message: values?.inputMessage || "",
        file: selectedFile || undefined,
        file_type: fileType,
        latitude: location?.latitude,
        longitude: location?.longitude,
        location_name: location?.name,
      };

      const response = await userSendMessageServices(payload);
      if (response?.statusCode === STATUS_CODES.success && response.data) {
        const data: IUserMessage = response.data;
        setMessages((prevMessages) => [...prevMessages, data]);
        handleSendMsg(data);
        handleTyping("", selectedUser?.user_name);
        resetForm();
        handleRemoveFile();
        setLocation(null);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const handleEditClick = (message: IUserMessage) => {
    setEditingMessage(message);
    setMenuAnchor(null);
  };

  const handleSaveEdit = async (newMessage: string) => {
    if (!editingMessage || !newMessage.trim()) return;

    try {
      const response = await editMessageService(editingMessage.id, newMessage);

      if (response?.statusCode === STATUS_CODES.success) {
        handleEditMessage(editingMessage.id, newMessage);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage.id
              ? { ...msg, message: newMessage, is_edited: true }
              : msg
          )
        );
        setEditingMessage(null);
        toast.success("Message updated successfully");
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const handleDeleteClick = (messageId: number) => {
    setMessageToDelete(messageId);
    setDeleteDialogOpen(true);
    setMenuAnchor(null);
  };

  const confirmDelete = async () => {
    if (!messageToDelete) return;

    try {
      const response = await deleteMessageService({
        message_id: messageToDelete,
      });

      if (response?.statusCode === STATUS_CODES.success) {
        handleDeleteMessage(messageToDelete);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageToDelete ? { ...msg, is_deleted: true } : msg
          )
        );
        toast.success("Message deleted successfully");
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    } finally {
      setDeleteDialogOpen(false);
      setMessageToDelete(null);
    }
  };

  const loadMessages = async (selectedUserId: number) => {
    try {
      setLoading(true);
      const res = await getAllMessages(selectedUserId);
      setMessages(res.data || []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const fetchProfile = async (username: string) => {
    try {
      const res = await getAnotherUserProfile(username);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        setSelectedUser(res.data || []);
        loadMessages(res?.data?.id);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
      if (
        err.error == STATUS_ERROR.UserNotFound &&
        err.statusCode == STATUS_CODES.notFound
      ) {
        router.push(`/chats`);
      }
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/user-name?username=${username}`);
  };

  useEffect(() => {
    if (username) {
      fetchProfile(username?.toString());
    } else {
      router.push(`/chats`);
    }
  }, [username]);

  const messagesAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
      handleReadMessage();
    }
  }, [messages]);

  const hasContent = (values: { inputMessage: string }) => {
    return (
      values.inputMessage.trim().length > 0 ||
      selectedFile !== null ||
      location !== null
    );
  };

  return (
    <div className="app-wrapper">
      <div className="chat-container">
        <Box className="chat-header view-chat">
          <BackButton
            onClick={() => router.push(`/chats`)}
            showIcon={true}
            underlineOnHover={false}
            className="message-back-button"
          />

          <Box className="user-all-section">
            <Box
              className="user-info-section"
              onClick={() => handleUserClick(selectedUser?.user_name || "")}
            >
              <Avatar
                src={
                  selectedUser?.photo_url
                    ? `${commonFilePath}${selectedUser.photo_url}`
                    : undefined
                }
                className="user-avatar"
              />
              <Box className="user-details">
                <Box display={"flex"} flexDirection={"column"}>
                  <Typography className="user-username" component="h3">
                    {selectedUser?.user_name}
                  </Typography>
                  {selectedUser?.first_name && (
                    <Typography className="user-display-name" variant="body2">
                      {selectedUser?.first_name + " " + selectedUser?.last_name}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        <div className="messages-area scrollbar" ref={messagesAreaRef}>
          {!loading && (
            <>
              {messages?.map((msg: IUserMessage) => (
                <div
                  key={msg.id}
                  className={`message-wrapper ${
                    msg.sender.id === currentUser?.id ? "me" : "them"
                  }`}
                >
                  {msg.deleted_date ? (
                    <div className="message deleted">
                      <p
                        className="message-text"
                        style={{ fontStyle: "italic", opacity: 0.6 }}
                      >
                        This message was deleted
                      </p>
                    </div>
                  ) : (
                    <div
                      className={`message ${
                        msg.sender.id === currentUser?.id ? "me" : "them"
                      }`}
                    >
                      {/* ⬇ Arrow shown on hover */}
                      {msg.sender.id === currentUser?.id && (
                        <span
                          className="message-menu-arrow"
                          onClick={(e) => {
                            e.stopPropagation();
                            setMenuAnchor({
                              element: e.currentTarget,
                              message: msg,
                            });
                          }}
                        >
                          <KeyboardArrowDownRoundedIcon />
                        </span>
                      )}

                      <div>
                        {/* Attachments */}
                        {msg.file_url && (
                          <div className="message-attachment">
                            {msg.file_type === "image" ? (
                              <img
                                src={`${commonFilePath}${msg.file_url}`}
                                alt="attachment"
                                style={{
                                  maxWidth: "300px",
                                  borderRadius: "8px",
                                }}
                              />
                            ) : (
                              <a
                                href={`${commonFilePath}${msg.file_url}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                📎 {msg.file_name}
                              </a>
                            )}
                          </div>
                        )}

                        {/* Location */}
                        {msg.latitude && msg.longitude && (
                          <div className="message-location">
                            <MapPin size={16} />
                            <a
                              href={`https://www.google.com/maps?q=${msg.latitude},${msg.longitude}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {msg.location_name || "View location"}
                            </a>
                          </div>
                        )}
                        {/* Message text */}
                        <p className="message-text">{msg.message}</p>

                        {/* Time + Edited label + Status */}
                        <span className="message-time-and-status">
                          <span className="message-time">
                            {getRelativeTime(msg.created_date)}
                          </span>

                          {msg.is_edited && (
                            <span className="edited-label">edited</span>
                          )}

                          {msg.sender.id === currentUser?.id &&
                            (msg.is_read &&
                            msg.status === MESSAGE_SENT_STATUS.SEEN ? (
                              <DoneAllIcon className="seen-msg-icon" />
                            ) : (
                              <DoneIcon className="sent-msg-icon" />
                            ))}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="message-wrapper typing-indicator-main ">
                {typingUser && typingUser?.is_typing && (
                  <p className="typing-indicator">
                    <span className="dot" />
                    <span className="dot" />
                    <span className="dot" />
                  </p>
                )}
              </div>
            </>
          )}
          {loading && (
            <MessageSkeleton count={4} showMessage={true} showTime={true} />
          )}
        </div>

        {/* File/Location Preview */}
        {(filePreview || location) && (
          <Box
            sx={{
              padding: "8px 16px",
              borderTop: "1px solid #e0e0e0",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {filePreview && (
              <Box sx={{ position: "relative", display: "inline-block" }}>
                <img
                  src={filePreview}
                  alt="preview"
                  style={{
                    maxHeight: "60px",
                    maxWidth: "60px",
                    borderRadius: "4px",
                  }}
                />
                <IconButton
                  size="small"
                  onClick={handleRemoveFile}
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: -8,
                    backgroundColor: "white",
                  }}
                >
                  <X size={16} />
                </IconButton>
              </Box>
            )}
            {location && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  padding: "4px 8px",
                  backgroundColor: "#f0f0f0",
                  borderRadius: "4px",
                }}
              >
                <MapPin size={16} />
                <Typography variant="caption">{location.name}</Typography>
                <IconButton size="small" onClick={() => setLocation(null)}>
                  <X size={16} />
                </IconButton>
              </Box>
            )}
          </Box>
        )}

        {/* Message Input */}
        <Formik
          initialValues={{ inputMessage: editingMessage?.message || "" }}
          validationSchema={chatMessageSchema}
          onSubmit={
            editingMessage
              ? (values) => handleSaveEdit(values.inputMessage)
              : handleSendMessage
          }
          enableReinitialize
        >
          {({
            isSubmitting,
            values,
            handleChange,
            touched,
            errors,
            isValid,
          }) => (
            <Form className="comment-input-container">
              <input
                ref={fileInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                accept="image/*,video/*,.pdf,.doc,.docx"
              />
              <input
                ref={cameraInputRef}
                type="file"
                style={{ display: "none" }}
                onChange={handleFileSelect}
                accept="image/*"
                capture="environment"
              />

              <TextField
                name="inputMessage"
                fullWidth
                variant="outlined"
                placeholder={
                  editingMessage ? "Edit message..." : "Write a message..."
                }
                size="small"
                value={values.inputMessage}
                onChange={(e) => {
                  handleChange(e);
                  if (!editingMessage) {
                    handleTyping(e.target.value, selectedUser?.user_name);
                  }
                }}
                error={touched.inputMessage && Boolean(errors.inputMessage)}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        {touched.inputMessage && errors.inputMessage ? (
                          <Tooltip
                            title={errors.inputMessage}
                            open={tooltipOpen}
                            onClick={handleTooltipToggle}
                            onMouseEnter={handleTooltipToggle}
                          >
                            <Info size={18} color="#f44336" />
                          </Tooltip>
                        ) : null}
                        {!editingMessage && !hasContent(values) && (
                          <Box className="icon-btn-box">
                            <IconButton
                              size="small"
                              onClick={() => fileInputRef.current?.click()}
                              className="icon-btn"
                            >
                              <Paperclip size={20} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => cameraInputRef.current?.click()}
                              className="icon-btn"
                            >
                              <Camera size={20} />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={handleGetLocation}
                              className="icon-btn"
                            >
                              <MapPin size={20} />
                            </IconButton>
                          </Box>
                        )}
                      </InputAdornment>
                    ),
                  },
                }}
                className="comment-input common-textfield-input"
              />

              {editingMessage && (
                <IconButton
                  size="small"
                  onClick={() => setEditingMessage(null)}
                  className="drawer-close-btn"
                >
                  <X size={20} />
                </IconButton>
              )}

              {hasContent(values) && (
                <IconButton
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="send-btn"
                >
                  {isSubmitting ? (
                    <Loader size={20} className="loading-spinner" />
                  ) : (
                    <SendHorizonal size={20} />
                  )}
                </IconButton>
              )}
            </Form>
          )}
        </Formik>

        {/* Message Menu */}
        <Menu
          anchorEl={menuAnchor?.element}
          open={Boolean(menuAnchor)}
          onClose={() => setMenuAnchor(null)}
        >
          <MenuItem
            key="edit"
            className="post-menu-item"
            onClick={() => menuAnchor && handleEditClick(menuAnchor.message)}
          >
            <BorderColorOutlined fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem
            key="delete"
            className="post-menu-item"
            onClick={() =>
              menuAnchor && handleDeleteClick(menuAnchor.message.id)
            }
          >
            <DeleteOutlineRounded fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        {/* Delete Confirmation Dialog */}
        {deleteDialogOpen && (
          <ConfirmationDialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            title="Delete Message"
            content={"Are you sure you want to delete this message?"}
            denyButton={{
              buttonText: "Cancel",
              onClick: () => {
                setDeleteDialogOpen(false);
              },
            }}
            confirmButton={{
              buttonText: "Delete",
              onClick: () => {
                confirmDelete;
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default ChatView;
