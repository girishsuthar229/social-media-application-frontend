"use client";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
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
import { NewUserNotification } from "@/models/userInterface";

const Notification = () => {
  const { currentUser } = UseUserContext();
  const [loading, setLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [requests, setRequests] = useState<PendingFollowResponse[]>([]);
  const [newUsers, setNewUsers] = useState<NewUserNotification[]>([]);
  const socket = useSocket(currentUser?.id.toString());
  const router = useRouter();

  useEffect(() => {
    if (!socket) return;
    socket.on("new_user_created", (user) => {
      setNewUsers((prev) => [...prev, user]);
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.id]);

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
            Highlights
          </Typography>
        </Box>
        <Box className="new-users-list">
          {/* List of new users */}
          {newUsers.length > 0 ? (
            newUsers.map((user) => (
              <Box key={user.id} className="new-users-message">
                <Typography variant="body2">
                  New user created, please follow them!{" "}
                  <BackButton
                    onClick={() => handleUserClick(user.user_name)}
                    labelText={`@ ${user.user_name}`}
                    showIcon={false}
                    underlineOnHover={true}
                  />
                </Typography>
              </Box>
            ))
          ) : (
            <Box className="new-users-message">
              <Typography variant="body2">No Highlights</Typography>
            </Box>
          )}
        </Box>

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
