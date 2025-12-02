import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Briefcase, Linkedin, Mail, Plus, TrendingUp } from "lucide-react";
import { Link, useLocation } from "wouter";
import { getLoginUrl } from "@/const";

export default function Dashboard() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
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
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/">
                <span className="text-xl font-bold">ATS CV Checker</span>
              </Link>
            </Button>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user?.name || user?.email}
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            مرحباً بك، {user?.name?.split(' ')[0] || 'عزيزي المستخدم'}
          </h1>
          <p className="text-muted-foreground">
            اختر الخدمة التي تريد استخدامها لتطوير مسيرتك المهنية
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>السير الذاتية</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                جاهز للبدء
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>البورتفوليو</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                جاهز للبدء
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>تحليلات LinkedIn</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                جاهز للبدء
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 backdrop-blur">
            <CardHeader className="pb-2">
              <CardDescription>خطابات التوصية</CardDescription>
              <CardTitle className="text-3xl">0</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                جاهز للبدء
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* CV Service */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">السيرة الذاتية CV</CardTitle>
                    <CardDescription>إنشاء ومراجعة سيرتك الذاتية</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/cv/create">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء سيرة ذاتية جديدة
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/cv/review">
                  <FileText className="ml-2 h-4 w-4" />
                  مراجعة سيرة ذاتية موجودة
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/cv/list">
                  عرض جميع السير الذاتية
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio Service */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">البورتفوليو Portfolio</CardTitle>
                    <CardDescription>بناء معرض أعمالك الاحترافي</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/portfolio/create">
                  <Plus className="ml-2 h-4 w-4" />
                  إنشاء بورتفوليو جديد
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/portfolio/review">
                  <Briefcase className="ml-2 h-4 w-4" />
                  مراجعة بورتفوليو موجود
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/portfolio/list">
                  عرض جميع البورتفوليوهات
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* LinkedIn Service */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Linkedin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">لينكد إن LinkedIn</CardTitle>
                    <CardDescription>تحسين ملفك الشخصي</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/linkedin/analyze">
                  <Linkedin className="ml-2 h-4 w-4" />
                  تحليل ملف LinkedIn
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/linkedin/history">
                  عرض التحليلات السابقة
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Cover Letter Service */}
          <Card className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">خطاب التوصية Cover Letter</CardTitle>
                    <CardDescription>كتابة خطابات احترافية</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/cover-letter/create">
                  <Plus className="ml-2 h-4 w-4" />
                  كتابة خطاب جديد
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/cover-letter/review">
                  <Mail className="ml-2 h-4 w-4" />
                  مراجعة خطاب موجود
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/cover-letter/list">
                  عرض جميع الخطابات
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
