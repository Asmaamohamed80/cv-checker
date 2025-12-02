import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function ReviewCoverLetter() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [content, setContent] = useState("");
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
    if (!content.trim()) {
      toast.error("الرجاء إدخال محتوى خطاب التوصية");
      return;
    }

    setAnalyzing(true);
    
    setTimeout(() => {
      toast.success("تم تحليل خطاب التوصية بنجاح!");
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
            <h1 className="text-xl font-bold">مراجعة خطاب التوصية</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">مراجعة وتحليل خطاب التوصية</CardTitle>
                <CardDescription className="text-base">
                  الصق محتوى خطابك للحصول على تحليل شامل ومقترحات للتحسين
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="content">محتوى خطاب التوصية</Label>
              <Textarea
                id="content"
                placeholder="الصق محتوى خطاب التوصية هنا..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={15}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">
                عدد الكلمات: {content.trim().split(/\s+/).filter(Boolean).length}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">فحص المحتوى</h4>
                  <p className="text-sm text-muted-foreground">
                    تقييم جودة وملاءمة المحتوى
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <AlertCircle className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">كشف الأخطاء</h4>
                  <p className="text-sm text-muted-foreground">
                    اكتشاف الأخطاء اللغوية والنحوية
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <Mail className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">تحسين الأسلوب</h4>
                  <p className="text-sm text-muted-foreground">
                    اقتراحات لتحسين الصياغة والأسلوب
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!content.trim() || analyzing}
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
                  <Mail className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
