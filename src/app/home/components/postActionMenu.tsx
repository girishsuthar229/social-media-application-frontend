import React, { useState } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkRemoveOutlinedIcon from "@mui/icons-material/BookmarkRemoveOutlined";
import { toast } from "react-toastify";
import { Menu, MenuItem } from "@mui/material";
import { deletePost, updatePost } from "@/services/post-service.service";
import { IApiError } from "@/models/common.interface";
import { STATUS_CODES } from "@/util/constanst";
import {
  savePostClickServices,
  unSavePostClickServices,
} from "@/services/saved-service.service";
import CommonDialogModal from "@/components/common/commonDialog/commonDialog";
import AddEditPost, {
  AddEditPostData,
} from "@/app/create-post/components/addEditPost";

export interface UpdatePostPayload {
  user_id: number;
  content: string;
  comment: string;
}

interface PostActionMenuProps {
  postObj: {
    postId: number;
    userId: number;
    is_saved: boolean;
  };
  loggedUserId: number | null;
  isMenuOpen: boolean;
  onToggleMenu: (postId: number) => void;
  onPostDelete: (postId: number) => void;
  onPostSavedUnsaved: (postId: number, isSaved: boolean) => void;
  onPostUpdated: (postId: number, updatedData: UpdatePostPayload) => void;
}

const PostActionMenu: React.FC<PostActionMenuProps> = ({
  postObj,
  loggedUserId,
  isMenuOpen,
  onToggleMenu,
  onPostDelete,
  onPostSavedUnsaved,
  onPostUpdated,
}) => {
  const isPostByCurrentUser = postObj.userId === loggedUserId;
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userPostModalId, setUserPostModalId] = useState<number | null>(null);
  const [postLoading, setPostLoading] = useState(false);

  const handlePostClose = () => {
    setAnchorEl(null);
    onToggleMenu(0);
  };

  const handleEditPostClick = (postId: number) => {
    setUserPostModalId(postId);
  };

  const handleDeletePostClick = async (postId: number) => {
    try {
      const response = await deletePost(postId);
      if (response?.statusCode === STATUS_CODES.success) {
        toast.success(response?.message);
        onPostDelete(postId);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const handleSavePostClick = async (postId: number) => {
    try {
      const response = await savePostClickServices(postId);
      if (response?.statusCode === STATUS_CODES.success) {
        onPostSavedUnsaved(postId, true);
        toast.success(response.message);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  const handleUnSavePostClick = async (postId: number) => {
    try {
      const response = await unSavePostClickServices(postId);
      if (response?.statusCode === STATUS_CODES.success) {
        onPostSavedUnsaved(postId, false);
        toast.success(response.message);
      }
    } catch (err) {
      const error = err as IApiError;
      toast.error(error?.message);
    }
  };

  // const handleShareClick = async (postId: number) => {
  //   if (postId) {
  //     console.log("handleShareClick");
  //   }
  // };

  const handleEditPostSubmit = async (
    postId: number,
    values: AddEditPostData
  ) => {
    setPostLoading(true);
    const payloadData: UpdatePostPayload = {
      user_id: values?.user_id,
      content: values?.content,
      comment: values?.comment,
    };
    try {
      const response = await updatePost(postId, payloadData);
      if (response?.statusCode === STATUS_CODES.success) {
        setUserPostModalId(null);
        onPostUpdated(postId, payloadData);
        toast.success(response?.message);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
    } finally {
      setPostLoading(false);
    }
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
            if (postObj.is_saved) {
              handleUnSavePostClick(postObj.postId);
            } else {
              handleSavePostClick(postObj.postId);
            }
            onToggleMenu(postObj.postId);
          }}
        >
          {postObj.is_saved ? (
            <>
              <BookmarkRemoveOutlinedIcon fontSize="small" />
              Unsave
            </>
          ) : (
            <>
              <BookmarkAddOutlinedIcon fontSize="small" />
              Save
            </>
          )}
        </MenuItem>
        {/* <MenuItem
          key="share"
          className="post-menu-item"
          onClick={() => handleShareClick(postObj?.postId)}
        >
          <Share2 size={18} />
          <span className={"action-text"}>Share</span>
        </MenuItem> */}
      </Menu>
      {userPostModalId && (
        <CommonDialogModal
          open={!!userPostModalId}
          onClose={() => setUserPostModalId(null)}
          title="Edit Post"
        >
          <AddEditPost
            postId={userPostModalId}
            onEditPostClick={handleEditPostSubmit}
            postLoading={postLoading}
            onCanceModalClick={() => setUserPostModalId(null)}
          />
        </CommonDialogModal>
      )}
    </div>
  );
};

export default PostActionMenu;
