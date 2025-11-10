"use client";
import { useRouter } from "next/navigation";
import { SearchOutlined as SearchOutlinedIcon } from "@mui/icons-material";
import BackButton from "../BackButton";

const PageNotFound = () => {
  const router = useRouter();

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        <div className="decorCircleTop" />
        <div className="decorCircleBottom" />
        <div className="access-denied-content">
          <div className="page-not-found-code">404</div>
          <div className="page-not-found-search-icon">
            <SearchOutlinedIcon
              sx={{ fontSize: 45, color: "#f36527", strokeWidth: 2.5 }}
            />
          </div>

          <h1 className="access-denied-title">Content Not Found</h1>

          <p className="access-denied-description">
            Oops! The page you're looking for seems to have vanished into the
            social media void. Let's get you back on track! 📱
          </p>

          {/* Action Buttons */}
          <BackButton labelText="Back" onClick={() => router.back()} />
        </div>
      </div>
    </div>
  );
};

export default PageNotFound;
