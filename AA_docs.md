# Account Abstraction Technical Reference

**Stack:** Privy · ZeroDev Kernel v3.1 · ERC-4337 EntryPoint v0.7

---

## Contents

1. [Standards](#2-standards)
2. [ERC-4337 Internals](#3-erc-4337-internals)
3. [Customization Layers](#4-customization-layers)
4. [Tool Selection](#5-tool-selection)
5. [Privy Integration](#6-privy-integration)
6. [Stack Decisions](#7-stack-decisions)
7. [Known Issues](#8-known-issues)
8. [Alternative Signer Providers](#9-alternative-signer-providers)
9. [References](#10-references)

---

## 1. Standards

### ERC-4337

Achieves AA without protocol changes via an alternative transaction flow through a singleton `EntryPoint` contract. Transactions are replaced by `UserOperation` structs processed through a separate mempool maintained by **bundlers**.

Core components:

- **UserOperation**  pseudo-transaction struct signed by the user's key
- **EntryPoint**  singleton on-chain contract that validates and executes UserOps
- **Bundler**  off-chain node that batches UserOps into real Ethereum transactions
- **Smart Account**  the user's contract wallet; implements `validateUserOp()` and `execute()`
- **Paymaster**  optional contract that agrees to pay gas under arbitrary conditions

All new deployments must target v0.7. SDKs, bundlers, and paymasters must all reference the same version.

---

## 2. ERC-4337 Internals

### Execution Flow

```
1. User constructs and signs a UserOperation
2. UserOp submitted to bundler via eth_sendUserOperation (JSON-RPC)
3. Bundler simulates: validateUserOp() and validatePaymasterUserOp()
4. Bundler batches one or more UserOps, submits to EntryPoint.handleOps()
5. EntryPoint:
     a. Calls account.validateUserOp()    → verifies signature, charges prefund
     b. Calls paymaster.validatePaymasterUserOp() if paymaster present
     c. Calls account.execute()           → runs the actual calldata
     d. Calls paymaster.postOp()          → settles actual gas cost
```

### Counterfactual Deployment

Smart account addresses are deterministic before deployment via CREATE2:

```
address = keccak256(0xff ++ factory ++ salt ++ keccak256(initCode))[12:]
```

The account does not need to be deployed before receiving funds or before the first transaction. On the first UserOperation, the factory call is included and the EntryPoint deploys the account before executing. Subsequent operations omit it.

The first operation is more expensive (~200k gas for deployment + execution). Managed paymasters (ZeroDev, Pimlico) detect first-time accounts automatically and adjust gas limits. Self-hosted paymasters must set `verificationGasLimit` higher for undeployed accounts.

### Paymaster Variants

| Variant | Mechanism |
|---|---|
| Verifying (sponsored) | Paymaster signs off-chain approval; covers gas unconditionally for approved ops |
| ERC-20 | User holds an ERC-20 token; paymaster swaps it to ETH to cover gas |
| Custom logic | Paymaster validates arbitrary on-chain conditions before agreeing to pay |

### Nonces

ERC-4337 uses a 256-bit nonce managed by the EntryPoint, structured as `[192-bit key][64-bit sequence]`. UserOps with different keys can be submitted and executed in parallel. Same-key UserOps are ordered by sequence. Most SDKs default to key `0`.

---

## 3. Customization Layers

Four levels, from highest to lowest:

### Layer 1  SDK Wiring

Using an AA SDK (ZeroDev, Alchemy, Biconomy) directly instead of a higher-level abstraction. The contracts are unchanged; only the integration code differs.

Example: manually composing `signerToEcdsaValidator → createKernelAccount → createKernelAccountClient` rather than delegating to Privy's `useSmartWallets()`.

Motivation: direct control over account index, paymaster RPC, and gas policies without depending on Privy's dashboard configuration.

### Layer 2  Custom Validator Plugin (ERC-7579)

A Solidity contract implementing `IValidator` installed into an existing ERC-7579-compliant account (Kernel, Nexus). The account contract itself is unchanged.

Example  KYC allowlist validator: requires a backend-signed attestation alongside the user's ECDSA signature. `validateUserOp()` decodes both from the UserOp signature field, verifies the backend attestation against a known attestor address, then verifies the user's own signature. Fails validation if either check fails.

Install into a Kernel account by passing the validator as `plugins.regular` in `createKernelAccount()`.

### Layer 3  Custom Paymaster Contract

A Solidity contract implementing `IPaymaster` that enforces business-specific sponsorship rules on-chain. Deployed independently and funded with ETH deposited to the EntryPoint.

Example  function-scoped paymaster: only sponsors calls to `invest()` and `claim()` on the vault contract, and only for KYC-approved senders. Reverts with a clear error for any other operation.

## 4. Privy Integration

All Privy authentication methods are exposed as headless hooks. The default Privy modal is not required.

```ts
const { sendCode, loginWithCode } = useLoginWithEmail();
const { sendCode, loginWithCode } = useLoginWithSms();
const { initOAuth }               = useLoginWithOAuth();   // google | twitter | discord | github | apple | telegram
const { loginWithPasskey }        = useLoginWithPasskey();
const { signupWithPasskey }       = useSignupWithPasskey();
const { generateSiweMessage, loginWithSiwe } = useLoginWithSiwe();
```

---

## 5. Stack Decisions

### 5a. Variant A  Manual ZeroDev SDK

#### Stack

| Component | Technology |
|---|---|
| Authentication | Privy (`@privy-io/react-auth` v3.x) |
| Smart account | ZeroDev Kernel v3.1 |
| Validator | ECDSA (`@zerodev/ecdsa-validator`) |
| Bundler | ZeroDev |
| Paymaster | ZeroDev verifying paymaster |
| EntryPoint | v0.7 |

#### Rationale

We use Privy for authentication and embedded wallet creation. We wire ZeroDev Kernel manually (Layer 1) rather than delegate to Privy's `useSmartWallets()` for three reasons:

1. **Paymaster policy**  ZeroDev paymaster policies are configurable in code and the dashboard. Privy's native paymaster is a binary dashboard toggle.
2. **Plugin roadmap**  ERC-7579 validators (KYC allowlist, spending limits, time-locks) are implementable as Kernel plugins. Kernel is the prerequisite.
3. **Consistency**  Privy's EIP-7702 native sponsorship uses ZeroDev Kernel under the hood. Wiring it explicitly gives us the same contract with direct control over its configuration.


---

### 5b. Variant B  Privy Smart Wallets + ZeroDev Paymaster

#### Stack

| Component | Technology |
|---|---|
| Authentication | Privy (`@privy-io/react-auth` v3.x) |
| Smart account | Privy `useSmartWallets()` |
| Bundler | URL configured in Privy Dashboard |
| Paymaster | ZeroDev paymaster URL configured in Privy Dashboard |
| EntryPoint | v0.7 |

Privy's smart wallet integration handles all smart account logic  account creation, embedded wallet as signer, counterfactual address derivation, and transaction routing. We write no AA-specific code. ZeroDev is used only as a paymaster endpoint, configured as a URL in the Privy Dashboard.

Privy owns the orchestration layer  the SDK hooks, dashboard configuration, embedded wallet key management, and UserOperation routing. What Privy does not own is the on-chain smart account contract itself. For that, it delegates to a third-party implementation we select once in the dashboard (Kernel, Light Account, Safe, Nexus, Thirdweb, or Coinbase Smart Wallet). From our code's perspective this distinction is invisible  `useSmartWallets()` returns a standard viem WalletClient regardless of the implementation chosen.

#### Setup

**Privy Dashboard (one-time):**
1. Enable Smart Wallets → select implementation (e.g. Kernel)
2. Add target chain under supported networks
3. Set bundler URL (e.g. `https://public.pimlico.io/v2/{chainId}/rpc`)
4. Set paymaster URL: `https://rpc.zerodev.app/api/v3/paymaster/<PROJECT_ID>`

**1. Provider setup**

Smart wallets require an embedded wallet first  the embedded wallet's key becomes the smart account's signer. Configure `PrivyProvider` to create one on login, then wrap with `SmartWalletsProvider`:

```tsx
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";

export default function App() {
    return (
        <PrivyProvider
            appId={PRIVY_APP_ID}
            config={{
                embeddedWallets: {
                    ethereum: {
                        createOnLogin: "all-users",
                    },
                },
            }}
        >
            <SmartWalletsProvider>
                {/* rest of app */}
            </SmartWalletsProvider>
        </PrivyProvider>
    );
}
```

`SmartWalletsProvider` reads the bundler/paymaster URLs from the Privy Dashboard configuration. No RPC URL is hardcoded in our app.

**2. Account lifecycle**

Smart accounts are created automatically once the user has an embedded wallet. No explicit deployment step  the account is counterfactual until the first UserOperation.

```ts
import { useSmartWallets } from "@privy-io/react-auth/smart-wallets";

const { client } = useSmartWallets();

// client is null if the user has no embedded wallet yet
// client is a viem WalletClient once the smart wallet is ready
if (!client) return <Loading />;
```

**3. Sending transactions**

All transactions are automatically routed as UserOperations through the configured bundler and paymaster:

```ts
// Simple transfer
const hash = await client.sendTransaction({
    to: recipientAddress,
    value: parseEther("0.1"),
});

// Contract interaction
const result = await client.writeContract({
    address: contractAddress,
    abi,
    functionName: "invest",
    args: [amount],
});

// Batch  multiple calls in a single UserOperation
const batchHash = await client.sendTransaction([
    { to: tokenAddress, data: approveCalldata },
    { to: contractAddress, data: investCalldata },
]);
```

Gas is automatically sponsored via the paymaster URL set in the dashboard. No `sponsor: true` flag or paymaster client is needed in code.

**4. Reading the smart account address**

```ts
const smartAccountAddress = client?.account?.address;
// differs from the EOA address  this is the contract wallet address
```

No `@zerodev/sdk` import. No validator wiring. No manual paymaster client.

#### Tradeoffs vs Variant A

| | Variant A (manual ZeroDev SDK) | Variant B (Privy smart wallets) |
|---|---|---|
| Code to maintain | Higher | Minimal |
| AA-specific code in app | Yes | None |
| ERC-7579 plugin support | Yes | Depends on implementation chosen |
| Session keys | Yes | No (ERC-7715 planned) |
| Paymaster policy in code | Yes | No (dashboard URL only) |
| Account index control | Yes | No (Privy manages derivation) |
| Batch transactions | Manual | Built into `client.sendTransaction([])` |
| `@zerodev/sdk` dependency | Required | Not required |

Variant B is the right default unless programmatic paymaster policies or Kernel-specific plugins are required.

---

## 8. Known Issues

**Address ambiguity.** Each user has two addresses: the EOA (Privy embedded wallet) and the smart account. The smart account address is the same whether or not the account has been deployed  "counterfactual" refers to its state, not a different address. Sending assets to the EOA when the intent was the smart account (or vice versa) is a common mistake. Keep these distinct in the database, indexer, and UI.

**EntryPoint version lock-in.** A smart account is deployed with a specific EntryPoint address baked into its initialization. Migrating to a newer EntryPoint version requires deploying a new account at a new address and migrating all assets. Choose the EntryPoint version once, before mainnet.

**First-operation gas overhead.** An account's first UserOperation includes a factory call for deployment, costing ~200k additional gas on top of the operation itself. Managed paymasters (ZeroDev, Pimlico) detect first-time accounts automatically and set the gas limits accordingly. This is only a concern if we are running a self-hosted paymaster or estimating gas manually  in those cases, `verificationGasLimit` must be set higher for undeployed accounts.

**Paymaster deposit exhaustion.** Paymasters pre-deposit ETH into the EntryPoint. If the deposit is exhausted, all sponsored operations fail with no recovery until the deposit is refilled. Managed paymasters (ZeroDev, Pimlico) handle top-up automatically but enforce per-policy spending caps  exhausting a policy's cap has the same effect as an empty deposit. Monitor active policy spend in production.

---

## 9. Alternative Signer Providers

The signer provider sits below Layers 1–3 (SDK wiring, validators, paymaster). Swapping it out does not change the Kernel account, validator plugins, bundler, or paymaster — all of those remain identical. Each provider below produces a signer object that slots directly into `signerToEcdsaValidator` or its equivalent.

### [Turnkey](https://docs.turnkey.com)

Signer infrastructure only — no auth UI. Your app owns all authentication (email OTP, OAuth, passkey) and calls Turnkey's API to sign. Returns a `TurnkeySigner` that plugs into ZeroDev via `@turnkey/sdk-browser`. Best fit when you want full control over the auth flow without delegating session management to a third party.

### [Alchemy Account Kit](https://accountkit.alchemy.com)

Full-stack AA SDK from Alchemy. Ships its own embedded signer (`@alchemy/aa-signers`) alongside its own smart account implementation (Light Account) and bundler/paymaster (Alchemy Gas Manager). Can also be used signer-only: extract the `AlchemySigner` and pass it to ZeroDev if you want Kernel + Alchemy auth. Note: Light Account does not support ERC-7579 plugins — keep Kernel if plugins are on the roadmap.

### [Dynamic.xyz](https://docs.dynamic.xyz)

Closest feature match to Privy: embedded wallets, social login, email OTP, passkeys, SIWE, multi-wallet. Has a native ZeroDev integration via `@dynamic-labs/sdk-react-core`. Returns a signer that wires into `signerToEcdsaValidator` with no extra adapter code. Better multi-chain and multi-wallet UX than Privy; more complex dashboard configuration.

### [Capsule](https://docs.usecapsule.com)

Passkey-first embedded wallet provider built on MPC. Returns a `CapsuleSigner` that works directly with ZeroDev and `permissionless.js`. Best fit if WebAuthn / device biometric login is the primary or only auth method.

### [Magic (Magic Labs)](https://magic.link/docs)

Email magic-link and OAuth → creates a key pair server-side. Returns a `MagicSigner`; ZeroDev ships a connector for it (`@zerodev/magic`). Oldest embedded wallet provider in the space; less actively developed than the alternatives.

### [Web3Auth](https://web3auth.io/docs)

MPC-based key generation from OAuth or email. Returns a standard signer; integrates with ZeroDev, Biconomy, and Alchemy. Higher setup complexity; suited for scenarios where a non-custodial guarantee with social recovery must be auditable on-chain.

### No third-party provider

| Approach | Notes |
|---|---|
| Raw EOA (MetaMask / injected via [wagmi](https://wagmi.sh)) | User's own wallet is the signer; ZeroDev wraps it as a Kernel account via `signerToEcdsaValidator` |
| SIWE only | User signs a nonce with any wallet; your backend issues a session; same ZeroDev wiring downstream |
| Passkey self-hosted | WebAuthn credential on device; ZeroDev's WebAuthn validator signs UserOps directly — no signer provider needed |
| Server-side key (custodial) | Backend holds the key via AWS KMS or Turnkey API; suitable for automated / bot accounts |

### Comparison

| | [Privy](https://docs.privy.io) | [Turnkey](https://docs.turnkey.com) | [Alchemy](https://accountkit.alchemy.com) | [Dynamic](https://docs.dynamic.xyz) | [Capsule](https://docs.usecapsule.com) | [Magic](https://magic.link/docs) | [Web3Auth](https://web3auth.io/docs) |
|---|---|---|---|---|---|---|---|
| Embedded wallet | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Social / email login | Yes | No (BYO) | Yes | Yes | Email / passkey | Yes | Yes |
| Headless hooks | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| ZeroDev connector | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| ERC-7579 plugin support | Via Kernel | Via Kernel | No (Light Account) | Via Kernel | Via Kernel | Via Kernel | Via Kernel |
| Key custody model | MPC split | MPC split | MPC split | MPC split | MPC split | Server-side | MPC split |
| Dashboard dependency | Medium | Low | Medium | Medium | Low | Low | Medium |

---

## 10. References

| Resource | URL |
|---|---|
| ERC-4337 | https://eips.ethereum.org/EIPS/eip-4337 |
| EIP-7702 | https://eips.ethereum.org/EIPS/eip-7702 |
| ERC-7579 | https://eips.ethereum.org/EIPS/eip-7579 |
| ERC-7715 | https://ethereum-magicians.org/t/erc-7715-grant-permissions-from-wallets/20100 |
| EIP-8141 | https://eips.ethereum.org/EIPS/eip-8141 |
| ZeroDev SDK | https://docs.zerodev.app |
| Privy | https://docs.privy.io |
| Pimlico | https://docs.pimlico.io |
| Alchemy Account Kit | https://accountkit.alchemy.com |
| Turnkey | https://docs.turnkey.com |
| Dynamic.xyz | https://docs.dynamic.xyz |
| Capsule | https://docs.usecapsule.com |
| Magic | https://magic.link/docs |
| Web3Auth | https://web3auth.io/docs |
| EntryPoint (source) | https://github.com/eth-infinitism/account-abstraction |
| Kernel (source) | https://github.com/zerodevapp/kernel |
| UserOp explorer | https://www.jiffyscan.xyz |

---

