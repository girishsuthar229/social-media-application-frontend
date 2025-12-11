"use client";
import React, { useState, useCallback, useMemo } from "react";
import { Heart, MessageCircle, Loader } from "lucide-react";
import PostActionMenu, { UpdatePostPayload } from "./postActionMenu";
import { IUserResponseData } from "@/models/userInterface";
import { AllPostListModel } from "@/models/postInterface";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import { getRelativeTime } from "@/util/helper";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import {
  allLikePostClickServices,
  likePostClickServices,
  unLikePostClickServices,
} from "@/services/likes-unlike-service.service";
import BackButton from "@/components/common/BackButton";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";
import LikeUserListDrawer from "@/components/common/SwipeableDrawerCommon/LikeUserListDrawer";
import CommentDrawer from "@/components/common/SwipeableDrawerCommon/CommentDrawer";
import { LikeUserListResponse } from "@/models/likesInterface";
import { CommentUserListResponse } from "@/models/commentsInterface";
import { allCommentPostClickServices } from "@/services/comments-service.service";
import { Box } from "@mui/material";
import Link from "next/link";
import PostCardSkeleton from "@/components/common/Skeleton/postCardSkeleton";
import Image from "next/image";

interface FeedProps {
  currentUser: IUserResponseData | null;
  posts: AllPostListModel[];
  onDeletePostClick: (postId: number) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

// Feed Component
const Feed: React.FC<FeedProps> = ({
  currentUser,
  posts,
  onDeletePostClick,
  isLoading,
  hasMore,
  onLoadMore,
}) => {
  const [loadingPostId, setLoadingPostId] = useState<number | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null);
  const [expandedContent, setExpandedContent] = useState<Set<number>>(
    new Set()
  );
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedPostUserId, setSelectedPostUserId] = useState<number | null>(
    null
  );
  const [likeDrawerOpen, setLikeDrawerOpen] = useState(false);
  const [likedUsers, setLikedUsers] = useState<LikeUserListResponse[]>([]);
  const [loaderComments, setLoaderComments] = useState<boolean>(false);
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [commentsUsers, setCommentsUsers] = useState<CommentUserListResponse[]>(
    []
  );

  const likeCloseDrawer = () => {
    setSelectedPostId(null);
    setLikeDrawerOpen(false);
  };
  const commentCloseDrawer = () => {
    setSelectedPostId(null);
    setCommentsModalOpen(false);
  };

  const toggleMenu = (postId: number) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
  };

  const updatePostSavedStatus = (postId: number, isSaved: boolean) => {
    posts.forEach((post) => {
      if (post.post_id === postId) {
        post.is_saved = isSaved;
      }
    });
  };

  const handlerPostUpdated = (
    postId: number,
    updatedData: UpdatePostPayload
  ) => {
    posts.forEach((post) => {
      if (post.post_id === postId) {
        post.content = updatedData?.content;
        post.self_comment = updatedData?.comment;
      }
    });
  };

  const updatePostLikeStatus = (
    postId: number,
    isLiked: boolean,
    likeCountChange: number
  ) => {
    posts.forEach((post) => {
      if (post.post_id === postId) {
        post.is_liked = isLiked;
        post.like_count += likeCountChange;
      }
    });
  };

  const handleLikePost = useCallback(
    async (postId: number) => {
      setLoadingPostId(postId);
      try {
        const response = await likePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          updatePostLikeStatus(postId, true, 1);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoadingPostId(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleUnLikePost = useCallback(
    async (postId: number) => {
      setLoadingPostId(postId);
      try {
        const response = await unLikePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          updatePostLikeStatus(postId, false, -1);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoadingPostId(null);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleLikeAllUserData = useCallback(
    async (postId: number) => {
      setSelectedPostId(postId);
      try {
        const response = await allLikePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          setLikeDrawerOpen(true);
          setLikedUsers(response?.data || []);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
    },

    []
  );

  const handleCommentAllUserData = useCallback(
    async (postId: number) => {
      setSelectedPostId(postId);
      posts.forEach((post) => {
        if (post.post_id === postId) {
          setSelectedPostUserId(post.user.id);
        }
      });

      try {
        const response = await allCommentPostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          setCommentsModalOpen(true);
          setCommentsUsers(response?.data || []);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoaderComments(false);
    },
    [posts]
  );

  const hanldePostComment = (newComment: CommentUserListResponse) => {
    setCommentsUsers((prev) => [newComment, ...prev]);
    posts.forEach((post) => {
      if (post.post_id === selectedPostId) {
        post.comment_count += 1;
      }
    });
  };

  const handleDeletePostComment = (
    commentId: number,
    select_post_id: number
  ) => {
    setCommentsUsers((prevComments) =>
      prevComments.filter((comment) => comment.id !== commentId)
    );
    posts.forEach((post) => {
      if (post.post_id === select_post_id) {
        post.comment_count -= 1;
      }
    });
  };

  // Handle Load More
  const handleLoadMore = useCallback(() => {
    if (onLoadMore && !isLoading) {
      onLoadMore();
    }
  }, [onLoadMore, isLoading]);

  // Memoized posts with animation
  const animatedPosts = useMemo(() => posts, [posts]);

  // Empty state
  if (!isLoading && animatedPosts.length === 0) {
    return (
      <div className={"feed"}>
        <div className={"feed-grid"}>
          <div className={"empty-feed-icon"}>📭</div>
          <h3 className={"empty-feed-title"}>No Posts Yet</h3>
          <p className={"empty-feed-text"}>
            Start following people to see their posts here!
          </p>
          <div className="forgot-link-div" style={{ paddingBlockEnd: 3 }}>
            <Link href={"/find-friends"} className="as-link-styling">
              Find Friends?
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toggleContentExpanded = (postId: number) => {
    setExpandedContent((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const isContentLong = (content: string) => {
    return content.length > 100;
  };

  return (
    <div className="feed">
      {/* Posts */}
      {animatedPosts.map((post, index) => {
        const isLiked = post.is_liked;
        const isExpanded = expandedContent.has(post.post_id);
        const shouldShowMore = isContentLong(post.content);
        const displayedComments = post.comments?.slice(0, 3) || [];
        const remainingCommentsCount: number =
          Number(post?.comment_count || 0) - Number(3);
        return (
          <article
            key={post.post_id}
            className="post-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card Header */}
            <header className="card-header">
              <UserlistWithFollowBtn
                user={{
                  id: post?.user?.id,
                  user_name: post?.user?.user_name,
                  photo_url: post?.user?.profile_pic_url,
                  bio: null,
                }}
                showBio={false}
                showTimeStamp={getRelativeTime(post.created_date)}
                showFullName={true}
                showFollowButton={false}
                currentUser={currentUser}
              />

              {/* Dropdown Menu Component */}
              <PostActionMenu
                postObj={{
                  postId: post.post_id,
                  userId: post.user.id,
                  is_saved: post.is_saved,
                }}
                loggedUserId={currentUser?.id || null}
                isMenuOpen={openMenuPostId === post.post_id}
                onToggleMenu={toggleMenu}
                onPostDelete={onDeletePostClick}
                onPostSavedUnsaved={updatePostSavedStatus}
                onPostUpdated={handlerPostUpdated}
              />
            </header>

            {/* Post Image */}
            <div className="image-wrapper">
              <Image
                width={1000}
                height={500}
                src={`${commonFilePath}${post.image_url}`}
                alt="Post"
                className="post-image"
                sizes="(max-width: 768px) 100vw, 50vw"
                loading="lazy"
              />
            </div>

            {/* Card Actions - Moved before content */}
            <footer className={"card-actions"}>
              {/* Like Button */}
              <button
                className={`action-button ${isLiked ? "liked" : ""}`}
                disabled={loadingPostId === post?.post_id}
                aria-label={isLiked ? "Unlike post" : "Like post"}
                title={isLiked ? "Unlike" : "Like"}
              >
                {loadingPostId === post?.post_id ? (
                  <Loader size={20} className="loading-spinner" />
                ) : (
                  <Heart
                    size={20}
                    className={`${isLiked ? "likeIcon" : ""}`}
                    fill={isLiked ? "currentColor" : "none"}
                    onClick={async (event) => {
                      event.preventDefault();
                      if (isLiked) {
                        await handleUnLikePost(post?.post_id);
                      } else {
                        await handleLikePost(post?.post_id);
                      }
                    }}
                  />
                )}
                <span
                  className="action-text"
                  onClick={(event) => {
                    event.preventDefault();
                    handleLikeAllUserData(post?.post_id);
                  }}
                >
                  {post?.like_count} Likes
                </span>
              </button>

              {/* Comment Button */}
              <button
                className={"action-button"}
                onClick={() => handleCommentAllUserData(post?.post_id)}
                aria-label="Comment on post"
                title="Comment"
              >
                <MessageCircle size={20} />
                <span className={"action-text"}>
                  {post?.comment_count} Comments
                </span>
              </button>
            </footer>

            {/* Card Content */}

            <div className="card-content">
              <p className={`caption ${isExpanded ? "expanded" : "collapsed"}`}>
                <span className="caption-username">{post.user.user_name}</span>{" "}
                {isExpanded || !shouldShowMore
                  ? post.content
                  : `${post.content.substring(0, 100)}...`}
                {shouldShowMore && (
                  <button
                    className="more-button"
                    onClick={() => toggleContentExpanded(post.post_id)}
                  >
                    {isExpanded ? "less" : "more"}
                  </button>
                )}
              </p>
            </div>
            {/* Self Comment */}
            {post.self_comment && (
              <div className="self-comment">
                <span className="comment-username">{post.user.user_name}</span>{" "}
                <span className="comment-content">{post.self_comment}</span>
              </div>
            )}
            {/* Comments Section */}
            {post.comments && post.comments.length > 0 && (
              <div className="comments-section">
                {displayedComments.map((comment, idx) => (
                  <div
                    key={`comment-${post.post_id}-${idx}`}
                    className="comment-item"
                  >
                    <span className="comment-username">
                      {comment.user_name}
                    </span>
                    <span className="comment-content">{comment.content}</span>
                  </div>
                ))}

                {/* View More Comments Button */}
                {remainingCommentsCount > 0 && (
                  <Box className="view-more-comments">
                    <BackButton
                      onClick={() => {
                        if (!loaderComments) {
                          setLoaderComments(true);
                          handleCommentAllUserData(post.post_id);
                        }
                      }}
                      labelText={
                        loaderComments
                          ? "Loading..."
                          : ` View all ${post.comment_count} comments`
                      }
                      showIcon={false}
                      underlineOnHover={true}
                    />
                  </Box>
                )}
              </div>
            )}
          </article>
        );
      })}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="load-more-wrapper">
          <BackButton
            onClick={handleLoadMore}
            labelText={"More Posts"}
            showIcon={false}
            underlineOnHover={true}
          />
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && <PostCardSkeleton showHeader showImage showContent />}

      {/* End of Feed */}
      {!hasMore && !isLoading && animatedPosts.length > 0 && (
        <div className="end-of-feed">
          <p className="end-of-feed-text">No more posts to load</p>
        </div>
      )}

      {/* Like Drawer */}
      {likeDrawerOpen && selectedPostId && (
        <LikeUserListDrawer
          selectedPostId={selectedPostId}
          open={likeDrawerOpen}
          onClose={likeCloseDrawer}
          likedUsers={likedUsers}
          currentUser={currentUser}
        />
      )}
      {/* Comments Drawer */}
      {commentsModalOpen && selectedPostId && (
        <CommentDrawer
          open={commentsModalOpen}
          selectedPostId={selectedPostId}
          selectedPostUserId={selectedPostUserId}
          onClose={commentCloseDrawer}
          comments={commentsUsers}
          onSendComment={(newComment) => hanldePostComment(newComment)}
          onPostDeleteComment={handleDeletePostComment}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default Feed;
