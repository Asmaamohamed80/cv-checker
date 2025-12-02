import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const packages = [
  {
    id: "cv_10",
    name: "باقة البداية",
    type: "CV",
    icon: Sparkles,
    price: 1,
    credits: 10,
    color: "from-blue-500 to-cyan-500",
    features: [
      "10 سير ذاتية مختلفة",
      "تعديلات غير محدودة لكل سيرة",
      "فحص توافق ATS",
      "كشف الأخطاء والتحسين",
      "تقارير مفصلة",
    ],
  },
  {
    id: "cv_50",
    name: "باقة الاحترافية",
    type: "CV",
    icon: Zap,
    price: 5,
    credits: 50,
    color: "from-purple-500 to-pink-500",
    popular: true,
    features: [
      "50 سيرة ذاتية مختلفة",
      "تعديلات غير محدودة لكل سيرة",
      "جميع مميزات باقة البداية",
      "أولوية في المعالجة",
      "دعم فني مميز",
    ],
  },
  {
    id: "cv_100",
    name: "باقة الشركات",
    type: "CV",
    icon: Crown,
    price: 10,
    credits: 100,
    color: "from-orange-500 to-red-500",
    features: [
      "100 سيرة ذاتية مختلفة",
      "تعديلات غير محدودة لكل سيرة",
      "جميع المميزات السابقة",
      "مثالية للشركات والمؤسسات",
      "استشارات مهنية مخصصة",
    ],
  },
  {
    id: "portfolio_10",
    name: "باقة البداية",
    type: "Portfolio",
    icon: Sparkles,
    price: 1,
    credits: 10,
    color: "from-green-500 to-emerald-500",
    features: [
      "10 بورتفوليوهات مختلفة",
      "تعديلات غير محدودة لكل بورتفوليو",
      "تقييم المحتوى والتصميم",
      "تقارير شاملة",
    ],
  },
  {
    id: "portfolio_50",
    name: "باقة الاحترافية",
    type: "Portfolio",
    icon: Zap,
    price: 5,
    credits: 50,
    color: "from-indigo-500 to-blue-500",
    popular: true,
    features: [
      "50 بورتفوليو مختلف",
      "تعديلات غير محدودة لكل بورتفوليو",
      "جميع مميزات باقة البداية",
      "تحليل تجربة المستخدم",
    ],
  },
  {
    id: "portfolio_100",
    name: "باقة الشركات",
    type: "Portfolio",
    icon: Crown,
    price: 10,
    credits: 100,
    color: "from-yellow-500 to-orange-500",
    features: [
      "100 بورتفوليو مختلف",
      "تعديلات غير محدودة لكل بورتفوليو",
      "جميع المميزات السابقة",
      "استشارات مخصصة للشركات",
    ],
  },
];

export default function Pricing() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [selectedType, setSelectedType] = useState<"CV" | "Portfolio">("CV");
  const [processingPackage, setProcessingPackage] = useState<string | null>(null);

  const createCheckout = trpc.subscription.createCheckoutSession.useMutation({
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error) => {
      toast.error("حدث خطأ أثناء إنشاء جلسة الدفع");
      setProcessingPackage(null);
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handlePurchase = async (packageId: string, price: number, credits: number, type: string) => {
    if (!isAuthenticated) {
      window.location.href = getLoginUrl();
      return;
    }

    setProcessingPackage(packageId);
    createCheckout.mutate({
      packageId,
      price,
      credits,
      type,
    });
  };

  const filteredPackages = packages.filter((pkg) => pkg.type === selectedType);

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
              {isAuthenticated ? (
                <Button asChild>
                  <Link href="/dashboard">لوحة التحكم</Link>
                </Button>
              ) : (
                <Button asChild>
                  <a href={getLoginUrl()}>تسجيل الدخول</a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            اختر الباقة المناسبة لك
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            باقات مرنة تناسب احتياجاتك - ابدأ مجاناً أو اختر باقة مدفوعة للحصول على المزيد
          </p>
        </div>

        {/* Type Selector */}
        <div className="flex justify-center gap-4 mb-12">
          <Button
            variant={selectedType === "CV" ? "default" : "outline"}
            size="lg"
            onClick={() => setSelectedType("CV")}
            className="min-w-[150px]"
          >
            السيرة الذاتية CV
          </Button>
          <Button
            variant={selectedType === "Portfolio" ? "default" : "outline"}
            size="lg"
            onClick={() => setSelectedType("Portfolio")}
            className="min-w-[150px]"
          >
            البورتفوليو
          </Button>
        </div>

        {/* Free Tier */}
        <Card className="border-2 border-primary/50 bg-card/50 backdrop-blur max-w-2xl mx-auto mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">الباقة المجانية</CardTitle>
                <CardDescription className="text-base mt-2">
                  تجربة مجانية واحدة لكل مستخدم
                </CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">مجاناً</div>
                <div className="text-sm text-muted-foreground">تحليل واحد</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>سيرة ذاتية واحدة مجاناً</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>تعديلات غير محدودة لنفس السيرة</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>فحص كامل لمعايير ATS</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>اقتراحات تحسين مفصلة</span>
              </li>
            </ul>
            <Button size="lg" className="w-full" asChild>
              <Link href={isAuthenticated ? "/dashboard" : getLoginUrl()}>
                ابدأ مجاناً
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Paid Packages */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredPackages.map((pkg) => {
            const Icon = pkg.icon;
            return (
              <Card
                key={pkg.id}
                className={`border-border/50 bg-card/50 backdrop-blur relative ${
                  pkg.popular ? "border-2 border-primary shadow-lg scale-105" : ""
                }`}
              >
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                    الأكثر شعبية
                  </Badge>
                )}
                <CardHeader>
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${pkg.color} flex items-center justify-center mb-4`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
                    <span className="text-muted-foreground"> / {pkg.credits} تحليل</span>
                  </div>
                  <CardDescription className="text-sm mt-2">
                    ${(pkg.price / pkg.credits).toFixed(2)} للتحليل الواحد
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    size="lg"
                    className="w-full"
                    disabled={processingPackage === pkg.id}
                    onClick={() => handlePurchase(pkg.id, pkg.price, pkg.credits, pkg.type)}
                  >
                    {processingPackage === pkg.id ? "جاري التحويل..." : "شراء الباقة"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-16">
          <h2 className="text-2xl font-bold text-center mb-8">الأسئلة الشائعة</h2>
          <div className="space-y-4">
            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">كيف يعمل نظام الرصيد؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  عند شراء باقة، يتم إضافة عدد السير الذاتية أو البورتفوليوهات المختلفة إلى رصيدك. كل سيرة يمكن تعديلها ورفعها مرات غير محدودة مجاناً.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">هل يمكنني استرجاع الأموال؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  نعم، نوفر ضمان استرجاع الأموال خلال 7 أيام من الشراء إذا لم تكن راضياً عن الخدمة.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-lg">هل الرصيد له تاريخ انتهاء؟</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  لا، رصيدك لا ينتهي ويمكنك استخدامه في أي وقت تشاء.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
