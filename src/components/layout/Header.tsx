"use client";

import {
  AppBar,
  Avatar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Home as HomeIcon,
  HomeOutlined as HomeOutlinedIcon,
  People as PeopleIcon,
  PeopleAltOutlined as PeopleAltOutlinedIcon,
  PlayCircleOutline as PlayCircleOutlineIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  AddCircleOutline as AddCircleOutlineIcon,
  AddCircle as AddCircleIcon,
  Logout as LogoutIcon,
  AccountCircle as AccountCircleIcon,
} from "@mui/icons-material";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { commonFilePath } from "@/util/constanst";
import { UseUserContext } from "../protected-route/protectedRoute";

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { currentUser, handleLogout } = UseUserContext();
  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  const handlerLogout = () => {
    handleLogout();
    handleProfileClose();
  };

  const handleProfileNavigate = () => {
    router.push("/profile");
    handleProfileClose();
  };

  const isActive: any = (route: string) => pathname === route;

  return (
    <AppBar position="static" className="header">
      <Toolbar className="toolbar">
        <Box sx={{ display: "flex", flex: 1 }} className="link-items">
          <Link href="/home" passHref>
            <IconButton
              className={`header-icon ${
                isActive("/home") ? "active" : "inactive"
              }`}
            >
              {isActive("/home") ? <HomeIcon /> : <HomeOutlinedIcon />}
            </IconButton>
          </Link>
          <Link
            href="/find-friends"
            onClick={() => {
              sessionStorage.removeItem("searchQuery");
            }}
            passHref
          >
            <IconButton
              className={`header-icon ${
                isActive("/find-friends") ? "active" : "inactive"
              }`}
            >
              {isActive("/find-friends") ? (
                <PeopleIcon />
              ) : (
                <PeopleAltOutlinedIcon />
              )}
            </IconButton>
          </Link>
          <Link href="/reels" passHref>
            <IconButton
              className={`header-icon ${
                isActive("/reels") ? "active" : "inactive"
              }`}
            >
              {isActive("/reels") ? (
                <PlayCircleFilledIcon />
              ) : (
                <PlayCircleOutlineIcon />
              )}
            </IconButton>
          </Link>
          <Link href="/notification" passHref>
            <IconButton
              className={`header-icon ${
                isActive("/notification") ? "active" : "inactive"
              }`}
            >
              {isActive("/notification") ? (
                <FavoriteIcon />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Link>
          <Link href="/create-post" passHref>
            <IconButton
              className={`header-icon ${
                isActive("/create-post") ? "active" : "inactive"
              }`}
            >
              {isActive("/create-post") ? (
                <AddCircleIcon />
              ) : (
                <AddCircleOutlineIcon />
              )}
            </IconButton>
          </Link>

          {/* Profile Avatar with Menu */}
          <Avatar
            className={`profile-avatar ${
              pathname == "/profile" ? "active" : ""
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
