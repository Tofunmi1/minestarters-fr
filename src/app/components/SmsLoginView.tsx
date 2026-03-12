import { useState, ChangeEvent, useRef, useEffect } from "react";
import {
  MSLogo,
  MailIcon,
  WalletIcon,
  ChevronRightWhite,
  ArrowBack,
} from "./icons";

const COUNTRIES = [
  { code: "US", label: "US", prefix: "+1" },
  { code: "CA", label: "CA", prefix: "+1" },
] as const;

type CountryCode = (typeof COUNTRIES)[number]["code"];

interface SmsLoginViewProps {
  onBack: () => void;
  onEmailSubmit: (email: string) => void;
  onPhoneSubmit: (phone: string) => void;
  onWallet: () => void;
}

export default function SmsLoginView({
  onBack,
  onEmailSubmit,
  onPhoneSubmit,
  onWallet,
}: SmsLoginViewProps) {
  const [emailVal, setEmailVal] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState<CountryCode>("US");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find((c) => c.code === country)!;
  const isValidEmail = emailVal.includes("@");
  const isValidPhone = phone.replace(/\D/g, "").length >= 7;

  const handlePhoneSubmit = () => {
    if (!isValidPhone) return;
    const digits = phone.replace(/\D/g, "");
    onPhoneSubmit(`${selectedCountry.prefix}${digits}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <button className="back-btn" onClick={onBack} aria-label="Go back">
        <ArrowBack />
      </button>

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
        <div>
          <div className="email-row">
            <MailIcon />
            <input
              id="sms-email-input"
              type="email"
              placeholder="Email Address"
              value={emailVal}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmailVal(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValidEmail) onEmailSubmit(emailVal);
              }}
              autoComplete="email"
            />
            <button
              className={`submit-btn${isValidEmail ? "" : " submit-btn--dim"}`}
              disabled={!isValidEmail}
              onClick={() => isValidEmail && onEmailSubmit(emailVal)}
            >
              Submit
            </button>
          </div>
          <button className="forgot-email-link">Forgot Email?</button>
        </div>

        <div className="or-divider">
          <span>or</span>
        </div>

        <div className="oauth-rows">
          <div className="phone-row">
            <div className="phone-left">
              {/* Custom country dropdown */}
              <div className="country-dropdown" ref={dropdownRef}>
                <button
                  type="button"
                  className="country-trigger"
                  onClick={() => setDropdownOpen((o) => !o)}
                >
                  <span className="country-label">{selectedCountry.label}</span>
                  <span className="country-prefix">
                    {selectedCountry.prefix}
                  </span>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    style={{
                      flexShrink: 0,
                      transition: "transform 0.2s",
                      transform: dropdownOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  >
                    <path
                      d="M2 4L6 8L10 4"
                      stroke="#FAFAFA"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div className="country-menu">
                    {COUNTRIES.map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        className={`country-option${
                          c.code === country ? " country-option--active" : ""
                        }`}
                        onClick={() => {
                          setCountry(c.code);
                          setDropdownOpen(false);
                        }}
                      >
                        <span className="country-label">{c.label}</span>
                        <span className="country-prefix">{c.prefix}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="country-divider" />
              <input
                id="phone-input"
                type="tel"
                className="phone-input"
                placeholder="(333) 000-0000"
                value={phone}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setPhone(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") handlePhoneSubmit();
                }}
                autoComplete="tel"
              />
            </div>
            <button
              className={`submit-btn${isValidPhone ? "" : " submit-btn--dim"}`}
              disabled={!isValidPhone}
              onClick={handlePhoneSubmit}
            >
              Submit
            </button>
          </div>

          <button className="oauth-btn" onClick={onWallet}>
            <WalletIcon />
            <span className="oauth-btn-label">Continue with Wallet</span>
            <ChevronRightWhite size={20} />
          </button>
        </div>
      </div>
    </>
  );
}
