import localFont from "next/font/local";

export const montserrat = localFont({
  src: [
    {
      path: "../styles/fonts/Montserrat-Variable.woff2",
      style: "normal",
      weight: "100 900",
    },
  ],
  display: "swap",
  variable: "--font-montserrat",
  // 37 KB that the first viewport never uses: the hero headline and CTA are
  // Poppins, so preloading Montserrat only stole bandwidth from the LCP poster
  // on Slow 4G. It is still fetched from the render-blocking CSS for the
  // sections below the fold, where a late swap is not visible.
  preload: false,
});

export const poppins = localFont({
  src: [
    {
      path: "../styles/fonts/Poppins-Medium.woff2",
      style: "normal",
      weight: "500",
    },
    {
      path: "../styles/fonts/Poppins-Black.woff2",
      style: "normal",
      weight: "900",
    },
  ],
  display: "swap",
  variable: "--font-poppins",
});
