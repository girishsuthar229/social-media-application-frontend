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

const Notification = () => {
  const { currentUser } = UseUserContext();
  const [loading, setLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [requests, setRequests] = useState<PendingFollowResponse[]>([]);

  useEffect(() => {
    if (currentUser?.id) {
      loadPendingRequests();
    }
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
                You don't have any pending follow requests
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
