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
import {
  commonFilePath,
  MESSAGE_SENT_STATUS,
  STATUS_CODES,
  STATUS_ERROR,
} from "@/util/constanst";
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
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useChatMessagesHook } from "../useChatMessagesHook";

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
  const handleTooltipToggle = () => {
    setTooltipOpen(!tooltipOpen);
  };
  const socket = useSocket(currentUser?.id.toString());
  const {
    messages,
    setMessages,
    typingUser,
    handleSendMsg,
    handleTyping,
    handleReadMessage,
  } = useChatMessagesHook({
    currentUserId: currentUser?.id,
    selectedUserId: selectedUser?.id,
  });

  const handleSendMessage = async (
    values: { inputMessage: string },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    { resetForm }: any
  ) => {
    if (!selectedUser || !values.inputMessage.trim() || !socket) {
      return;
    }
    try {
      const payload = {
        sender_id: currentUser?.id.toString() || "",
        receiver_id: selectedUser?.id.toString() || "",
        message: values?.inputMessage || "",
      };
      const response = await userSendMessageServices(payload);
      if (response?.statusCode === STATUS_CODES.success && response.data) {
        const data: IUserMessage = response.data;
        setMessages((prevMessages) => [...prevMessages, data]);
        handleSendMsg(data);
        handleTyping("", selectedUser?.user_name);
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
      handleReadMessage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    <span className="message-time-and-status">
                      <span className="message-time">
                        {getRelativeTime(msg.created_date)}
                      </span>
                      {msg?.sender?.id === currentUser?.id ? (
                        msg?.is_read &&
                        msg?.status === MESSAGE_SENT_STATUS.SEEN ? (
                          <DoneAllIcon className="seen-msg-icon  " />
                        ) : (
                          <DoneIcon className="sent-msg-icon" />
                        )
                      ) : (
                        <></>
                      )}
                    </span>
                  </div>
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
                onChange={(e) => {
                  handleChange(e);
                  handleTyping(e.target.value, selectedUser?.user_name);
                }}
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
