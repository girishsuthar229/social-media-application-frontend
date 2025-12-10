import React from "react";
import { PROFILE_TABS } from "./userProfile";
import BackButton from "@/components/common/BackButton";
import { Box } from "@mui/material";

interface TabSectionsProps {
  isOwnProfile: boolean;
  activeTab: PROFILE_TABS;
  handlePostTab: () => void;
  handleSaveTab: () => void;
}

const TabSections: React.FC<TabSectionsProps> = ({
  isOwnProfile,
  activeTab,
  handlePostTab,
  handleSaveTab,
}) => {
  return (
    <Box className="profile-tabs">
      <span
        className={`tab-button ${
          activeTab === PROFILE_TABS.POSTS ? "active" : ""
        }`}
      >
        <BackButton
          onClick={handlePostTab}
          labelText="Posts"
          iconPosition="start"
          iconName="grid-outlined-icon"
          fullWidth
        />
      </span>
      {isOwnProfile && (
        <span
          className={`tab-button ${
            activeTab === PROFILE_TABS.SAVED ? "active" : ""
          }`}
        >
          <BackButton
            onClick={handleSaveTab}
            labelText="Saved"
            iconPosition="start"
            iconName="book-mark-icon"
            fullWidth
          />
        </span>
      )}
    </Box>
  );
};

export default TabSections;
