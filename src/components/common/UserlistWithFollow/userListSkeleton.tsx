import React from "react";
import { Box, Skeleton } from "@mui/material";

interface UserListSkeletonProps {
  count?: number;
  showFollowButton?: boolean;
  showBio?: boolean;
}

const UserListSkeleton: React.FC<UserListSkeletonProps> = ({
  count = 3,
  showFollowButton = true,
  showBio = true,
}) => {
  const skeletonArray = [1, 2, 3].slice(0, count);

  return (
    <Box>
      {skeletonArray.map((_, index) => (
        <Box key={index} className="user-list-item">
          {/* Avatar Section */}
          <Box className="user-info-section" sx={{ width: "100%" }}>
            <Skeleton
              variant="circular"
              width={48}
              height={48}
              className="user-avatar"
            />

            {/* User Details */}
            <Box className="user-details">
              <Skeleton
                variant="text"
                width="50%"
                height={20}
                className="user-username"
              />
              <Skeleton
                variant="text"
                width="35%"
                height={16}
                className="user-display-name"
              />

              {/* Bio (Optional) */}
              {showBio && (
                <Skeleton
                  variant="text"
                  width="80%"
                  height={14}
                  className="user-bio"
                />
              )}
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
