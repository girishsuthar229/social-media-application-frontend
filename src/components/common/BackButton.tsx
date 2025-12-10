import React from "react";
import { Button } from "@mui/material";

import {
  GridOnOutlined as GridOnOutlinedIcon,
  Bookmark,
  ArrowBackIosNewRounded as ArrowBackIosNewRoundedIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  PersonAddAlt1Outlined as PersonAddAlt1OutlinedIcon,
  PersonRemoveAlt1Outlined as PersonRemoveAlt1OutlinedIcon,
  DoubleArrow as DoubleArrowIcon,
  DynamicFeed as DynamicFeedIcon,
} from "@mui/icons-material";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { Edit, Share } from "@mui/icons-material";

interface BackButtonProps {
  labelText?: string;
  navigateUrl?: string;
  onClick?: () => void;
  showIcon?: boolean;
  fullWidth?: boolean;
  className?: string;
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
  className,
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
      case "add-person-icon":
        return <PersonAddAlt1OutlinedIcon />;
      case "remove-person-icon":
        return <PersonRemoveAlt1OutlinedIcon />;
      case "dynamic-feed-icon":
        return <DynamicFeedIcon />;
      case "circular-progress":
        return (
          <CircularProgress
            size={20}
            className="circular-progress"
            thickness={5}
          />
        );
      default:
        return <ArrowBackIosNewRoundedIcon />;
    }
  };

  // Conditionally render the icon based on position and showIcon flag
  const icon = showIcon ? getIconByName(iconName) : null;

  return (
    <Button
      onClick={handleClick}
      className={`back-btn ${
        underlineOnHover ? "as-link-styling" : "as-btn"
      } ${className}`}
      startIcon={iconPosition === "start" && icon}
      endIcon={iconPosition === "end" && icon}
      fullWidth={fullWidth}
    >
      <span className="back-btn-lable">{labelText}</span>
    </Button>
  );
};

export default BackButton;
