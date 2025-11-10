"use client";
import { usePromiseTracker } from "react-promise-tracker";
import { CircularProgress } from "@mui/material";
import { RouterURLs } from "@/util/constanst";

const GlobalLoader = () => {
  const { promiseInProgress } = usePromiseTracker();
  const publicRoutes = Object.values(RouterURLs);
  return (
    promiseInProgress &&
    !publicRoutes && (
      <>
        <div className="circular-progress-loader">
          <CircularProgress color="warning" />
        </div>
      </>
    )
  );
};

export default GlobalLoader;
