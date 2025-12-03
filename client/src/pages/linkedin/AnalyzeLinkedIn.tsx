import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Linkedin, Loader2, CheckCircle, TrendingUp, Users } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function AnalyzeLinkedIn() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [linkedinUrl, setLinkedinUrl] = useState("");
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
    if (!linkedinUrl.trim()) {
      toast.error("الرجاء إدخال رابط ملفك على LinkedIn");
      return;
    }

    if (!linkedinUrl.includes("linkedin.com")) {
      toast.error("الرجاء إدخال رابط LinkedIn صحيح");
      return;
    }

    setAnalyzing(true);
    
    setTimeout(() => {
      toast.success("تم تحليل ملف LinkedIn بنجاح!");
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
            <h1 className="text-xl font-bold">تحليل LinkedIn</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Linkedin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">تحليل ملف LinkedIn</CardTitle>
                <CardDescription className="text-base">
                  احصل على تحليل شامل لملفك الشخصي على LinkedIn ومقترحات للتحسين
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Linkedin className="w-5 h-5 text-blue-500 mt-0.5" />
                <div className="space-y-2">
                  <h3 className="font-semibold text-foreground">كيف أحصل على رابط ملفي؟</h3>
                  <ol className="text-sm text-muted-foreground list-decimal list-inside space-y-1">
                    <li>افتح ملفك الشخصي على LinkedIn</li>
                    <li>انسخ الرابط من شريط العنوان</li>
                    <li>الصق الرابط في الحقل أدناه</li>
                  </ol>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin-url">رابط ملفك على LinkedIn</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Linkedin className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="linkedin-url"
                    type="url"
                    placeholder="https://www.linkedin.com/in/your-profile"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="pr-10"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">اكتمال الملف</h4>
                  <p className="text-sm text-muted-foreground">
                    تقييم مدى اكتمال معلومات ملفك
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <TrendingUp className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">تحسين الظهور</h4>
                  <p className="text-sm text-muted-foreground">
                    نصائح لزيادة ظهورك في البحث
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <Users className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">التفاعل</h4>
                  <p className="text-sm text-muted-foreground">
                    اقتراحات لزيادة التفاعل والشبكة
                  </p>
                </CardContent>
              </Card>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!linkedinUrl.trim() || analyzing}
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
                  <Linkedin className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
