"use client";
import { useState, useEffect } from "react";
import { walletIcons, tokenIcons } from "@web3icons/react";
import { ArrowBack } from "./icons";
import type { WalletListEntry } from "@privy-io/react-auth";

const {
  WalletRainbow,
  WalletPhantom,
  WalletZerion,
  WalletOkx,
  WalletCoinbase,
} = walletIcons;
const { TokenCRO, TokenUNI } = tokenIcons;

const PRIVY_WALLET_LIST: WalletListEntry[] = [
  "metamask",
  "coinbase_wallet",
  "base_account",
  "rainbow",
  "phantom",
  "zerion",
  "cryptocom",
  "uniswap",
  "okx_wallet",
];

interface EIP6963Detail {
  info: { rdns: string; name: string; icon: string; uuid: string };
  provider: unknown;
}

export const WALLET_DEFS = [
  {
    id: "rainbow" as WalletListEntry,
    label: "Rainbow",
    Icon: WalletRainbow,
    rdns: "me.rainbow" as string | null,
  },
  {
    id: "phantom" as WalletListEntry,
    label: "Phantom",
    Icon: WalletPhantom,
    rdns: "app.phantom" as string | null,
  },
  {
    id: "zerion" as WalletListEntry,
    label: "Zerion",
    Icon: WalletZerion,
    rdns: "io.zerion.wallet" as string | null,
  },
  {
    id: "okx_wallet" as WalletListEntry,
    label: "OKX Wallet",
    Icon: WalletOkx,
    rdns: "com.okex.wallet" as string | null,
  },
  {
    id: "cryptocom" as WalletListEntry,
    label: "Crypto.com",
    Icon: TokenCRO,
    rdns: null as string | null,
  },
  {
    id: "uniswap" as WalletListEntry,
    label: "Uniswap",
    Icon: TokenUNI,
    rdns: null as string | null,
  },
  {
    id: "base_account" as WalletListEntry,
    label: "Base",
    Icon: WalletCoinbase,
    rdns: null as string | null,
  },
] as const;

const POPULAR_WALLET_IDS = new Set<WalletListEntry>([
  "coinbase_wallet",
  "metamask",
  "rainbow",
]);

const WALLET_DEF_MAP = new Map<WalletListEntry, (typeof WALLET_DEFS)[number]>(
  WALLET_DEFS.map((wallet) => [wallet.id, wallet]),
);

const formatWalletLabel = (walletId: WalletListEntry) =>
  walletId
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export interface MoreWalletsViewProps {
  onBack: () => void;
  onAdd: (walletId: WalletListEntry) => void;
}

function SearchIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      style={{ flexShrink: 0 }}
    >
      <circle cx="11" cy="11" r="7.5" stroke="#FAFAFA" strokeWidth="1.5" />
      <path
        d="M17 17L21 21"
        stroke="#FAFAFA"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MoreWalletsView({
  onBack,
  onAdd,
}: MoreWalletsViewProps) {
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<WalletListEntry | null>(null);
  const [installedProviders, setInstalledProviders] = useState<
    Map<string, unknown>
  >(new Map());

  // Discover installed browser wallet extensions via EIP-6963
  useEffect(() => {
    const map = new Map<string, unknown>();
    const handler = (event: Event) => {
      const e = event as CustomEvent<EIP6963Detail>;
      map.set(e.detail.info.rdns, e.detail.provider);
      setInstalledProviders(new Map(map));
    };
    window.addEventListener(
      "eip6963:announceProvider",
      handler as EventListener,
    );
    // Ask all installed extensions to announce themselves
    window.dispatchEvent(new Event("eip6963:requestProvider"));
    return () =>
      window.removeEventListener(
        "eip6963:announceProvider",
        handler as EventListener,
      );
  }, []);

  const privyWallets = PRIVY_WALLET_LIST.filter(
    (walletId) => !POPULAR_WALLET_IDS.has(walletId),
  ).map(
    (walletId) =>
      WALLET_DEF_MAP.get(walletId) ?? {
        id: walletId,
        label: formatWalletLabel(walletId),
        Icon: WalletCoinbase,
        rdns: null,
      },
  );

  useEffect(() => {
    if (privyWallets.length === 0) return;
    if (
      !selectedId ||
      !privyWallets.some((wallet) => wallet.id === selectedId)
    ) {
      setSelectedId(privyWallets[0].id);
    }
  }, [selectedId, privyWallets]);

  const displayed = privyWallets.filter((w) =>
    w.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleAddWallet = () => {
    if (!selectedId) return;
    onAdd(selectedId);
  };

  return (
    <>
      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <ArrowBack />
      </button>

      <div className="form-section">
        <div className="mw-search-row">
          <SearchIcon />
          <input
            className="mw-search-input"
            type="text"
            placeholder="Search Wallet"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
          />
        </div>

        {/* Wallet list — click to select, then press Add Wallet */}
        <div className="mw-list">
          {displayed.length === 0 && (
            <p className="mw-empty">No wallet matches &ldquo;{search}&rdquo;</p>
          )}
          {displayed.map(({ id, label, Icon, rdns }) => {
            const provider = rdns ? installedProviders.get(rdns) : undefined;
            const isInstalled = !!provider;

            return (
              <button
                key={label}
                className={`mw-row${
                  selectedId === id ? " mw-row--active" : ""
                }`}
                onClick={() => setSelectedId(id)}
              >
                <div className="wallet-icon-wrap">
                  <Icon size={24} variant="branded" />
                </div>
                <span className="mw-row-name">{label}</span>
                {isInstalled && (
                  <span
                    className="wallet-badge"
                    style={{ background: "#0D542B", color: "#7BF1A8" }}
                  >
                    Detected
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <button className="add-wallet-btn" onClick={handleAddWallet}>
          Add Wallet
        </button>
      </div>
    </>
  );
}
