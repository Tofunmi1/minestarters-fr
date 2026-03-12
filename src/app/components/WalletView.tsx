import { walletIcons } from "@web3icons/react";
import { MSLogo, WalletIcon, ChevronRightWhite, ArrowBack } from "./icons";
import type { ConnectedWallet, WalletListEntry } from "@privy-io/react-auth";
import { WALLET_DEFS } from "./MoreWalletsView";

const { WalletCoinbase, WalletMetamask, WalletRainbow } = walletIcons;

const POPULAR = [
  { id: "coinbase_wallet", label: "Coinbase", Icon: WalletCoinbase },
  { id: "metamask", label: "MetaMask", Icon: WalletMetamask },
  { id: "rainbow", label: "Rainbow", Icon: WalletRainbow },
] as const;

interface WalletViewProps {
  onBack: () => void;
  wallets: ConnectedWallet[];
  addedWallets: WalletListEntry[];
  onConnectWallet: (walletType: WalletListEntry) => void;
  onMoreWallets: () => void;
}

export default function WalletView({
  onBack,
  wallets,
  addedWallets,
  onConnectWallet,
  onMoreWallets,
}: WalletViewProps) {
  const connectedTypes = new Set(wallets.map((w) => w.walletClientType));
  const popularIds = new Set<WalletListEntry>(
    POPULAR.map((wallet) => wallet.id as WalletListEntry),
  );
  const dedupedAddedWallets = addedWallets.filter(
    (walletId, index, arr) =>
      arr.indexOf(walletId) === index && !popularIds.has(walletId),
  );

  return (
    <>
      {/* Back button */}
      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <ArrowBack />
      </button>

      {/* Header */}
      <div className="card-header">
        <div className="card-brand">
          <MSLogo size={36} />
          <span className="card-brand-text">Minestarters</span>
        </div>
        <p className="card-subtitle">
          Secure access to your private investments and digital assets.
        </p>
      </div>

      {/* Wallet list */}
      <div className="form-section">
        <div className="oauth-rows">
          {POPULAR.map(({ id, label, Icon }) => {
            const isConnected = connectedTypes.has(id);
            const badge = isConnected
              ? id === "coinbase_wallet"
                ? { text: "Detected", bg: "#1C398E", color: "#8EC5FF" }
                : { text: "Detected", bg: "#0D542B", color: "#7BF1A8" }
              : null;

            return (
              <button
                key={id}
                className="oauth-btn"
                onClick={() => onConnectWallet(id)}
              >
                <div className="wallet-icon-wrap">
                  <Icon size={24} variant="branded" />
                </div>
                <span className="oauth-btn-label">{label}</span>
                {badge && (
                  <span
                    className="wallet-badge"
                    style={{ background: badge.bg, color: badge.color }}
                  >
                    {badge.text}
                  </span>
                )}
              </button>
            );
          })}

          {dedupedAddedWallets.map((walletId) => {
            const def = WALLET_DEFS.find((w) => w.id === walletId);
            if (!def) return null;
            const { Icon, label } = def;
            return (
              <button
                key={walletId}
                className="oauth-btn"
                onClick={() => onConnectWallet(walletId)}
              >
                <div className="wallet-icon-wrap">
                  <Icon size={24} variant="branded" />
                </div>
                <span className="oauth-btn-label">{label}</span>
              </button>
            );
          })}

          <button className="oauth-btn" onClick={onMoreWallets}>
            <WalletIcon size={24} />
            <span className="oauth-btn-label">More Wallets</span>
            <ChevronRightWhite size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
