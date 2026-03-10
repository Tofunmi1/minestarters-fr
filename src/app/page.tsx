"use client";

import { useState, useRef, KeyboardEvent } from "react";
import LoginView from "./components/LoginView";
import OtpView from "./components/OtpView";
import LoadingView from "./components/LoadingView";

type View = "login" | "otp" | "loading";

export default function LoginPage() {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ── Email handlers ────────────────────────────────────────────────────────

  const handleEmailSubmit = () => {
    if (!email.includes("@")) return;
    setView("otp");
  };

  // ── OTP handlers ──────────────────────────────────────────────────────────

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every(Boolean)) setView("loading");
  };

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.every(Boolean)) {
      setView("loading");
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...otp];
    text.split("").forEach((d, i) => { next[i] = d; });
    setOtp(next);
    otpRefs.current[Math.min(text.length, 5)]?.focus();
  };

  const handleResend = () => {
    setOtp(["", "", "", "", "", ""]);
    otpRefs.current[0]?.focus();
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const cardClass = [
    "auth-card",
    view === "loading" && "auth-card--loading",
    view === "otp" && "auth-card--otp",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {/* Full-screen backdrop */}
      <div className="page-bg">
        <div className={cardClass}>

          {view === "login" && (
            <LoginView
              email={email}
              onEmailChange={setEmail}
              onSubmit={handleEmailSubmit}
            />
          )}

          {view === "otp" && (
            <OtpView
              email={email}
              otp={otp}
              otpRefs={otpRefs}
              onOtpChange={handleOtpChange}
              onOtpKeyDown={handleOtpKeyDown}
              onOtpPaste={handleOtpPaste}
              onResend={handleResend}
            />
          )}

          {view === "loading" && <LoadingView />}

        </div>
      </div>
    </>
  );
}
