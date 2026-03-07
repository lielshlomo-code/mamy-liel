import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "מדיניות פרטיות",
  description: "מדיניות הפרטיות של mamy.liel - כיצד אנו אוספים, משתמשים ומגנים על המידע שלך",
};

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-24 relative">
      <PageHeader
        title="מדיניות פרטיות"
        subtitle="כיצד אנו אוספים, משתמשים ומגנים על המידע שלך"
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

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">1. כללי</h2>
              <p>
                אתר mamy.liel (להלן: &quot;האתר&quot;) מופעל על ידי ליאל שלמה (להלן: &quot;אנחנו&quot;).
                אנו מכבדים את פרטיותך ומחויבים להגן על המידע האישי שלך. מדיניות פרטיות זו
                מסבירה כיצד אנו אוספים, משתמשים ומגנים על מידע שנאסף באמצעות האתר.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">2. איסוף מידע</h2>
              <p>אנו אוספים מידע בשני אופנים:</p>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">מידע שנמסר באופן יזום</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li>פרטים שנמסרים בטופס יצירת קשר (שם, דוא&quot;ל, מספר טלפון, תוכן ההודעה)</li>
                <li>פרטי הרשמה לאתר (שם, דוא&quot;ל, סיסמה)</li>
              </ul>
              <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">מידע שנאסף באופן אוטומטי</h3>
              <ul className="list-disc pr-6 space-y-2">
                <li>כתובת IP</li>
                <li>סוג הדפדפן והמכשיר</li>
                <li>דפים שנצפו ומשך השהייה</li>
                <li>מקור ההגעה לאתר</li>
                <li>
                  קוקיז ומזהים דומים (ראו{" "}
                  <Link href="/cookies" className="text-foreground underline hover:text-rose-400 transition-colors">
                    מדיניות קוקיז
                  </Link>
                  )
                </li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">3. שימוש במידע</h2>
              <p>המידע שנאסף משמש למטרות הבאות:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>מענה לפניות ובקשות שיתוף פעולה</li>
                <li>ניהול חשבון המשתמש באתר</li>
                <li>שיפור חוויית הגלישה והתוכן באתר</li>
                <li>ניתוח סטטיסטי של השימוש באתר</li>
                <li>עמידה בדרישות חוקיות</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">4. שיתוף מידע עם צדדים שלישיים</h2>
              <p>
                אנו לא מוכרים, סוחרים או מעבירים את המידע האישי שלך לצדדים שלישיים,
                למעט במקרים הבאים:
              </p>
              <ul className="list-disc pr-6 space-y-2">
                <li>ספקי שירות הנדרשים להפעלת האתר (אחסון, אנליטיקה, דוא&quot;ל)</li>
                <li>כאשר נדרש על פי חוק או צו בית משפט</li>
                <li>להגנה על הזכויות, הרכוש או הבטיחות שלנו</li>
              </ul>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">5. אבטחת מידע</h2>
              <p>
                אנו נוקטים באמצעי אבטחה סבירים כדי להגן על המידע האישי שלך מפני
                גישה בלתי מורשית, שינוי, חשיפה או השמדה. עם זאת, אין שיטת העברה
                באינטרנט או אחסון אלקטרוני מאובטחת ב-100%.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">6. זכויות המשתמש</h2>
              <p>יש לך את הזכויות הבאות בנוגע למידע האישי שלך:</p>
              <ul className="list-disc pr-6 space-y-2">
                <li>זכות עיון - לבקש לדעת איזה מידע נשמר עליך</li>
                <li>זכות תיקון - לבקש לתקן מידע שגוי</li>
                <li>זכות מחיקה - לבקש למחוק את המידע האישי שלך</li>
                <li>זכות התנגדות - להתנגד לעיבוד המידע שלך</li>
              </ul>
              <p>
                למימוש זכויותיך, ניתן לפנות אלינו באמצעות{" "}
                <Link href="/contact" className="text-foreground underline hover:text-rose-400 transition-colors">
                  טופס יצירת הקשר
                </Link>
                .
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">7. שינויים במדיניות</h2>
              <p>
                אנו שומרים לעצמנו את הזכות לעדכן מדיניות פרטיות זו מעת לעת.
                שינויים מהותיים יפורסמו באתר. המשך השימוש באתר לאחר עדכון המדיניות
                מהווה הסכמה לשינויים.
              </p>

              <h2 className="text-xl font-bold text-foreground mt-8 mb-4">8. יצירת קשר</h2>
              <p>
                לשאלות או בקשות בנוגע למדיניות הפרטיות, ניתן לפנות אלינו דרך{" "}
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
