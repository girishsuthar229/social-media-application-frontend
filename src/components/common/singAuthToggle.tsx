"use client";

import { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IndicatorStyle {
  left: number;
  width: number;
}

const AuthToggle = () => {
  const pathname = usePathname();
  const signInRef = useRef<HTMLAnchorElement>(null);
  const signUpRef = useRef<HTMLAnchorElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState<IndicatorStyle>({
    left: 0,
    width: 0,
  });
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      updateIndicator();
      setIsReady(true);
    }, 50);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateIndicator();
   // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const updateIndicator = () => {
    const activeRef = pathname === "/sign-up" ? signUpRef : signInRef;

    if (activeRef.current && containerRef.current) {
      const rect = activeRef.current.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();

      setIndicatorStyle({
        left: rect.left - containerRect.left,
        width: rect.width,
      });
    }
  };

  return (
    <Box className="auth-toggle" ref={containerRef}>
      <Link
        href="/sign-in"
        ref={signInRef}
        className={`auth-link ${pathname === "/sign-in" ? "active" : ""}`}
      >
        Sign In
      </Link>
      <Link
        href="/sign-up"
        ref={signUpRef}
        className={`auth-link ${pathname === "/sign-up" ? "active" : ""}`}
      >
        Sign Up
      </Link>

      <span
        className="auth-indicator"
        style={{
          left: `${indicatorStyle.left}px`,
          width: `${indicatorStyle.width}px`,
          opacity: isReady ? 1 : 0,
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      />
    </Box>
  );
};

export default AuthToggle;
