import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import React, { useState } from "react";

interface SearchFieldProps {
  subtitle?: string;
  placeholder?: string;
  onSearchChange: (searchValue: string) => void;
  onClearSearch: () => void;
  className?: string;
  searchQuery: string;
}

const SearchField: React.FC<SearchFieldProps> = ({
  subtitle,
  placeholder = "Search by name...",
  onSearchChange,
  onClearSearch,
  searchQuery,
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    // const normalizedValue = value.trim().replace(/\s+/g, " ");
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    onClearSearch();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const normalizedValue = searchQuery.trim().replace(/\s+/g, " ");
      onSearchChange(normalizedValue);
    }
  };

  return (
    <Box className={`search-section ${className}`}>
      {subtitle && (
        <Typography variant="body2" className="subtitle">
          {subtitle}
        </Typography>
      )}

      <TextField
        fullWidth
        placeholder={placeholder}
        value={searchQuery}
        onChange={handleSearchChange}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        slotProps={{
          inputLabel: { shrink: isFocused || !!searchQuery },
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: searchQuery ? (
              <InputAdornment position="end" sx={{ alignItems: "center" }}>
                <IconButton
                  onClick={handleClearSearch}
                  size="small"
                  sx={{ p: 0.5 }}
                  aria-label="Clear search"
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </InputAdornment>
            ) : null,
          },
        }}
        className="common-textfield-input"
        sx={{
          ".MuiInputBase-input": { padding: "12px 12px 12px 0px" },
        }}
      />
    </Box>
  );
};

export default SearchField;
