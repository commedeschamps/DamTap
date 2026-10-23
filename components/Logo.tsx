type LogoProps = { symbolOnly?: boolean; inverse?: boolean; className?: string };

/** D-shaped plate: the cut-out center keeps the mark clear on any background. */
export default function Logo({ symbolOnly = false, inverse = false, className = "" }: LogoProps) {
  return (
    <span className={`logo ${inverse ? "logo-inverse" : ""} ${className}`}>
      <svg className="logo-symbol" viewBox="0 0 48 48" fill="none" aria-hidden="true" focusable="false">
        <path fill="currentColor" fillRule="evenodd" d="M10 6h12a18 18 0 0 1 0 36H10a4 4 0 0 1-4-4V10a4 4 0 0 1 4-4Zm14 7a11 11 0 1 0 0 22 11 11 0 0 0 0-22Z" />
        <circle cx="24" cy="24" r="7" stroke="currentColor" strokeWidth="2" />
      </svg>
      {symbolOnly ? <span className="sr-only">DamTap</span> : <span className="logo-wordmark">DamTap</span>}
    </span>
  );
}
