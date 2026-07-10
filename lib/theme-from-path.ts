export type ThemeAttrs = {
  theme: "dark" | "light";
  display: "sans";
  accent: "cobalt" | "oxblood";
};

export function themeAttrsFromPathname(pathname: string): ThemeAttrs {
  const isProduct = pathname.includes("/product");

  return {
    theme: "light",
    display: "sans",
    accent: isProduct ? "oxblood" : "cobalt",
  };
}
