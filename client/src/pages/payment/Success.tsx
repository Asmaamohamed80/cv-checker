import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function PaymentSuccess() {
  const [, setLocation] = useLocation();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(true);

  const verifyPayment = trpc.subscription.verifyPayment.useMutation({
    onSuccess: (data) => {
      setVerifying(false);
      if (data.success) {
        // Success! Credits added
      } else {
        // Verification failed
        setLocation("/pricing?error=verification_failed");
      }
    },
    onError: () => {
      setVerifying(false);
      setLocation("/pricing?error=verification_failed");
    },
  });

  useEffect(() => {
    // Get session_id from URL
    const params = new URLSearchParams(window.location.search);
    const sid = params.get("session_id");

    if (sid) {
      setSessionId(sid);
      verifyPayment.mutate({ sessionId: sid });
    } else {
      setLocation("/pricing");
    }
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Loader2 className="w-16 h-16 text-primary animate-spin" />
            </div>
            <CardTitle className="text-2xl">جاري التحقق من الدفع...</CardTitle>
            <CardDescription>الرجاء الانتظار بينما نؤكد عملية الدفع</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card">
      <Card className="w-full max-w-md border-2 border-primary/50">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl text-green-600">تم الدفع بنجاح!</CardTitle>
          <CardDescription className="text-base">
            تمت إضافة الرصيد إلى حسابك بنجاح
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">رقم المعاملة</p>
            <p className="text-xs font-mono text-foreground break-all">{sessionId}</p>
          </div>

          <div className="space-y-2">
            <Button size="lg" className="w-full" asChild>
              <Link href="/dashboard">الذهاب إلى لوحة التحكم</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full" asChild>
              <Link href="/pricing">عرض الباقات الأخرى</Link>
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            شكراً لثقتك بنا! يمكنك الآن استخدام رصيدك لتحليل سيرتك الذاتية أو بورتفوليو
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
