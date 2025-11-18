import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { toast } from "react-toastify";
import { Menu, MenuItem } from "@mui/material";
import { deletePost } from "@/services/post-service.service";
import { IApiError } from "@/models/common.interface";
import { STATUS_CODES } from "@/util/constanst";

interface PostActionMenuProps {
  postObj: {
    postId: number;
    userId: number;
  };
  loggedUserId: number | null;
  isMenuOpen: boolean;
  onToggleMenu: (postId: number) => void;
  onPostDelete: (postId: number) => void;
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({
  postObj,
  loggedUserId,
  isMenuOpen,
  onToggleMenu,
  onPostDelete,
}) => {
  const isPostByCurrentUser = postObj.userId === loggedUserId;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const handlePostClose = () => {
    setAnchorEl(null);
    onToggleMenu(0);
  };

  const handleEditPostClick = (postId: number) => {
    console.log("Edit post", postId);
    toast.info("coming soon!");
  };

  const handleDeletePostClick = async (postId: number) => {
    try {
      const response = await deletePost(postId);
      if (response?.statusCode === STATUS_CODES.success) {
        onPostDelete(postId);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const handleSavePostClick = (postId: number) => {
    console.log("Delete post", postId);
    toast.info("coming soon!");
  };

  return (
    <div className="more-options">
      <MoreVertIcon
        fontSize="medium"
        onClick={(event: React.MouseEvent<SVGSVGElement>) => {
          setAnchorEl(event.currentTarget as unknown as HTMLElement);
          onToggleMenu(postObj.postId);
        }}
      />

      <Menu
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handlePostClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        className="more-options-menu"
      >
        {isPostByCurrentUser && (
          <MenuItem
            key="edit"
            className="post-menu-item"
            onClick={() => {
              handleEditPostClick(postObj.postId);
              onToggleMenu(postObj.postId);
            }}
          >
            <BorderColorOutlined fontSize="small" />
            Edit
          </MenuItem>
        )}
        {isPostByCurrentUser && (
          <MenuItem
            key="delete"
            className="post-menu-item"
            onClick={() => {
              handleDeletePostClick(postObj.postId);
              onToggleMenu(postObj.postId);
            }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" />
            Delete
          </MenuItem>
        )}

        <MenuItem
          key="save"
          className="post-menu-item"
          onClick={() => {
            handleSavePostClick(postObj.postId);
            onToggleMenu(postObj.postId);
          }}
        >
          <BookmarkBorderIcon fontSize="small" />
          Save
        </MenuItem>
      </Menu>
    </div>
  );
};

export default PostActionMenu;
