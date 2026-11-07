import Image from "next/image";

type LogoProps = { symbolOnly?: boolean; className?: string; priority?: boolean };

/** Exact supplied Fork in D artwork, including its original wordmark. */
export default function Logo({ symbolOnly = false, className = "", priority = false }: LogoProps) {
  return (
    <span className={`logo ${className}`}>
      <Image
        className={symbolOnly ? "logo-symbol" : "logo-horizontal"}
        src={symbolOnly ? "/brand/damtap-symbol-64.png" : "/brand/damtap-logo-horizontal.webp"}
        alt="DamTap"
        width={symbolOnly ? 64 : 1868}
        height={symbolOnly ? 64 : 467}
        sizes={symbolOnly ? "22px" : "144px"}
        priority={priority}
      />
    </span>
  );
}
