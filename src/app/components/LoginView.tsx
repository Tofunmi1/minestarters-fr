import { ChangeEvent, useState } from "react";
import { walletIcons } from "@web3icons/react";
import type { WalletListEntry } from "@privy-io/react-auth";
import {
  MSLogo,
  MailIcon,
  GoogleIcon,
  AppleIcon,
  PersonIcon,
  ChevronRight,
} from "./icons";

const { WalletCoinbase, WalletMetamask } = walletIcons;

interface LoginViewProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
  onMoreOptions: () => void;
  onGoogle: () => void;
  onApple: () => void;
  onRecentWallet: (type: WalletListEntry) => void;
  sendError?: string | null;
}

type OAuthEntry = {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  badge?: string;
  badgeStyle?: { bg: string; color: string };
  chevron?: boolean;
};

const WALLET_META = {
  metamask: { label: "MetaMask", Icon: WalletMetamask },
  coinbase_wallet: { label: "Coinbase", Icon: WalletCoinbase },
} as const;

type RecentWalletMethod = keyof typeof WALLET_META;

const isRecentWalletMethod = (value: string): value is RecentWalletMethod =>
  value === "metamask" || value === "coinbase_wallet";

const RECENT_KEY = "ms_recent_method";
const RECENT_BADGE = { bg: "#0D542B", color: "#7BF1A8" };

export default function LoginView({
  email,
  onEmailChange,
  onSubmit,
  onMoreOptions,
  onGoogle,
  onApple,
  onRecentWallet,
  sendError,
}: LoginViewProps) {
  const [recentMethod] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(RECENT_KEY);
  });
  const googleEntry: OAuthEntry = {
    id: "google",
    label: "Google",
    icon: (
      <div className="icon-box google">
        <GoogleIcon />
      </div>
    ),
    onClick: onGoogle,
  };
  const appleEntry: OAuthEntry = {
    id: "apple",
    label: "Apple",
    icon: (
      <div className="icon-box apple">
        <AppleIcon />
      </div>
    ),
    onClick: onApple,
  };
  const moreEntry: OAuthEntry = {
    id: "more",
    label: "More Options",
    icon: <PersonIcon />,
    onClick: onMoreOptions,
    chevron: true,
  };

  let oauthOptions: OAuthEntry[] = [googleEntry, appleEntry];

  if (recentMethod) {
    if (recentMethod === "google" || recentMethod === "apple") {
      oauthOptions = [
        {
          ...(recentMethod === "google" ? googleEntry : appleEntry),
          badge: "Recent",
          badgeStyle: RECENT_BADGE,
        },
        recentMethod === "google" ? appleEntry : googleEntry,
      ];
    } else if (isRecentWalletMethod(recentMethod)) {
      const walletType = recentMethod;
      const { label, Icon } = WALLET_META[walletType];
      const walletEntry: OAuthEntry = {
        id: walletType,
        label,
        icon: (
          <div className="wallet-icon-wrap">
            <Icon size={24} variant="branded" />
          </div>
        ),
        onClick: () => onRecentWallet(walletType as WalletListEntry),
        badge: "Recent",
        badgeStyle: RECENT_BADGE,
      };
      oauthOptions = [walletEntry, googleEntry, appleEntry];
    }
  }

  oauthOptions.push(moreEntry);

  return (
    <>
      <div className="card-header">
        <div className="card-brand">
          <MSLogo size={36} />
          <span className="card-brand-text">Minestarters</span>
        </div>
        <p className="card-subtitle">
          Secure access to your private investments and digital assets.
        </p>
      </div>

      <div className="form-section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          style={{ width: "100%" }}
        >
          <div className="email-row">
            <MailIcon />
            <input
              id="email-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                onEmailChange(e.target.value)
              }
              autoComplete="email"
            />
            <button
              type="submit"
              className={`submit-btn${
                !email.includes("@") ? " submit-btn--dim" : ""
              }`}
              disabled={!email.includes("@")}
            >
              Submit
            </button>
          </div>
        </form>

        {sendError && (
          <p
            style={{
              color: "#f87171",
              fontSize: 13,
              margin: 0,
              textAlign: "center",
            }}
          >
            {sendError}
          </p>
        )}

        <div className="or-divider">
          <span>or</span>
        </div>

        <div className="oauth-rows">
          {oauthOptions.map((opt) => (
            <button key={opt.id} className="oauth-btn" onClick={opt.onClick}>
              {opt.icon}
              <span className="oauth-btn-label">{opt.label}</span>
              {opt.badge && (
                <span
                  className="recent-badge"
                  style={
                    opt.badgeStyle
                      ? {
                          background: opt.badgeStyle.bg,
                          color: opt.badgeStyle.color,
                        }
                      : undefined
                  }
                >
                  {opt.badge}
                </span>
              )}
              {opt.chevron && <ChevronRight />}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
