"use client";
import React, { useEffect, useState } from "react";
import { Box, Button, List, Typography } from "@mui/material";
import { UserPlus } from "lucide-react";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import { STATUS_CODES } from "@/util/constanst";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { pendingAccptedFollowListService } from "@/services/follows-service.service";
import { PendingFollowResponse } from "@/models/followsInterface";
import UserListSkeleton from "@/components/common/Skeleton/userListSkeleton";
import RequestItem from "./components/requestItem";
import useSocket from "@/util/socket";
import { useRouter } from "next/navigation";
import BackButton from "@/components/common/BackButton";
import { NewUserNotification, UserAllListModel } from "@/models/userInterface";
import { getAllUsers } from "@/services/user-service.service";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";

const Notification = () => {
  const { currentUser } = UseUserContext();
  const [loading, setLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [requests, setRequests] = useState<PendingFollowResponse[]>([]);
  const [newUsers, setNewUsers] = useState<NewUserNotification[]>([]);
  const socket = useSocket(currentUser?.id.toString());
  const router = useRouter();
  const [showSuggestedUsers, setShowSuggestedUsers] = useState(false);
  const [suggestedUsers, setAllSuggestedUsers] = useState<UserAllListModel[]>(
    []
  );
  const [showSuggestedUsersHasMore, setShowSuggestedUsersHasMore] =
    useState(true);
  const [allUsersTotalCount, setAllUsersTotalCount] = useState<number>();
  const [userOffset, setUserOffset] = useState<number>(0);
  const [userLoading, setUserLoading] = useState(false);

  useEffect(() => {
    if (!socket) return;
    socket.on("new_user_created", (user: any) => {
      const newUser: NewUserNotification = {
        id: user?.id,
        user_name: user?.user_name,
        first_name: user?.first_name || null,
        last_name: user?.last_name || null,
        bio: user?.bio || null,
        photo_url: user?.photo_url || null,
      };

      setNewUsers((prevUsers) => {
        const updatedUsers = [newUser, ...prevUsers];
        if (updatedUsers.length > 4) {
          updatedUsers.pop();
        }
        return updatedUsers;
      });
    });

    return () => {
      socket.off("new_user_created");
    };
  }, [socket]);

  const handleUserClick = (username: string) => {
    router.push(`/profile/user-name?username=${username}`);
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadPendingRequests();
      loadMoreUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

  const loadMoreUsers = async (sgtUser?: boolean) => {
    if (userLoading || !showSuggestedUsersHasMore) return;
    setUserLoading(true);
    const payload = {
      limit: 10,
      offset: userOffset,
      sortBy: "created_date",
      sortOrder: "DESC",
    };

    try {
      const response = await getAllUsers(payload);
      if (response?.data && response.statusCode === STATUS_CODES.success) {
        const newUsers: UserAllListModel[] = response.data?.rows || [];
        if (showSuggestedUsers || sgtUser) {
          setAllSuggestedUsers((prev) => [...prev, ...newUsers]);
          setAllUsersTotalCount(response.data?.count);
          setUserOffset((prev) => prev + newUsers.length);
          if (newUsers.length < 10) {
            setShowSuggestedUsersHasMore(false);
          }
        }
        if (!showSuggestedUsers) {
          const newUserNotifications: NewUserNotification[] = newUsers
            .slice(0, 4)
            .map((user) => ({
              id: user?.id,
              user_name: user?.user_name,
              first_name: user?.first_name || null,
              last_name: user?.last_name || null,
              bio: user?.bio || null,
              photo_url: user?.photo_url || null,
            }));
          setNewUsers((prev) => [...prev, ...newUserNotifications]);
        }
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setUserLoading(false);
    }
  };

  const handleMoreSuggestedUsers = () => {
    setShowSuggestedUsers(true);
    loadMoreUsers(true);
  };

  const loadPendingRequests = async () => {
    if (!currentUser?.id) return;

    setLoading(true);
    try {
      const payload = {
        limit: 25,
        offset: requests.length,
        sortBy: "created_date",
        sortOrder: "DESC",
      };
      const response = await pendingAccptedFollowListService(
        currentUser.id,
        payload
      );
      if (response.statusCode === STATUS_CODES.success) {
        const allRequests = response.data?.rows || [];
        setRequests((prev) => [...prev, ...allRequests]);
        if (allRequests.length < 25) {
          setUserHasMore(false);
        }
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const removeRequestHandler = (requestId: number) => {
    setRequests((prevRequests) =>
      prevRequests.filter((req) => req.id !== requestId)
    );
  };

  return (
    <Box className="notification-page">
      <Box
        className="notification-container scrollbar"
        onScroll={(e) => {
          const T = e.currentTarget;
          const bottom = T.scrollHeight - T.scrollTop - T.clientHeight < 10;
          if (bottom && userHasMore && !loading) {
            loadPendingRequests();
          }
        }}
      >
        <Box className="notification-header">
          <Typography variant="h5" className="page-title">
            Suggested Users
          </Typography>
        </Box>
        {!showSuggestedUsers && (
          <Box className="new-users-list">
            {/* List of new users */}
            {newUsers.length > 0 ? (
              <Box className="new-users-message">
                <Typography variant="body2">
                  New user(s) created, please follow them!{" "}
                </Typography>
                {newUsers.map((user, index) => (
                  <Typography
                    component={"span"}
                    key={user?.id || index}
                    className="user-name-container"
                    onClick={() => handleUserClick(user?.user_name)}
                  >
                    <Typography component={"span"} className="user-name">
                      {`@${user?.user_name}`}
                      {" , "}
                    </Typography>
                  </Typography>
                ))}
                <Typography
                  component="span"
                  className="more-users-message"
                  onClick={() => handleMoreSuggestedUsers()}
                >
                  {" more"}
                </Typography>
              </Box>
            ) : (
              <Box className="new-users-message">
                <Typography variant="body2">No Highlights</Typography>
              </Box>
            )}
          </Box>
        )}
        {showSuggestedUsers && (
          <Box className="suggested-user-div notofication-sgstd-user-div">
            <List className="scrollbar">
              {suggestedUsers.map((user: UserAllListModel, index: number) => (
                <Box key={index}>
                  <UserlistWithFollowBtn
                    user={{
                      id: user?.id,
                      user_name: user?.user_name,
                      first_name: user?.first_name,
                      last_name: user?.last_name,
                      photo_url: user?.photo_url,
                      bio: user?.bio || null,
                      is_following: user?.is_following,
                      follow_status: user?.follow_status,
                    }}
                    showBio={true}
                    showFullName={true}
                    showFollowButton={true}
                    currentUser={currentUser}
                  />
                </Box>
              ))}
              {userLoading ? (
                <UserListSkeleton
                  count={3}
                  showBio={true}
                  showFollowButton={true}
                />
              ) : (
                Number(suggestedUsers.length) < Number(allUsersTotalCount) && (
                  <div className="load-more-div">
                    <BackButton
                      onClick={!loading ? loadMoreUsers : undefined}
                      labelText={loading ? "Loading..." : "Load More"}
                      showIcon={false}
                      underlineOnHover={true}
                    />
                  </div>
                )
              )}
            </List>
          </Box>
        )}
        <Box className="notification-header">
          <Typography variant="h5" className="page-title">
            Notifications
          </Typography>
        </Box>

        <Box className="notification-content">
          {!loading && requests.length === 0 ? (
            <Box className="empty-state">
              <UserPlus size={64} className="empty-icon" />
              <Typography variant="h6" className="empty-title">
                No Follow Requests
              </Typography>
              <Typography variant="body2" color="textSecondary">
                You don&apos;t have any pending follow requests
              </Typography>
            </Box>
          ) : (
            <Box className="requests-list">
              {requests.map((request: PendingFollowResponse, index: number) => (
                <Box key={index}>
                  <RequestItem
                    key={request.id}
                    request={request}
                    currentUserId={currentUser?.id || 0}
                    onReject={removeRequestHandler}
                  />
                </Box>
              ))}
            </Box>
          )}
          {loading && (
            <UserListSkeleton
              count={3}
              showBio={true}
              showFollowButton={true}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Notification;
