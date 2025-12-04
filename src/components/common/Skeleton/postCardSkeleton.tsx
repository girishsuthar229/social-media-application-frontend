import { Box } from "@mui/material";
import React from "react";

interface PostListSkeletonProps {
  count?: number;
  showHeader?: boolean;
  showImage?: boolean;
  showContent?: boolean;
}
const PostCardSkeleton: React.FC<PostListSkeletonProps> = ({
  count = 2,
  showHeader = true,
  showImage = true,
  showContent = true,
}) => {
  const skeletonArray = [1, 2].slice(0, count);

  return (
    <Box className="feed-grid scrollbar skeleton-feed-grid">
      {skeletonArray.map((_, index) => (
        <Box key={`skeleton-${index}`} className="post-skeleton">
          {showHeader && (
            <Box className="skeleton-header">
              <Box className="skeleton-avatar" />
              <Box className="skeleton-text">
                <Box className="skeleton-line" />
                <Box className="skeleton-line" />
              </Box>
            </Box>
          )}
          {showImage && <Box className="skeleton-image" />}
          {showContent && (
            <>
              <Box className="skeleton-line" />
              <Box className="skeleton-content">
                <Box className="skeleton-line" />
              </Box>
            </>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default PostCardSkeleton;
