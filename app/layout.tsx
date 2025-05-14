import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import { ThemeProvider } from "@/components/theme-provider"
import { Web3Provider } from "@/components/web3-provider"
import { SupplyChainProvider } from "@/components/supply-chain-provider"

import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Web3Provider>
            <SupplyChainProvider>
              {children}
              <Toaster />
            </SupplyChainProvider>
          </Web3Provider>
        </ThemeProvider>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
