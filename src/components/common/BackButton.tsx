import React from "react";
import { Button } from "@mui/material";
import ArrowBackIosNewRoundedIcon from "@mui/icons-material/ArrowBackIosNewRounded";
import SubdirectoryArrowRightIcon from "@mui/icons-material/SubdirectoryArrowRight";
import {
  GridOnOutlined as GridOnOutlinedIcon,
  Bookmark,
} from "@mui/icons-material";
import DoubleArrowIcon from "@mui/icons-material/DoubleArrow";
import { useRouter } from "next/navigation";
import { Edit, Share } from "@mui/icons-material";

interface BackButtonProps {
  labelText?: string;
  navigateUrl?: string;
  onClick?: () => void;
  showIcon?: boolean;
  fullWidth?: boolean;
  iconPosition?: "start" | "end";
  underlineOnHover?: boolean;
  iconName?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  labelText,
  navigateUrl,
  onClick,
  showIcon = true,
  iconPosition = "start",
  underlineOnHover = false,
  fullWidth = false,
  iconName = "single-arrow",
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      router.push(navigateUrl || "/");
    }
  };

  // Function to map the icon name to the correct MUI icon
  const getIconByName = (name: string) => {
    switch (name) {
      case "single-arrow":
        return <ArrowBackIosNewRoundedIcon />;
      case "double-arrow":
        return <DoubleArrowIcon />;
      case "sub-directory-arrow":
        return <SubdirectoryArrowRightIcon />;
      case "edit-button":
        return <Edit />;
      case "share-button":
        return <Share />;
      case "grid-outlined-icon":
        return <GridOnOutlinedIcon />;
      case "book-mark-icon":
        return <Bookmark />;
      default:
        return <ArrowBackIosNewRoundedIcon />;
    }
  };

  // Conditionally render the icon based on position and showIcon flag
  const icon = showIcon ? getIconByName(iconName) : null;

  return (
    <Button
      onClick={handleClick}
      className={`back-btn ${underlineOnHover ? "as-link-styling" : "as-btn"}`}
      startIcon={iconPosition === "start" && icon}
      endIcon={iconPosition === "end" && icon}
      fullWidth={fullWidth}
    >
      {labelText}
    </Button>
  );
};

export default BackButton;
