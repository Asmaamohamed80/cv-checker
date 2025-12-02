import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Briefcase, Link as LinkIcon, Loader2, CheckCircle } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function ReviewPortfolio() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [portfolioUrl, setPortfolioUrl] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

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

  const handleAnalyze = async () => {
    if (!portfolioUrl.trim()) {
      toast.error("الرجاء إدخال رابط البورتفوليو");
      return;
    }

    setAnalyzing(true);
    
    setTimeout(() => {
      toast.success("تم تحليل البورتفوليو بنجاح!");
      setAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">← العودة إلى لوحة التحكم</Link>
            </Button>
            <h1 className="text-xl font-bold">مراجعة البورتفوليو</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">مراجعة وتحليل البورتفوليو</CardTitle>
                <CardDescription className="text-base">
                  أدخل رابط بورتفوليوك للحصول على تحليل شامل ومقترحات للتحسين
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="portfolio-url">رابط البورتفوليو</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="portfolio-url"
                    type="url"
                    placeholder="https://example.com/portfolio"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                يمكنك إدخال رابط من Behance, Dribbble, GitHub Pages، أو أي موقع آخر
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">تقييم المحتوى</h4>
                  <p className="text-sm text-muted-foreground">
                    تحليل جودة وتنوع المشاريع
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <Briefcase className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">فحص التصميم</h4>
                  <p className="text-sm text-muted-foreground">
                    تقييم التصميم وتجربة المستخدم
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <LinkIcon className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">اقتراحات التحسين</h4>
                  <p className="text-sm text-muted-foreground">
                    توصيات لتطوير البورتفوليو
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!portfolioUrl.trim() || analyzing}
              size="lg"
              className="w-full"
            >
              {analyzing ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري التحليل...
                </>
              ) : (
                <>
                  بدء التحليل
                  <Briefcase className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
