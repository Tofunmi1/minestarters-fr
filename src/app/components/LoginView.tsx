import { ChangeEvent } from "react";
import { MSLogo, MailIcon, GoogleIcon, AppleIcon, PersonIcon, ChevronRight } from "./icons";

interface LoginViewProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: () => void;
}

export default function LoginView({ email, onEmailChange, onSubmit }: LoginViewProps) {
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
          onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
          style={{ width: "100%" }}
        >
          <div className="email-row">
            <MailIcon />
            <input
              id="email-input"
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e: ChangeEvent<HTMLInputElement>) => onEmailChange(e.target.value)}
              autoComplete="email"
            />
            <button
              type="submit"
              className="submit-btn"
              disabled={!email.includes("@")}
            >
              Submit
            </button>
          </div>
        </form>

        {/* OR divider */}
        <div className="or-divider">
          <span>or</span>
        </div>

        {/* OAuth options */}
        <div className="oauth-rows">
          <button className="oauth-btn" onClick={() => {}}>
            <div className="icon-box google"><GoogleIcon /></div>
            <span className="oauth-btn-label">Google</span>
            <span className="recent-badge">Recent</span>
          </button>

          <button className="oauth-btn" onClick={() => {}}>
            <div className="icon-box apple"><AppleIcon /></div>
            <span className="oauth-btn-label">Apple</span>
          </button>

          <button className="oauth-btn" onClick={() => {}}>
            <PersonIcon />
            <span className="oauth-btn-label">More Options</span>
            <ChevronRight />
          </button>
        </div>

      </div>
    </>
  );
}
