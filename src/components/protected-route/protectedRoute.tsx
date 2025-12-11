"use client";
import {
  useEffect,
  useState,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { CircularProgress } from "@mui/material";
import { userDetail } from "@/services/user-service.service";
import { IUserResponseData } from "@/models/userInterface";
import {
  RouterURLs,
  AuthBaseRoute,
  STATUS_CODES,
  localStorageKeys,
} from "@/util/constanst";
import { isTokenExpired } from "@/util/helper";
import AccessDenied from "../common/AccessDenied/AccessDenied ";
import PageNotFound from "../common/PageNotFound/PageNotFound";
import { toast } from "react-toastify";
import Header from "../layout/Header";

interface UserContextType {
  currentUser: IUserResponseData | null;
  setCurrentUser: React.Dispatch<
    React.SetStateAction<IUserResponseData | null>
  >;
  handleLogout: () => void;
  handlerUserDetailApi: () => void;
}

const UserContext = createContext<UserContextType>({
  currentUser: null,
  setCurrentUser: () => {},
  handleLogout: () => {},
  handlerUserDetailApi: () => {},
});

export const UseUserContext = () => useContext(UserContext);

type RouteStatus =
  | "loading"
  | "authenticated"
  | "access-denied"
  | "not-found"
  | "redirect";

const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [routeStatus, setRouteStatus] = useState<RouteStatus>("loading");
  const [currentUser, setCurrentUser] = useState<IUserResponseData | null>(
    null
  );
  const pathname = usePathname();
  const [hasLoadedUser, setHasLoadedUser] = useState(false);
  const publicRoutes = Object.values(RouterURLs);
  const protectedRoutes = Object.values(AuthBaseRoute);
  const isPublicRoute = publicRoutes.some((route) => pathname === route);
  const isProtectedRoute = protectedRoutes.some((route) => pathname === route);
  //   const allValidRoutes = [...publicRoutes, ...protectedRoutes];
  //   const isValidRoute = allValidRoutes.some((route) =>
  //     pathname.startsWith(route)
  //   );

  const loadUser = async (): Promise<boolean> => {
    try {
      const userDetailResponse = await userDetail();
      if (
        userDetailResponse?.data &&
        userDetailResponse.statusCode === STATUS_CODES.success
      ) {
        setCurrentUser(userDetailResponse.data);
        return true;
      }
      return false;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (error.statusCode === STATUS_CODES.internalServerError) {
        toast.error(error.message);
        return true;
      }
      console.error("Failed to load user:", error);
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(localStorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(localStorageKeys.TOKEN_EXPIRES_AT);
    setCurrentUser(null);
    setHasLoadedUser(false);
    router.push(RouterURLs.signIn);
  };

  const handlerUserDetailApi = () => {
    loadUser();
  };
  const checkAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (isPublicRoute) {
      setRouteStatus("authenticated");
      return;
    }

    if (isProtectedRoute && !accessToken) {
      return router.replace("/sign-in");
    }

    if (isProtectedRoute && accessToken) {
      const expToken = isTokenExpired(accessToken);

      if (expToken) {
        handleLogout();
        setRouteStatus("redirect");
        return;
      }

      if (!hasLoadedUser) {
        const isValidUser = await loadUser();
        if (isValidUser) {
          setRouteStatus("authenticated");
        } else {
          setRouteStatus("access-denied");
        }
        setHasLoadedUser(true);
      }
      return;
    }

    setRouteStatus("authenticated");
  };

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, router]);

  // Loading state
  if (routeStatus === "loading" || routeStatus === "redirect") {
    return (
      <div className="circular-progress-loader">
        <CircularProgress color="warning" />
      </div>
    );
  }

  if (routeStatus === "access-denied") {
    return <AccessDenied />;
  }

  if (routeStatus === "not-found") {
    return <PageNotFound />;
  }
  const shouldShowHeader = protectedRoutes.includes(pathname);
  return (
    <UserContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        handleLogout,
        handlerUserDetailApi,
      }}
    >
      <main>
        {shouldShowHeader && <Header />}
        {children}
      </main>
    </UserContext.Provider>
  );
};

export default ProtectedRoute;
