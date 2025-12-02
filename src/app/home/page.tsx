"use client";
import { Box } from "@mui/material";
import Feed from "./components/Feed";
import SuggestionsSidebar from "./components/SuggestionsSidebar";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { UserAllListModel } from "@/models/userInterface";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/services/user-service.service";
import { getAllPosts } from "@/services/post-service.service";
import { AllPostListModel } from "@/models/postInterface";
import { toast } from "react-toastify";
import { IApiError } from "@/models/common.interface";
import { STATUS_CODES } from "@/util/constanst";

const Home = () => {
  const { currentUser } = UseUserContext();
  const [allUsers, setAllUsers] = useState<UserAllListModel[]>([]);
  const [allUsersTotalCount, setAllUsersTotalCount] = useState<number>();
  const [userOffset, setUserOffset] = useState<number>(0);
  const [userLoading, setUserLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [allUsersPosts, setAllUsersPosts] = useState<AllPostListModel[]>([]);
  const [allUsersPostTotalCount, setAllUsersPostTotalCount] =
    useState<number>();
  const [postOffset, setPostOffset] = useState(0);
  const [postLoading, setPostLoading] = useState(false);
  const [postHasMore, setPostHasMore] = useState(true);

  const loadMoreUsers = async () => {
    if (userLoading || !userHasMore) return;
    setUserLoading(true);
    const payload = {
      limit: 10,
      offset: userOffset,
      sortBy: "created_date",
      sortOrder: "DESC",
    };

    try {
      const response = await getAllUsers(payload);
      if (response?.data && response.statusCode === STATUS_CODES.success) {
        const newUsers = response.data?.rows || [];
        if (newUsers.length < 10) {
          setUserHasMore(false);
        }
        setAllUsers((prev) => [...prev, ...newUsers]);
        setAllUsersTotalCount(response.data?.count);
        setUserOffset((prevOffset) => prevOffset + 10);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setUserLoading(false);
    }
  };

  const loadMorePosts = async () => {
    if (postLoading || !postHasMore) return;
    setPostLoading(true);
    const payload = {
      limit: 10,
      offset: postOffset,
      sortBy: "created_date",
      sortOrder: "DESC",
    };

    try {
      const response = await getAllPosts(payload);
      if (response?.data && response.statusCode === STATUS_CODES.success) {
        const newPosts = response.data?.rows || [];
        if (newPosts.length < 10) {
          setPostHasMore(false);
        }
        setAllUsersPosts((prev) => [...prev, ...newPosts]);
        setAllUsersPostTotalCount(response.data?.count);
        setPostOffset((prevOffset) => prevOffset + 10);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setPostLoading(false);
    }
  };

  useEffect(() => {
    loadMoreUsers();
    loadMorePosts();
  }, []);

  const handleDeletePost = (postId: number) => {
    setAllUsersPosts((prevPosts) =>
      prevPosts.filter((post) => post.post_id !== postId)
    );
  };
  return (
    <Box className="page-wrapper">
      {/* Main Content */}
      <Box className="main-content">
        <Box className="container homepage-container-box ">
          {/* Left Sidebar - Suggestions */}
          <Box className="sidebar-grid">
            <SuggestionsSidebar
              currentUser={currentUser}
              onLoadMoreUsers={loadMoreUsers}
              suggestedUsers={allUsers}
              allUsersTotalCount={allUsersTotalCount ? allUsersTotalCount : 0}
              loading={userLoading}
            />
          </Box>

          {/* Center - Feed */}
          <Box
            className="feed-grid scrollbar"
            onScroll={(e) => {
              const bottom =
                e.currentTarget.scrollHeight -
                  e.currentTarget.scrollTop -
                  e.currentTarget.clientHeight <
                10;
              if (bottom && postHasMore && !postLoading) {
                loadMorePosts();
              }
            }}
          >
            <Feed
              currentUser={currentUser}
              suggestedUsers={allUsers}
              posts={allUsersPosts}
              onLoadMore={loadMorePosts}
              isLoading={postLoading}
              hasMore={
                allUsersPostTotalCount
                  ? allUsersPostTotalCount > postOffset
                    ? true
                    : false
                  : false
              }
              onDeletePostClick={handleDeletePost}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
