import React from "react";
import { PROFILE_TABS } from "./userProfile";
import { UserWiseAllPostsData } from "@/models/postInterface";
import { AllSavedPostList } from "@/models/savedinterface";
import { IAnotherUserResponse } from "@/models/userInterface";
import { Box, Grid, Typography } from "@mui/material";
import {
  GridOnOutlined as GridOnOutlinedIcon,
  Bookmark,
  Lock as LockIcon,
} from "@mui/icons-material";
import SquareCardSkeleton from "@/components/common/Skeleton/squareCardSkeleton";
import { commonFilePath } from "@/util/constanst";
import Image from "next/image";

interface PostGridProps {
  isLoading: boolean;
  canViewPosts: boolean | null;
  activeTab: PROFILE_TABS;
  postValues: UserWiseAllPostsData[];
  savedPosts: AllSavedPostList[];
  postHasMore: boolean;
  loadUserPosts: (userId: number, offset: number) => void;
  profileUser: IAnotherUserResponse | null;
  isOwnProfile: boolean;
  handlePostClick: (postId: number) => void;
}

const PostGrid: React.FC<PostGridProps> = ({
  isLoading,
  canViewPosts,
  activeTab,
  postValues,
  savedPosts,
  postHasMore,
  loadUserPosts,
  profileUser,
  isOwnProfile,
  handlePostClick,
}) => {
  return (
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
            loadUserPosts(profileUser?.id, postValues?.length);
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
      ) : !isLoading &&
        activeTab === PROFILE_TABS.POSTS &&
        postValues.length === 0 ? (
        <Box className="empty-state">
          <GridOnOutlinedIcon className="empty-icon" />
          <Typography className="empty-title">No Posts Yet</Typography>
          <Typography className="empty-text">
            {isOwnProfile
              ? "When you share photos, they'll appear on your profile."
              : `${profileUser?.user_name} hasn't posted yet.`}
          </Typography>
        </Box>
      ) : !isLoading &&
        activeTab === PROFILE_TABS.POSTS &&
        postValues.length > 0 ? (
        <Grid container spacing={1} className="posts-grid">
          {postValues.map((post) => (
            <Grid size={{ xs: 6, sm: 6, md: 4 }} key={post?.post_id}>
              <Box
                className="post-thumbnail"
                onClick={() => handlePostClick(post?.post_id)}
              >
                <Image
                  src={`${commonFilePath}${post?.image_url}`}
                  alt={`Post ${post?.post_id}`}
                  className="image-preview"
                  loading="lazy"
                  width={1000}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : !isLoading &&
        activeTab === PROFILE_TABS.SAVED &&
        savedPosts.length > 0 ? (
        <Grid container spacing={1} className="posts-grid">
          {savedPosts.map((post) => (
            <Grid size={{ xs: 6, sm: 6, md: 4 }} key={post?.post_id}>
              <Box
                className="post-thumbnail"
                onClick={() => handlePostClick(post?.post_id)}
              >
                <Image
                  src={`${commonFilePath}${post?.image_url}`}
                  alt={`Post ${post?.post_id}`}
                  className="image-preview"
                  loading="lazy"
                  width={1000}
                  height={500}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : !isLoading &&
        activeTab === PROFILE_TABS.SAVED &&
        savedPosts.length === 0 ? (
        <Box className="empty-state">
          <Bookmark className="empty-icon" />
          <Typography className="empty-title">No Saved Posts</Typography>
          <Typography className="empty-text">
            Save posts that you want to see again.
          </Typography>
        </Box>
      ) : null}
    </Box>
  );
};

export default PostGrid;
