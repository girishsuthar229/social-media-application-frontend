import { LikeUserListResponse } from "@/models/likesInterface";
import { IUserResponseData } from "@/models/userInterface";
import { Box, Typography } from "@mui/material";
import React from "react";
import UserlistWithFollowBtn from "../UserlistWithFollow/UserlistWithFollowBtn";
import { FollowingsEnum } from "@/util/constanst";
import UserListSkeleton from "../Skeleton/userListSkeleton";

interface LikeUserListProps {
  currentUser: IUserResponseData | null;
  likedUsers: LikeUserListResponse[];
  showFollowButton: boolean;
  loaderlikesUser: boolean;
}

const LikeUserList: React.FC<LikeUserListProps> = ({
  currentUser,
  likedUsers,
  showFollowButton,
  loaderlikesUser,
}) => {
  return (
    <Box className="drawer-content scrollbar">
      <div className="like-user-list">
        {!loaderlikesUser &&
          (likedUsers.length === 0 ? (
            <Typography className="no-likes">No likes yet.</Typography>
          ) : (
            likedUsers.map((likedUser: LikeUserListResponse, index: number) => (
              <Box key={index}>
                <UserlistWithFollowBtn
                  user={{
                    id: likedUser?.user?.id,
                    user_name: likedUser?.user?.user_name,
                    first_name: likedUser?.user?.first_name,
                    last_name: likedUser?.user?.last_name,
                    photo_url: likedUser?.user?.photo_url,
                    bio: likedUser?.user?.bio || null,
                    is_following: likedUser?.user?.is_following || false,
                    follow_status:
                      likedUser?.user?.follow_status || FollowingsEnum.PENDING,
                  }}
                  showBio={true}
                  showFullName={true}
                  showFollowButton={showFollowButton}
                  currentUser={currentUser}
                />
              </Box>
            ))
          ))}
        {loaderlikesUser && (
          <UserListSkeleton count={3} showBio={true} showFollowButton={true} />
        )}
      </div>
    </Box>
  );
};

export default LikeUserList;
