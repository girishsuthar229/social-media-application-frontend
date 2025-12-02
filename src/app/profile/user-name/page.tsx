"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProfileComponent from "../components/userProfile";
import { IAnotherUserResponse } from "@/models/userInterface";
import { UseUserContext } from "@/components/protected-route/protectedRoute";
import { toast } from "react-toastify";
import { getAnotherUserProfile } from "@/services/user-service.service";
import { STATUS_CODES, STATUS_ERROR } from "@/util/constanst";
import { IApiError } from "@/models/common.interface";

const AnotherProfile = () => {
  const { currentUser } = UseUserContext();
  const [profileUser, setProfileUser] = useState<IAnotherUserResponse | null>(
    null
  );
  const [isUserNotFound, setIsUserNotFound] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || null;

  const fetchProfile = async (username: string) => {
    try {
      const res = await getAnotherUserProfile(username);
      if (res?.data && res.statusCode === STATUS_CODES.success) {
        console.log("res.data", res.data);
        setProfileUser(res.data || []);
      }
    } catch (error) {
      const err = error as IApiError;
      toast.error(err?.message);
      if (
        err.error == STATUS_ERROR.UserNotFound &&
        err.statusCode == STATUS_CODES.notFound
      ) {
        setIsUserNotFound(true);
      }
    }
  };

  useEffect(() => {
    if (username) {
      fetchProfile(username?.toString());
    } else {
      setIsUserNotFound(true);
    }
  }, [username]);

  return (
    <ProfileComponent
      profileUser={profileUser}
      currentUser={currentUser}
      isOwnProfile={username === currentUser?.user_name}
      isUserNotFound={isUserNotFound}
    />
  );
};

export default AnotherProfile;
