import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "תנאי שימוש",
  description: "תנאי השימוש באתר mamy.liel",
};

export default function TermsPage() {
  return (
    <div className="pt-24 pb-24 relative">
      <PageHeader
        title="תנאי שימוש"
        subtitle="התנאים וההגבלות לשימוש באתר mamy.liel"
      />
      <div className="relative overflow-hidden bg-warm-gradient-reverse min-h-[50vh]">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-warm-200/35 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 md:px-10 pt-12 pb-16">
          <div className="rounded-3xl border border-warm-300/40 p-6 sm:p-8 md:p-10 bg-white/70 backdrop-blur-md shadow-xl shadow-warm-200/25">
            <div className="prose prose-lg max-w-none text-text-secondary leading-relaxed">
              <p className="text-sm text-text-light mb-8">
                עדכון אחרון: {new Date().toLocaleDateString("he-IL")}
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. הסכמה לתנאים</h2>
              <p>
                ברוכים הבאים לאתר mamy.liel (להלן: &quot;האתר&quot;). השימוש באתר מהווה
                הסכמה לתנאי שימוש אלה. אם אינך מסכים/ה לתנאים, אנא הימנע/י משימוש באתר.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. שימוש באתר</h2>
              <p>האתר מספק תוכן בתחומי אמהות, בית ומשפחה, כולל:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>הדרכות ומתכונים</li>
                <li>המלצות על מוצרים</li>
                <li>תוכן בלוג</li>
                <li>אפשרויות ליצירת קשר ושיתוף פעולה</li>
              </ul>
              <p>
                השימוש באתר מותר למטרות אישיות ולא מסחריות בלבד, אלא אם ניתנה
                הסכמה מפורשת אחרת בכתב.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. חשבון משתמש</h2>
              <p>
                חלק מהשירותים באתר עשויים לדרוש הרשמה ויצירת חשבון. בעת ההרשמה,
                עליך לספק מידע מדויק ועדכני. אתה אחראי לשמירה על סודיות פרטי
                ההתחברות שלך ולכל פעילות המתבצעת תחת חשבונך.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. קניין רוחני</h2>
              <p>
                כל התכנים באתר, לרבות טקסטים, תמונות, סרטונים, עיצובים, לוגו ושאר
                חומרים, הם רכושה הבלעדי של ליאל שלמה ומוגנים בזכויות יוצרים.
              </p>
              <p>אין להעתיק, לשכפל, להפיץ או לעשות שימוש מסחרי בתכנים ללא אישור מראש ובכתב.</p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. קישורים חיצוניים</h2>
              <p>
                האתר עשוי להכיל קישורים לאתרים חיצוניים שאינם בשליטתנו. איננו
                אחראים לתוכן, למדיניות הפרטיות או לפרקטיקות של אתרים אלה. מומלץ
                לעיין בתנאי השימוש ומדיניות הפרטיות של כל אתר חיצוני.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. המלצות ומוצרים</h2>
              <p>
                התוכן באתר, לרבות המלצות על מוצרים, מבוסס על דעה אישית וחוויה אישית.
                חלק מהקישורים למוצרים עשויים להיות קישורי שותפים (affiliate links),
                כלומר אנו עשויים לקבל עמלה ברכישה דרכם, ללא עלות נוספת עבורך.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">7. הגבלת אחריות</h2>
              <p>
                התוכן באתר מסופק &quot;כמות שהוא&quot; (AS IS) ללא אחריות מכל סוג.
                אנו לא נישא באחריות לכל נזק ישיר, עקיף, מקרי או תוצאתי הנובע
                מהשימוש באתר או מהסתמכות על התוכן שבו.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">8. שינויים בתנאים</h2>
              <p>
                אנו שומרים לעצמנו את הזכות לעדכן תנאי שימוש אלה בכל עת. שינויים
                ייכנסו לתוקף עם פרסומם באתר. המשך השימוש באתר לאחר עדכון התנאים
                מהווה הסכמה לשינויים.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">9. דין חל וסמכות שיפוט</h2>
              <p>
                תנאי שימוש אלה כפופים לדיני מדינת ישראל. סמכות השיפוט הבלעדית
                בכל סכסוך הנוגע לתנאים אלה תהיה לבתי המשפט המוסמכים בישראל.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">10. יצירת קשר</h2>
              <p>
                לשאלות בנוגע לתנאי השימוש, ניתן לפנות אלינו דרך{" "}
                <Link href="/contact" className="text-foreground underline hover:text-rose-400 transition-colors">
                  דף יצירת הקשר
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
