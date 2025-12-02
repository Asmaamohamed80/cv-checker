import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import { FileText, Briefcase, Linkedin, Mail, Sparkles, CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">ATS CV Checker</h1>
                <p className="text-xs text-muted-foreground">مراجع السيرة الذاتية الاحترافي</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  <span className="text-sm text-muted-foreground hidden sm:inline">
                    مرحباً، {user?.name || user?.email}
                  </span>
                  <Button asChild>
                    <Link href="/dashboard">لوحة التحكم</Link>
                  </Button>
                </>
              ) : (
                <Button asChild>
                  <a href={getLoginUrl()}>تسجيل الدخول</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-6 mb-16">
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-center mb-4">
              <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-base shadow-lg shadow-green-500/50 animate-pulse">
                <Sparkles className="w-5 h-5" />
                <span>جرّب مجاناً!</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>مدعوم بالذكاء الاصطناعي</span>
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
              اصنع مستقبلك المهني
              <br />
              <span className="text-primary">بثقة واحترافية</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              منصة متكاملة لإنشاء ومراجعة وتحسين سيرتك الذاتية، بورتفوليو، ملف لينكد إن، وخطابات التوصية
              باستخدام تقنيات الذكاء الاصطناعي ومعايير ATS
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              {isAuthenticated ? (
                <div className="flex gap-4">
                  <Button size="lg" asChild>
                    <Link href="/dashboard">
                      ابدأ الآن
                      <ArrowLeft className="mr-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/pricing">
                      الباقات والأسعار
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="flex gap-4">
                  <Button size="lg" className="text-lg px-8 py-6" asChild>
                    <a href={getLoginUrl()}>
                      ابدأ مجاناً
                      <ArrowRight className="mr-2 h-5 w-5" />
                    </a>
                  </Button>
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
                    <Link href="/pricing">
                      الباقات
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">السيرة الذاتية CV</CardTitle>
                <CardDescription className="text-base">
                  إنشاء ومراجعة سيرتك الذاتية وفقاً لمعايير ATS
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>إنشاء من البداية</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>فحص توافق ATS</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>تصحيح تلقائي</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Briefcase className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">البورتفوليو Portfolio</CardTitle>
                <CardDescription className="text-base">
                  بناء معرض أعمال احترافي يبرز مهاراتك
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>نماذج جاهزة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>تحليل الجودة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>اقتراحات تحسين</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Linkedin className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">لينكد إن LinkedIn</CardTitle>
                <CardDescription className="text-base">
                  تحسين ملفك الشخصي على لينكد إن
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>تحليل الملف</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>نقاط القوة والضعف</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>توصيات محددة</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg hover:scale-105 duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl">خطاب التوصية Cover Letter</CardTitle>
                <CardDescription className="text-base">
                  كتابة خطابات توصية مؤثرة واحترافية
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>قوالب متنوعة</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>مراجعة المحتوى</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-primary" />
                    <span>تحسين الصياغة</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-card/30 border-y border-border/40">
        <div className="container mx-auto max-w-4xl text-center">
          <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            جاهز لتطوير مسيرتك المهنية؟
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            انضم إلى آلاف المستخدمين الذين حسّنوا فرصهم الوظيفية باستخدام أدواتنا الاحترافية
          </p>
          {isAuthenticated ? (
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <Link href="/dashboard">
                انتقل إلى لوحة التحكم
                <ArrowRight className="mr-2 h-5 w-5" />
              </Link>
            </Button>
          ) : (
            <Button size="lg" className="text-lg px-8 py-6" asChild>
              <a href={getLoginUrl()}>
                ابدأ الآن مجاناً
                <ArrowRight className="mr-2 h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border/40">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 ATS CV Checker. جميع الحقوق محفوظة.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                سياسة الخصوصية
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                شروط الاستخدام
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">
                اتصل بنا
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
