import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";

export default function Privacy() {
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
            <CardTitle className="text-3xl">سياسة الخصوصية</CardTitle>
            <p className="text-sm text-muted-foreground">آخر تحديث: {new Date().toLocaleDateString('ar-EG')}</p>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-bold mb-4">مقدمة</h2>
              <p className="text-muted-foreground leading-relaxed">
                نحن في ATS CV Checker نلتزم بحماية خصوصيتك. توضح هذه السياسة كيفية جمع واستخدام وحماية معلوماتك الشخصية عند استخدام خدماتنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">المعلومات التي نجمعها</h2>
              <div className="space-y-3 text-muted-foreground">
                <p><strong>معلومات الحساب:</strong> الاسم، البريد الإلكتروني، وطريقة تسجيل الدخول.</p>
                <p><strong>المحتوى:</strong> السير الذاتية، البورتفوليوهات، وخطابات التوصية التي تقوم بإنشائها أو رفعها.</p>
                <p><strong>معلومات الاستخدام:</strong> بيانات حول كيفية استخدامك للموقع والخدمات.</p>
                <p><strong>معلومات الدفع:</strong> نستخدم Stripe لمعالجة المدفوعات ولا نحتفظ بتفاصيل بطاقتك الائتمانية.</p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">كيف نستخدم معلوماتك</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>تقديم وتحسين خدماتنا</li>
                <li>تحليل ومراجعة المحتوى الذي تقدمه باستخدام الذكاء الاصطناعي</li>
                <li>معالجة المدفوعات والاشتراكات</li>
                <li>التواصل معك بخصوص حسابك والخدمات</li>
                <li>تحسين تجربة المستخدم وتطوير ميزات جديدة</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">حماية البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                نستخدم تقنيات التشفير المتقدمة (SSL/TLS) لحماية بياناتك أثناء النقل والتخزين. جميع البيانات الحساسة مشفرة ومحمية بأحدث معايير الأمان.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">مشاركة البيانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                لا نبيع أو نشارك معلوماتك الشخصية مع أطراف ثالثة إلا في الحالات التالية:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                <li>عند الحاجة لتقديم الخدمة (مثل معالجة الدفع عبر Stripe)</li>
                <li>عند الامتثال للقوانين واللوائح</li>
                <li>لحماية حقوقنا وسلامة المستخدمين</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">ملفات تعريف الارتباط (Cookies)</h2>
              <p className="text-muted-foreground leading-relaxed">
                نستخدم ملفات تعريف الارتباط لتحسين تجربتك وتذكر تفضيلاتك. يمكنك التحكم في ملفات تعريف الارتباط من خلال إعدادات المتصفح.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">حقوقك</h2>
              <p className="text-muted-foreground leading-relaxed">
                لديك الحق في الوصول إلى بياناتك الشخصية، تصحيحها، حذفها، أو تقييد معالجتها. للقيام بذلك، يرجى التواصل معنا.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">الإعلانات</h2>
              <p className="text-muted-foreground leading-relaxed">
                قد نستخدم Google AdSense أو خدمات إعلانية أخرى. هذه الخدمات قد تستخدم ملفات تعريف الارتباط لعرض إعلانات مخصصة. يمكنك إدارة تفضيلات الإعلانات من خلال إعدادات Google.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">التواصل معنا</h2>
              <p className="text-muted-foreground leading-relaxed">
                إذا كان لديك أي أسئلة حول سياسة الخصوصية، يرجى التواصل معنا عبر صفحة{" "}
                <Link href="/contact" className="text-primary hover:underline">اتصل بنا</Link>.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
