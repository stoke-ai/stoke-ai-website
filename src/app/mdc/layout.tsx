import { Geist, Oswald } from "next/font/google";
import "./mdc.css";

const body = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const display = Oswald({
  variable: "--font-display",
  subsets: ["latin"],
});

export default function MorganDoorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className={`${body.variable} ${display.variable}`}>{children}</div>;
}
