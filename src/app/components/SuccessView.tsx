import { SuccessIcon } from "./icons";

export default function SuccessView() {
  return (
    <div className="success-content">
      <div className="success-icon-wrap">
        <SuccessIcon />
      </div>
      <h2 className="success-title">Success!</h2>
      <p className="success-description">
        Authentication Successful. You&apos;ve successfully created an account
      </p>
    </div>
  );
}
