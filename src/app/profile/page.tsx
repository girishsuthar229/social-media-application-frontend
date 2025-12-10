"use client";
import { useEffect, useState } from "react";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import ProfileComponent from "./components/userProfile";
import { IAnotherUserResponse } from "@/models/userInterface";

const ProfilePage = () => {
  const { currentUser } = UseUserContext();
  const [profileUser, setProfileUser] = useState<IAnotherUserResponse | null>(
    null
  );

  useEffect(() => {
    const profilData: IAnotherUserResponse = {
      id: currentUser?.id ?? 0,
      user_name: currentUser?.user_name ?? "",
      first_name: currentUser?.first_name ?? "",
      last_name: currentUser?.last_name ?? "",
      bio: currentUser?.bio ?? "",
      photo_url: currentUser?.photo_url ?? "",
      is_private: currentUser?.is_private ?? true,
      is_following: currentUser ? true : false,
      follower_count: currentUser?.follower_count,
      following_count: currentUser?.following_count,
      post_count: currentUser?.post_count,
    };
    setProfileUser(profilData?.id ? profilData : null);
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
