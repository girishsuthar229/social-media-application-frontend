"use client";
import React from "react";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  Grid,
  List,
  Typography,
} from "@mui/material";
import BackButton from "@/components/common/BackButton";
import { IUserResponseData, UserAllListModel } from "@/models/userInterface";
import { commonFilePath } from "@/util/constanst";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";
import UserListSkeleton from "@/components/common/Skeleton/userListSkeleton";

interface SugSidebarProps {
  suggestedUsers: UserAllListModel[];
  allUsersTotalCount: number;
  currentUser: IUserResponseData | null;
  onLoadMoreUsers?: () => void;
  loading: boolean;
}

const SuggestionsSidebar = ({
  suggestedUsers,
  allUsersTotalCount,
  currentUser,
  onLoadMoreUsers,
  loading,
}: SugSidebarProps) => {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card className="sidebar-user-profile">
        <CardHeader
          avatar={
            <Avatar
              src={`${commonFilePath}${currentUser?.photo_url}`}
              sx={{ width: 75, height: 75 }}
            />
          }
          title={
            <>
              <Typography variant="h6" className="current-user-username">
                {currentUser?.user_name}
              </Typography>
              <Typography variant="subtitle1" className="current-display-name">
                {[currentUser?.first_name, currentUser?.last_name]
                  .filter(Boolean)
                  .join(" ")
                  .trim()}
              </Typography>
            </>
          }
        />
        <Typography
          variant="body2"
          color="text.secondary"
          className="current-bio user-bio"
          title={`${currentUser?.bio}`}
        >
          {currentUser?.bio}
        </Typography>
        <CardContent sx={{ display: "flex", justifyContent: "center" }}>
          <BackButton
            navigateUrl="/profile"
            labelText="view your profile"
            iconPosition="start"
            iconName="sub-directory-arrow"
            underlineOnHover={true}
          />
        </CardContent>
      </Card>
      {/* Bottom: Suggested Users (list) */}
      <Box className="suggested-user-div">
        <Typography variant="h6" gutterBottom>
          Suggested Users
        </Typography>
        <List className="scrollbar">
          {suggestedUsers.map((user: UserAllListModel, index: number) => (
            <Box key={index}>
              <UserlistWithFollowBtn
                user={{
                  id: user?.id,
                  user_name: user?.user_name,
                  first_name: user?.first_name,
                  last_name: user?.last_name,
                  photo_url: user?.photo_url,
                  bio: user?.bio || null,
                  is_following: user?.is_following,
                  follow_status: user?.follow_status,
                }}
                showBio={true}
                showFullName={true}
                showFollowButton={true}
                currentUser={currentUser}
              />
            </Box>
          ))}
          {loading ? (
            <UserListSkeleton
              count={3}
              showBio={true}
              showFollowButton={true}
            />
          ) : (
            Number(suggestedUsers.length) < Number(allUsersTotalCount) && (
              <div className="load-more-div">
                <BackButton
                  onClick={!loading ? onLoadMoreUsers : undefined}
                  labelText={loading ? "Loading..." : "Load More"}
                  showIcon={false}
                  underlineOnHover={true}
                />
              </div>
            )
          )}
        </List>
      </Box>
    </Grid>
  );
};

export default SuggestionsSidebar;
