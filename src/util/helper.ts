import { jwtDecode } from "jwt-decode";
import moment from "moment";

export const regionDateAndTime = () => {
  return {
    DATE_FORMAT: "DD/MM/YYYY",
    TIME_FORMAT: "HH:mm:ss",
    DATE_TIME_FORMAT: "DD/MM/YYYY HH:mm:ss",
  };
};

export const getRelativeTime = (create_date: string): string => {
  if (!create_date) return "No date available";

  const now = moment();
  const date = moment(create_date);

  // Calculate the difference and return relative time
  const differenceInHours = now.diff(date, "hours");
  const differenceInDays = now.diff(date, "days");
  const differenceInMonths = now.diff(date, "months");
  const differenceInYears = now.diff(date, "years");

  // Return relative time based on the difference
  if (differenceInHours < 24) {
    return date.fromNow(); // e.g., "2 hours ago"
  } else if (differenceInDays < 30) {
    return date.fromNow(); // e.g., "1 day ago"
  } else if (differenceInMonths < 12) {
    return date.format("D MMM YYYY"); // e.g., "1 Jan 2024"
  } else if (differenceInYears) {
    return date.format("D MMM YYYY"); // e.g., "1 Jan 2024"
  } else {
    return date.toString();
  }
};

export const formatTimeMinAndSec = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const secs = (seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
};

// Helper function to check if the token is expired
export const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (e) {
    return true;
  }
};
