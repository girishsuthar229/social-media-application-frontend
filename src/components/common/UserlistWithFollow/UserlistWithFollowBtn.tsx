import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import { commonFilePath, FollowingsEnum, STATUS_CODES } from "@/util/constanst";
import {
  followUserService,
  unfollowUserService,
} from "@/services/follows-service.service";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { IUserResponseData } from "@/models/userInterface";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

export interface IUserListItem {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string | null;
  bio?: string | null;
  is_following?: boolean;
  follow_status?: string | null;
}

interface UserListItemProps {
  user: IUserListItem;
  showFollowButton?: boolean;
  showFullName?: boolean;
  showBio?: boolean;
  showTimeStamp?: string | null;
  showComment?: string | null;
  currentUser: IUserResponseData | null;
}

const UserlistWithFollowBtn: React.FC<UserListItemProps> = ({
  user,
  showFollowButton = true,
  showFullName = true,
  showBio = true,
  showTimeStamp,
  showComment,
  currentUser,
}) => {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(user.is_following || false);
  const [followStatus, setFollowStatus] = useState(user.follow_status || null);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const { setCurrentUser } = UseUserContext();
  const fullName = [user.first_name, user.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();

  const handleFollowClick = async (user_id: number) => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      const response = await followUserService(user_id);
      if (
        response.statusCode === STATUS_CODES.success &&
        response?.data?.follow_status
      ) {
        const followStatus = response?.data?.follow_status;
        setIsFollowing(true);
        setFollowStatus(followStatus);
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const followingCount = Number(
            Number(prev.following_count ?? 0) +
              (followStatus === FollowingsEnum.ACCEPTED ? 1 : 0)
          );
          return {
            ...prev,
            following_count: followingCount,
          };
        });
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
        setCurrentUser((prev) => {
          if (!prev) return prev;
          const followingCount =
            Number(prev.following_count ?? 0) -
            (followStatus === FollowingsEnum.ACCEPTED ? 1 : 0);
          return {
            ...prev,
            following_count: followingCount,
          };
        });
        setIsFollowing(false);
        setFollowStatus(null);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/user-name?username=${username}`);
  };

  return (
    <Box className="user-list-item">
      <Box className="user-all-section">
        <Box
          className="user-info-section"
          onClick={() => handleUserClick(user.user_name)}
        >
          <Avatar
            src={
              user.photo_url ? `${commonFilePath}${user.photo_url}` : undefined
            }
            className="user-avatar"
          />
          <Box className="user-details">
            <Box display={"flex"} flexDirection={"column"}>
              <Typography className="user-username" component="h3">
                {user.user_name}
              </Typography>
              {showFullName && fullName && (
                <Typography className="user-display-name" variant="body2">
                  {fullName}
                </Typography>
              )}
              {showTimeStamp && (
                <Typography component="p" className="time-stamp-create-date">
                  {showTimeStamp}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box className="user-another-content-section">
          {showBio && user?.bio && (
            <Typography className="user-bio" variant="body2">
              {user.bio}
            </Typography>
          )}
          {showComment && (
            <Typography className="user-comment" variant="body2">
              {showComment}
            </Typography>
          )}
        </Box>
      </Box>
      {showFollowButton && currentUser?.id !== user?.id && (
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
                ? handleFollowClick(user.id)
                : handleUnFollowClick(user.id)
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
      )}
    </Box>
  );
};

export default UserlistWithFollowBtn;
