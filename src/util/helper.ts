import { jwtDecode } from "jwt-decode";
import moment from "moment";

export const regionDateAndTime = () => {
  return {
    DATE_FORMAT: "YYYY-MM-DD",
    TIME_FORMAT: "HH:mm:ss",
    DATE_TIME_FORMAT: "YYYY-MM-DD HH:mm:ss",
  };
};

export const getRelativeTime = (create_date: string): string => {
  if (!create_date) return "No date available";

  const now = moment();
  const date = moment(create_date);

  const differenceInHours = now.diff(date, "hours");
  const differenceInDays = now.diff(date, "days");
  const differenceInMonths = now.diff(date, "months");
  const differenceInYears = now.diff(date, "years");

  if (differenceInHours < 24) {
    return date.fromNow();
  } else if (differenceInDays < 30) {
    return date.fromNow();
  } else if (differenceInMonths < 12) {
    return date.format("D MMM YYYY");
  } else if (differenceInYears) {
    return date.format("D MMM YYYY");
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

export const isTokenExpired = (token: string): boolean => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
    /* eslint-disable @typescript-eslint/no-explicit-any */
  } catch (e: any) {
    console.error(e);
    return true;
  }
};

export const handleShareData = (props: ShareData) => {
  if (navigator.share) {
    const shareData: ShareData = {
      title: props.title,
      text: props.text,
      url: props.url,
    };
    navigator
      .share(shareData)
      .then(() => console.log("Profile shared successfully"))
      .catch((error) => console.log("Error sharing:", error));
  } else {
    const url = props.url ?? "";
    navigator.clipboard.writeText(url);
  }
};
