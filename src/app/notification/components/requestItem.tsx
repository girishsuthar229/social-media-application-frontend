import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Button,
  CircularProgress,
} from "@mui/material";
import { Check, X, UserPlus } from "lucide-react";
import { FollowingsEnum, STATUS_CODES, commonFilePath } from "@/util/constanst";
import { PendingFollowResponse } from "@/models/followsInterface";
import {
  acceptFollowRequestService,
  followUserService,
  rejectFollowRequestService,
  unfollowUserService,
} from "@/services/follows-service.service";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

interface RequestItemProps {
  request: PendingFollowResponse;
  currentUserId: number;
  onReject: (requestId: number) => void;
}

const RequestItem: React.FC<RequestItemProps> = React.memo(
  ({ request, currentUserId, onReject }) => {
    const router = useRouter();
    const fullName = [request.user.first_name, request.user.last_name]
      .filter(Boolean)
      .join(" ")
      .trim();
    const [isFollowRequestAccepted, setIsFollowRequestAccepted] =
      useState<boolean>(request.follow_me_status === FollowingsEnum.ACCEPTED);
    const [isFollowing, setIsFollowing] = useState(
      request.user.is_following || false
    );
    const [followStatus, setFollowStatus] = useState(
      request?.user.follow_status || null
    );
    const [processingIds, setProcessingIds] = useState<boolean>(false);
    const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);

    const handleAccept = async (currentUserId: number, followRedId: number) => {
      setProcessingIds(true);
      try {
        const response = await acceptFollowRequestService(
          currentUserId,
          followRedId
        );

        if (response.statusCode === STATUS_CODES.success) {
          toast.success(response?.message);
          setIsFollowRequestAccepted(true);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message || "Failed to accept request");
      } finally {
        setProcessingIds(false);
      }
    };

    const handleReject = async (currentUserId: number, followRedId: number) => {
      setProcessingIds(true);
      try {
        const response = await rejectFollowRequestService(
          currentUserId,
          followRedId
        );

        if (response.statusCode === STATUS_CODES.success) {
          toast.success(response.message);
          onReject(followRedId);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message || "Failed to reject request");
      } finally {
        setProcessingIds(false);
      }
    };

    const handleFollowClick = async (user_id: number) => {
      if (isFollowLoading) return;
      setIsFollowLoading(true);
      try {
        const response = await followUserService(user_id);
        if (
          response.statusCode === STATUS_CODES.success &&
          response?.data?.follow_status
        ) {
          setIsFollowing(response?.data?.is_following || false);
          setFollowStatus(response?.data?.follow_status);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      } finally {
        setIsFollowLoading(false);
      }
    };

    const handleUnFollowClick = async (user_id: number) => {
      if (isFollowLoading) return;
      setIsFollowLoading(true);

      try {
        const response = await unfollowUserService(user_id);
        if (response.statusCode === STATUS_CODES.success) {
          toast.success(response?.message);
          setIsFollowing(false);
          setFollowStatus(null);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message || "Failed to unfollow user");
      } finally {
        setIsFollowLoading(false);
      }
    };

    const handleUserClick = (username: string) => {
      router.push(`/profile/user-name?username=${username}`);
    };

    return (
      <Box className="request-item user-list-item">
        <Box
          className="request-user-info"
          onClick={() => handleUserClick(request.user.user_name)}
        >
          <Avatar
            src={`${commonFilePath}${request.user.photo_url}`}
            className="request-avatar"
          />
          <Box className="request-details">
            <Typography className="request-username">
              @{request.user.user_name}
            </Typography>
            {fullName && (
              <Typography className="request-fullname">{fullName}</Typography>
            )}
            {request.user.bio && (
              <Typography className="request-bio">
                {request.user.bio}
              </Typography>
            )}
          </Box>
        </Box>

        {isFollowRequestAccepted ? (
          <Box className="follow-button-container">
            <Button
              variant={isFollowing ? "outlined" : "contained"}
              size="small"
              className={`follow-button ${
                isFollowing && followStatus === FollowingsEnum.ACCEPTED
                  ? "following"
                  : isFollowing && followStatus === FollowingsEnum.PENDING
                  ? "requested"
                  : ""
              }`}
              onClick={() =>
                !isFollowing
                  ? handleFollowClick(request?.user?.user_id)
                  : handleUnFollowClick(request?.user?.user_id)
              }
              disabled={isFollowLoading}
              startIcon={
                !isFollowLoading && !isFollowing && <UserPlus size={16} />
              }
            >
              {isFollowLoading ? (
                <CircularProgress size={16} />
              ) : isFollowing && followStatus === FollowingsEnum.PENDING ? (
                "Requested"
              ) : isFollowing && followStatus === FollowingsEnum.ACCEPTED ? (
                "Following"
              ) : (
                "Follow"
              )}
            </Button>
          </Box>
        ) : (
          <Box className="request-actions">
            <IconButton
              className="accept-icon-button"
              onClick={() => handleAccept(currentUserId, request.id)}
              disabled={processingIds}
              size="small"
            >
              {processingIds ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Check size={18} />
              )}
            </IconButton>
            <IconButton
              className="reject-icon-button"
              onClick={() => handleReject(currentUserId, request.id)}
              disabled={processingIds}
              size="small"
            >
              {processingIds ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <X size={18} />
              )}
            </IconButton>
          </Box>
        )}
      </Box>
    );
  }
);

export default RequestItem;
