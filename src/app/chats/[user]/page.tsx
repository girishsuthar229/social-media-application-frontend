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
} from "@mui/material";
import { Form, Formik } from "formik";
import { chatMessageSchema } from "@/util/validations/postSchema.validation";
import { Info, Loader, SendHorizonal } from "lucide-react";
import { commonFilePath, STATUS_CODES, STATUS_ERROR } from "@/util/constanst";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import { getAnotherUserProfile } from "@/services/user-service.service";
import { IAnotherUserResponse } from "@/models/userInterface";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import BackButton from "@/components/common/BackButton";
import useSocket from "@/util/socket";
import {
  getAllMessages,
  userSendMessageServices,
} from "@/services/message-services.service";
import { IUserMessage } from "@/models/messageInterface";
import { getRelativeTime } from "@/util/helper";
import MessageSkeleton from "@/components/common/Skeleton/messageSkeleton";

const ChatView: React.FC = () => {
  const { currentUser } = UseUserContext();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || null;
  const [selectedUser, setSelectedUser] = useState<IAnotherUserResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [messages, setMessages] = useState<IUserMessage[]>([]);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const handleTooltipToggle = () => {
    setTooltipOpen(!tooltipOpen);
  };
  const socket = useSocket(currentUser?.id.toString());
  useEffect(() => {
    if (!socket) return;
    socket.on("receive_message", (message: IUserMessage) => {
      const newMessage: IUserMessage = {
        id: message.id,
        message: message.message,
        created_date: message?.created_date.toString(),
        modified_date: message?.modified_date?.toString() || "",
        sender: {
          id: message?.sender?.id,
          user_name: message?.sender?.user_name,
          first_name: message?.sender?.first_name,
          last_name: message?.sender?.last_name,
          photo_url: message?.sender?.photo_url,
        },
        receiver: {
          id: message?.receiver?.id,
          user_name: message?.receiver?.user_name,
          first_name: message?.receiver?.first_name,
          last_name: message?.receiver?.last_name,
          photo_url: message?.receiver?.photo_url,
        },
      };
      if (newMessage?.sender?.id !== newMessage?.receiver?.id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  const handleSendMessage = async (
    values: { inputMessage: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { resetForm }: any
  ) => {
    if (!selectedUser || !values.inputMessage.trim() || !socket) {
      return;
    }
    try {
      const newMessage: IUserMessage = {
        id: Date.now(),
        message: values?.inputMessage,
        created_date: new Date().toISOString(),
        sender: {
          id: currentUser?.id || 0,
          user_name: currentUser?.user_name || "",
          first_name: currentUser?.first_name || null,
          last_name: currentUser?.last_name || null,
          photo_url: currentUser?.photo_url || null,
        },
        receiver: {
          id: selectedUser?.id || 0,
          user_name: selectedUser?.user_name || "",
          first_name: selectedUser?.first_name || null,
          last_name: selectedUser?.last_name || null,
          photo_url: selectedUser?.photo_url || null,
        },
      };
      socket.emit("send_message", newMessage);
      const payload = {
        sender_id: currentUser?.id.toString() || "",
        receiver_id: selectedUser?.id.toString() || "",
        message: values?.inputMessage || "",
      };
      const response = await userSendMessageServices(payload);
      if (response?.statusCode === STATUS_CODES.success && response.data) {
        const data: IUserMessage = response.data;
        setMessages((prevMessages) => [...prevMessages, data]);
        resetForm();
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const loadMessages = async (selectedUserId: number) => {
    try {
      setLoading(true);
      const res = await getAllMessages(selectedUserId);
      setMessages(res.data || []);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username]);

  const messagesAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesAreaRef.current) {
      messagesAreaRef.current.scrollTop = messagesAreaRef.current.scrollHeight;
    }
  }, [messages]);

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
                    msg.sender.id == currentUser?.id ? "me" : "them"
                  }`}
                >
                  <div
                    className={`message ${
                      msg.sender.id == currentUser?.id ? "me" : "them"
                    }`}
                  >
                    <p className="message-text">{msg.message}</p>
                    <span className="message-time">
                      {getRelativeTime(msg.created_date)}
                    </span>
                  </div>
                </div>
              ))}
            </>
          )}
          {loading && (
            <MessageSkeleton count={4} showMessage={true} showTime={true} />
          )}
        </div>
        {/* Message Input */}
        <Formik
          initialValues={{ inputMessage: "" }}
          validationSchema={chatMessageSchema}
          onSubmit={handleSendMessage}
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
              <TextField
                name="inputMessage"
                fullWidth
                variant="outlined"
                placeholder="Write a message..."
                size="small"
                value={values.inputMessage}
                onChange={handleChange}
                // onBlur={handleBlur}
                error={touched.inputMessage && Boolean(errors.inputMessage)}
                slotProps={{
                  input: {
                    endAdornment:
                      touched.inputMessage && errors.inputMessage ? (
                        <InputAdornment position="end">
                          <Tooltip
                            title={errors.inputMessage}
                            open={tooltipOpen}
                            onClick={handleTooltipToggle}
                            onMouseEnter={handleTooltipToggle}
                          >
                            <Info size={18} color="#f44336" />
                          </Tooltip>
                        </InputAdornment>
                      ) : null,
                  },
                }}
                className="comment-input common-textfield-input"
              />
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
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default ChatView;
