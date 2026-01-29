"use client";
import { useEffect, useState } from "react";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import ProfileComponent from "./components/userProfile";
import { IAnotherUserResponse } from "@/models/userInterface";
import { STATUS_CODES } from "@/util/constanst";
import { userDetail } from "@/services/user-service.service";

const ProfilePage = () => {
  const { currentUser } = UseUserContext();
  const [profileUser, setProfileUser] = useState<IAnotherUserResponse | null>(
    null
  );

  const loadUser = async () => {
    try {
      const userDetailResponse = await userDetail();
      if (
        userDetailResponse?.data &&
        userDetailResponse.statusCode === STATUS_CODES.success
      ) {
        const userData = userDetailResponse.data;
        const profilData: IAnotherUserResponse = {
          id: userData?.id ?? 0,
          user_name: userData?.user_name ?? "",
          first_name: userData?.first_name ?? "",
          last_name: userData?.last_name ?? "",
          bio: userData?.bio ?? "",
          photo_url: userData?.photo_url ?? "",
          is_private: userData?.is_private ?? true,
          is_following: userData ? true : false,
          follower_count: userData?.follower_count,
          following_count: userData?.following_count,
          post_count: userData?.post_count,
        };
        setProfileUser(profilData?.id ? profilData : null);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Failed to load user:", error);
      return false;
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <ProfileComponent
      profileUser={profileUser}
      currentUser={currentUser}
      isOwnProfile={true}
    />
  );
};

export default ProfilePage;
