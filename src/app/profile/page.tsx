"use client";
import { useEffect, useState } from "react";
import { Typography, Box, Avatar, Grid } from "@mui/material";
import { useRouter } from "next/navigation";
import { IApiError } from "@/models/common.interface";
import { toast } from "react-toastify";
import BackButton from "@/components/common/BackButton";
import {
  GridOnOutlined as GridOnOutlinedIcon,
  Bookmark,
} from "@mui/icons-material";
import { formatNumber } from "@/util/helper";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { commonFilePath, STATUS_CODES } from "@/util/constanst";
import { getUserUploadPost } from "@/services/post-service.service";
import { UserWiseAllPostsData } from "@/models/postInterface";

const ProfilePage = () => {
  const router = useRouter();
  const { currentUser } = UseUserContext();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [postValues, setPostValues] = useState<UserWiseAllPostsData[]>([]);
  const [postOffset, setPostOffset] = useState(0);

  const userUploadPost = async () => {
    setIsLoading(true);
    try {
      const payload = {
        limit: 10,
        offset: postOffset,
        sortBy: "created_date",
        sortOrder: "DESC",
        userId: currentUser?.id,
      };
      const res = await getUserUploadPost(payload);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        const allPosts = res.data?.rows || [];
        setPostValues(allPosts);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    userUploadPost();
  }, []);

  const handleEditProfile = () => {
    router.push("/profile/edit");
  };
  const handleShareProfile = () => {
    if (navigator.share) {
      const data = {
        title: `${currentUser?.first_name} ${currentUser?.last_name}`,
        text: `Check out @${currentUser?.user_name}'s profile!`,
        url: `${window.location.href}?user_name=${currentUser?.user_name}`,
      };
      navigator
        .share(data)
        .then(() => console.log("Profile shared successfully", data))
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Profile link copied to clipboard!");
    }
  };

  const handlePostClick = (postId: number) => {
    console.log("Post clicked:", postId);
  };

  return (
    <Box className="user-profile-page scrollbar">
      <Box className="profile-card scrollbar">
        {/* Profile Info Section */}
        <Box className="profile-info-section">
          <Box className="profile-top">
            <Box className="profile-avatar-container">
              <Avatar
                src={`${commonFilePath}${currentUser?.photo_url}`}
                alt={currentUser?.user_name}
                className="profile-avatar-large"
              />
            </Box>
            {/* Name and Bio */}
            <Box className="profile-bio-section">
              <Typography className="profile-header-username">
                {currentUser?.user_name}
              </Typography>
              <Typography className="profile-full-name">
                {currentUser?.first_name} {currentUser?.last_name}
              </Typography>
              <Typography className="profile-bio">
                {currentUser?.bio}
              </Typography>
            </Box>
          </Box>
          <Box className="profile-status">
            <Box className="stat-item">
              <Typography component="span" className="stat-number">
                {formatNumber(currentUser?.posts_count || 0)}
              </Typography>
              <Typography component="span" className="stat-label">
                Posts
              </Typography>
            </Box>
            <Box className="stat-item">
              <Typography component="span" className="stat-number">
                {formatNumber(currentUser?.followers || 0)}
              </Typography>
              <Typography component="span" className="stat-label">
                Followers
              </Typography>
            </Box>
            <Box className="stat-item">
              <Typography component="span" className="stat-number">
                {formatNumber(currentUser?.following || 0)}
              </Typography>
              <Typography component="span" className="stat-label">
                Following
              </Typography>
            </Box>
          </Box>
          <Box className="profile-actions">
            <BackButton
              onClick={handleEditProfile}
              labelText="Edit Profile"
              iconPosition="start"
              iconName="edit-button"
              fullWidth
            />
            <BackButton
              onClick={handleShareProfile}
              labelText="Share Profile"
              iconPosition="start"
              iconName="share-button"
              fullWidth
            />
          </Box>
        </Box>
        <hr className="horitzonal-line" />
        {/* Tabs Section */}
        <Box className="profile-tabs">
          <span
            className={`tab-button ${activeTab === "posts" ? "active" : ""}`}
          >
            <BackButton
              onClick={() => setActiveTab("posts")}
              labelText="POSTS"
              iconPosition="start"
              iconName="grid-outlined-icon"
              fullWidth
            />
          </span>
          <span
            className={`tab-button ${activeTab === "saved" ? "active" : ""}`}
          >
            <BackButton
              onClick={() => setActiveTab("saved")}
              labelText="SAVED"
              iconPosition="start"
              iconName="book-mark-icon"
              fullWidth
            />
          </span>
        </Box>

        {/* Posts Grid */}
        <Box className="posts-grid-container">
          {/* Loading Skeleton */}
          {isLoading ? (
            <Grid container spacing={1} className="posts-grid">
              {[1, 2, 3].map((i) => (
                <Grid
                  size={{ xs: 6, sm: 6, md: 4 }}
                  key={`skeleton-${i}`}
                  className={"post-skeleton"}
                >
                  <Box className="post-thumbnail">
                    <div className={"skeleton-image"} />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : activeTab === "posts" && postValues.length > 0 ? (
            <Grid container spacing={1} className="posts-grid">
              {postValues.map((post) => (
                <Grid size={{ xs: 6, sm: 6, md: 4 }} key={post?.post_id}>
                  <Box
                    className="post-thumbnail"
                    onClick={() => handlePostClick(post?.post_id)}
                  >
                    <img
                      src={`${commonFilePath}${post?.image_url}`}
                      alt={`Post ${post?.post_id}`}
                      className="image-preview"
                      loading="lazy"
                    />
                  </Box>
                </Grid>
              ))}
            </Grid>
          ) : activeTab === "posts" && postValues.length === 0 ? (
            <Box className="empty-state">
              <GridOnOutlinedIcon className="empty-icon" />
              <Typography className="empty-title">No Posts Yet</Typography>
              <Typography className="empty-text">
                When you share photos, they'll appear on your profile.
              </Typography>
            </Box>
          ) : (
            <Box className="empty-state">
              <Bookmark className="empty-icon" />
              <Typography className="empty-title">No Saved Posts</Typography>
              <Typography className="empty-text">
                Save posts that you want to see again.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfilePage;
