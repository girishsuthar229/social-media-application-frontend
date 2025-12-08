"use client";
import { useEffect, useState } from "react";
import { Typography, Box, Avatar, Grid } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import BackButton from "@/components/common/BackButton";
import {
  GridOnOutlined as GridOnOutlinedIcon,
  Bookmark,
  Lock as LockIcon,
} from "@mui/icons-material";
import { formatNumber, handleShareData } from "@/util/helper";
import {
  AuthBaseRoute,
  commonFilePath,
  FollowingsEnum,
  STATUS_CODES,
  STATUS_ERROR,
} from "@/util/constanst";
import { getUserUploadPost } from "@/services/post-service.service";
import { UserWiseAllPostsData } from "@/models/postInterface";
import { AllSavedPostList } from "@/models/savedinterface";
import { getAllSavedPosts } from "@/services/saved-service.service";
import {
  IAnotherUserResponse,
  IUserResponseData,
} from "@/models/userInterface";
import {
  followersListService,
  followingsListService,
  followUserService,
  unfollowUserService,
} from "@/services/follows-service.service";
import ConfirmationDialog from "@/components/common/ConfirmationModal/confirmationModal";
import { FollowUserListResponse } from "@/models/followsInterface";
import FollowUserListDrawer from "@/components/common/SwipeableDrawerCommon/FollowUserListDrawer";
import UserPostModal from "./userPostModal";
import SquareCardSkeleton from "@/components/common/Skeleton/squareCardSkeleton";

interface ProfileComponentProps {
  profileUser: IAnotherUserResponse | null;
  currentUser: IUserResponseData | null;
  isOwnProfile: boolean;
  isUserNotFound?: boolean;
}

const ProfileComponent = ({
  profileUser,
  currentUser,
  isOwnProfile,
  isUserNotFound,
}: ProfileComponentProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [postValues, setPostValues] = useState<UserWiseAllPostsData[]>([]);
  const [postOffset, setPostOffset] = useState(0);
  const [postHasMore, setPostHasMore] = useState(true);
  const [savedPosts, setSavedPosts] = useState<AllSavedPostList[]>([]);
  const [savedPostOffset, setSavedPostOffset] = useState(0);
  const [isSavedPostsLoaded, setIsSavedPostsLoaded] = useState(false);
  const [canViewPosts, setCanViewPosts] = useState<boolean | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState<string | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [unFollowConfirmModel, setUnFollowConfirmModel] = useState(false);
  const [isFollowListLoading, setIsFollowListLoading] = useState(false);
  const [followUserListModel, setFollowUserListModel] = useState(false);
  const [followheadingContent, setFollowheadingContent] = useState<
    string | null
  >(null);
  const [userOffset, setUsersOffset] = useState(0);
  const [followUsers, setFollowUsers] = useState<FollowUserListResponse[]>([]);
  const [userPostModalId, setUserPostModalId] = useState<number | null>(null);

  const loadUserPosts = async (userId: number) => {
    setIsLoading(true);
    try {
      const payload = {
        limit: 12,
        offset: postOffset,
        sortBy: "created_date",
        sortOrder: "DESC" as "DESC",
        userId: userId || 0,
      };
      const res = await getUserUploadPost(payload);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        const allPosts = res.data?.rows || [];
        setPostValues(allPosts);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
      if (
        err.statusCode === STATUS_CODES.Conflict &&
        err.error === STATUS_ERROR.UserAcountPrivate
      ) {
        setCanViewPosts(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setUsersOffset(0);
    setUserPostModalId(null);
    setFollowUserListModel(false);
    if (profileUser) {
      const canShowPosts =
        isOwnProfile ||
        !profileUser?.is_private ||
        (profileUser?.is_following &&
          profileUser?.follow_status == FollowingsEnum.ACCEPTED);
      setCanViewPosts(!!canShowPosts);
      setIsFollowing(!!profileUser?.is_following);
      setFollowStatus(profileUser?.follow_status || null);
      if (canShowPosts) {
        loadUserPosts(profileUser?.id);
      }
    }
  }, [profileUser]);

  const handleFollowClick = async (userId: number | null) => {
    if (isFollowLoading || !userId) return;
    setIsFollowLoading(true);
    try {
      const response = await followUserService(userId);
      if (response.statusCode === STATUS_CODES.success) {
        setIsFollowing(response.data?.is_following || false);
        setFollowStatus(response.data?.follow_status || null);
        toast.success(response.message);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handlerUnfollowModel = (userId: number | null, isPrivate?: boolean) => {
    if (isPrivate && followStatus === FollowingsEnum.ACCEPTED) {
      setUnFollowConfirmModel(true);
    } else {
      handleUnFollowClick(userId);
    }
  };
  const handleUnFollowClick = async (userId: number | null) => {
    if (isFollowLoading || !userId) return;
    setIsFollowLoading(true);
    try {
      const response = await unfollowUserService(userId);
      if (response.statusCode === STATUS_CODES.success) {
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

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };

  const userSavedPost = async () => {
    if (isSavedPostsLoaded) return;
    setIsLoading(true);
    try {
      const payload = {
        limit: 10,
        offset: savedPostOffset,
        sortBy: "created_date",
        sortOrder: "DESC",
        userId: currentUser?.id,
      };
      const res = await getAllSavedPosts(payload);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        const allPosts = res.data?.rows || [];
        setSavedPosts(allPosts);
        setIsSavedPostsLoaded(true);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostTab = () => {
    setActiveTab("posts");
  };

  const handleSaveTab = () => {
    setActiveTab("saved");
    if (!isSavedPostsLoaded && isOwnProfile) {
      userSavedPost();
    }
  };

  const handleShareProfile = () => {
    const data: ShareData = {
      title: `${profileUser?.first_name} ${profileUser?.last_name}`,
      text: `Check out @${profileUser?.user_name}'s profile!`,
      url: `${window.location.origin}/profile/user-name?username=${profileUser?.user_name}`,
    };
    handleShareData(data);
  };

  const handlePostClick = (postId: number) => {
    setUserPostModalId(postId);
  };

  const handleFollowersList = async (userId: number | null) => {
    if (isFollowListLoading || !userId) return;
    setIsFollowListLoading(true);
    setFollowheadingContent("Followers");
    try {
      const payload = {
        limit: 10,
        offset: userOffset,
        sortBy: "created_date",
        sortOrder: "DESC",
      };
      const response = await followersListService(userId, payload);
      if (
        response.statusCode === STATUS_CODES.success &&
        response?.data?.rows
      ) {
        setFollowUserListModel(true);
        setFollowUsers(response?.data?.rows);
        setUsersOffset((prevOffset) => prevOffset + 10);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsFollowListLoading(false);
    }
  };

  const handleFollowingsList = async (userId: number | null) => {
    if (isFollowListLoading || !userId) return;
    setIsFollowListLoading(true);
    setFollowheadingContent("Followings");
    try {
      const payload = {
        limit: 10,
        offset: userOffset,
        sortBy: "created_date",
        sortOrder: "DESC",
      };
      const response = await followingsListService(userId, payload);
      if (
        response.statusCode === STATUS_CODES.success &&
        response?.data?.rows
      ) {
        setFollowUserListModel(true);
        setFollowUsers(response?.data?.rows);
        setUsersOffset((prevOffset) => prevOffset + 10);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsFollowListLoading(false);
    }
  };

  const handleDeletePost = (postId: number) => {
    setPostValues((prevPosts) =>
      prevPosts.filter((post) => post.post_id !== postId)
    );
    setSavedPosts((prevPosts) =>
      prevPosts.filter((post) => post.post_id !== postId)
    );
    setUserPostModalId(null);
  };

  const handleSavedUnSavedPost = (
    isSaved: boolean,
    savePostData: AllSavedPostList
  ) => {
    if (isSaved) {
      setSavedPosts((prev) => [...prev, { ...savePostData }]);
    } else {
      setSavedPosts((prevPosts) =>
        prevPosts.filter((post) => post.post_id !== savePostData?.post_id)
      );
    }
  };
  return (
    <Box className="profile-page scrollbar">
      <Box className="profile-card scrollbar">
        {usePathname() !== AuthBaseRoute.profile && (
          <Box paddingBlockEnd={1}>
            <BackButton labelText="Back" onClick={() => router.back()} />
          </Box>
        )}
        {/* Profile Info Section */}
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
              <Typography className="profile-bio">
                {profileUser?.bio}
              </Typography>
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
                setUsersOffset(0);
                handleFollowersList(profileUser?.id || null);
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
                setUsersOffset(0);
                handleFollowingsList(profileUser?.id || null);
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
                      : handleFollowClick(
                          profileUser?.id ? profileUser?.id : null
                        )
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

        <hr className="horitzonal-line" />

        {/* Tab Section */}
        {canViewPosts && (
          <Box className="profile-tabs">
            <span
              className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
            >
              <BackButton
                onClick={handlePostTab}
                labelText="Posts"
                iconPosition="start"
                iconName="grid-outlined-icon"
                fullWidth
              />
            </span>

            {isOwnProfile && (
              <span
                className={`tab-button ${
                  activeTab === "saved" ? "active" : ""
                }`}
              >
                <BackButton
                  onClick={handleSaveTab}
                  labelText="Saved"
                  iconPosition="start"
                  iconName="book-mark-icon"
                  fullWidth
                />
              </span>
            )}
          </Box>
        )}

        {/* Posts Grid */}
        <Box
          className="posts-grid-container"
          onScroll={(e) => {
            const bottom =
              e.currentTarget.scrollHeight -
                e.currentTarget.scrollTop -
                e.currentTarget.clientHeight <
              50;
            if (bottom && !isLoading && postHasMore) {
              if (profileUser) {
                setPostOffset((prevOffset) => prevOffset + 10);
                loadUserPosts(profileUser?.id);
              }
            }
          }}
        >
          {isLoading ? (
            <SquareCardSkeleton count={3} />
          ) : canViewPosts === false && canViewPosts !== null ? (
            <Box className="empty-state">
              <LockIcon className="empty-icon" />
              <Typography className="empty-title">
                This Account is Private
              </Typography>
              <Typography className="empty-text">
                Follow @{profileUser?.user_name} to see their photos and videos.
              </Typography>
            </Box>
          ) : !isLoading && activeTab === "posts" && postValues.length > 0 ? (
            <Grid container spacing={1} className="posts-grid">
              {postValues.map((post) => (
                <Grid size={{ xs: 6, sm: 6, md: 4 }} key={post?.post_id}>
                  <Box
                    className="post-thumbnail"
                    onClick={() => handlePostClick(post?.post_id)}
                  >
                    <img
                      src={`${commonFilePath}${post?.image_url}`}
                      alt={`Post ${post?.post_id}`}
                      className="image-preview"
                      loading="lazy"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : !isLoading && activeTab === "posts" && postValues.length === 0 ? (
            <Box className="empty-state">
              <GridOnOutlinedIcon className="empty-icon" />
              <Typography className="empty-title">No Posts Yet</Typography>
              <Typography className="empty-text">
                {isOwnProfile
                  ? "When you share photos, they'll appear on your profile."
                  : `${profileUser?.user_name} hasn't posted yet.`}
              </Typography>
            </Box>
          ) : !isLoading && activeTab === "saved" && savedPosts.length > 0 ? (
            <Grid container spacing={1} className="posts-grid">
              {savedPosts.map((post) => (
                <Grid size={{ xs: 6, sm: 6, md: 4 }} key={post?.post_id}>
                  <Box
                    className="post-thumbnail"
                    onClick={() => handlePostClick(post?.post_id)}
                  >
                    <img
                      src={`${commonFilePath}${post?.image_url}`}
                      alt={`Post ${post?.post_id}`}
                      className="image-preview"
                      loading="lazy"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : !isLoading && activeTab === "saved" && savedPosts.length === 0 ? (
            <Box className="empty-state">
              <Bookmark className="empty-icon" />
              <Typography className="empty-title">No Saved Posts</Typography>
              <Typography className="empty-text">
                Save posts that you want to see again.
              </Typography>
            </Box>
          ) : null}
        </Box>
      </Box>
      {unFollowConfirmModel && (
        <ConfirmationDialog
          open={unFollowConfirmModel}
          onClose={() => {
            setUnFollowConfirmModel(false);
            setUsersOffset(0);
          }}
          content={
            <Typography>
              Are you sure you want to unfollow this user?
            </Typography>
          }
          confirmButton={{
            buttonText: "Unfollow",
            onClick: () => {
              handleUnFollowClick(profileUser?.id ? profileUser?.id : null);
              setCanViewPosts(false);
              setUnFollowConfirmModel(false);
            },
          }}
          denyButton={{
            buttonText: "Cancel",
            onClick: () => {
              setUnFollowConfirmModel(false);
            },
          }}
        />
      )}
      {followUserListModel && (
        <FollowUserListDrawer
          open={followUserListModel}
          onClose={() => {
            setFollowUserListModel(false);
            setUsersOffset(0);
          }}
          selectedUserId={Number(profileUser?.id)}
          headingContent={followheadingContent || ""}
          followUsers={followUsers}
          currentUser={currentUser}
        />
      )}
      {userPostModalId && (
        <UserPostModal
          open={!!userPostModalId}
          onClose={() => {
            setUserPostModalId(null);
          }}
          postId={Number(userPostModalId)}
          currentUser={currentUser}
          profileUser={profileUser}
          updatePostSaveUnSaved={handleSavedUnSavedPost}
          onDeletePostClick={handleDeletePost}
        />
      )}
    </Box>
  );
};

export default ProfileComponent;
