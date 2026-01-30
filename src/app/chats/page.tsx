"use client";
import React, { useState, useEffect, useMemo } from "react";
import { MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  commonFilePath,
  MESSAGE_SENT_STATUS,
  STATUS_CODES,
} from "@/util/constanst";
import { Avatar, Badge, Box, Typography } from "@mui/material";
import { IApiError } from "@/models/common.interface";
import { toast } from "@/util/reactToastify";
import {
  getAllMsgUsers,
  getUnReadMsgUsers,
} from "@/services/message-services.service";
import SearchField from "@/components/common/SearchField/searchField";
import UserListSkeleton from "@/components/common/Skeleton/userListSkeleton";
import { debounce } from "lodash";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { useChatMessagesHook } from "./useChatMessagesHook";

const ChatApp = () => {
  const { currentUser } = UseUserContext();
  const [userOffset, setUserOffset] = useState<number>(0);
  const [userLoading, setUserLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const router = useRouter();
  const { allUsers, setAllUsers, typingUser, unreadCount, setUnreadCount } =
    useChatMessagesHook({
      currentUserId: currentUser?.id,
      selectedUserId: null,
    });

  const loadMessageUsers = async (searchValue: string) => {
    if (userLoading) return;
    setUserLoading(true);
    const payload = {
      limit: 50,
      offset: userOffset,
      sortBy: "created_date",
      sortOrder: "DESC",
      searchName: searchValue.toLowerCase() || searchQuery.toLowerCase(),
    };
    try {
      const response = await getAllMsgUsers(payload);

      if (response?.data && response.statusCode === STATUS_CODES.success) {
        const newUsers = response.data?.rows || [];
        if (newUsers.length < 10) {
          // setUserHasMore(false);
        }
        setAllUsers((prev) => {
          const updatedUsers = [...prev, ...newUsers];
          updatedUsers.sort((a, b) => {
            const aTime = a.message?.created_date
              ? new Date(a.message.created_date).getTime()
              : 0;
            const bTime = b.message?.created_date
              ? new Date(b.message.created_date).getTime()
              : 0;
            return bTime - aTime;
          });

          return updatedUsers;
        });
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setUserLoading(false);
    }
  };

  const handleUserClick = (user_name: string) => {
    router.push(`chats/user?username=${user_name}`);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        await loadMessageUsers(value);
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    const trimmedValue = value.trim();
    if (trimmedValue) {
      sessionStorage.setItem("searchMessagesUsers", trimmedValue);
      setUserLoading(true);
    } else {
      sessionStorage.removeItem("searchMessagesUsers");
      setUserLoading(false);
    }
    debouncedSearch(trimmedValue.toLowerCase());
    setUserOffset(0);
    setAllUsers([]);
    // setUserHasMore(true);
  };

  const handlerClearSearchKey = () => {
    sessionStorage.removeItem("searchMessagesUsers");
    setSearchQuery("");
    setUserOffset(0);
    // setUserHasMore(true);
    setAllUsers([]);
    debouncedSearch("");
  };

  const unreadMessageUserCount = async () => {
    try {
      const response = await getUnReadMsgUsers();
      if (response?.data && response.statusCode === STATUS_CODES.success) {
        setUnreadCount(response.data);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    }
  };

  useEffect(() => {
    const storedSearchQuery = sessionStorage.getItem("searchMessagesUsers");
    if (storedSearchQuery) {
      loadMessageUsers(storedSearchQuery);
      setSearchQuery(storedSearchQuery);
    } else {
      loadMessageUsers("");
      setSearchQuery("");
    }
    unreadMessageUserCount();
    return () => {
      debouncedSearch.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app-wrapper">
      <div className="chat-container">
        <div className="chat-header">
          <h1 className="chat-title">
            <MessageCircle size={28} />
            Messages
          </h1>
        </div>
        <Box className="search-container">
          <SearchField
            placeholder="Search by name or username..."
            onSearchChange={handleSearchChange}
            onClearSearch={handlerClearSearchKey}
            searchQuery={searchQuery}
          />
        </Box>
        <div className="user-list scrollbar">
          {userLoading ? (
            <UserListSkeleton
              count={3}
              showBio={false}
              showFollowButton={false}
            />
          ) : allUsers.length === 0 ? (
            <Typography variant="h6" className="message-empty-title">
              No Users Found
            </Typography>
          ) : (
            allUsers.map((user) => {
              const unreadUser = unreadCount.users.find(
                (unreadMsgUser) => unreadMsgUser.m_sender_id === user.id
              );
              const isTyping =
                typingUser?.is_typing && typingUser.type_user_id === user.id;

              return (
                <Box
                  className="user-item"
                  key={user.id}
                  onClick={() => handleUserClick(user.user_name)}
                >
                  <Avatar
                    src={
                      user.photo_url
                        ? `${commonFilePath}${user.photo_url}`
                        : undefined
                    }
                    className="user-avatar"
                  />
                  <Box className="user-details">
                    <Box display={"flex"} flexDirection={"column"}>
                      <Typography className="user-username" component="h3">
                        {user.user_name}
                      </Typography>

                      {/* Last Message Display */}
                      {user.message && (
                        <Box className="user-last-message-main-div">
                          {user.message.sender_id === currentUser?.id && (
                            <>
                              {user.message.is_read &&
                              user.message.status ===
                                MESSAGE_SENT_STATUS.SEEN ? (
                                <DoneAllIcon className="seen-msg-icon" />
                              ) : (
                                <DoneIcon className="sent-msg-icon" />
                              )}
                            </>
                          )}
                          <Box className="user-send-recieve-message">
                            {/* Typing Indicator */}
                            {isTyping ? (
                              <p className="typing-indicator">
                                <span className="dot" />
                                <span className="dot" />
                                <span className="dot" />
                              </p>
                            ) : user.message?.last_message ? (
                              <Typography
                                className={`user-last-message ${
                                  (user.message.is_read &&
                                    user.message.status ===
                                      MESSAGE_SENT_STATUS.SEEN) ||
                                  user.message.sender_id === currentUser?.id
                                    ? ""
                                    : "bold"
                                }`}
                                variant="body1"
                              >
                                {user.message.last_message}
                              </Typography>
                            ) : (
                              <></>
                            )}

                            {unreadUser && !!unreadUser.eachUserMsgCount && (
                              <Box className={`user-unread-count`}>
                                <Typography
                                  component={"p"}
                                  className="unread-number"
                                >
                                  {unreadUser.eachUserMsgCount}
                                </Typography>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatApp;
