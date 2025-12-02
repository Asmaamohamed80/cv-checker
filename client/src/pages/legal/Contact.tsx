import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, Send } from "lucide-react";
import { Link } from "wouter";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("الرجاء ملء جميع الحقول المطلوبة");
      return;
    }

    setSending(true);
    
    // Simulate sending
    setTimeout(() => {
      toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSending(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">
                ← العودة للرئيسية
              </Link>
            </Button>
            <h1 className="text-xl font-bold">ATS CV Checker</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-3xl">اتصل بنا</CardTitle>
                <CardDescription className="text-base">
                  نحن هنا للإجابة على أسئلتك ومساعدتك
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">الاسم *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">البريد الإلكتروني *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">الموضوع</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="موضوع الرسالة"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">الرسالة *</Label>
                <Textarea
                  id="message"
                  placeholder="اكتب رسالتك هنا..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  required
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={sending}>
                {sending ? (
                  <>جاري الإرسال...</>
                ) : (
                  <>
                    إرسال الرسالة
                    <Send className="mr-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/40">
              <h3 className="text-lg font-semibold mb-4">معلومات التواصل</h3>
              <div className="space-y-3 text-muted-foreground">
                <p>
                  <strong>البريد الإلكتروني:</strong>{" "}
                  <a href="mailto:support@atscvchecker.com" className="text-primary hover:underline">
                    support@atscvchecker.com
                  </a>
                </p>
                <p>
                  <strong>ساعات العمل:</strong> من الأحد إلى الخميس، 9 صباحاً - 5 مساءً
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
