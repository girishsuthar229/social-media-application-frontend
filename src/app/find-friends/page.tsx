"use client";
import {
  Box,
  TextField,
  Grid,
  Typography,
  InputAdornment,
  Container,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useMemo } from "react";
import { getAllUsers } from "@/services/user-service.service";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { UserAllListModel } from "@/models/userInterface";
import UserlistWithFollowBtn from "@/components/common/UserlistWithFollow/UserlistWithFollowBtn";
import BackButton from "@/components/common/BackButton";
import UserListSkeleton from "@/components/common/Skeleton/userListSkeleton";
import { Search, UserPlus } from "lucide-react";
import { debounce } from "lodash";

const FindFriendsPage = () => {
  const { currentUser } = UseUserContext();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [suggestedUsers, setSuggestedUsers] = useState<UserAllListModel[]>([]);
  const [userOffset, setUserOffset] = useState<number>(0);
  const [userLoading, setUserLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [isFocused, setIsFocused] = useState(false);

  const loadMoreUsers = async (searchName?: string) => {
    if (userLoading || !userHasMore) return;
    setUserLoading(true);
    const payload = {
      limit: 10,
      offset: userOffset,
      search: searchQuery || searchName,
      sortBy: "created_date",
      sortOrder: "DESC",
    };
    try {
      const response = await getAllUsers(payload);
      const newUsers = response.data?.rows || [];
      setSuggestedUsers((prev) => [...prev, ...newUsers]);
      setUserOffset((prevOffset) => prevOffset + 10);

      if (newUsers.length < 10) {
        setUserHasMore(false);
      } else {
        setUserHasMore(true);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setUserLoading(false);
    }
  };

  const debouncedSearch = useMemo(
    () =>
      debounce(async (value: string) => {
        setSuggestedUsers([]);
        setUserHasMore(false);
        setUserOffset(0);
        if (value.trim()) {
          await loadMoreUsers(value);
        } else {
          setUserLoading(false);
        }
      }, 300),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handlerSearchKey = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    const trimmedValue = value.trim();

    if (trimmedValue) {
      sessionStorage.setItem("searchQuery", trimmedValue);
      setUserLoading(true);
      debouncedSearch(trimmedValue.toLowerCase());
    } else {
      sessionStorage.removeItem("searchQuery");
      setSuggestedUsers([]);
      setUserHasMore(false);
      setUserLoading(false);
    }
  };

  const handlerClearSearchKey = () => {
    setUserLoading(true);
    debouncedSearch("");
    setSearchQuery("");
    sessionStorage.removeItem("searchQuery");
  };

  // Load the search query from sessionStorage if it exists
  useEffect(() => {
    const storedSearchQuery = sessionStorage.getItem("searchQuery");
    if (storedSearchQuery) {
      setSearchQuery(storedSearchQuery);
      loadMoreUsers(storedSearchQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            slotProps={{
              inputLabel: { shrink: isFocused || !!searchQuery },
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end" sx={{ alignItems: "center" }}>
                    {searchQuery && (
                      <IconButton
                        onClick={handlerClearSearchKey}
                        size="small"
                        sx={{ p: 0.5 }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    )}
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
          {suggestedUsers.map((user: UserAllListModel) => (
            <Grid size={{ xs: 12 }} key={user.id}>
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
                showFollowButton={false}
                currentUser={currentUser}
              />
            </Grid>
          ))}
        </Grid>

        {!userLoading && userHasMore && searchQuery.trim() !== "" && (
          <div className="load-more-div">
            <BackButton
              onClick={!userLoading ? loadMoreUsers : undefined}
              labelText={userLoading ? "Loading..." : "Load More"}
              showIcon={false}
              underlineOnHover={true}
            />
          </div>
        )}
        {userLoading && (
          <UserListSkeleton count={3} showBio={true} showFollowButton={false} />
        )}
        {/* Show Users or Empty States */}
        {!userLoading && searchQuery.trim() === "" && (
          <Box className="empty-state">
            <Search size={64} className="empty-icon" />
            <Box>
              <Typography variant="h6" className="empty-title">
                Find People Using the Search Key
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Type a name or keyword in the search bar to find people to
                connect with.
              </Typography>
            </Box>
          </Box>
        )}

        {!userLoading &&
          searchQuery.trim() !== "" &&
          suggestedUsers.length === 0 && (
            <Box className="empty-state">
              <UserPlus size={64} className="empty-icon" />
              <Box>
                <Typography variant="h6" className="empty-title">
                  No Users Found
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  We couldn&apos;t find any users matching your search. Try a
                  different query.
                </Typography>
              </Box>
            </Box>
          )}
      </Container>
    </Box>
  );
};

export default FindFriendsPage;
