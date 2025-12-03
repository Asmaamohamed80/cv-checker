import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Terms() {
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

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-3xl">شروط الاستخدام</CardTitle>
            <p className="text-sm text-muted-foreground">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">قبول الشروط</h2>
              <p className="text-muted-foreground leading-relaxed">
                باستخدامك لموقع ATS CV Checker، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى عدم استخدام خدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الخدمات المقدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                نقدم خدمات إنشاء ومراجعة وتحسين السير الذاتية، البورتفوليوهات، ملفات LinkedIn، وخطابات التوصية باستخدام تقنيات الذكاء الاصطناعي.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الحسابات والتسجيل</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>يجب أن تكون بعمر 18 عاماً أو أكثر لاستخدام خدماتنا</li>
                <li>أنت مسؤول عن الحفاظ على سرية حسابك</li>
                <li>يجب تقديم معلومات دقيقة وصحيحة عند التسجيل</li>
                <li>حساب واحد لكل مستخدم</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">نظام الاشتراكات والدفع</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>الاستخدام المجاني:</strong> يحق لكل مستخدم إنشاء سيرة ذاتية واحدة وبورتفوليو واحد مجاناً.</p>
                <p><strong>الباقات المدفوعة:</strong></p>
                <ul className="list-disc list-inside mr-6 space-y-1">
                  <li>10 سير ذاتية = 5 دولار</li>
                  <li>50 سيرة ذاتية = 10 دولار</li>
                  <li>100 سيرة ذاتية = 15 دولار</li>
                  <li>نفس الأسعار للبورتفوليوهات</li>
                </ul>
                <p>جميع المدفوعات نهائية وغير قابلة للاسترداد ما لم ينص القانون على خلاف ذلك.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الاستخدام المقبول</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">يُمنع استخدام الخدمة في:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>أي نشاط غير قانوني أو احتيالي</li>
                <li>انتهاك حقوق الملكية الفكرية</li>
                <li>نشر محتوى مسيء أو ضار</li>
                <li>محاولة اختراق أو تعطيل الخدمة</li>
                <li>استخدام الخدمة لأغراض تجارية دون إذن</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الملكية الفكرية</h2>
              <p className="text-muted-foreground leading-relaxed">
                المحتوى الذي تنشئه يبقى ملكاً لك. نحتفظ بحق استخدام المحتوى لتحسين خدماتنا بشكل مجهول الهوية. جميع حقوق الملكية الفكرية للموقع والخدمات محفوظة لـ ATS CV Checker.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">إخلاء المسؤولية</h2>
              <p className="text-muted-foreground leading-relaxed">
                الخدمات مقدمة "كما هي" دون أي ضمانات. لا نضمن دقة أو اكتمال المحتوى الذي ينشئه الذكاء الاصطناعي. أنت مسؤول عن مراجعة وتعديل المحتوى قبل استخدامه.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">تحديد المسؤولية</h2>
              <p className="text-muted-foreground leading-relaxed">
                لن نكون مسؤولين عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام خدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">التعديلات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحتفظ بالحق في تعديل هذه الشروط في أي وقت. سيتم إشعارك بأي تغييرات جوهرية. استمرارك في استخدام الخدمة بعد التعديلات يعني موافقتك على الشروط الجديدة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">إنهاء الخدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحتفظ بالحق في تعليق أو إنهاء حسابك في حالة انتهاك هذه الشروط. يمكنك إلغاء حسابك في أي وقت.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">القانون الحاكم</h2>
              <p className="text-muted-foreground leading-relaxed">
                تخضع هذه الشروط للقوانين المعمول بها. أي نزاع يتم حله من خلال المحاكم المختصة.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">التواصل</h2>
              <p className="text-muted-foreground leading-relaxed">
                للأسئلة حول شروط الاستخدام، يرجى التواصل معنا عبر{" "}
                <Link href="/contact" className="text-primary hover:underline">صفحة الاتصال</Link>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
