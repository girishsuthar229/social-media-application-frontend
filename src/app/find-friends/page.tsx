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
  CircularProgress,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { useState, useEffect } from "react";
import { getAllUsers } from "@/services/user-service.service";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import {
  followUserService,
  unfollowUserService,
} from "@/services/follows-service.service";
import { UseUserContext } from "@/components/protected-route/protectedRoute";

interface User {
  id: number;
  user_name: string;
  first_name?: string;
  last_name?: string;
  photo_url?: string | null;
  bio?: string | null;
  is_following: boolean;
  follower_count: number;
  following_count: number;
}

const FindFriendsPage = () => {
  const [isFollowLoading, setIsFollowLoading] = useState<boolean>(false);
  const { setCurrentUser } = UseUserContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [userOffset, setUserOffset] = useState<number>(0);
  const [userLoading, setUserLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );

  const loadMoreUsers = async (reset = false) => {
    if (userLoading || (!userHasMore && !reset)) return;

    const payload = {
      limit: 10,
      offset: userOffset,
      search: searchQuery,
      sortBy: "created_date",
      sortOrder: "DESC",
    };
    setUserLoading(true);
    try {
      const response = await getAllUsers(payload);
      const newUsers = response.data?.rows || [];
      if (reset) {
        setSuggestedUsers(newUsers);
        setUserOffset(10);
      } else {
        setSuggestedUsers((prev) => [...prev, ...newUsers]);
        setUserOffset((prevOffset) => prevOffset + 10);
      }

      if (newUsers.length < 10) {
        setUserHasMore(false);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setUserLoading(false);
    }
  };

  const handlerSearchKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      setSuggestedUsers([]);
      setUserOffset(0);
      setUserHasMore(true);
      loadMoreUsers();
    }, 300);
    setDebounceTimer(timer);
  };

  const updateUserFollowStatus = (
    userId: number,
    isFollowing: boolean,
    followCountChange: number
  ) => {
    suggestedUsers.forEach((user) => {
      if (user.id === userId) {
        user.is_following = isFollowing;
        user.follower_count += followCountChange;
      }
    });
    setCurrentUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        following_count: (prev.following_count ?? 0) + followCountChange,
      };
    });
  };

  const handleFollowClick = async (user_id: number) => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      const response = await followUserService(user_id);
      if (response.statusCode === STATUS_CODES.success) {
        updateUserFollowStatus(user_id, true, 1);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleUnFollowClick = async (user_id: number) => {
    if (isFollowLoading) return;
    setIsFollowLoading(true);
    try {
      const response = await unfollowUserService(user_id);
      if (response.statusCode === STATUS_CODES.success) {
        updateUserFollowStatus(user_id, false, -1);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsFollowLoading(false);
    }
  };

  useEffect(() => {
    loadMoreUsers();
  }, []);

  return (
    <Box className="container">
      <Container maxWidth="lg" className="content-wrapper">
        {/* Search Section */}
        <Box className="search-section">
          <Typography variant="body2" className="subtitle">
            Discover and connect with people who share your interests
          </Typography>

          <TextField
            fullWidth
            placeholder="Search by name ..."
            value={searchQuery}
            onChange={handlerSearchKey}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon className="searchIcon" />
                  </InputAdornment>
                ),
              },
            }}
            className="common-textfield-input"
            sx={{
              ".MuiInputBase-input": { padding: "12px 12px 12px 0px" },
            }}
          />
        </Box>

        {/* Results Section */}
        <Grid
          container
          spacing={2}
          className="suggested-user-grid scrollbar"
          onScroll={(e) => {
            const bottom =
              e.currentTarget.scrollHeight -
                e.currentTarget.scrollTop -
                e.currentTarget.clientHeight <
              50;
            if (bottom && !userLoading && userHasMore) {
              loadMoreUsers();
            }
          }}
        >
          {suggestedUsers.length > 0 &&
            suggestedUsers.map((user) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={user.id}>
                <Card className="suggested-user-card">
                  <CardHeader
                    avatar={
                      <Avatar
                        src={`${commonFilePath}${user?.photo_url}`}
                        className="suggested-user-avatar"
                      />
                    }
                    title={
                      <Typography variant="subtitle1" className="user-username">
                        @ {user.user_name}
                      </Typography>
                    }
                    className="suggested-user-card-header"
                  />

                  <CardContent className="card-content">
                    <Typography variant="h6" className="user-full-name">
                      {[user.first_name, user.last_name]
                        .filter(Boolean)
                        .join(" ")
                        .trim()}
                    </Typography>
                    <Typography variant="body2" className="user-bio">
                      {user.bio}
                    </Typography>
                    <Typography variant="caption" className="followers-count">
                      {user.follower_count || 0} followers
                    </Typography>
                  </CardContent>

                  <CardActions className="user-list-item">
                    <Box className="follow-button-container">
                      <Button
                        variant={user?.is_following ? "outlined" : "contained"}
                        size="small"
                        className={`follow-button ${
                          user?.is_following ? "following" : ""
                        }`}
                        onClick={() =>
                          user?.is_following
                            ? handleUnFollowClick(user?.id)
                            : handleFollowClick(user?.id)
                        }
                        disabled={isFollowLoading}
                      >
                        {isFollowLoading ? (
                          <CircularProgress size={16} />
                        ) : user?.is_following ? (
                          "Following"
                        ) : (
                          "Follow"
                        )}
                      </Button>
                    </Box>
                  </CardActions>
                </Card>
              </Grid>
            ))}

          {userLoading &&
            [1, 2, 3].map((i) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={`skeleton-${i}`}>
                <Card className="suggested-user-card">
                  <CardHeader
                    avatar={
                      <Typography className="skeleton-image skeleton-circle" />
                    }
                    title={
                      <Typography className="skeleton-image skeleton-line" />
                    }
                    sx={{ paddingBlock: 1 }}
                  />
                  <CardContent sx={{ paddingBlock: 0 }}>
                    <Typography className="skeleton-image skeleton-content" />
                  </CardContent>
                  <CardActions sx={{ paddingInline: 2 }}>
                    <Typography className="skeleton-image skeleton-action" />
                  </CardActions>
                </Card>
              </Grid>
            ))}
          {!userLoading && suggestedUsers.length === 0 && (
            <Box className="noResults">
              <Typography variant="h6" className="noResultsTitle">
                No users found
              </Typography>
              <Typography variant="body2" className="noResultsText">
                Try searching with different keywords
              </Typography>
            </Box>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default FindFriendsPage;
