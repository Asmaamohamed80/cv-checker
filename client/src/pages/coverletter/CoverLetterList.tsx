import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Plus } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function CoverLetterList() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    window.location.href = getLoginUrl();
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">← العودة إلى لوحة التحكم</Link>
            </Button>
            <h1 className="text-xl font-bold">خطابات التوصية</h1>
            <Button asChild>
              <Link href="/cover-letter/create">
                <Plus className="ml-2 h-4 w-4" />
                كتابة جديد
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Card className="border-border/50 bg-card/50 backdrop-blur max-w-2xl mx-auto">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <Mail className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">لا توجد خطابات توصية</h2>
            <p className="text-muted-foreground mb-6 text-center">
              ابدأ بكتابة خطاب توصية احترافي لوظيفتك المستهدفة
            </p>
            <Button size="lg" asChild>
              <Link href="/cover-letter/create">
                <Plus className="ml-2 h-5 w-5" />
                كتابة خطاب توصية
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
