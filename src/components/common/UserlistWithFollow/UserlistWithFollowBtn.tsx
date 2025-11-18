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
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import {
  followUserService,
  unfollowUserService,
} from "@/services/follows-service.service";
import { UseUserContext } from "@/components/protected-route/protectedRoute";

export interface IUserListItem {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string | null;
  bio?: string | null;
  is_following?: boolean;
}

interface UserListItemProps {
  user: IUserListItem;
  showFollowButton?: boolean;
  showFullName?: boolean;
  showBio?: boolean;
  showAnotherContent?: string | null;
  commonFilePath?: string;
}

const UserlistWithFollowBtn: React.FC<UserListItemProps> = ({
  user,
  showFollowButton = true,
  showFullName = true,
  showBio = true,
  showAnotherContent,
}) => {
  const [isFollowing, setIsFollowing] = useState(user.is_following || false);
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const [isUserLoading, setIsUserLoading] = useState<boolean>();
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
      if (response.statusCode === STATUS_CODES.success) {
        setIsFollowing(!isFollowing);
        setCurrentUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            following_count: (prev.following_count ?? 0) + 1,
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
        setIsFollowing(!isFollowing);
        setCurrentUser((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            following_count: (prev.following_count ?? 0) - 1,
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

  const handleUserClick = async (user_id: number) => {
    if (isUserLoading) return;
    setIsUserLoading(true);
    try {
      //   await onUserClickServices(user.id);
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsUserLoading(false);
    }
  };

  return (
    <Box className="user-list-item">
      <Box className="user-info-section">
        <Avatar
          src={
            user.photo_url ? `${commonFilePath}${user.photo_url}` : undefined
          }
          className="user-avatar"
          onClick={() => handleUserClick(user.id)}
        />

        <Box className="user-details">
          <Box display={"flex"} gap={0.5}>
            <Typography className="user-username" component="h3">
              {user.user_name}
            </Typography>
            {showAnotherContent && (
              <Typography component="p" className="time-stamp-create-date">
                {showAnotherContent}
              </Typography>
            )}
          </Box>
          {showFullName && fullName && (
            <Typography className="user-display-name" variant="body2">
              {fullName}
            </Typography>
          )}
          {showBio && user?.bio && (
            <Typography
              className="user-bio"
              variant="body2"
              color="textSecondary"
            >
              {user.bio}
            </Typography>
          )}
        </Box>
      </Box>
      {showFollowButton && (
        <Box className="follow-button-container">
          <Button
            variant={isFollowing ? "outlined" : "contained"}
            size="small"
            className={`follow-button ${isFollowing ? "following" : ""}`}
            onClick={() =>
              isFollowing
                ? handleUnFollowClick(user?.id)
                : handleFollowClick(user?.id)
            }
            disabled={isFollowLoading}
          >
            {isFollowLoading ? (
              <CircularProgress size={16} />
            ) : isFollowing ? (
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
