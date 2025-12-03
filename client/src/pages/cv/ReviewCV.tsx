import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function ReviewCV() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "application/pdf" || 
          droppedFile.type === "application/msword" ||
          droppedFile.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        setFile(droppedFile);
      } else {
        toast.error("يرجى رفع ملف PDF أو Word فقط");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("الرجاء رفع ملف السيرة الذاتية أولاً");
      return;
    }

    setAnalyzing(true);
    
    // Simulate analysis
    setTimeout(() => {
      toast.success("تم تحليل السيرة الذاتية بنجاح!");
      setAnalyzing(false);
      // TODO: Navigate to results page
    }, 3000);
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
            <h1 className="text-xl font-bold">مراجعة السيرة الذاتية</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">مراجعة وتحليل السيرة الذاتية</CardTitle>
                <CardDescription className="text-base">
                  ارفع سيرتك الذاتية للحصول على تحليل شامل ومقترحات للتحسين
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Upload Area */}
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-primary/50"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {!file ? (
                <>
                  <Upload className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">اسحب الملف وأفلته هنا</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    أو اضغط لاختيار ملف من جهازك
                  </p>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <Button type="button" variant="outline" asChild>
                      <span>اختر ملف</span>
                    </Button>
                  </Label>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                  <p className="text-xs text-muted-foreground mt-4">
                    الصيغ المدعومة: PDF, DOC, DOCX (حجم أقصى: 5 MB)
                  </p>
                </>
              ) : (
                <div className="space-y-4">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold">{file.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFile(null)}
                  >
                    إزالة الملف
                  </Button>
                </div>
              )}
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <CheckCircle className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">فحص ATS</h4>
                  <p className="text-sm text-muted-foreground">
                    تحليل توافق السيرة مع أنظمة ATS
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <AlertCircle className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">كشف الأخطاء</h4>
                  <p className="text-sm text-muted-foreground">
                    اكتشاف الأخطاء اللغوية والتنسيقية
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">اقتراحات التحسين</h4>
                  <p className="text-sm text-muted-foreground">
                    توصيات لتحسين المحتوى والبنية
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Analyze Button */}
            <Button
              onClick={handleAnalyze}
              disabled={!file || analyzing}
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
                  <FileText className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
