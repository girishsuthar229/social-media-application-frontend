"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CardMedia,
  Container,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import BackButton from "@/components/common/BackButton";
import { IUserResponseData, UserAllListModel } from "@/models/userInterface";
import { commonFilePath } from "@/util/constanst";
import { getAllUsers } from "@/services/user-service.service";

interface User {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  followers?: number;
  isFollowing?: boolean;
}

interface SugSidebarProps {
  suggestedUsers: UserAllListModel[];
  currentUser: IUserResponseData | null;
  onLoadMoreUsers?: () => void;
  loading: boolean;
}

const SuggestionsSidebar = ({
  suggestedUsers,
  currentUser,
  onLoadMoreUsers,
  loading,
}: SugSidebarProps) => {
  return (
    <Grid size={{ xs: 12, md: 4 }}>
      <Card>
        <CardHeader
          avatar={
            <Avatar
              src={`${commonFilePath}${currentUser?.photo_url}`}
              sx={{ width: 75, height: 75 }}
            />
          }
          title={<Typography variant="h6">{currentUser?.user_name}</Typography>}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {currentUser?.bio}
          </Typography>
        </CardContent>
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
            <ListItem key={index} className="list-item">
              <div className="avataar-container">
                <Avatar src={`${commonFilePath}${user?.photo_url}`} />
                <div className="user-info">
                  <Typography variant="body1" component="div">
                    {user.user_name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {user.bio}
                  </Typography>
                </div>
              </div>
              <div className="follow-button-container">
                <Button
                  variant="outlined"
                  size="small"
                  className="follow-button"
                >
                  Follow
                </Button>
              </div>
            </ListItem>
          ))}
          <div className="load-more-div">
            <BackButton
              onClick={!loading ? onLoadMoreUsers : undefined} // Only trigger if not loading
              labelText={loading ? "Loading..." : "Load More"}
              showIcon={false}
              underlineOnHover={true}
            />
          </div>
        </List>
      </Box>
    </Grid>
  );
};

export default SuggestionsSidebar;
