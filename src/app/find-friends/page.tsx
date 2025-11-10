"use client";
import {
  Box,
  TextField,
  Grid,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  InputAdornment,
  Container,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useState, useMemo, useEffect } from "react";
import { suggestesdAllUsers } from "../home/page";

interface User {
  id: number;
  name: string;
  bio: string;
  avatar: string;
  followers?: number;
  isFollowing?: boolean;
}

const FindFriendsPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set());

  useEffect(() => {
    setSuggestedUsers(suggestesdAllUsers);
  }, []);

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) {
      return suggestedUsers;
    }
    return suggestedUsers.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.bio.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, suggestedUsers]);

  const handleFollow = (userId: number) => {
    const newFollowed = new Set(followedUsers);
    if (newFollowed.has(userId)) {
      newFollowed.delete(userId);
    } else {
      newFollowed.add(userId);
    }
    setFollowedUsers(newFollowed);
  };

  return (
    <Box className="container">
      <Container maxWidth="lg" className="contentWrapper">
        {/* Search Section */}
        <Box className="searchSection">
          <Typography variant="h4" className="title">
            Find Friends
          </Typography>
          <Typography variant="body2" className="subtitle">
            Discover and connect with people who share your interests
          </Typography>

          <TextField
            fullWidth
            placeholder="Search by name or bio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon className="searchIcon" />
                </InputAdornment>
              ),
            }}
            className="searchField"
          />
        </Box>

        {/* Results Section */}
        {filteredUsers.length > 0 ? (
          <Grid container spacing={3} className="usersGrid">
            {filteredUsers.map((user) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={user.id}>
                <Card className="userCard">
                  <CardHeader
                    avatar={<Avatar src={user.avatar} className="userAvatar" />}
                    className="cardHeader"
                  />

                  <CardContent className="cardContent">
                    <Typography variant="h6" className="userName">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" className="userBio">
                      {user.bio}
                    </Typography>
                    {user.followers && (
                      <Typography variant="caption" className="followers">
                        {user.followers} followers
                      </Typography>
                    )}
                  </CardContent>

                  <CardActions className="cardActions">
                    <Button
                      variant={
                        followedUsers.has(user.id) ? "contained" : "outlined"
                      }
                      fullWidth
                      onClick={() => handleFollow(user.id)}
                      className={`followButton ${
                        followedUsers.has(user.id) ? "followed" : ""
                      }`}
                    >
                      {followedUsers.has(user.id) ? "Following" : "Follow"}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box className="noResults">
            <Typography variant="h6" className="noResultsTitle">
              No users found
            </Typography>
            <Typography variant="body2" className="noResultsText">
              Try searching with different keywords
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default FindFriendsPage;
