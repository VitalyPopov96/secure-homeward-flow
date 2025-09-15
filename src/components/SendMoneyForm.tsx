import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAccount } from 'wagmi';
import { useCreateRemittance, useTransactionReceipt } from '@/hooks/useContract';

interface SendMoneyFormProps {
  isWalletConnected: boolean;
}

const SendMoneyForm = ({ isWalletConnected }: SendMoneyFormProps) => {
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [fromCountry, setFromCountry] = useState("");
  const [toCountry, setToCountry] = useState("");
  const [purpose, setPurpose] = useState("");
  const [isAmountHidden, setIsAmountHidden] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { address } = useAccount();
  const { createRemittance, hash, isPending, error } = useCreateRemittance();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useTransactionReceipt(hash);

  const countries = [
    { code: "US", name: "United States", currency: "USD" },
    { code: "UK", name: "United Kingdom", currency: "GBP" },
    { code: "IN", name: "India", currency: "INR" },
    { code: "PH", name: "Philippines", currency: "PHP" },
    { code: "MX", name: "Mexico", currency: "MXN" },
    { code: "CN", name: "China", currency: "CNY" },
    { code: "BD", name: "Bangladesh", currency: "BDT" },
    { code: "PK", name: "Pakistan", currency: "PKR" },
  ];

  const handleSend = async () => {
    if (!amount || !recipient || !recipientName || !fromCountry || !toCountry || !purpose) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    if (!address) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to send money.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsProcessing(true);
      
      // Calculate fee (0.5% of amount)
      const fee = (parseFloat(amount) * 0.005).toString();
      
      await createRemittance({
        amount,
        fee,
        recipientName,
        recipientCountry: toCountry,
        purpose,
        recipient,
      });
      
      toast({
        title: "Transaction Submitted",
        description: "Your encrypted remittance transaction has been submitted to the blockchain.",
      });
      
      // Reset form
      setAmount("");
      setRecipient("");
      setRecipientName("");
      setFromCountry("");
      setToCountry("");
      setPurpose("");
    } catch (err) {
      console.error('Error sending remittance:', err);
      toast({
        title: "Transaction Failed",
        description: "There was an error processing your transaction. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const displayAmount = isAmountHidden && amount ? "•".repeat(amount.length) : amount;

  return (
    <Card className="p-6 bg-card border-border">
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-card-foreground mb-2">Send Money Home</h2>
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            <span>End-to-end encrypted transfers</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-country">From Country</Label>
              <Select value={fromCountry} onValueChange={setFromCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="to-country">To Country</Label>
              <Select value={toCountry} onValueChange={setToCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name} ({country.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <Input
                id="amount"
                type={isAmountHidden ? "password" : "number"}
                placeholder="0.00"
                value={displayAmount}
                onChange={(e) => setAmount(e.target.value)}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                onClick={() => setIsAmountHidden(!isAmountHidden)}
              >
                {isAmountHidden ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3 w-3" />
              <span>Amount is encrypted and hidden for privacy</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient-name">Recipient Name</Label>
            <Input
              id="recipient-name"
              placeholder="Enter recipient's full name"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient Wallet Address</Label>
            <Input
              id="recipient"
              placeholder="0x..."
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Transfer</Label>
            <Select value={purpose} onValueChange={setPurpose}>
              <SelectTrigger>
                <SelectValue placeholder="Select purpose" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="family-support">Family Support</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="medical">Medical Expenses</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="emergency">Emergency</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="pt-4 space-y-3">
            <Button
              onClick={handleSend}
              disabled={!isWalletConnected || isPending || isConfirming}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : isConfirming ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Confirming...
                </div>
              ) : isConfirmed ? (
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Transaction Confirmed
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send Securely</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              )}
            </Button>

            {!isWalletConnected && (
              <p className="text-center text-sm text-muted-foreground">
                Please connect your wallet to send money
              </p>
            )}
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-sm font-medium text-card-foreground">Fee</div>
              <div className="text-xs text-muted-foreground">0.5%</div>
            </div>
            <div>
              <div className="text-sm font-medium text-card-foreground">Speed</div>
              <div className="text-xs text-muted-foreground">~2 minutes</div>
            </div>
            <div>
              <div className="text-sm font-medium text-card-foreground">Privacy</div>
              <div className="text-xs text-primary">Maximum</div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SendMoneyForm;