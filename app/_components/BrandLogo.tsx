type BrandLogoProps = {
  className?: string;
  /** `light` = black wordmark (default). `dark` = white wordmark for dark surfaces. */
  surface?: "light" | "dark";
};

export function BrandLogo({ className = "brand-logo", surface = "light" }: BrandLogoProps) {
  const src = surface === "dark" ? "/legis-logo-on-dark.png" : "/legis-logo.png";
  return <img className={className} src={src} alt="Legis" />;
}
