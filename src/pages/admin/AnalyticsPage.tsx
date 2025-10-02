import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function AnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Header />
      <main className="pt-24 pb-12">
        <div className="mx-auto max-w-7xl px-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="mb-8">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Deep Analytics
            </h1>
            <p className="text-muted-foreground mt-3 text-lg">
              Advanced metrics and insights (Coming Soon)
            </p>
          </div>

          <Card className="backdrop-blur-xl bg-card/50 border-border/50 p-12 text-center">
            <p className="text-muted-foreground">
              Deep analytics dashboard with detailed charts, user behavior tracking, and performance metrics will be available here.
            </p>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
