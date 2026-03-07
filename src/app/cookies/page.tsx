import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "מדיניות קוקיז",
  description: "מדיניות הקוקיז של mamy.liel - מידע על השימוש בקוקיז באתר",
};

export default function CookiesPage() {
  return (
    <div className="pt-24 pb-24 relative">
      <PageHeader
        title="מדיניות קוקיז"
        subtitle="מידע על השימוש בקוקיז ובטכנולוגיות מעקב באתר"
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

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. מהם קוקיז?</h2>
              <p>
                קוקיז (Cookies) הם קבצי טקסט קטנים שנשמרים במכשיר שלך (מחשב, טלפון
                נייד או טאבלט) כאשר אתה מבקר באתר אינטרנט. קוקיז מאפשרים לאתר
                לזהות את המכשיר שלך ולשמור מידע על העדפותיך.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. סוגי הקוקיז בשימוש</h2>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">קוקיז הכרחיים</h3>
              <p>
                קוקיז אלה נדרשים לפעולה תקינה של האתר ולא ניתן לבטלם. הם כוללים
                למשל קוקיז לניהול הפעלה (session) ולאימות משתמשים מחוברים.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">קוקיז של ביצועים ואנליטיקה</h3>
              <p>
                קוקיז אלה מאפשרים לנו להבין כיצד מבקרים משתמשים באתר, אילו דפים
                פופולריים ואילו תכנים מעניינים את הגולשים. המידע נאסף באופן אנונימי
                ומשמש לשיפור האתר.
              </p>

              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">קוקיז של העדפות</h3>
              <p>
                קוקיז אלה מאפשרים לאתר לזכור את הבחירות שלך (כגון הסכמה לקוקיז)
                ולספק חוויה מותאמת אישית.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. קוקיז של צדדים שלישיים</h2>
              <p>
                האתר עשוי להשתמש בשירותים של צדדים שלישיים שמציבים קוקיז משלהם,
                כגון:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>
                  <strong>שירותי אנליטיקה</strong> - לניתוח תנועה ושימוש באתר
                </li>
                <li>
                  <strong>רשתות חברתיות</strong> - כפתורי שיתוף ותוכן מוטמע (אינסטגרם)
                </li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. ניהול וביטול קוקיז</h2>
              <p>
                באפשרותך לנהל ולבטל קוקיז דרך הגדרות הדפדפן שלך. שים לב שביטול
                קוקיז עלול לפגוע בחוויית הגלישה ובפונקציונליות מסוימת של האתר.
              </p>
              <p>להלן הנחיות לניהול קוקיז בדפדפנים הנפוצים:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li><strong>Chrome</strong> - הגדרות &gt; פרטיות ואבטחה &gt; קוקיז</li>
                <li><strong>Firefox</strong> - הגדרות &gt; פרטיות ואבטחה &gt; קוקיז</li>
                <li><strong>Safari</strong> - העדפות &gt; פרטיות &gt; ניהול נתוני אתרים</li>
                <li><strong>Edge</strong> - הגדרות &gt; פרטיות &gt; קוקיז</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. שינויים במדיניות</h2>
              <p>
                אנו עשויים לעדכן מדיניות קוקיז זו מעת לעת. שינויים יפורסמו בדף
                זה עם תאריך עדכון חדש.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. יצירת קשר</h2>
              <p>
                לשאלות בנוגע לשימוש בקוקיז, ניתן לפנות אלינו דרך{" "}
                <Link href="/contact" className="text-foreground underline hover:text-rose-400 transition-colors">
                  דף יצירת הקשר
                </Link>{" "}
                או לעיין ב
                <Link href="/privacy" className="text-foreground underline hover:text-rose-400 transition-colors">
                  מדיניות הפרטיות
                </Link>{" "}
                שלנו.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
