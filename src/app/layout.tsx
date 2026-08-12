import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Harshit Pandey — Robotics, AI, STEM & Embedded Systems",
  description: "AI and robotics instructor focused on hands-on STEM education, VLSI design, CAD, and electrical engineering principles.",
  openGraph: {
    title: "Harshit Pandey — Robotics, AI, STEM & Embedded Systems",
    description: "AI and robotics instructor focused on hands-on STEM education, VLSI design, CAD, and electrical engineering principles.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <html lang="en" className={geist.variable}><body>{children}</body></html>;
}
