import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect } from 'wagmi';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Shield, CheckCircle } from "lucide-react";

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected) {
    return (
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-success/20">
              <CheckCircle className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="font-medium text-card-foreground">Wallet Connected</p>
              <p className="text-sm text-muted-foreground">
                {address?.substring(0, 6)}...{address?.substring(address.length - 4)}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => disconnect()}>
            Disconnect
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-card border-border">
      <div className="text-center space-y-4">
        <div className="p-3 rounded-full bg-primary/20 w-fit mx-auto">
          <Wallet className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground mb-2">Connect Your Wallet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Connect your wallet to send secure, private remittances
          </p>
        </div>
        <ConnectButton />
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Shield className="h-3 w-3" />
          <span>Fully encrypted and secure</span>
        </div>
      </div>
    </Card>
  );
}