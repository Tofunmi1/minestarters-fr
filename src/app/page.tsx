"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import {
  usePrivy,
  useLoginWithEmail,
  useLoginWithSms,
  useLoginWithOAuth,
  useConnectWallet,
  useWallets,
  type WalletListEntry,
} from "@privy-io/react-auth";
import LoginView from "./components/LoginView";
import OtpView from "./components/OtpView";
import LoadingView from "./components/LoadingView";
import TermsView from "./components/TermsView";
import SuccessView from "./components/SuccessView";
import SmsLoginView from "./components/SmsLoginView";
import WalletView from "./components/WalletView";
import MoreWalletsView from "./components/MoreWalletsView";

type View =
  | "login"
  | "otp"
  | "loading"
  | "terms"
  | "success"
  | "sms"
  | "wallet"
  | "more-wallets";

const RECENT_KEY = "ms_recent_method";

export default function LoginPage() {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [authError, setAuthError] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);
  const [addedWallets, setAddedWallets] = useState<WalletListEntry[]>([]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const otpMode = useRef<"email" | "phone">("email");
  const pendingWalletType = useRef<string | null>(null);
  const preAuthRef = useRef(false);

  const saveRecent = (method: string) => {
    localStorage.setItem(RECENT_KEY, method);
  };

  const { authenticated, logout } = usePrivy();

  const { sendCode: sendEmailCode, loginWithCode: loginWithEmailCode } =
    useLoginWithEmail({
      onComplete: ({ isNewUser }) => {
        saveRecent("email");
        setView(isNewUser ? "terms" : "success");
      },
      onError: () => {
        setAuthError("Invalid code. Please try again.");
        setView("otp");
      },
    });

  const { sendCode: sendSmsCode, loginWithCode: loginWithSmsCode } =
    useLoginWithSms({
      onComplete: ({ isNewUser }) => {
        saveRecent("phone");
        setView(isNewUser ? "terms" : "success");
      },
      onError: () => {
        setAuthError("Invalid code. Please try again.");
        setView("otp");
      },
    });

  const { initOAuth } = useLoginWithOAuth({
    onComplete: ({ isNewUser, loginMethod }) => {
      if (loginMethod) saveRecent(loginMethod);
      setView(isNewUser ? "terms" : "success");
    },
    onError: (err) => {
      console.error("OAuth error:", err);
      setView("login");
    },
  });

  const { connectWallet } = useConnectWallet({
    onSuccess: () => {
      // Guard: ignore embedded wallet auto-creation — only handle explicit user clicks
      if (!pendingWalletType.current) return;
      saveRecent(pendingWalletType.current);
      pendingWalletType.current = null;
      setView("success");
    },
    onError: (err) => {
      console.error("Wallet connect error:", err);
      if (!pendingWalletType.current) return;
      pendingWalletType.current = null;
      setView("wallet");
    },
  });

  const supportedWalletIds = new Set<WalletListEntry>([
    "metamask",
    "coinbase_wallet",
    "base_account",
    "rainbow",
    "phantom",
    "zerion",
    "cryptocom",
    "uniswap",
    "okx_wallet",
  ]);

  const popularWalletIds = new Set<WalletListEntry>([
    "coinbase_wallet",
    "metamask",
    "rainbow",
  ]);

  const uniqueAddedWallets = addedWallets.filter(
    (walletId, index, arr) => arr.indexOf(walletId) === index,
  );

  const handleConnectWallet = (walletType: WalletListEntry) => {
    pendingWalletType.current = walletType;
    preAuthRef.current = authenticated;

    try {
      if (!supportedWalletIds.has(walletType)) {
        console.warn(
          `Wallet '${walletType}' is not supported by Privy walletList`,
        );
        setView("wallet");
        return;
      }

      connectWallet({
        walletList: [walletType],
        preSelectedWalletId: walletType,
        hideHeader: true,
      });
    } catch (err) {
      console.error("Wallet connect failed:", err);
      setView("wallet");
    }
  };

  const { wallets } = useWallets();

  // If already authenticated on mount, skip straight to success
  useEffect(() => {
    if (authenticated) setView("success");
  }, []);

  const handleEmailSubmit = async (emailVal?: string) => {
    const target = emailVal ?? email;
    if (!target.includes("@")) return;
    setSendError(null);
    try {
      await sendEmailCode({ email: target });
      if (emailVal) setEmail(emailVal);
      otpMode.current = "email";
      setOtp(["", "", "", "", "", ""]);
      setAuthError(null);
      setView("otp");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("sendEmailCode failed:", msg);
      setSendError(msg);
    }
  };

  const handlePhoneSubmit = async (ph: string) => {
    // Ensure E.164 format
    const formatted = ph.startsWith("+") ? ph : `+1${ph.replace(/\D/g, "")}`;
    try {
      await sendSmsCode({ phoneNumber: formatted });
      setPhone(formatted);
      otpMode.current = "phone";
      setOtp(["", "", "", "", "", ""]);
      setAuthError(null);
      setView("otp");
    } catch (err) {
      console.error(err);
    }
  };

  const verifyOtp = async (code: string) => {
    setView("loading");
    try {
      if (otpMode.current === "email") {
        await loginWithEmailCode({ code });
      } else {
        await loginWithSmsCode({ code });
      }
      // onComplete → setView("terms")
    } catch (err) {
      console.error(err);
      setAuthError("Invalid code. Please try again.");
      setView("otp");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (next.every(Boolean)) verifyOtp(next.join(""));
  };

  const handleOtpKeyDown = (
    index: number,
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
    if (e.key === "Enter" && otp.every(Boolean)) verifyOtp(otp.join(""));
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    const next = [...otp];
    text.split("").forEach((d, i) => {
      next[i] = d;
    });
    setOtp(next);
    otpRefs.current[Math.min(text.length, 5)]?.focus();
    if (next.every(Boolean)) verifyOtp(next.join(""));
  };

  const handleResend = async () => {
    setOtp(["", "", "", "", "", ""]);
    setAuthError(null);
    otpRefs.current[0]?.focus();
    if (otpMode.current === "email") {
      await sendEmailCode({ email });
    } else {
      await sendSmsCode({ phoneNumber: phone });
    }
  };

  const cardClass = [
    "auth-card",
    view === "loading" && "auth-card--loading",
    view === "otp" && "auth-card--otp",
    view === "terms" && "auth-card--terms",
    view === "success" && "auth-card--success",
    view === "sms" && "auth-card--sms",
    view === "wallet" && "auth-card--wallet",
    view === "more-wallets" && "auth-card--more-wallets",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <button
        className="auth-action-btn"
        onClick={async () => {
          if (authenticated) {
            await logout();
            setView("login");
            setEmail("");
            setOtp(["", "", "", "", "", ""]);
          } else {
            setView("login");
          }
        }}
      >
        {authenticated ? "Log Out" : "Sign Up"}
      </button>
      <div className="page-bg">
        <div className={cardClass}>
          {view === "login" && (
            <LoginView
              email={email}
              onEmailChange={setEmail}
              onSubmit={() => handleEmailSubmit()}
              onMoreOptions={() => setView("sms")}
              onGoogle={() => {
                setView("loading");
                initOAuth({ provider: "google" });
              }}
              onApple={() => {
                setView("loading");
                initOAuth({ provider: "apple" });
              }}
              onRecentWallet={(type) => handleConnectWallet(type)}
              sendError={sendError}
            />
          )}

          {view === "sms" && (
            <SmsLoginView
              onBack={() => setView("login")}
              onEmailSubmit={(em) => handleEmailSubmit(em)}
              onPhoneSubmit={handlePhoneSubmit}
              onWallet={() => setView("wallet")}
            />
          )}

          {view === "wallet" && (
            <WalletView
              onBack={() => setView("sms")}
              wallets={wallets}
              addedWallets={uniqueAddedWallets}
              onConnectWallet={handleConnectWallet}
              onMoreWallets={() => setView("more-wallets")}
            />
          )}

          {view === "more-wallets" && (
            <MoreWalletsView
              onBack={() => setView("wallet")}
              onAdd={(walletId) => {
                setAddedWallets((prev) => {
                  if (
                    popularWalletIds.has(walletId) ||
                    prev.includes(walletId)
                  ) {
                    return prev;
                  }
                  return Array.from(new Set([...prev, walletId]));
                });
                setView("wallet");
              }}
            />
          )}

          {view === "otp" && (
            <OtpView
              target={otpMode.current === "phone" ? phone : email}
              mode={otpMode.current}
              otp={otp}
              otpRefs={otpRefs}
              onOtpChange={handleOtpChange}
              onOtpKeyDown={handleOtpKeyDown}
              onOtpPaste={handleOtpPaste}
              onResend={handleResend}
              error={authError}
            />
          )}

          {view === "loading" && <LoadingView />}

          {view === "terms" && (
            <TermsView
              onCancel={() => {
                setOtp(["", "", "", "", "", ""]);
                setView("login");
              }}
              onContinue={() => {
                setView("loading");
                setTimeout(() => setView("success"), 1500);
              }}
            />
          )}

          {view === "success" && <SuccessView />}
        </div>
      </div>
    </>
  );
}
