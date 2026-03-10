import { KeyboardEvent, RefObject } from "react";
import { MailIcon } from "./icons";

interface OtpViewProps {
  email: string;
  otp: string[];
  otpRefs: RefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onResend: () => void;
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const masked = local.slice(0, 2) + "*".repeat(Math.max(local.length - 2, 3));
  return `${masked}@${domain}`;
}

export default function OtpView({
  email,
  otp,
  otpRefs,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onResend,
}: OtpViewProps) {
  return (
    <div className="otp-content">

      {/* ── Header ── */}
      <div className="otp-header">
        <div className="otp-icon-wrap">
          <MailIcon size={40} color="#0A0A0A" />
        </div>
        <p className="otp-title">Enter confirmation code</p>
        <p className="otp-sub">
          A secure one-time passcode has been sent to {maskEmail(email)}
        </p>
      </div>

      {/* ── OTP Boxes: [0][1][2] – [3][4][5] ── */}
      <div className="otp-boxes" onPaste={onOtpPaste}>
        <div className="otp-group">
          {[0, 1, 2].map((i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              className="otp-box"
              maxLength={1}
              inputMode="numeric"
              value={otp[i]}
              onChange={(e) => onOtpChange(i, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(i, e)}
              autoFocus={i === 0}
            />
          ))}
        </div>

        <span className="otp-dash">–</span>

        <div className="otp-group">
          {[3, 4, 5].map((i) => (
            <input
              key={i}
              ref={(el) => { otpRefs.current[i] = el; }}
              className="otp-box"
              maxLength={1}
              inputMode="numeric"
              value={otp[i]}
              onChange={(e) => onOtpChange(i, e.target.value)}
              onKeyDown={(e) => onOtpKeyDown(i, e)}
            />
          ))}
        </div>
      </div>

      {/* ── Resend ── */}
      <p className="resend-text">
        Didn't receive a code?{" "}
        <span className="resend-link" onClick={onResend}>
          Resend.
        </span>
      </p>

    </div>
  );
}
