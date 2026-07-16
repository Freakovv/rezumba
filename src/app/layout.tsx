import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { getServerLocale } from "@/lib/get-server-locale";
import "./globals.css";
import "lenis/dist/lenis.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin", "cyrillic"],
  // Only the hero headline uses the serif, always at font-light.
  weight: ["300"],
});

export const metadata: Metadata = {
  title: "Mikhail Simanovich — Software Developer",
  description:
    "Portfolio and resume of Mikhail Simanovich — software developer building production web products.",
  metadataBase: new URL("https://rezumba.xyz"),
  other: {
    google: "notranslate",
  },
  openGraph: {
    title: "Mikhail Simanovich — Software Developer",
    description:
      "Portfolio and resume of Mikhail Simanovich — software developer building production web products.",
    url: "/",
    siteName: "rezumba",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Mikhail Simanovich — Software Developer portfolio",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mikhail Simanovich — Software Developer",
    description:
      "Portfolio and resume of Mikhail Simanovich — software developer building production web products.",
    images: ["/og.jpg"],
  },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  const initialLocale = await getServerLocale();

  return (
    <html
      lang={initialLocale}
      translate="no"
      suppressHydrationWarning
      className={`notranslate ${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var h=location.hash;if(h==="#stack"||h==="#experience"||h==="#contact"){document.documentElement.dataset.sectionRestore="true"}}catch(e){}',
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-background text-foreground"
      >
        <LocaleProvider initialLocale={initialLocale}>
          <SmoothScroll>
            {children}
            {modal}
          </SmoothScroll>
        </LocaleProvider>
      </body>
    </html>
  );
}
