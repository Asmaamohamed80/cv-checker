import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Briefcase, Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { getLoginUrl } from "@/const";

export default function CreatePortfolio() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [creating, setCreating] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projects: "",
    skills: "",
    links: "",
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

  const handleCreate = async () => {
    if (!formData.title.trim()) {
      toast.error("الرجاء إدخال عنوان البورتفوليو");
      return;
    }

    setCreating(true);
    
    setTimeout(() => {
      toast.success("تم إنشاء البورتفوليو بنجاح!");
      setCreating(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <header className="border-b border-border/40 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" asChild>
              <Link href="/dashboard">← العودة إلى لوحة التحكم</Link>
            </Button>
            <h1 className="text-xl font-bold">إنشاء بورتفوليو جديد</h1>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">إنشاء بورتفوليو احترافي</CardTitle>
                <CardDescription className="text-base">
                  أنشئ معرض أعمالك لإبراز مهاراتك ومشاريعك
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">عنوان البورتفوليو *</Label>
              <Input
                id="title"
                placeholder="مثال: معرض أعمال التصميم الجرافيكي"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">نبذة عنك</Label>
              <Textarea
                id="description"
                placeholder="اكتب نبذة مختصرة عن خبرتك ومجال عملك..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="projects">المشاريع</Label>
              <Textarea
                id="projects"
                placeholder="اذكر مشاريعك السابقة والحالية..."
                value={formData.projects}
                onChange={(e) => setFormData({ ...formData, projects: e.target.value })}
                rows={6}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">المهارات</Label>
              <Textarea
                id="skills"
                placeholder="اذكر مهاراتك التقنية والإبداعية..."
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="links">روابط أعمالك</Label>
              <Textarea
                id="links"
                placeholder="أضف روابط لأعمالك على GitHub, Behance, Dribbble..."
                value={formData.links}
                onChange={(e) => setFormData({ ...formData, links: e.target.value })}
                rows={3}
              />
            </div>

            <Button 
              onClick={handleCreate}
              disabled={creating}
              size="lg"
              className="w-full"
            >
              {creating ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جاري الإنشاء...
                </>
              ) : (
                <>
                  إنشاء البورتفوليو
                  <Plus className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
