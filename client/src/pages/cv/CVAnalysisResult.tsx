import { useEffect, useState } from "react";
import { useLocation, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  XCircle, 
  Lightbulb, 
  TrendingUp, 
  Sparkles,
  Download,
  Loader2 
} from "lucide-react";
import { toast } from "sonner";

export default function CVAnalysisResult() {
  const [, params] = useRoute("/cv/analysis/:id");
  const [, setLocation] = useLocation();
  const cvId = params?.id ? parseInt(params.id) : null;
  const [generatingPro, setGeneratingPro] = useState(false);

  const { data: analysis, isLoading, error } = trpc.cv.getAnalysis.useQuery(
    { cvId: cvId! },
    { enabled: !!cvId }
  );

  const createProCVMutation = trpc.cv.createProfessionalCV.useMutation({
    onSuccess: (data: { paymentUrl: string | null }) => {
      toast.success("تم إنشاء السيرة الاحترافية بنجاح!");
      setGeneratingPro(false);
      // Redirect to payment or download page
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "حدث خطأ أثناء إنشاء السيرة الاحترافية");
      setGeneratingPro(false);
    },
  });

  const handleGetProCV = () => {
    if (!cvId) return;
    setGeneratingPro(true);
    createProCVMutation.mutate({ cvId });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>خطأ</CardTitle>
            <CardDescription>لم يتم العثور على نتائج التحليل</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setLocation("/dashboard")}>
              العودة إلى لوحة التحكم
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const strengths = analysis.strengths ? JSON.parse(analysis.strengths) : [];
  const weaknesses = analysis.weaknesses ? JSON.parse(analysis.weaknesses) : [];
  const suggestions = analysis.suggestions ? JSON.parse(analysis.suggestions) : [];
  const atsScore = analysis.atsScore || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 dark:from-slate-950 dark:via-blue-950 dark:to-slate-950 py-12">
      <div className="container max-w-5xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">نتائج تحليل السيرة الذاتية</h1>
          <p className="text-muted-foreground">تحليل شامل باستخدام الذكاء الاصطناعي</p>
        </div>

        {/* Overall Score */}
        <Card className="mb-6 border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>التقييم الإجمالي</span>
              <Badge variant={atsScore >= 80 ? "default" : atsScore >= 60 ? "secondary" : "destructive"} className="text-lg px-4 py-1">
                {atsScore}/100
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={atsScore} className="h-3" />
            <p className="text-sm text-muted-foreground mt-2">
              {atsScore >= 80 && "ممتاز! سيرتك الذاتية متوافقة بشكل كبير مع معايير ATS"}
              {atsScore >= 60 && atsScore < 80 && "جيد! هناك بعض التحسينات المطلوبة"}
              {atsScore < 60 && "يحتاج إلى تحسين كبير لزيادة فرص القبول"}
            </p>
          </CardContent>
        </Card>

        {/* Special Offer - Professional CV */}
        <Card className="mb-6 border-2 border-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Sparkles className="h-6 w-6" />
                  عرض خاص: سيرة ذاتية احترافية جاهزة!
                </CardTitle>
                <CardDescription className="mt-2 text-base">
                  احصل على سيرة ذاتية احترافية كاملة ومحسّنة بالكامل، مكتوبة من الصفر بواسطة الذكاء الاصطناعي بناءً على معلوماتك
                </CardDescription>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700 text-white text-xl px-4 py-2">
                $1 فقط
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">سيرة ذاتية احترافية مكتوبة بالكامل</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">متوافقة 100% مع معايير ATS</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">تنسيق احترافي وجذاب</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">جاهزة للتحميل بصيغة PDF</span>
              </div>
            </div>
            <Button 
              onClick={handleGetProCV}
              disabled={generatingPro}
              size="lg"
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {generatingPro ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  احصل على سيرتك الاحترافية الآن - $1 فقط
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Strengths */}
        {strengths.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                نقاط القوة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {strengths.map((strength: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <TrendingUp className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Weaknesses */}
        {weaknesses.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                نقاط الضعف
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {weaknesses.map((weakness: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <XCircle className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-600">
                <Lightbulb className="h-5 w-5" />
                اقتراحات التحسين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {suggestions.map((suggestion: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                    <Lightbulb className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Detailed Feedback */}
        {analysis.correctedContent && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>تفاصيل التحليل</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap">{analysis.correctedContent}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={() => setLocation("/dashboard")}>
            العودة إلى لوحة التحكم
          </Button>
          <Button onClick={() => setLocation(`/cv/${cvId}`)}>
            تعديل السيرة الذاتية
          </Button>
        </div>
      </div>
    </div>
  );
}
