import { Button } from "@/components/ui/button";
import WalletConnect from "@/components/WalletConnect";
import SendMoneyForm from "@/components/SendMoneyForm";
import Logo from "@/components/Logo";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccount } from 'wagmi';

const SendMoney = () => {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <Logo size="md" showText={true} />
          </div>
        </div>
      </header>

      {/* Send Money Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Send Money Securely
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Connect your wallet and start sending encrypted remittances to your family back home.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Step 1: Connect Your Wallet
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Securely connect your cryptocurrency wallet to begin the transfer process.
                  </p>
                </div>
                
                <WalletConnect />
                
                {isConnected && address && (
                  <div className="p-4 rounded-lg bg-success/20 border border-success/30">
                    <div className="flex items-center gap-2 text-success">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">
                        Wallet connected securely: {address.substring(0, 6)}...{address.substring(address.length - 4)}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    Step 2: Send Money
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Enter recipient details and amount. All information is encrypted end-to-end.
                  </p>
                </div>
                
                <SendMoneyForm isWalletConnected={isConnected} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SendMoney;