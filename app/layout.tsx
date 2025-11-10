import "./globals.css";
import { Inter, Fraunces } from "next/font/google";
import { clsx } from "clsx";
import { ThemeProvider } from 'next-themes'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { AuthProvider } from '@/components/AuthProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets:["latin"], variable:"--font-inter", display:"swap" });
const fraunces = Fraunces({ subsets:["latin"], variable:"--font-fraunces", display:"swap" });

export const metadata = {
  title: "Hodges & Fooshee Realty",
  description: "Your Source for Nashville Real Estate Excellence"
};

export default function RootLayout({ children }:{children:React.ReactNode}) {
  return (
    <html lang="en" className={clsx(inter.variable, fraunces.variable)} suppressHydrationWarning>
      <body>
        <AuthProvider>
          <QueryProvider>
            <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
              {children}
              <Toaster />
            </ThemeProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
