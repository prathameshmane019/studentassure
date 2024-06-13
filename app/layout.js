import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./Providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Student Assure",
  description: "Student Assure - Feedback for College Students",
  icons:{
    icon:"/logo.png"
  }

};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider></body>
    </html>
  );
}
