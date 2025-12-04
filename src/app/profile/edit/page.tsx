import PostActionMenu from "@/app/home/components/postActionMenu";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";
import { CommentUserListResponse } from "@/models/commentsInterface";
import { IApiError } from "@/models/common.interface";
import { LikeUserListResponse } from "@/models/likesInterface";
import { IUserResponseData } from "@/models/userInterface";
import { allCommentPostClickServices } from "@/services/comments-service.service";
import {
  allLikePostClickServices,
  likePostClickServices,
  unLikePostClickServices,
} from "@/services/likes-unlike-service.service";
import { getPostById } from "@/services/post-service.service";
import { commonFilePath, FollowingsEnum, STATUS_CODES } from "@/util/constanst";
import { getRelativeTime } from "@/util/helper";
import {
  Box,
  Dialog,
  DialogContent,
  IconButton,
  Tab,
  Tabs,
  Typography,
  Avatar,
  Divider,
} from "@mui/material";
import { X, Heart, MessageCircle, Loader } from "lucide-react";
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
  onShareClick?: (postId: number) => void;
  onDeletePostClick: (postId: number) => void;
}

const UserPostModal = ({
  open,
  onClose,
  postId,
  currentUser,
  onShareClick,
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
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

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
  useEffect(() => {
    if (postId) {
      loadUserPostById(postId);
    }
  }, [postId]);

  const toggleMenu = (postId: number) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  };
  const updatePostSavedStatus = (postId: number, isSaved: boolean) => {
    if (postData?.id === postId) {
      postData.is_saved = isSaved;
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
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setSelectedPostId(null);
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
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setSelectedPostId(null);
    },
    [postData]
  );

  const handleLikeAllUserData = useCallback(
    async (postId: number) => {
      setSelectedPostId(postId);
      try {
        const response = await allLikePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          setLikedUsers(response?.data || []);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
    },
    [postData]
  );

  const handleCommentAllUserData = useCallback(
    async (postId: number) => {
      setSelectedPostId(postId);
      try {
        const response = await allCommentPostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          setCommentUsers(response?.data || []);
          setActiveTab(0);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoaderComments(false);
    },
    [postData]
  );

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
  const handleShareClick = useCallback(
    (postId: number) => {
      if (onShareClick) {
        onShareClick(postId);
      }
    },
    [onShareClick]
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      className="user-post-modal"
      maxWidth="lg"
      fullWidth
    >
      <DialogContent className="post-modal-container">
        {/* Close Button */}
        <IconButton className="post-modal-close-btn" onClick={onClose}>
          <X size={24} />
        </IconButton>

        {!postData && <p>post not found</p>}
        {postData && (
          <Box className="post-modal-content">
            {/* Left Side - Post Card */}
            <Box className="post-card-section">
              <article
                key={postData?.id}
                className="post-card"
                style={{ animationDelay: "100ms" }}
              >
                {/* Card Header */}
                <header className="card-header">
                  <UserlistWithFollowBtn
                    user={{
                      id: postData?.user.id,
                      user_name: postData?.user?.user_name,
                      photo_url: postData?.user?.profile_pic_url,
                      bio: getRelativeTime(postData?.created_date),
                    }}
                    showBio={true}
                    showFullName={false}
                    showFollowButton={false}
                    currentUser={currentUser}
                  />

                  {/* Dropdown Menu Component */}
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
                  />
                </header>

                {/* Post Image */}
                <div className="image-wrapper">
                  <img
                    src={`${commonFilePath}${postData?.image_url}`}
                    alt="Post"
                    className="post-image"
                    loading="lazy"
                  />
                </div>

                {/* Card Actions - Moved before content */}
                <footer className={"card-actions"}>
                  {/* Like Button */}
                  <button
                    className={`action-button ${
                      postData?.is_liked ? "liked" : ""
                    }`}
                    disabled={selectedPostId === postData?.id}
                    aria-label={
                      postData?.is_liked ? "Unlike post" : "Like post"
                    }
                    title={postData?.is_liked ? "Unlike" : "Like"}
                  >
                    {selectedPostId === postData?.id ? (
                      <Loader size={20} className="loading-spinner" />
                    ) : (
                      <Heart
                        size={20}
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
                        setActiveTab(1);
                      }}
                    >
                      {postData?.like_count} Likes
                    </span>
                  </button>
                  <button
                    className={"action-button"}
                    onClick={() => setActiveTab(0)}
                    aria-label="Comment on post"
                    title="Comment"
                  >
                    <MessageCircle size={20} />
                    <span className={"action-text"}>
                      {postData?.comment_count} Comments
                    </span>
                  </button>
                </footer>

                {/* Card Content */}

                <div className="card-content">
                  <p
                    className={`caption ${
                      expandedContent ? "expanded" : "collapsed"
                    }`}
                  >
                    <span className="caption-username">
                      {postData?.user.user_name}
                    </span>{" "}
                    {!!(postData?.content.length > 100)
                      ? `${postData?.content.substring(0, 100)}...`
                      : postData?.content}
                    {!!(postData?.content.length > 100) && (
                      <button
                        className="more-button"
                        onClick={() => setExpandedContent((prev) => !prev)}
                      >
                        {expandedContent ? "less" : "more"}
                      </button>
                    )}
                  </p>
                </div>
                {/* Self Comment */}
                {postData.self_comment && (
                  <div className="self-comment">
                    <span className="comment-username">
                      {postData.user.user_name}
                    </span>
                    <span className="comment-content">
                      {postData?.self_comment}
                    </span>
                  </div>
                )}
              </article>

              <Box className="post-stats">
                <Box className="stat-item">
                  <Heart size={18} className="stat-icon" />
                  <Typography variant="body2">
                    {postData?.like_count}{" "}
                    {postData?.like_count === 1 ? "Like" : "Likes"}
                  </Typography>
                </Box>
                <Box className="stat-item">
                  <MessageCircle size={18} className="stat-icon" />
                  <Typography variant="body2">
                    {postData?.comment_count}{" "}
                    {postData?.comment_count === 1 ? "Comment" : "Comments"}
                  </Typography>
                </Box>
              </Box>
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
                  label={
                    <Box className="tab-label">
                      <Heart size={18} />
                      <span>Likes ({likedUsers.length})</span>
                    </Box>
                  }
                />
                <Tab
                  label={
                    <Box className="tab-label">
                      <MessageCircle size={18} />
                      <span>Comments ({commentUsers.length})</span>
                    </Box>
                  }
                />
              </Tabs>

              <Divider />

              {/* Likes Tab Content */}
              {activeTab === 0 && (
                <Box className="user-list-content">
                  <Box className="drawer-wrapper">
                    <Box className="drawer-header">
                      <Typography variant="h6" className="drawer-title">
                        Liked by
                      </Typography>
                      <IconButton
                        className="drawer-close-btn"
                        onClick={onClose}
                      >
                        <X size={20} />
                      </IconButton>
                    </Box>

                    <Box className="drawer-content scrollbar">
                      <div className="like-user-list">
                        {likedUsers.length === 0 ? (
                          <Typography className="no-likes">
                            No likes yet.
                          </Typography>
                        ) : (
                          likedUsers.map(
                            (
                              likedUser: LikeUserListResponse,
                              index: number
                            ) => (
                              <Box key={index}>
                                <UserlistWithFollowBtn
                                  user={{
                                    id: likedUser?.user?.id,
                                    user_name: likedUser?.user?.user_name,
                                    first_name: likedUser?.user?.first_name,
                                    last_name: likedUser?.user?.last_name,
                                    photo_url: likedUser?.user?.photo_url,
                                    bio: likedUser?.user?.bio || null,
                                    is_following:
                                      likedUser?.user?.is_following || false,
                                    follow_status:
                                      likedUser?.user?.follow_status ||
                                      FollowingsEnum.PENDING,
                                  }}
                                  showBio={true}
                                  showFullName={true}
                                  showFollowButton={true}
                                  currentUser={currentUser}
                                />
                              </Box>
                            )
                          )
                        )}
                      </div>
                    </Box>
                  </Box>
                </Box>
              )}

              {/* Comments Tab Content */}
              {activeTab === 1 && (
                <Box className="user-list-content">
                  {commentUsers.length > 0 ? (
                    commentUsers.map((comment) => (
                      <Box key={comment?.user.id} className="comment-item">
                        <Avatar
                          src={comment?.user.photo_url}
                          alt={comment?.user.user_name}
                        />
                        <Box className="comment-content">
                          <Typography
                            variant="body2"
                            className="comment-user-name"
                          >
                            {comment?.user.user_name}
                          </Typography>
                          {comment?.user.user_name}
                          {comment?.comment && (
                            <Typography
                              variant="body2"
                              className="comment-text"
                            >
                              {comment?.comment}
                            </Typography>
                          )}
                          {comment?.created_date && (
                            <Typography
                              variant="caption"
                              className="comment-timestamp"
                            >
                              {getRelativeTime(comment?.created_date)}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    ))
                  ) : (
                    <Box className="empty-state">
                      <Typography variant="body2" color="textSecondary">
                        No comments yet
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UserPostModal;
