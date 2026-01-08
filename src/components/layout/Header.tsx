"use client";

import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Badge,
} from "@mui/material";
import {
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  People as PeopleIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  AddCircle as AddCircleIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
  Chat as ChatIcon,
  ChatOutlined as ChatOutlinedIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthBaseRoute, commonFilePath, STATUS_CODES } from "@/util/constanst";
import { UseUserContext } from "../protected-route/protectedRoute";
import { useChatMessagesHook } from "@/app/chats/useChatMessagesHook";
import { toast } from "@/util/reactToastify";
import { getUnReadMsgUsers } from "@/services/message-services.service";
import { IApiError } from "@/models/common.interface";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, handleLogout } = UseUserContext();
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const { newMessage, unreadCount, setUnreadCount } = useChatMessagesHook({
    currentUserId: currentUser?.id,
  });
  useEffect(() => {
    const unreadMessageUserCount = async () => {
      try {
        const response = await getUnReadMsgUsers();
        if (response?.data && response.statusCode === STATUS_CODES.success) {
          setUnreadCount(response.data?.totalCount);
        }
      } catch (error) {
        const err = error as IApiError;
        toast.error(err?.message);
      }
    };

    unreadMessageUserCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isChatRoute = pathname.startsWith(AuthBaseRoute.chatUser);
    const isChatUserRoute = pathname.startsWith(AuthBaseRoute.chatMessgae);
    if (
      newMessage &&
      newMessage.receiver.id === currentUser?.id &&
      !isChatRoute &&
      !isChatUserRoute
    ) {
      toast.newMessage(`${newMessage?.message || "sent you a message"}`, {
        userName: newMessage?.sender.user_name || "",
        photoUrl: newMessage?.sender.photo_url || "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage]);

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handlerLogout = () => {
    handleLogout();
    handleProfileClose();
  };

  const handleProfileNavigate = () => {
    router.push(AuthBaseRoute.profile);
    handleProfileClose();
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const isActive: any = (route: string) => pathname === route;

  return (
    <AppBar position="static" className="header">
      <Toolbar className="toolbar">
        <Box sx={{ display: "flex", flex: 1 }} className="link-items">
          <Link href={AuthBaseRoute.home} passHref>
            <IconButton
              className={`header-icon ${
                isActive(AuthBaseRoute.home) ? "active" : "inactive"
              }`}
            >
              {isActive(AuthBaseRoute.home) ? (
                <HomeIcon />
              ) : (
                <HomeOutlinedIcon />
              )}
            </IconButton>
          </Link>
          <Link
            href={AuthBaseRoute.findFirends}
            onClick={() => {
              sessionStorage.removeItem("searchQuery");
            }}
            passHref
          >
            <IconButton
              className={`header-icon ${
                isActive(AuthBaseRoute.findFirends) ? "active" : "inactive"
              }`}
            >
              {isActive(AuthBaseRoute.findFirends) ? (
                <PeopleIcon />
              ) : (
                <PeopleAltOutlinedIcon />
              )}
            </IconButton>
          </Link>
          <Link href={AuthBaseRoute.createPost} passHref>
            <IconButton
              className={`header-icon ${
                isActive(AuthBaseRoute.createPost) ? "active" : "inactive"
              }`}
            >
              {isActive(AuthBaseRoute.createPost) ? (
                <AddCircleIcon />
              ) : (
                <AddCircleOutlineIcon />
              )}
            </IconButton>
          </Link>
          <Link href={AuthBaseRoute.notification} passHref>
            <IconButton
              className={`header-icon ${
                isActive(AuthBaseRoute.notification) ? "active" : "inactive"
              }`}
            >
              {isActive(AuthBaseRoute.notification) ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Link>
          <Link
            href={AuthBaseRoute.chatUser}
            passHref
            onClick={() => {
              sessionStorage.removeItem("searchMessagesUsers");
            }}
          >
            <IconButton
              className={`header-icon ${
                isActive(AuthBaseRoute.chatUser) ||
                isActive(AuthBaseRoute.chatMessgae)
                  ? "active"
                  : "inactive"
              }`}
            >
              {unreadCount !== 0 ? (
                <Badge
                  badgeContent={unreadCount}
                  overlap="circular"
                  color="error"
                >
                  {isActive(AuthBaseRoute.chatUser) ||
                  isActive(AuthBaseRoute.chatMessgae) ? (
                    <ChatIcon />
                  ) : (
                    <ChatOutlinedIcon />
                  )}
                </Badge>
              ) : isActive(AuthBaseRoute.chatUser) ||
                isActive(AuthBaseRoute.chatMessgae) ? (
                <ChatIcon />
              ) : (
                <ChatOutlinedIcon />
              )}
            </IconButton>
          </Link>
          {/* Profile Avatar with Menu */}
          <Avatar
            className={`profile-avatar ${
              isActive(AuthBaseRoute.profile) ? "active" : ""
            }`}
            src={`${commonFilePath}${currentUser?.photo_url}`}
            onClick={handleProfileClick}
          />
        </Box>

        {/* Profile Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
          className="profile-menu"
        >
          <MenuItem
            onClick={handleProfileNavigate}
            className="header-menu-item"
          >
            <AccountCircleIcon sx={{ mr: 1 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handlerLogout} className="header-menu-item">
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
