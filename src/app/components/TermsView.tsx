import { useState } from "react";
import { TermsIcon, ArrowOutward, CheckIcon } from "./icons";

interface TermsViewProps {
  onCancel: () => void;
  onContinue: () => void;
  termsUrl?: string;
  privacyUrl?: string;
}

export default function TermsView({
  onCancel,
  onContinue,
  termsUrl,
  privacyUrl,
}: TermsViewProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="terms-content">
      <div className="terms-header">
        <div className="terms-icon-wrap">
          <TermsIcon />
        </div>
        <h2 className="terms-title">Agree to the Terms</h2>
        <p className="terms-description">
          By proceeding, you acknowledge that you are accessing a restricted portal. Use of this platform is subject to our Terms of Service, Privacy Policy, and strict KYC/AML verification protocols.
        </p>
      </div>

      <div className="terms-list">
        <a
          className="terms-link-item"
          href={termsUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!termsUrl) e.preventDefault();
          }}
        >
          <span>View Terms of Service</span>
          <ArrowOutward />
        </a>
        <a
          className="terms-link-item"
          href={privacyUrl || "#"}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => {
            if (!privacyUrl) e.preventDefault();
          }}
        >
          <span>View Privacy Policy</span>
          <ArrowOutward />
        </a>
      </div>

      <div className="terms-checkbox-wrap" onClick={() => setAccepted(!accepted)}>
        <div className={`terms-checkbox ${accepted ? "accepted" : ""}`}>
          {accepted && <CheckIcon />}
        </div>
        <span className="terms-checkbox-label">
          I have read and accept the Terms of Service and Privacy Policy
        </span>
      </div>

      <div className="terms-actions">
        <button className="btn-cancel" onClick={onCancel}>
          CANCEL
        </button>
        <button
          className="btn-continue"
          disabled={!accepted}
          onClick={onContinue}
        >
          CONTINUE
        </button>
      </div>
    </div>
  );
}
