import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowRight, FileText, Sparkles, Upload, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { getLoginUrl } from "@/const";

export default function CreateCV() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("ai");
  
  // Language Selection
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [jobType, setJobType] = useState("");
  
  // AI Creation State
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Manual Creation State
  const [manualData, setManualData] = useState({
    title: "",
    personalInfo: "",
    experience: "",
    education: "",
    skills: "",
  });

  const createCvMutation = trpc.cv.create.useMutation({
    onSuccess: () => {
      toast.success("تم إنشاء السيرة الذاتية بنجاح!");
      setLocation("/cv/list");
    },
    onError: (error) => {
      toast.error("حدث خطأ: " + error.message);
    },
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

  const handleAiGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast.error("الرجاء إدخال معلوماتك");
      return;
    }

    setAiGenerating(true);
    
    // Generate CV with AI
    const langText = language === "ar" ? "عربي" : "English";
    const jobInfo = jobType ? `\nنوع الوظيفة: ${jobType}` : "";
    const fullPrompt = `اللغة: ${language}${jobInfo}\n\n${aiPrompt}`;
    
    // Note: AI generation will be handled by the backend
    // For now, we create a placeholder that will be enhanced by AI analysis
    createCvMutation.mutate({
      title: `سيرة ذاتية (${langText}) - ` + new Date().toLocaleDateString('ar-EG'),
      content: fullPrompt,
    });
    
    setAiGenerating(false);
  };

  const handleManualCreate = () => {
    const { title, personalInfo, experience, education, skills } = manualData;
    
    if (!title.trim()) {
      toast.error("الرجاء إدخال عنوان السيرة الذاتية");
      return;
    }

    const content = `معلومات شخصية:\n${personalInfo}\n\nالخبرات:\n${experience}\n\nالتعليم:\n${education}\n\nالمهارات:\n${skills}`;

    createCvMutation.mutate({
      title,
      content,
    });
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
            <h1 className="text-xl font-bold">إنشاء سيرة ذاتية جديدة</h1>
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
                <CardTitle className="text-2xl">إنشاء سيرة ذاتية احترافية</CardTitle>
                <CardDescription className="text-base">
                  اختر طريقة الإنشاء المناسبة لك
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Language and Job Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
              <div className="space-y-2">
                <Label htmlFor="language" className="text-base font-semibold">اللغة</Label>
                <Select value={language} onValueChange={(value: "ar" | "en") => setLanguage(value)}>
                  <SelectTrigger id="language">
                    <SelectValue placeholder="اختر اللغة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ar">العربية</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {language === "ar" ? "مناسبة للوظائف المحلية" : "مناسبة للوظائف الدولية"}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobType" className="text-base font-semibold">نوع الوظيفة (اختياري)</Label>
                <Input
                  id="jobType"
                  placeholder="مثال: تطوير برمجيات، تسويق، محاسبة"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  سيساعد الذكاء الاصطناعي في تخصيص السيرة حسب المجال
                </p>
              </div>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="ai" className="gap-2">
                  <Sparkles className="w-4 h-4" />
                  إنشاء بالذكاء الاصطناعي
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-2">
                  <FileText className="w-4 h-4" />
                  إنشاء يدوي
                </TabsTrigger>
              </TabsList>

              <TabsContent value="ai" className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles className="w-5 h-5 text-primary mt-0.5" />
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">كيف يعمل الإنشاء بالذكاء الاصطناعي؟</h3>
                        <p className="text-sm text-muted-foreground">
                          أدخل معلوماتك الأساسية (الاسم، المسمى الوظيفي، الخبرات، المهارات) وسيقوم الذكاء الاصطناعي
                          بإنشاء سيرة ذاتية احترافية متوافقة مع معايير ATS تلقائياً.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ai-prompt" className="text-base">أدخل معلوماتك</Label>
                    <Textarea
                      id="ai-prompt"
                      placeholder="مثال: أنا محمد أحمد، مطور برمجيات بخبرة 5 سنوات في تطوير تطبيقات الويب باستخدام React و Node.js. عملت في شركة XYZ كمطور Full Stack. حاصل على بكالوريوس علوم الحاسب من جامعة القاهرة. مهاراتي تشمل JavaScript, TypeScript, React, Node.js, MongoDB..."
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      rows={10}
                      className="resize-none"
                    />
                    <p className="text-sm text-muted-foreground">
                      اكتب معلوماتك بحرية، سيقوم الذكاء الاصطناعي بتنظيمها وتنسيقها
                    </p>
                  </div>

                  <Button 
                    onClick={handleAiGenerate} 
                    disabled={aiGenerating || !aiPrompt.trim()}
                    size="lg"
                    className="w-full"
                  >
                    {aiGenerating ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        جاري الإنشاء...
                      </>
                    ) : (
                      <>
                        إنشاء السيرة الذاتية
                        <ArrowRight className="mr-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">عنوان السيرة الذاتية *</Label>
                    <Input
                      id="title"
                      placeholder="مثال: سيرة ذاتية - مطور برمجيات"
                      value={manualData.title}
                      onChange={(e) => setManualData({ ...manualData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="personal-info">المعلومات الشخصية</Label>
                    <Textarea
                      id="personal-info"
                      placeholder="الاسم، البريد الإلكتروني، رقم الهاتف، العنوان..."
                      value={manualData.personalInfo}
                      onChange={(e) => setManualData({ ...manualData, personalInfo: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">الخبرات العملية</Label>
                    <Textarea
                      id="experience"
                      placeholder="اذكر خبراتك العملية، المسمى الوظيفي، اسم الشركة، الفترة الزمنية..."
                      value={manualData.experience}
                      onChange={(e) => setManualData({ ...manualData, experience: e.target.value })}
                      rows={6}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">التعليم</Label>
                    <Textarea
                      id="education"
                      placeholder="الشهادات الدراسية، الجامعة، التخصص، سنة التخرج..."
                      value={manualData.education}
                      onChange={(e) => setManualData({ ...manualData, education: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">المهارات</Label>
                    <Textarea
                      id="skills"
                      placeholder="اذكر مهاراتك التقنية والشخصية..."
                      value={manualData.skills}
                      onChange={(e) => setManualData({ ...manualData, skills: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <Button 
                    onClick={handleManualCreate}
                    disabled={createCvMutation.isPending}
                    size="lg"
                    className="w-full"
                  >
                    {createCvMutation.isPending ? (
                      <>
                        <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        حفظ السيرة الذاتية
                        <ArrowRight className="mr-2 h-5 w-5" />
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
