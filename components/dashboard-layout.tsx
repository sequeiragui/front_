"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useWeb3 } from "@/components/web3-provider";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  Package,
  ShoppingBag,
  Truck,
  WarehouseIcon,
  Box,
  LogOut,
  User,
  AlertCircle,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "seller" | "buyer" | "distributor" | "warehouse" | "delivery";
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const router = useRouter();
  const { isConnected, address, disconnect, chainId } = useWeb3();
  const [networkError, setNetworkError] = useState<string | null>(null);

  // Reset network error on chain change
  useEffect(() => {
    if (chainId !== null) {
      setNetworkError(null);
    }
  }, [chainId]);

  // Redirect to home if not connected
  useEffect(() => {
    if (!isConnected) {
      router.push("/");
    }
  }, [isConnected, router]);

  const handleLogout = () => {
    disconnect();
    router.push("/");
  };

  const getRoleIcon = () => {
    switch (role) {
      case "seller":
        return <Package className="h-6 w-6" />;
      case "buyer":
        return <ShoppingBag className="h-6 w-6" />;
      case "distributor":
        return <Truck className="h-6 w-6" />;
      case "warehouse":
        return <WarehouseIcon className="h-6 w-6" />;
      case "delivery":
        return <Box className="h-6 w-6" />;
      default:
        return <User className="h-6 w-6" />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            {getRoleIcon()}
            <span className="text-lg font-semibold capitalize">
              {role} Dashboard
            </span>
          </div>

          <div className="flex items-center gap-4">
            {address && (
              <div className="hidden md:block text-sm text-muted-foreground">
                <div>
                  {address.slice(0, 6)}...{address.slice(-4)}
                </div>
                {chainId && (
                  <div className="text-xs text-muted-foreground text-right">
                    Network ID: {chainId}
                  </div>
                )}
              </div>
            )}

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 lg:block">
          <nav className="flex flex-col gap-2 p-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded-md px-3 py-2 text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              Home
            </Link>
            <Link
              href={`/${role}`}
              className="flex items-center gap-2 rounded-md bg-muted px-3 py-2 text-foreground"
            >
              Dashboard
            </Link>
            {/* Add additional navigation links as needed */}
          </nav>
        </aside>

        <main className="flex-1 bg-background">
          {networkError ? (
            <div className="container mx-auto py-6">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Network Error</AlertTitle>
                <AlertDescription>{networkError}</AlertDescription>
              </Alert>
            </div>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
