import { invokeLLM } from "./llm";

export interface CVAnalysisResult {
  score: number; // 0-100
  atsCompatibility: number; // 0-100
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  detailedFeedback: string;
}

export async function analyzeCVWithAI(
  content: string,
  language: "ar" | "en" = "ar"
): Promise<CVAnalysisResult> {
  const systemPrompt = language === "ar" 
    ? `أنت خبير في تحليل السير الذاتية وفحصها حسب معايير ATS (Applicant Tracking Systems). 
مهمتك هي تحليل السيرة الذاتية المقدمة وتقديم تقييم شامل يتضمن:
1. درجة عامة من 100
2. نسبة توافق مع أنظمة ATS
3. نقاط القوة (3-5 نقاط)
4. نقاط الضعف (3-5 نقاط)
5. اقتراحات للتحسين (5-7 اقتراحات محددة وقابلة للتطبيق)
6. تقييم مفصل

يجب أن يكون التحليل دقيقاً، مفصلاً، ومبنياً على أفضل الممارسات في كتابة السير الذاتية.`
    : `You are an expert in analyzing resumes and checking them according to ATS (Applicant Tracking Systems) standards.
Your task is to analyze the provided resume and provide a comprehensive evaluation that includes:
1. Overall score out of 100
2. ATS compatibility percentage
3. Strengths (3-5 points)
4. Weaknesses (3-5 points)
5. Improvement suggestions (5-7 specific and actionable suggestions)
6. Detailed evaluation

The analysis should be accurate, detailed, and based on best practices in resume writing.`;

  const userPrompt = language === "ar"
    ? `قم بتحليل السيرة الذاتية التالية:\n\n${content}\n\nقدم التحليل بصيغة JSON مع المفاتيح التالية:
{
  "score": رقم من 0 إلى 100,
  "atsCompatibility": رقم من 0 إلى 100,
  "strengths": ["نقطة قوة 1", "نقطة قوة 2", ...],
  "weaknesses": ["نقطة ضعف 1", "نقطة ضعف 2", ...],
  "suggestions": ["اقتراح 1", "اقتراح 2", ...],
  "detailedFeedback": "تقييم مفصل شامل"
}`
    : `Analyze the following resume:\n\n${content}\n\nProvide the analysis in JSON format with the following keys:
{
  "score": number from 0 to 100,
  "atsCompatibility": number from 0 to 100,
  "strengths": ["strength 1", "strength 2", ...],
  "weaknesses": ["weakness 1", "weakness 2", ...],
  "suggestions": ["suggestion 1", "suggestion 2", ...],
  "detailedFeedback": "comprehensive detailed evaluation"
}`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "cv_analysis",
          strict: true,
          schema: {
            type: "object",
            properties: {
              score: { type: "number", description: "Overall score from 0 to 100" },
              atsCompatibility: { type: "number", description: "ATS compatibility from 0 to 100" },
              strengths: {
                type: "array",
                items: { type: "string" },
                description: "List of strengths"
              },
              weaknesses: {
                type: "array",
                items: { type: "string" },
                description: "List of weaknesses"
              },
              suggestions: {
                type: "array",
                items: { type: "string" },
                description: "List of improvement suggestions"
              },
              detailedFeedback: { type: "string", description: "Detailed evaluation" }
            },
            required: ["score", "atsCompatibility", "strengths", "weaknesses", "suggestions", "detailedFeedback"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error("No response from AI");
    }

    const result = JSON.parse(content) as CVAnalysisResult;
    return result;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze CV with AI");
  }
}

export async function generateCVWithAI(
  userInput: string,
  language: "ar" | "en" = "ar",
  jobType?: string
): Promise<string> {
  const systemPrompt = language === "ar"
    ? `أنت خبير في كتابة السير الذاتية الاحترافية المتوافقة مع معايير ATS.
مهمتك هي إنشاء سيرة ذاتية احترافية بناءً على المعلومات المقدمة من المستخدم.
السيرة يجب أن تكون:
- منظمة ومنسقة بشكل احترافي
- متوافقة مع أنظمة ATS
- تحتوي على كلمات مفتاحية مناسبة
- خالية من الأخطاء اللغوية
- مناسبة للتقديم على الوظائف${jobType ? ` في مجال ${jobType}` : ""}`
    : `You are an expert in writing professional resumes that comply with ATS standards.
Your task is to create a professional resume based on the information provided by the user.
The resume should be:
- Well-organized and professionally formatted
- ATS-compatible
- Contains appropriate keywords
- Free of grammatical errors
- Suitable for job applications${jobType ? ` in the field of ${jobType}` : ""}`;

  const userPrompt = language === "ar"
    ? `قم بإنشاء سيرة ذاتية احترافية باللغة العربية بناءً على المعلومات التالية:\n\n${userInput}\n\nالسيرة يجب أن تحتوي على الأقسام التالية:\n- المعلومات الشخصية\n- الملخص المهني\n- الخبرات العملية\n- التعليم\n- المهارات\n- الشهادات (إن وجدت)`
    : `Create a professional resume in English based on the following information:\n\n${userInput}\n\nThe resume should contain the following sections:\n- Personal Information\n- Professional Summary\n- Work Experience\n- Education\n- Skills\n- Certifications (if any)`;

  try {
    const response = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== 'string') {
      throw new Error("No response from AI");
    }

    return content;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate CV with AI");
  }
}
