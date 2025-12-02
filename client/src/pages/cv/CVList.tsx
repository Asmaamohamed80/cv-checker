import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Eye, Trash2, Calendar } from "lucide-react";
import { Link } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";

export default function CVList() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const { data: cvList, isLoading } = trpc.cv.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (authLoading || isLoading) {
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="default" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">مكتمل</Badge>;
      case "analyzing":
        return <Badge variant="default" className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">قيد التحليل</Badge>;
      default:
        return <Badge variant="secondary">مسودة</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      {/* Header */}
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">
                ← العودة إلى لوحة التحكم
              </Link>
            </Button>
            <h1 className="text-xl font-bold">سيرتي الذاتية</h1>
            <Button asChild>
              <Link href="/cv/create">
                <Plus className="ml-2 h-4 w-4" />
                إنشاء جديد
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!cvList || cvList.length === 0 ? (
          <Card className="border-border/50 bg-card/50 backdrop-blur max-w-2xl mx-auto">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <FileText className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">لا توجد سير ذاتية</h2>
              <p className="text-muted-foreground mb-6 text-center">
                ابدأ بإنشاء سيرتك الذاتية الأولى باستخدام الذكاء الاصطناعي أو يدوياً
              </p>
              <Button size="lg" asChild>
                <Link href="/cv/create">
                  <Plus className="ml-2 h-5 w-5" />
                  إنشاء سيرة ذاتية
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvList.map((cv) => (
              <Card key={cv.id} className="border-border/50 bg-card/50 backdrop-blur hover:bg-card/80 transition-all hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    {getStatusBadge(cv.status)}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{cv.title}</CardTitle>
                  <CardDescription className="flex items-center gap-1 text-xs">
                    <Calendar className="w-3 h-3" />
                    {formatDistanceToNow(new Date(cv.createdAt), { addSuffix: true, locale: ar })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <Link href={`/cv/view/${cv.id}`}>
                      <Eye className="ml-2 h-4 w-4" />
                      عرض التفاصيل
                    </Link>
                  </Button>
                  {cv.status === "completed" && (
                    <Button variant="outline" className="w-full justify-start" asChild>
                      <Link href={`/cv/analysis/${cv.id}`}>
                        <FileText className="ml-2 h-4 w-4" />
                        عرض التحليل
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
