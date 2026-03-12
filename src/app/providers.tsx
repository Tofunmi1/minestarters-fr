"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { sepolia } from "viem/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        defaultChain: sepolia,
        supportedChains: [sepolia],
        loginMethods: ["email", "sms", "google", "apple", "wallet"],
        appearance: {
          theme: "dark",
          accentColor: "#6DC5AB",
          walletList: [
            "metamask",
            "coinbase_wallet",
            "base_account",
            "rainbow",
            "phantom",
            "zerion",
            "cryptocom",
            "uniswap",
            "okx_wallet",
            "universal_profile",
          ],
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "all-users",
          },
        },
      }}
    >
      <SmartWalletsProvider>{children}</SmartWalletsProvider>
    </PrivyProvider>
  );
}
