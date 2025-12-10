"use client";
import { Lock, Shield } from "lucide-react";

const AccessDenied = () => {

  return (
    <div className="access-denied-container">
      <div className="access-denied-card">
        {/* Decorative elements */}
        <div className="decorCircleTop" />
        <div className="decorCircleBottom" />

        {/* Content */}
        <div className="access-denied-content">
          {/* Lock Icon with animation */}
          <div className="iconWrapper">
            <div className="pulseEffect" />
            <div className="iconCircle">
              <Lock size={60} color="#f36527" strokeWidth={2.5} />
            </div>
          </div>

          <h1 className="access-denied-title">Access Denied</h1>

          <p className="access-denied-description">
            You need to be signed in to view this content. Join our community to
            connect, share, and explore amazing content! 🎉
          </p>

          {/* Features showcase */}
          <div className="features">
            <div className="featureItem">
              <span className="featureIcon">📸</span>
              Share Moments
            </div>
            <div className="featureItem">
              <span className="featureIcon">🎬</span>
              Watch Reels
            </div>
            <div className="featureItem">
              <span className="featureIcon">💬</span>
              Connect
            </div>
          </div>

          {/* Security note */}
          <div className="securityNote">
            <Shield size={18} color="#718096" />
            <p>Your privacy and security are our top priority</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
