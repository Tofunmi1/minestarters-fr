import { KeyboardEvent, RefObject } from "react";
import { MailIcon, PhoneIcon } from "./icons";

interface OtpViewProps {
  target: string;
  mode?: "email" | "phone";
  otp: string[];
  otpRefs: RefObject<(HTMLInputElement | null)[]>;
  onOtpChange: (index: number, value: string) => void;
  onOtpKeyDown: (index: number, e: KeyboardEvent<HTMLInputElement>) => void;
  onOtpPaste: (e: React.ClipboardEvent) => void;
  onResend: () => void;
  error?: string | null;
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const masked = local.slice(0, 2) + "*".repeat(Math.max(local.length - 2, 3));
  return `${masked}@${domain}`;
}

function maskPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return phone;
  return "•••• " + digits.slice(-4);
}

export default function OtpView({
  target,
  mode = "email",
  otp,
  otpRefs,
  onOtpChange,
  onOtpKeyDown,
  onOtpPaste,
  onResend,
  error,
}: OtpViewProps) {
  const isPhone = mode === "phone";
  const masked = isPhone ? maskPhone(target) : maskEmail(target);

  return (
    <div className="otp-content">

      <div className="otp-header">
        <div className="otp-icon-wrap">
          {isPhone
            ? <PhoneIcon size={40} color="#0A0A0A" />
            : <MailIcon size={40} color="#0A0A0A" />
          }
        </div>
        <p className="otp-title">Enter confirmation code</p>
        <p className="otp-sub">
          A secure one-time passcode has been sent to {masked}
        </p>
      </div>

      {/*  [0][1][2] – [3][4][5] */}
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

      {/* ── Error ── */}
      {error && <p className="otp-error">{error}</p>}

      {/* ── Resend ── */}
      <p className="resend-text">
        Didn&apos;t receive a code?{" "}
        <span className="resend-link" onClick={onResend}>
          Resend.
        </span>
      </p>

    </div>
  );
}

