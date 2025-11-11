"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { Heart, MessageCircle, Share2, Loader } from "lucide-react";
import PostActionMenu from "./postActionMenu";
import { IUserResponseData, UserAllListModel } from "@/models/userInterface";
import { AllPostListModel } from "@/models/postInterface";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import { getRelativeTime } from "@/util/helper";
import { Avatar } from "@mui/material";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import {
  allLikePostClickServices,
  likePostClickServices,
  unLikePostClickServices,
} from "@/services/likes-unlike-serivce.service";

// Types
interface User {
  user_id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  avatar: string;
}

interface Post {
  id: number;
  user: { name: string; avatar: string };
  image: string;
  caption: string;
  likes: number;
  comments: number;
  timestamp?: string;
  isLiked?: boolean;
}

interface FeedProps {
  suggestedUsers: UserAllListModel[];
  currentUser: IUserResponseData | null;
  posts: AllPostListModel[];
  onPostClick?: (postId: number) => void;
  onLikeClick?: (postId: number, liked: boolean) => void;
  onCommentClick?: (postId: number) => void;
  onShareClick?: (postId: number) => void;
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

// Feed Component
const Feed: React.FC<FeedProps> = ({
  suggestedUsers,
  currentUser,
  posts,
  onPostClick,
  onLikeClick,
  onCommentClick,
  onShareClick,
  isLoading = false,
  hasMore = false,
  onLoadMore,
}) => {
  const [likedPosts, setLikedPosts] = useState();
  const [loadingPostId, setLoadingPostId] = useState<number | null>(null);
  const [openMenuPostId, setOpenMenuPostId] = useState<number | null>(null);
  const [expandedContent, setExpandedContent] = useState<Set<number>>(
    new Set()
  );
  const [commentsModalOpen, setCommentsModalOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  const toggleMenu = (postId: number) => {
    setOpenMenuPostId((prev) => (prev === postId ? null : postId));
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
          toast.success(response.message);
          updatePostLikeStatus(postId, true, 1);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoadingPostId(null);
    },
    [posts]
  );

  const handleUnLikePost = useCallback(
    async (postId: number) => {
      setLoadingPostId(postId);
      try {
        const response = await unLikePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          toast.success(response.message);
          updatePostLikeStatus(postId, false, -1);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoadingPostId(null);
    },
    [posts]
  );

  const handleLikeAllUserData = useCallback(
    async (postId: number) => {
      console.log("handleLikeAllUser click postId", postId);
      setLoadingPostId(postId);
      try {
        const response = await allLikePostClickServices(postId);
        if (response.statusCode === STATUS_CODES.success) {
          toast.success(response.message);
          console.log("handleLikeAllUser response:::", response);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
      setLoadingPostId(null);
    },
    [posts]
  );

  const handleCommentClick = useCallback(
    (postId: number) => {
      setSelectedPostId(postId);
      setCommentsModalOpen(true);

      if (onCommentClick) {
        onCommentClick(postId);
      }
    },
    [onCommentClick]
  );

  const handleShareClick = useCallback(
    (postId: number) => {
      if (onShareClick) {
        onShareClick(postId);
      }
    },
    [onShareClick]
  );

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
        const remainingCommentsCount = (post.comments?.length || 0) - 3;

        return (
          <article
            key={post.post_id}
            className="post-card"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Card Header */}
            <header className="card-header">
              <Avatar
                src={`${commonFilePath}${post.user.profile_pic_url}`}
                className="header-avatar"
                onClick={() => onPostClick?.(post.post_id)}
              />
              <h3 className="user-name">{post.user.user_name}</h3>
              {post.created_date && (
                <span className="timestamp">
                  {getRelativeTime(post.created_date)}
                </span>
              )}

              {/* Dropdown Menu Component */}
              <PostActionMenu
                postObj={{ postId: post.post_id, userId: post.user.id }}
                loggedUserId={currentUser?.id || null}
                isMenuOpen={openMenuPostId === post.post_id}
                onToggleMenu={toggleMenu}
              />
            </header>

            {/* Post Image */}
            <div className="image-wrapper">
              <img
                src={`${commonFilePath}${post.image_url}`}
                alt="Post"
                className="post-image"
                loading="lazy"
                onClick={() => onPostClick?.(post.post_id)}
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
                onClick={() => handleCommentClick(post?.post_id)}
                aria-label="Comment on post"
                title="Comment"
              >
                <MessageCircle size={20} />
                <span className={"action-text"}>
                  {post?.comment_count} Comments
                </span>
              </button>

              {/* Share Button */}
              <button
                className={"action-button"}
                onClick={() => handleShareClick(post?.post_id)}
                aria-label="Share post"
                title="Share"
              >
                <Share2 size={20} />
                <span className={"action-text"}>Share</span>
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
                  <button
                    className="view-more-comments"
                    onClick={() => handleCommentClick(post.post_id)}
                  >
                    View all {post.comment_count} comments
                  </button>
                )}
              </div>
            )}
          </article>
        );
      })}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="feed-grid scrollbar">
          {[1, 2, 3].map((i) => (
            <div key={`skeleton-${i}`} className="post-skeleton">
              <div className="skeleton-header">
                <div className="skeleton-avatar" />
                <div className="skeleton-text">
                  <div className="skeleton-line" />
                  <div className="skeleton-line" />
                </div>
              </div>
              <div className="skeleton-image" />
              <div className="skeleton-content">
                <div className="skeleton-line" />
                <div className="skeleton-line" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !isLoading && (
        <div className="load-more-wrapper">
          <button
            className="load-more-button"
            onClick={handleLoadMore}
            aria-label="Load more posts"
          >
            Load More Posts
          </button>
        </div>
      )}

      {/* End of Feed */}
      {!hasMore && animatedPosts.length > 0 && (
        <div className="end-of-feed">
          <p className="end-of-feed-text">No more posts to load</p>
        </div>
      )}

      {/* Comments Modal */}
      {commentsModalOpen && selectedPostId && (
        // <CommentsModal
        //   postId={selectedPostId}
        //   isOpen={commentsModalOpen}
        //   onClose={() => setCommentsModalOpen(false)}
        //   post={animatedPosts.find((p) => p.post_id === selectedPostId)}
        //   commonFilePath={commonFilePath}
        // />
        <></>
      )}
    </div>
  );
};

export default Feed;
