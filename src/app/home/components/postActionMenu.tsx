import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { toast } from "react-toastify";

interface PostActionMenuProps {
  postObj: {
    postId: number;
    userId: number;
  };
  loggedUserId: number | null;
  isMenuOpen: boolean;
  onToggleMenu: (postId: number) => void;
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({
  postObj,
  loggedUserId,
  isMenuOpen,
  onToggleMenu,
}) => {
  const isPostByCurrentUser = postObj.userId === loggedUserId;
  const handleEditPostClick = (postId: number) => {
    console.log("Edit post", postId);
    toast.info("coming soon!");
  };

  const handleDeletePostClick = (postId: number) => {
    console.log("Delete post", postId);
    toast.info("coming soon!");
  };

  const handleSavePostClick = (postId: number) => {
    console.log("Delete post", postId);
    toast.info("coming soon!");
  };

  return (
    <div className="more-options">
      <MoreVertIcon
        fontSize="medium"
        onClick={() => onToggleMenu(postObj?.postId)}
      />
      {isMenuOpen && (
        <div className="more-options-menu">
          {/* Only show Edit and Delete if the post is by the current user */}
          {isPostByCurrentUser && (
            <>
              <button
                className="post-menu-item"
                onClick={() => {
                  handleEditPostClick(postObj?.postId);
                  onToggleMenu(postObj?.postId);
                }}
              >
                <BorderColorOutlined fontSize="small" />
                Edit
              </button>
              <button
                className="post-menu-item"
                onClick={() => {
                  handleDeletePostClick(postObj?.postId);
                  onToggleMenu(postObj?.postId);
                }}
              >
                <DeleteOutlineRoundedIcon fontSize="small" />
                Delete
              </button>
            </>
          )}
          {/* Save option (always visible) */}
          <button
            className="post-menu-item"
            onClick={() => {
              handleSavePostClick(postObj?.postId);
              onToggleMenu(postObj?.postId);
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default PostActionMenu;
