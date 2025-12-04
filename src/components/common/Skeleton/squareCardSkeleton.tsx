import { Box, Grid } from "@mui/material";
import React from "react";

interface SquareCardSkeletonProps {
  count?: number;
}
const SquareCardSkeleton: React.FC<SquareCardSkeletonProps> = ({
  count = 3,
}) => {
  const skeletonArray = [1, 2, 3].slice(0, count);

  return (
    <Grid container spacing={1} className="posts-grid">
      {skeletonArray.map((_, index) => (
        <Grid
          size={{ xs: 6, sm: 6, md: 4 }}
          key={`skeleton-${index}`}
          className="post-skeleton"
        >
          <Box className="post-thumbnail">
            <div className="skeleton-image" />
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default SquareCardSkeleton;
