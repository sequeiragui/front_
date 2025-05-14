"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3 } from "@/components/web3-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

export default function Home() {
  const router = useRouter();
  const { connect, isConnected, isConnecting, address, chainId } = useWeb3();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [networkError, setNetworkError] = useState<string | null>(null);

  useEffect(() => {
    if (chainId !== null) {
      setNetworkError(null); // Accept any network for demo
    }
  }, [chainId]);

  const handleContinue = async () => {
    if (!isConnected) {
      await connect();
    }
    if (selectedRole) {
      router.push(`/${selectedRole}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-background to-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Supply Chain DApp</CardTitle>
          <CardDescription>Connect your wallet and select your role</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {networkError && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Network Error</AlertTitle>
              <AlertDescription>{networkError}</AlertDescription>
            </Alert>
          )}

          {!isConnected ? (
            <Button className="w-full" onClick={connect} disabled={isConnecting}>
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Connect MetaMask"
              )}
            </Button>
          ) : (
            <>
              <div className="rounded-lg bg-muted p-3 text-center text-sm">
                <div>
                  Connected: {address?.slice(0, 6)}...{address?.slice(-4)}
                </div>
                {chainId && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Network ID: {chainId}
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Select your role:</h3>
                <RadioGroup value={selectedRole || ""} onValueChange={setSelectedRole}>
                  {["seller", "buyer", "distributor", "warehouse", "delivery"].map((role) => (
                    <div key={role} className="flex items-center space-x-2">
                      <RadioGroupItem value={role} id={role} />
                      <Label htmlFor={role}>{role}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleContinue}
            disabled={!isConnected || !selectedRole || !!networkError}
          >
            Continue
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
