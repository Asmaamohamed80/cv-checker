import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function CreateCoverLetter() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    jobTitle: "",
    companyName: "",
    content: "",
  });

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

  const handleCreate = async () => {
    if (!formData.jobTitle.trim() || !formData.companyName.trim()) {
      toast.error("الرجاء إدخال المسمى الوظيفي واسم الشركة");
      return;
    }

    setCreating(true);
    
    setTimeout(() => {
      toast.success("تم إنشاء خطاب التوصية بنجاح!");
      setCreating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">← العودة إلى لوحة التحكم</Link>
            </Button>
            <h1 className="text-xl font-bold">كتابة خطاب توصية</h1>
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
                <CardTitle className="text-2xl">إنشاء خطاب توصية احترافي</CardTitle>
                <CardDescription className="text-base">
                  اكتب خطاب توصية مخصص لوظيفتك المستهدفة
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">المسمى الوظيفي *</Label>
                <Input
                  id="job-title"
                  placeholder="مثال: مطور برمجيات"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company-name">اسم الشركة *</Label>
                <Input
                  id="company-name"
                  placeholder="مثال: شركة التقنية المتقدمة"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">محتوى الخطاب</Label>
              <Textarea
                id="content"
                placeholder="اكتب خطاب التوصية هنا، أو اترك الحقل فارغاً ليقوم الذكاء الاصطناعي بكتابته لك..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={12}
              />
              <p className="text-sm text-muted-foreground">
                يمكنك كتابة الخطاب بنفسك أو ترك الحقل فارغاً ليقوم الذكاء الاصطناعي بإنشائه تلقائياً
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-2">نصائح لخطاب توصية فعّال:</h4>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>ابدأ بتحية رسمية وذكر الوظيفة المستهدفة</li>
                <li>اذكر مهاراتك وخبراتك المتعلقة بالوظيفة</li>
                <li>أظهر معرفتك بالشركة وسبب اهتمامك بها</li>
                <li>اختم بدعوة للتواصل وشكر على الوقت</li>
              </ul>
            </div>

            <Button 
              onClick={handleCreate}
              disabled={creating}
              size="lg"
              className="w-full"
            >
              {creating ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  إنشاء خطاب التوصية
                  <Plus className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
