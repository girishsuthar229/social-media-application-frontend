import React from "react";
import { Box, Skeleton } from "@mui/material";

interface UserListSkeletonProps {
  count?: number;
  showBio?: boolean;
  showFullName?: boolean;
  showFollowButton?: boolean;
}

const UserListSkeleton: React.FC<UserListSkeletonProps> = ({
  count = 3,
  showBio = true,
  showFullName = true,
  showFollowButton = true,
}) => {
  const skeletonArray = [1, 2, 3].slice(0, count);

  return (
    <Box>
      {skeletonArray.map((_, index) => (
        <Box key={index} className="user-list-item-skeleton">
          {/* Avatar Section */}
          <Box className="user-info-section-skeleton" sx={{ width: "100%" }}>
            <Skeleton variant="circular" width={48} height={48} />

            {/* User Details */}
            <Box className="user-details-skeleton">
              <Skeleton variant="text" width="50%" height={20} />
              {showFullName && (
                <Skeleton variant="text" width="35%" height={16} />
              )}

              {/* Bio (Optional) */}
              {showBio && <Skeleton variant="text" width="80%" height={14} />}
            </Box>
          </Box>

          {/* Follow Button */}
          {showFollowButton && (
            <Box className="follow-button-container">
              <Skeleton
                variant="rectangular"
                width={100}
                height={32}
                className="skeleton-button"
              />
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default UserListSkeleton;
