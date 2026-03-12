export function MSLogo({ size = 32 }: { size?: number }) {
  const width = Math.round(size * (47 / 32));
  return (
    <svg
      width={width}
      height={size}
      viewBox="0 0 47 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M36.7182 32H30.441L18.4522 11.167L18.2941 11.2094C17.9534 12.0111 17.3492 12.7421 16.9769 13.512C16.8996 13.6709 16.7731 13.8263 16.8118 14.01L23.1592 25.0781L19.2355 32H0L8.77472 16.8176L11.9256 22.3057L9.61777 26.4165H16.1127L16.7731 25.0357L10.4292 13.904L18.3925 0.0635986L36.7218 32H36.7182Z"
        fill="white"
      />
      <path
        d="M39.9009 32.0001L24.8138 5.64718C24.7682 5.45647 24.9333 5.21632 25.0281 5.03974C25.8957 3.39048 26.9952 1.81537 27.8383 0.144918L28.0069 0.00012207L46.3994 32.0001H39.9044H39.9009Z"
        fill="white"
      />
    </svg>
  );
}

export function MailIcon({
  size = 16,
  color = "rgba(255,255,255,0.4)",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width="20"
      height="16"
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 2C20 0.9 19.1 0 18 0H2C0.9 0 0 0.9 0 2V14C0 15.1 0.9 16 2 16H18C19.1 16 20 15.1 20 14V2ZM18 2L10 7L2 2H18ZM18 14H2V4L10 9L18 4V14Z"
        fill="#FAFAFA"
      />
    </svg>
  );
}

export function GoogleIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export function AppleIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.4c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.99zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"
        fill="rgba(255,255,255,0.75)"
      />
    </svg>
  );
}

export function PersonIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none">
      <circle
        cx="10"
        cy="7"
        r="3"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
      />
      <path
        d="M3 18c0-3.87 3.13-7 7-7s7 3.13 7 7"
        stroke="rgba(255,255,255,0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function ChevronRight({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none">
      <path
        d="M6 4l4 4-4 4"
        stroke="rgba(255,255,255,0.3)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TermsIcon({ size = 70 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="72" height="72" rx="36" fill="#6DC5AB" />
      <path
        d="M42.6667 21H24.3333C22.5 21 21 22.5 21 24.3333V47.6667C21 49.5 22.5 51 24.3333 51H47.6667C49.5 51 51 49.5 51 47.6667V29.3333L42.6667 21ZM47.6667 47.6667H24.3333V24.3333H41V31H47.6667V47.6667ZM27.6667 44.3333H44.3333V41H27.6667V44.3333ZM36 27.6667H27.6667V31H36V27.6667ZM27.6667 37.6667H44.3333V34.3333H27.6667V37.6667Z"
        fill="#0A0A0A"
      />
    </svg>
  );
}

export function ArrowOutward({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 7H17V17M17 7L7 17"
        stroke="#FAFAFA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CheckIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13L9 17L19 7"
        stroke="#70CCB0"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SuccessIcon({ size = 70 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 72 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="72" height="72" rx="36" fill="#05DF72" />
      <path
        d="M35.9997 19.3334C26.7997 19.3334 19.333 26.8 19.333 36C19.333 45.2 26.7997 52.6667 35.9997 52.6667C45.1997 52.6667 52.6663 45.2 52.6663 36C52.6663 26.8 45.1997 19.3334 35.9997 19.3334ZM35.9997 49.3334C28.6497 49.3334 22.6663 43.35 22.6663 36C22.6663 28.65 28.6497 22.6667 35.9997 22.6667C43.3497 22.6667 49.333 28.65 49.333 36C49.333 43.35 43.3497 49.3334 35.9997 49.3334ZM43.6497 28.6334L32.6663 39.6167L28.3497 35.3167L25.9997 37.6667L32.6663 44.3334L45.9997 31L43.6497 28.6334Z"
        fill="#0A0A0A"
      />
    </svg>
  );
}

export function ArrowBack({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"
        fill="#FAFAFA"
      />
    </svg>
  );
}

export function ExpandMore({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M7 10l5 5 5-5"
        stroke="#FAFAFA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WalletIcon({ size = 30 }: { size?: number }) {
  return (
    <svg
      width={20}
      height={16}
      viewBox="0 0 20 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 0H4C1.79 0 0 1.79 0 4V12C0 14.21 1.79 16 4 16H16C18.21 16 20 14.21 20 12V4C20 1.79 18.21 0 16 0ZM14.14 9.77C13.9 9.97 13.57 10.05 13.26 9.97L2.15 7.25C2.45 6.52 3.16 6 4 6H16C16.67 6 17.26 6.34 17.63 6.84L14.14 9.77ZM4 2H16C17.1 2 18 2.9 18 4V4.55C17.41 4.21 16.73 4 16 4H4C3.27 4 2.59 4.21 2 4.55V4C2 2.9 2.9 2 4 2Z"
        fill="#FAFAFA"
      />
    </svg>
  );
}

export function ChevronRightWhite({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M9 6l6 6-6 6"
        stroke="#FAFAFA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({
  size = 24,
  color = "#FAFAFA",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path
        d="M6.62 10.79a15.45 15.45 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"
        fill={color}
      />
    </svg>
  );
}

export function CoinbaseIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#1652F0" />
      <circle cx="12" cy="12" r="4" fill="white" />
      <circle cx="12" cy="12" r="2" fill="#1652F0" />
    </svg>
  );
}

export function MetamaskIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#F7E4D3" />
      {/* Fox ears */}
      <polygon points="4,4 9.5,12 7,5" fill="#E27625" />
      <polygon points="20,4 17,5 14.5,12" fill="#E27625" />
      {/* Fox face */}
      <polygon points="9.5,12 7,5 12,9" fill="#E27625" />
      <polygon points="14.5,12 12,9 17,5" fill="#E27625" />
      <polygon points="9.5,12 12,9 14.5,12 13,15 11,15" fill="#D5BFB2" />
      {/* Eyes */}
      <ellipse cx="9.5" cy="13" rx="1.2" ry="1.2" fill="#233447" />
      <ellipse cx="14.5" cy="13" rx="1.2" ry="1.2" fill="#233447" />
      {/* Nose */}
      <ellipse cx="12" cy="15.5" rx="0.8" ry="0.6" fill="#161616" />
      {/* Mouth area */}
      <polygon points="9.5,15.5 11,15 12,16.5" fill="#F5841F" />
      <polygon points="14.5,15.5 13,15 12,16.5" fill="#F5841F" />
      {/* Chin */}
      <polygon points="9.5,15.5 12,18 14.5,15.5 13,15 11,15" fill="#C0AC9D" />
    </svg>
  );
}

export function BinanceIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <rect width="24" height="24" rx="4" fill="#F3BA2F" />
      {/* BNB diamond shape */}
      <polygon points="12,5 14.5,7.5 12,10 9.5,7.5" fill="white" />
      <polygon points="7,9.5 9.5,12 7,14.5 4.5,12" fill="white" />
      <polygon points="12,10 14.5,12.5 12,15 9.5,12.5" fill="white" />
      <polygon points="17,9.5 19.5,12 17,14.5 14.5,12" fill="white" />
      <polygon points="12,15 14.5,17.5 12,20 9.5,17.5" fill="white" />
    </svg>
  );
}
