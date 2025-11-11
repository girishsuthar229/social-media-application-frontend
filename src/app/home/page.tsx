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

export const suggestesdAllUsers = [
  {
    id: 1,
    name: "Alice Wonderland",
    bio: "Adventurer | Travel Blogger | Nature Lover 🌍",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    followers: 5420,
  },
  {
    id: 2,
    name: "Bob Builder",
    bio: "Construction Expert | DIY Enthusiast 🛠️",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    followers: 3210,
  },
  {
    id: 1,
    name: "Alice",
    bio: "Adventurer",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    followers: 5420,
  },
  {
    id: 2,
    name: "Bob Builder",
    bio: "Construction Expert | DIY Enthusiast 🛠️",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    followers: 3210,
  },
  {
    id: 1,
    name: "Alice Wonderland",
    bio: "Adventurer | Travel Blogger | Nature Lover 🌍",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    followers: 5420,
  },
  {
    id: 2,
    name: "Bob Builder",
    bio: "Construction Expert | DIY Enthusiast 🛠️",
    avatar: "https://randomuser.me/api/portraits/men/5.jpg",
    followers: 3210,
  },
  {
    id: 3,
    name: "Sara Green",
    bio: "Foodie | Chef 🍣 | Passionate about flavors",
    avatar: "https://randomuser.me/api/portraits/women/6.jpg",
    followers: 7850,
  },
  {
    id: 4,
    name: "Mike Johnson",
    bio: "Tech Enthusiast | AI Developer 🤖",
    avatar: "https://randomuser.me/api/portraits/men/8.jpg",
    followers: 4120,
  },
  {
    id: 5,
    name: "Lisa Wong",
    bio: "Digital Artist | Designer ✨",
    avatar: "https://randomuser.me/api/portraits/women/9.jpg",
    followers: 6340,
  },
];

const Home = () => {
  const { currentUser } = UseUserContext();
  const [allUsers, setAllUsers] = useState<UserAllListModel[]>([]);
  const [allUsersTotalCount, setAllUsersTotalCount] = useState<number>();
  const [userOffset, setUserOffset] = useState(0);
  const [userLoading, setUserLoading] = useState(false);
  const [userHasMore, setUserHasMore] = useState(true);
  const [allUsersPosts, setAllUsersPosts] = useState<AllPostListModel[]>([]);
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
      const newUsers = response.data?.rows || [];
      if (newUsers.length < 10) {
        setUserHasMore(false);
      }

      setAllUsers((prev) => [...prev, ...newUsers]);
      setAllUsersTotalCount(response.data?.count);
      setUserOffset((prevOffset) => prevOffset + 10);
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
      const newPosts = response.data?.rows || [];
      if (newPosts.length < 10) {
        setPostHasMore(false);
      }
      setAllUsersPosts((prev) => [...prev, ...newPosts]);
      setPostOffset((prevOffset) => prevOffset + 10);
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
          <Box className="feed-grid scrollbar">
            <Feed
              currentUser={currentUser}
              suggestedUsers={allUsers}
              posts={allUsersPosts}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
