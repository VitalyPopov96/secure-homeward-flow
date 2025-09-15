import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import GlobalMap from "@/components/GlobalMap";
import { Shield, Globe, Lock, Zap, Users, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/remittance-hero.jpg";

const Index = () => {

  const features = [
    {
      icon: Shield,
      title: "End-to-End Encryption",
      description: "Transaction amounts and details are fully encrypted and private"
    },
    {
      icon: Globe,
      title: "Global Network",
      description: "Send money to over 50 countries with competitive rates"
    },
    {
      icon: Lock,
      title: "Zero Knowledge",
      description: "We never see your transaction amounts or recipient details"
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Transfers complete in minutes, not days"
    },
    {
      icon: Users,
      title: "Built for Workers",
      description: "Designed specifically for migrant workers sending money home"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero" />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-tight">
                Send Money Home,
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-accent">
                  Keep Privacy
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                Secure, encrypted cross-border remittances for migrant workers. 
                Your family gets the money, nobody else gets your data.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/send">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg">
                  <div className="flex items-center gap-2">
                    <span>Start Sending</span>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="px-8 py-3 text-lg border-border">
                Learn More
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">$2.3B+</div>
                  <div className="text-sm text-muted-foreground">Sent Securely</div>
                </div>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
              </Card>
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-primary">2min</div>
                  <div className="text-sm text-muted-foreground">Average Transfer</div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Global Map Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Global Remittance Network
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch money flow across borders in real-time. Every transfer is encrypted, 
              every transaction is private.
            </p>
          </div>
          <GlobalMap />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              Why Choose Private Remittance?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-card border-border hover:shadow-glow transition-all duration-300">
                <div className="space-y-4">
                  <div className="p-3 rounded-full bg-primary/20 w-fit">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/20 to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-foreground">
              Ready to Send Money Home?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of migrant workers who trust Private Remittance for secure, encrypted money transfers.
            </p>
            <Link to="/send">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                <div className="flex items-center gap-2">
                  <span>Start Your Transfer</span>
                  <ArrowRight className="h-5 w-5" />
                </div>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-secondary/10 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold text-foreground">Private Remittance</span>
            </div>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Empowering migrant workers with secure, private cross-border money transfers. 
              Your family gets the money, your privacy stays protected.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" />
              <span>All transactions are end-to-end encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;