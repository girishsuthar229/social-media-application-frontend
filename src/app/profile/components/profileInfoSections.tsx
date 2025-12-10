import React from "react";
import { PROFILE_TABS } from "./userProfile";
import BackButton from "@/components/common/BackButton";
import { Avatar, Box, Typography } from "@mui/material";
import { formatNumber } from "@/util/helper";
import { commonFilePath, FollowingsEnum } from "@/util/constanst";
import { IAnotherUserResponse } from "@/models/userInterface";

interface ProfileInfoProps {
  profileUser: IAnotherUserResponse | null;
  isOwnProfile: boolean;
  isUserNotFound?: boolean;
  canViewPosts?: boolean | null;
  isFollowing: boolean;
  isFollowLoading: boolean;
  followStatus?: string | null;
  handleFollowClick: (userId: number | null) => void;
  handlerUnfollowModel: (userId: number | null, isPrivate?: boolean) => void;
  handleFollowersList: (userId: number | null) => void;
  handleFollowingsList: (userId: number | null) => void;
  handleEditProfile: () => void;
  handleShareProfile: () => void;
}

const ProfileInfoSections: React.FC<ProfileInfoProps> = ({
  isOwnProfile,
  profileUser,
  isUserNotFound,
  canViewPosts,
  isFollowing,
  isFollowLoading,
  followStatus,
  handleFollowClick,
  handlerUnfollowModel,
  handleEditProfile,
  handleShareProfile,
  handleFollowersList,
  handleFollowingsList,
}) => {
  return (
    <Box className="profile-info-section">
      <Box className="profile-top">
        <Box className="profile-avatar-container">
          <Avatar
            src={`${commonFilePath}${profileUser?.photo_url}`}
            alt={profileUser?.user_name?.toLocaleUpperCase()}
            className="profile-avatar-large"
          >
            {!profileUser?.photo_url &&
              profileUser?.user_name?.charAt(0).toUpperCase()}
          </Avatar>
        </Box>
        <Box className="profile-bio-section">
          <Typography className="profile-header-username">
            {profileUser?.user_name}
          </Typography>
          <Typography className="profile-full-name">
            {profileUser?.first_name} {profileUser?.last_name}
          </Typography>
          <Typography className="profile-bio">{profileUser?.bio}</Typography>
          {isUserNotFound && (
            <Typography className="profile-full-name">
              User Not Found
            </Typography>
          )}
        </Box>
      </Box>
      <Box className="profile-status">
        <Box className="stat-item">
          <Typography component="span" className="stat-number">
            {formatNumber(profileUser?.post_count || 0)}
          </Typography>
          <Typography component="span" className="stat-label">
            Posts
          </Typography>
        </Box>
        <Box
          className="stat-item"
          onClick={() => {
            if (canViewPosts) {
              handleFollowersList(profileUser?.id || null);
            }
          }}
        >
          <Typography component="span" className="stat-number">
            {formatNumber(profileUser?.follower_count || 0)}
          </Typography>
          <Typography component="span" className="stat-label">
            Followers
          </Typography>
        </Box>
        <Box
          className="stat-item"
          onClick={() => {
            if (canViewPosts) {
              handleFollowingsList(profileUser?.id || null);
            }
          }}
        >
          <Typography component="span" className="stat-number">
            {formatNumber(profileUser?.following_count || 0)}
          </Typography>
          <Typography component="span" className="stat-label">
            Following
          </Typography>
        </Box>
      </Box>
      <Box className="profile-actions">
        {isOwnProfile ? (
          <BackButton
            onClick={handleEditProfile}
            labelText="Edit Profile"
            iconPosition="start"
            iconName="edit-button"
            fullWidth
          />
        ) : (
          <Box className={`profile-tabs ${isFollowing ? " " : "active"}`}>
            <BackButton
              onClick={() =>
                isFollowing
                  ? handlerUnfollowModel(
                      profileUser?.id ? profileUser?.id : null,
                      profileUser?.is_private
                    )
                  : handleFollowClick(profileUser?.id ? profileUser?.id : null)
              }
              labelText={
                isFollowing && followStatus === FollowingsEnum.PENDING
                  ? "Requested"
                  : isFollowing && followStatus === FollowingsEnum.ACCEPTED
                  ? "UnFollow"
                  : "Follow"
              }
              iconPosition="start"
              iconName={
                isFollowLoading
                  ? "circular-progress"
                  : isFollowing
                  ? "remove-person-icon"
                  : "add-person-icon"
              }
              fullWidth
            />
          </Box>
        )}
        <BackButton
          onClick={handleShareProfile}
          labelText="Share Profile"
          iconPosition="start"
          iconName="share-button"
          fullWidth
        />
      </Box>
    </Box>
  );
};

export default ProfileInfoSections;
