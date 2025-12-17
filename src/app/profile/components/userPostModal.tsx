import PostActionMenu, {
  UpdatePostPayload,
} from "@/app/home/components/postActionMenu";
import CommentUsersList from "@/components/common/CommentUserList/commentUsersList";
import CommonDialogModal from "@/components/common/commonDialog/commonDialog";
import LikeUserList from "@/components/common/LikeUserList/likeUserList";
import PostCardSkeleton from "@/components/common/Skeleton/postCardSkeleton";
import UserListSkeleton from "@/components/common/Skeleton/userListSkeleton";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";
import { CommentUserListResponse } from "@/models/commentsInterface";
import { IApiError } from "@/models/common.interface";
import { LikeUserListResponse } from "@/models/likesInterface";
import { AllSavedPostList } from "@/models/savedinterface";
import {
  IAnotherUserResponse,
  IUserResponseData,
} from "@/models/userInterface";
import { allCommentPostClickServices } from "@/services/comments-service.service";
import {
  allLikePostClickServices,
  likePostClickServices,
  unLikePostClickServices,
} from "@/services/likes-unlike-service.service";
import { getPostById } from "@/services/post-service.service";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import { getRelativeTime } from "@/util/helper";
import { Box, Tab, Tabs, Typography } from "@mui/material";
import { Heart, MessageCircle, Loader } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface IPost {
  id: number;
  content: string;
  image_url: string;
  like_count: number;
  share_count: number;
  comment_count: number;
  self_comment: string | null;
  created_date: string;
  modified_date: string | null;
  is_liked: boolean;
  is_saved: boolean;
  user: {
    id: number;
    user_name: string;
    profile_pic_url: string;
  };
}
interface IPostModalProps {
  open: boolean;
  onClose: () => void;
  postId: number | null;
  currentUser: IUserResponseData | null;
  profileUser: IAnotherUserResponse | null;
  updatePostSaveUnSaved: (isSaved: boolean, data: AllSavedPostList) => void;
  onDeletePostClick: (postId: number) => void;
}

const UserPostModal = ({
  open,
  onClose,
  postId,
  currentUser,
  profileUser,
  updatePostSaveUnSaved,
  onDeletePostClick,
}: IPostModalProps) => {
  const [activeTab, setActiveTab] = useState(0); // 1 for likes, 0 for comments
  const [isLoading, setIsLoading] = useState(false);
  const [postData, setPostData] = useState<IPost | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [loaderLike, setLoaderLike] = useState<boolean>(false);
  const [likedUsers, setLikedUsers] = useState<LikeUserListResponse[]>([]);
  const [loaderComments, setLoaderComments] = useState<boolean>(false);
  const [commentUsers, setCommentUsers] = useState<CommentUserListResponse[]>(
    []
  );
  const [expandedContent, setExpandedContent] = useState<boolean>(false);

  const loadUserPostById = async (postId: number) => {
    setIsLoading(true);
    try {
      const res = await getPostById(postId);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        setPostData(res.data);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLikeAllUserData = useCallback(async (postId: number) => {
    setLoaderLike(true);
    try {
      const response = await allLikePostClickServices(postId);
      if (response.statusCode === STATUS_CODES.success) {
        setLikedUsers(response?.data || []);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setLoaderLike(false);
    }
  }, []);

  const handleCommentAllUserData = useCallback(async (postId: number) => {
    setLoaderComments(true);
    try {
      const response = await allCommentPostClickServices(postId);
      if (response.statusCode === STATUS_CODES.success) {
        setCommentUsers(response?.data || []);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setLoaderComments(false);
    }
  }, []);

  const hanldePostComment = (newComment: CommentUserListResponse) => {
    setCommentUsers((prev) => [newComment, ...prev]);
    if (postData?.id === postId) {
      postData.comment_count += 1;
    }
  };
  const handleDeletePostComment = (
    commentId: number,
    select_post_id: number
  ) => {
    setCommentUsers((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
    if (postData?.id === select_post_id) {
      postData.comment_count -= 1;
    }
  };

  const updatePostLikeStatus = (
    postId: number,
    isLiked: boolean,
    likeCountChange: number
  ) => {
    if (postData?.id === postId) {
      postData.is_liked = isLiked;
      postData.like_count += likeCountChange;
    }
  };
  const handleLikePost = useCallback(
    async (postId: number) => {
      setSelectedPostId(postId);
      try {
        const response = await likePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          updatePostLikeStatus(postId, true, 1);
          const newData: LikeUserListResponse = {
            id: currentUser?.id || 0,
            created_date: new Date().toISOString(),
            user: {
              id: currentUser?.id || 0,
              user_name: currentUser?.user_name || "",
              first_name: currentUser?.first_name || "",
              last_name: currentUser?.last_name || "",
              photo_url: currentUser?.photo_url || "",
              bio: currentUser?.bio || "",
              is_following: false,
              follow_status: "pending",
            },
          };
          setLikedUsers((prev) => [...prev, { ...newData }]);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      } finally {
        setSelectedPostId(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [postData]
  );
  const handleUnLikePost = useCallback(
    async (postId: number) => {
      setSelectedPostId(postId);
      try {
        const response = await unLikePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          updatePostLikeStatus(postId, false, -1);
          setLikedUsers((prev) =>
            prev.filter((user) => user.user.id !== currentUser?.id)
          );
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      } finally {
        setSelectedPostId(null);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [postData]
  );

  const toggleMenu = (postId: number) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const updatePostSavedStatus = (postId: number, isSaved: boolean) => {
    if (postData?.id === postId) {
      postData.is_saved = isSaved;
      const savePostData: AllSavedPostList = {
        post_id: postData?.id,
        image_url: postData?.image_url,
        like_count: postData?.like_count,
        comment_count: postData?.comment_count,
        share_count: postData?.share_count,
      };
      updatePostSaveUnSaved(isSaved, savePostData);
    }
  };

  const handlerPostUpdated = (
    postId: number,
    updatedData: UpdatePostPayload
  ) => {
    if (postData?.id === postId) {
      postData.content = updatedData?.content;
      postData.self_comment = updatedData?.comment;
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue === 0) {
      handleLikeAllUserData(postId ? postId : 0);
    }
    if (newValue === 1) {
      handleCommentAllUserData(postId ? postId : 0);
    }
    setActiveTab(newValue);
  };

  useEffect(() => {
    if (postId) {
      loadUserPostById(postId);
      handleLikeAllUserData(postId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [postId]);
  return (
    <CommonDialogModal open={open} onClose={onClose} title="User Post">
      <Box className="post-modal-content">
        {/* Left Side - Tabs and User List */}
        <Box className="post-card-section">
          {!isLoading && postData && (
            <>
              <Box className="post-header">
                <UserlistWithFollowBtn
                  user={{
                    id: postData?.user.id,
                    user_name: postData?.user?.user_name,
                    photo_url: postData?.user?.profile_pic_url,
                    bio: null,
                  }}
                  showTimeStamp={getRelativeTime(postData?.created_date)}
                  showBio={true}
                  showFullName={false}
                  showFollowButton={false}
                  currentUser={currentUser}
                />
                <PostActionMenu
                  postObj={{
                    postId: postData?.id,
                    userId: postData?.user.id,
                    is_saved: postData?.is_saved,
                  }}
                  loggedUserId={currentUser?.id || null}
                  isMenuOpen={openMenuPostId === postData?.id}
                  onToggleMenu={toggleMenu}
                  onPostDelete={onDeletePostClick}
                  onPostSavedUnsaved={updatePostSavedStatus}
                  onPostUpdated={handlerPostUpdated}
                />
              </Box>
              <Box className="post-body">
                {postData?.image_url && (
                  <Box className="post-image-container">
                    <Image
                      src={`${commonFilePath}${postData?.image_url}`}
                      alt="Post"
                      className="post-image"
                      loading="lazy"
                      width={1000}
                      height={500}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </Box>
                )}
              </Box>
              <Box className={"card-actions"}>
                <button
                  className={`action-button ${
                    postData?.is_liked ? "liked" : ""
                  }`}
                  aria-label={postData?.is_liked ? "Unlike post" : "Like post"}
                  title={postData?.is_liked ? "Unlike" : "Like"}
                >
                  {selectedPostId === postData?.id ? (
                    <Loader size={20} className="loading-spinner" />
                  ) : (
                    <Heart
                      size={18}
                      className={`${postData?.is_liked ? "likeIcon" : ""}`}
                      fill={postData?.is_liked ? "currentColor" : "none"}
                      onClick={async (event) => {
                        event.preventDefault();
                        if (postData?.is_liked) {
                          await handleUnLikePost(postData?.id);
                        } else {
                          await handleLikePost(postData?.id);
                        }
                      }}
                    />
                  )}
                  <span
                    className="action-text"
                    onClick={(event) => {
                      event.preventDefault();
                      setActiveTab(0);
                    }}
                  >
                    {postData?.like_count}{" "}
                    {postData?.like_count === 1 ? "Like" : "Likes"}
                  </span>
                </button>
                <button
                  className={"action-button"}
                  onClick={() => {
                    setActiveTab(1);
                    handleCommentAllUserData(postData?.id);
                  }}
                  aria-label="Comment on post"
                  title="Comment"
                >
                  <MessageCircle size={18} />
                  <span className={"action-text"}>
                    {postData?.comment_count}{" "}
                    {postData?.comment_count === 1 ? "Comment" : "Comments"}
                  </span>
                </button>
              </Box>
              <Box className="card-content">
                <p
                  className={`caption ${
                    expandedContent ? "expanded" : "collapsed"
                  }`}
                >
                  <span className="caption-username">
                    {postData?.user.user_name}
                  </span>
                  {expandedContent || !!!(postData?.content.length > 100)
                    ? postData?.content
                    : `${postData?.content.substring(0, 100)}...`}
                  {!!(postData?.content.length > 100) && (
                    <button
                      className="more-button"
                      onClick={() => setExpandedContent((prev) => !prev)}
                    >
                      {expandedContent ? "less" : "more"}
                    </button>
                  )}
                </p>
              </Box>
            </>
          )}
          {/* Loading Skeleton  And Not Found*/}
          {!isLoading && !postData && <Typography>post not found</Typography>}
          {isLoading && (
            <PostCardSkeleton showHeader showImage showContent count={1} />
          )}
        </Box>

        {/* Right Side - Tabs and User List */}
        <Box className="user-list-section">
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            className="user-list-tabs"
            variant="fullWidth"
          >
            <Tab
              className={`tab-button`}
              value={0}
              label={
                <Box className="tab-label">
                  <Heart size={18} />
                  <span>Likes ({postData?.like_count})</span>
                </Box>
              }
            />
            <Tab
              className={`tab-button`}
              value={1}
              label={
                <Box className="tab-label">
                  <MessageCircle size={18} />
                  <span>Comments ({postData?.comment_count})</span>
                </Box>
              }
            />
          </Tabs>
          {/* Likes Tab Content */}
          {activeTab === 0 && (
            <Box className="user-list-content">
              {!loaderLike && (
                <LikeUserList
                  likedUsers={likedUsers}
                  currentUser={currentUser}
                />
              )}
              {loaderLike && (
                <UserListSkeleton
                  count={3}
                  showFullName={true}
                  showBio={true}
                  showFollowButton={true}
                />
              )}
            </Box>
          )}
          {/* Comments Tab Content */}
          {activeTab === 1 && (
            <Box className="user-list-content">
              {!loaderComments && (
                <CommentUsersList
                  selectedPostId={postId || 0}
                  selectedPostUserId={Number(profileUser?.id) || 0}
                  comments={commentUsers}
                  onSendComment={hanldePostComment}
                  onPostDeleteComment={handleDeletePostComment}
                  currentUser={currentUser}
                />
              )}
              {loaderComments && (
                <UserListSkeleton
                  count={3}
                  showFullName={true}
                  showBio={true}
                  showFollowButton={true}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>
    </CommonDialogModal>
  );
};

export default UserPostModal;
