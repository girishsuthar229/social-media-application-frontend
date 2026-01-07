"use client";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";
import { IApiError } from "@/models/common.interface";
import { toast } from "@/util/reactToastify";
import BackButton from "@/components/common/BackButton";
import { handleShareData } from "@/util/helper";
import {
  AuthBaseRoute,
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
import PostGrid from "./postGrid";
import TabSections from "./tabSections";
import ProfileInfoSections from "./profileInfoSections";

interface ProfileComponentProps {
  profileUser: IAnotherUserResponse | null;
  currentUser: IUserResponseData | null;
  isOwnProfile: boolean;
  isUserNotFound?: boolean;
}
export enum PROFILE_TABS {
  POSTS = "posts",
  SAVED = "saved",
}
const ProfileComponent = ({
  profileUser,
  currentUser,
  isOwnProfile,
  isUserNotFound,
}: ProfileComponentProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<PROFILE_TABS>(PROFILE_TABS.POSTS);
  const [postValues, setPostValues] = useState<UserWiseAllPostsData[]>([]);
  const [postHasMore, setPostHasMore] = useState(true);
  const [savedPosts, setSavedPosts] = useState<AllSavedPostList[]>([]);
  const [isSavedPostsLoaded, setIsSavedPostsLoaded] = useState(false);
  const [canViewPosts, setCanViewPosts] = useState<boolean | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followStatus, setFollowStatus] = useState<string | null>(null);
  const [isFollowLoading, setIsFollowLoading] = useState(false);
  const [unFollowConfirmModel, setUnFollowConfirmModel] = useState(false);
  const [isFollowListLoading, setIsFollowListLoading] = useState(false);
  const [followUserListDrawer, setFollowUserListDrawer] = useState(false);
  const [followheadingContent, setFollowheadingContent] = useState<
    string | null
  >(null);
  const [followUserHasMore, setFollowUserHasMore] = useState(true);
  const [followUsers, setFollowUsers] = useState<FollowUserListResponse[]>([]);
  const [userPostModalId, setUserPostModalId] = useState<number | null>(null);

  const loadUserPosts = async (userId: number) => {
    setIsLoading(true);
    try {
      const payload = {
        limit: 10,
        offset: postValues.length || 0,
        sortBy: "created_date",
        sortOrder: "DESC",
        userId: userId || 0,
      };
      const res = await getUserUploadPost(payload);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        const allPosts = res.data?.rows || [];
        setPostValues((prev) => [...prev, ...allPosts]);
        if (res?.data?.rows?.length < 10) {
          setPostHasMore(false);
        }
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
    setUserPostModalId(null);
    if (!isOwnProfile) {
      setFollowUserListDrawer(false);
    }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileUser]);

  const handleFollowClick = async (userId: number | null) => {
    if (isFollowLoading || !userId) return;
    setIsFollowLoading(true);
    try {
      const response = await followUserService(userId);
      if (response.statusCode === STATUS_CODES.success) {
        setIsFollowing(response.data?.is_following || false);
        setFollowStatus(response.data?.follow_status || null);
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
        offset: savedPosts.length || 0,
        sortBy: "created_date",
        sortOrder: "DESC",
        userId: currentUser?.id,
      };
      const res = await getAllSavedPosts(payload);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        const allPosts = res.data?.rows || [];
        setSavedPosts((prev) => [...prev, ...allPosts]);
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
    setActiveTab(PROFILE_TABS.POSTS);
  };

  const handleSaveTab = () => {
    setActiveTab(PROFILE_TABS.SAVED);
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
        limit: 25,
        offset: followUsers.length || 0,
        sortBy: "created_date",
        sortOrder: "DESC",
      };
      const response = await followersListService(userId, payload);
      if (
        response.statusCode === STATUS_CODES.success &&
        response?.data?.rows
      ) {
        setFollowUserListDrawer(true);
        const newUsers = response?.data?.rows;
        setFollowUsers((prev) => [...prev, ...newUsers]);
        if (newUsers.length < 25) {
          setFollowUserHasMore(false);
        }
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
        limit: 25,
        offset: followUsers.length || 0,
        sortBy: "created_date",
        sortOrder: "DESC",
      };
      const response = await followingsListService(userId, payload);
      if (
        response.statusCode === STATUS_CODES.success &&
        response?.data?.rows
      ) {
        setFollowUserListDrawer(true);
        const newUsers = response?.data?.rows;
        setFollowUsers((prev) => [...prev, ...newUsers]);
        if (newUsers.length < 25) {
          setFollowUserHasMore(false);
        }
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
      setSavedPosts((prev) => [...prev, savePostData]);
    } else {
      setSavedPosts((prevPosts) =>
        prevPosts.filter((post) => post.post_id !== savePostData?.post_id)
      );
    }
  };
  return (
    <Box className="profile-page">
      <Box className="profile-card scrollbar">
        {usePathname() !== AuthBaseRoute.profile && (
          <Box paddingBlockEnd={1}>
            <BackButton labelText="Back" onClick={() => router.back()} />
          </Box>
        )}
        {/* Profile Info Section */}
        <ProfileInfoSections
          isOwnProfile={isOwnProfile}
          profileUser={profileUser}
          isUserNotFound={isUserNotFound}
          canViewPosts={canViewPosts}
          isFollowing={isFollowing}
          isFollowLoading={isFollowLoading}
          followStatus={followStatus}
          handleFollowClick={handleFollowClick}
          handlerUnfollowModel={handlerUnfollowModel}
          handleEditProfile={handleEditProfile}
          handleShareProfile={handleShareProfile}
          handleFollowersList={handleFollowersList}
          handleFollowingsList={handleFollowingsList}
        />

        <hr className="horitzonal-line" />

        {/* Tab Section */}
        {canViewPosts && (
          <TabSections
            isOwnProfile={isOwnProfile}
            activeTab={activeTab}
            handlePostTab={handlePostTab}
            handleSaveTab={handleSaveTab}
          />
        )}

        {/* Posts Grid */}
        <PostGrid
          isLoading={isLoading}
          canViewPosts={canViewPosts}
          activeTab={activeTab}
          postValues={postValues}
          savedPosts={savedPosts}
          postHasMore={postHasMore}
          loadUserPosts={loadUserPosts}
          profileUser={profileUser}
          isOwnProfile={isOwnProfile}
          handlePostClick={handlePostClick}
        />
      </Box>
      {unFollowConfirmModel && (
        <ConfirmationDialog
          open={unFollowConfirmModel}
          onClose={() => {
            setUnFollowConfirmModel(false);
            setFollowUsers([]);
            setFollowUserHasMore(true);
          }}
          content={"Are you sure you want to unfollow this user?"}
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
      {followUserListDrawer && (
        <FollowUserListDrawer
          open={followUserListDrawer}
          onClose={() => {
            setFollowUserListDrawer(false);
            setFollowUsers([]);
            setFollowUserHasMore(true);
          }}
          selectedUserId={Number(profileUser?.id)}
          headingContent={followheadingContent || ""}
          followUsers={followUsers}
          followUserHasMore={followUserHasMore}
          isFollowListLoading={isFollowListLoading}
          handleFollowersList={() =>
            handleFollowersList(profileUser?.id || null)
          }
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
