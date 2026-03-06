import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zhqifgoptqqfnkkfiuzq.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpocWlmZ29wdHFxZm5ra2ZpdXpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MjI5OTUyNiwiZXhwIjoyMDg3ODc1NTI2fQ.3XseL4JlrfH_I5YX80sHSSoBKYTbpcs8gnO59wDOGdQ";

const supabase = createClient(supabaseUrl, supabaseKey);

const today = new Date().toISOString().split("T")[0];

// ─── Categories ───
const categories = [
  { id: "gear", label: "ציוד ואביזרים" },
  { id: "toys", label: "צעצועים ומשחקים" },
  { id: "feeding", label: "שולחן ואוכל" },
  { id: "home", label: "הבית שלנו" },
  { id: "personal", label: "לגן ולילדים" },
];

// ─── Subcategories ───
const subcategories = [
  // gear
  { id: "diaper-bags", label: "תיקים להחתלה", category_id: "gear" },
  { id: "carriers", label: "מנשאים", category_id: "gear" },
  { id: "stroller-acc", label: "לעגלה", category_id: "gear" },
  { id: "monitors", label: "מוניטורים", category_id: "gear" },
  { id: "cameras", label: "מצלמות WiFi", category_id: "gear" },
  { id: "baby-nests", label: "בייבי נסט", category_id: "gear" },
  { id: "car", label: "נסיעות ורכב", category_id: "gear" },
  { id: "tetrot", label: "טטרות ועטיפות", category_id: "gear" },
  { id: "water-bottles", label: "בקבוקי שתייה", category_id: "gear" },
  // toys
  { id: "development-0-6", label: "התפתחות ראשונית", category_id: "toys" },
  { id: "games-6m", label: "צעצועים מ-6 חודשים", category_id: "toys" },
  { id: "bath-toys", label: "כיף באמבטיה", category_id: "toys" },
  { id: "play-gyms", label: "אוניברסיטאות", category_id: "toys" },
  { id: "mobiles", label: "מוביילים לעריסה", category_id: "toys" },
  { id: "activity-mats", label: "משטחי פעילות", category_id: "toys" },
  { id: "trampolines", label: "טרמפולינות", category_id: "toys" },
  // feeding
  { id: "baby-feeding", label: "כלי אוכל וסינרים", category_id: "feeding" },
  { id: "breastfeeding", label: "הנקה ושאיבה", category_id: "feeding" },
  // home
  { id: "safety", label: "מגנים ומנעולים", category_id: "home" },
  { id: "night-lights", label: "תאורה ומנורות", category_id: "home" },
  { id: "organization", label: "ארגון ואחסון", category_id: "home" },
  // personal
  { id: "name-stickers", label: "סימון שם לציוד", category_id: "personal" },
  { id: "kinder-bags", label: "תיקי גן אישיים", category_id: "personal" },
  { id: "winter-care", label: "בריאות וטיפול", category_id: "personal" },
];

// ─── Products ───
const products = [
  // ═══ משחקים מגיל חצי שנה ═══
  { id: "g6m-01", name: "ספינר סיליקון מסתובב לתינוקות עם דמויות מצוירות וסוגר", description: "צעצוע סיליקון איכותי עם דמויות חמודות, בטוח ומהנה", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c4pwGjbz" },
  { id: "g6m-02", name: "תיבת מגבות מונטסורי לתינוקות - פעילות חושית לאצבעות", description: "צעצוע מונטסורי לתרגול אצבעות ופעילות למידה חינוכית", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_old23AK" },
  { id: "g6m-03", name: "קוביות בנייה רכות בגדלים שונים - מונטסורי לפעוטות", description: "סט קוביות רכות לחינוך מוקדם ובנייה יצירתית", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c3qzVb1h" },
  { id: "g6m-04", name: "מקלדת מוזיקלית לתינוקות עם צלילי חיות ופסנתר", description: "צעצוע מוזיקלי אינטראקטיבי עם קולות חיות ומנגינות", category: "toys", subcategory: "games-6m", url: "https://mommy-mor.link/lhptht" },
  { id: "g6m-05", name: "משחק פיתוח אינטראקטיבי - למידה בסגנון מונטסורי", description: "צעצוע חינוכי לתינוקות המעודד פיתוח מוטורי וחשיבה", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c35hXq4L" },
  { id: "g6m-06", name: "מגוון צעצועים מומלצים לגיל שנה", description: "אוסף צעצועים מותאמים לגיל שנה לפיתוח ומשחק", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_olyPm9T" },
  { id: "g6m-07", name: "קוביית פעילות מעץ 5 ב-1 לפעוטות", description: "קובייה רב-תכליתית מעץ עם 5 פעילויות שונות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_okdwGDZ" },
  { id: "g6m-08", name: "רעשן עץ לתינוק עם תוף גשם מסיליקון - חוויה חושית", description: "צעצוע חושי מעץ וסיליקון עם צלילי גשם מרגיעים", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c3uyR4c3" },
  { id: "g6m-09", name: "נשכן סיליקון בצורת טלפון לתינוקות", description: "נשכן רך ובטוח בעיצוב טלפון מהנה לתינוקות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c3PZWL8n" },
  { id: "g6m-10", name: "ספר בד חינוכי לתינוקות מגיל לידה", description: "ספר רך ומגרה חושים לתינוקות עם תמונות צבעוניות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c4nw0xL9" },
  { id: "g6m-11", name: "ספר בד תלת-ממדי עם ניגודיות גבוהה לתינוקות", description: "ספר עם מרקמים שונים ודפים בניגודיות גבוהה לגירוי חושי", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c4m5az23" },
  { id: "g6m-12", name: "קוף מתגלגל חשמלי עם אורות ומוזיקה לתינוקות", description: "צעצוע חשמלי מהנה שמתגלגל עם אורות ומנגינות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c4epZM3p" },
  { id: "g6m-13", name: "סרטן רוקד אינטראקטיבי - מעודד זחילה לתינוקות", description: "צעצוע חשמלי בצורת סרטן שמעודד תנועה וזחילה", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c3x797n9" },
  { id: "g6m-14", name: "צעצוע אלקטרוני חינוכי לילדים", description: "משחק אלקטרוני עם פעילויות למידה מגוונות", category: "toys", subcategory: "games-6m", url: "https://www.aliexpress.com/item/1005009127782679.html" },
  { id: "g6m-15", name: "פינגווין מתנדנד מוזיקלי - צעצוע חינוכי חשמלי", description: "פינגווין חשמלי עם נדנוד, אורות ומוזיקה לפעוטות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c4nU18BD" },
  { id: "g6m-16", name: "שלט טלוויזיה מוזיקלי חינוכי לתינוקות", description: "צעצוע בצורת שלט עם כפתורים מוזיקליים לפעוטות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c4c4F2Sr" },
  { id: "g6m-17", name: "שלט טלוויזיה מסיליקון עם דמויות מצוירות לתינוקות", description: "שלט סיליקון רך ובטוח עם עיצוב כיפי לתינוקות", category: "toys", subcategory: "games-6m", url: "https://s.click.aliexpress.com/e/_c442ppI3" },

  // ═══ בטיחות בבית ═══
  { id: "saf-01", name: "מגן דלת בצורת כבשה - מונע צביטת אצבעות", description: "מגן דלת רך בעיצוב חמוד שמגן על אצבעות הילדים", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_oERPbLv" },
  { id: "saf-02", name: "סט 5 מכסי שקע בטיחותיים עם דמויות חמודות", description: "מכסי הגנה לשקעי חשמל עם עיצוב ילדותי ומקסים", category: "home", subcategory: "safety", url: "https://mommy-mor.link/v7zzx5" },
  { id: "saf-03", name: "מנעולי בטיחות לארונות ומקרר - הגנה לילדים", description: "מנעולים איכותיים לנעילת דלתות ארונות ומקרר", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_olPgUYn" },
  { id: "saf-04", name: "מנעול בטיחות למקרר ומקפיא לפעוטות", description: "מנעול חזק ובטוח למניעת פתיחת מקרר על ידי ילדים", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_okQRwaD" },
  { id: "saf-05", name: "מנעול מגנטי לארונות ומגירות - הגנה בלתי נראית", description: "מנעול מגנטי נסתר שלא פוגע בעיצוב הרהיטים", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_onjKmf9" },
  { id: "saf-06", name: "רצועת הגנה שקופה לפינות וקצוות", description: "סרט שקוף להגנה על פינות חדות ברחבי הבית", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_oCHf0Eu" },
  { id: "saf-07", name: "סט מגני פינות שולחן מסיליקון רך", description: "מגנים רכים מסיליקון להגנה על פינות שולחן ורהיטים", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_omDsLfl" },
  { id: "saf-08", name: "מנעול בטיחות לדלת תנור - הגנה למטבח", description: "מנעול ייעודי לתנור שמונע פתיחה על ידי ילדים", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_oER0gej" },
  { id: "saf-09", name: "מערכת נעילה לארונות, מגירות ודלתות", description: "פתרון נעילה אוניברסלי לכל סוגי הרהיטים בבית", category: "home", subcategory: "safety", url: "https://s.click.aliexpress.com/e/_oEENFJ1" },

  // ═══ משחקי התפתחות 0-6 ═══
  { id: "dev-01", name: "כרית שכיבה על הבטן לתינוק עם דמויות חיות חמודות", description: "כרית תמיכה לזמן בטן שמחזקת שרירי ראש וצוואר", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_oDP41mn" },
  { id: "dev-02", name: "כרית פעילות חושית לתינוקות עם משטח משחק", description: "כרית לזמן בטן עם צעצועים חושיים מגרים", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_opirsCx" },
  { id: "dev-03", name: "כרית פעילות מונטסורי בשחור-לבן לתינוקות", description: "כרית בניגודיות גבוהה לגירוי חזותי ופיתוח תינוקות", category: "toys", subcategory: "development-0-6", url: "https://www.aliexpress.com/item/1005005847144310.html" },
  { id: "dev-04", name: "צעצוע תלוי עם רעשנים ודמויות חיות למיטת תינוק", description: "צעצועי תלייה צבעוניים למיטה עם רעשנים ודמויות", category: "toys", subcategory: "development-0-6", url: "https://www.aliexpress.com/item/1005005201333615.html" },
  { id: "dev-05", name: "ספר חושי חינוכי בשחור-לבן לעריסה", description: "ספר מגרה חושים ליילודים עם דפים בניגודיות גבוהה", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_op2KIL7" },
  { id: "dev-06", name: "משטח מים מתנפח גדול 100 ס״מ עם דמויות ים", description: "משטח מים צבעוני לתינוקות עם דמויות דולפין וכלב ים", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_oC85FlA" },
  { id: "dev-07", name: "ספר בד רשרשן לגירוי חזותי ליילודים", description: "ספר בד עם צלילי רשרוש שמושך תשומת לב תינוקות", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_oouNFU7" },
  { id: "dev-08", name: "רעשן חיות ממולא רך עם אחיזה נוחה לתינוק", description: "רעשן בצורת חיה ממולאת עם אחיזה קלה ורשרוש", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_olhMuOt" },
  { id: "dev-09", name: "כדור רעשן רך עם נשכן חושי לתינוק", description: "כדור רך עם פעמון חושי ונשכן לאחיזה ולמשחק", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_oCC2RkF" },
  { id: "dev-10", name: "צעצוע התפתחות חושי 0-12 חודשים עם נשכן ורעשן", description: "צעצוע רב-תכליתי לתינוק עם נשכן, רעשן ומגע חושי", category: "toys", subcategory: "development-0-6", url: "https://mommy-mor.link/k3zml5" },
  { id: "dev-11", name: "רעשן עץ עם תוף גשם מסיליקון - צעצוע חושי", description: "רעשן מעץ טבעי עם אלמנט גשם סיליקון מרגיע", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_onkKX4b" },
  { id: "dev-12", name: "מקל גשם מונטסורי צבעוני עם שעון חול ורעשן", description: "צעצוע מונטסורי מרהיב עם אפקט קשת בענן ושעון חול", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_ooF5u8f" },
  { id: "dev-13", name: "גרבי רעשן עם חיות ממולאות לתינוק 0-12 חודשים", description: "גרביים חמודות עם רעשני חיות לתינוקות", category: "toys", subcategory: "development-0-6", url: "https://mommy-mor.link/Cw45QL" },
  { id: "dev-14", name: "צעצועי התפתחות מגוונים לגיל 1-12 חודשים", description: "אוסף צעצועי התפתחות מותאמים לשלבי הגדילה השונים", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_ABTlZ7" },
  { id: "dev-15", name: "ספר חושי חינוכי לעריסה בשחור-לבן - דגם מיוחד", description: "ספר חינוכי ייחודי לעריסה עם דפים בניגודיות גבוהה", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_AAACTB" },
  { id: "dev-16", name: "ספר בד חושי בניגודיות גבוהה 0-12 חודשים", description: "ספר בד עם דפים בניגודיות גבוהה לגירוי ראייה", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_AEC1Ep" },
  { id: "dev-17", name: "ספר בד רך עם זנבות חיות חושיים לתינוקות", description: "ספר עם זנבות ממרקמים שונים לגירוי חוש המישוש", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_EQNeJUL" },
  { id: "dev-18", name: "ספר בד חינוכי רך עם חיות לתינוקות", description: "ספר למידה רך עם דמויות חיות צבעוניות לתינוקות", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_oB7h39N" },
  { id: "dev-19", name: "כדור רעשן עם פעמון לפיתוח מוטוריקה", description: "כדור צבעוני עם פעמון פנימי לתרגול אחיזה והתפתחות", category: "toys", subcategory: "development-0-6", url: "https://s.click.aliexpress.com/e/_olV6jCh" },

  // ═══ תיקי החתלה ═══
  { id: "dbag-01", name: "תיק חיתולים קורדורוי לאמא עם נפח גדול - Soboba", description: "תיק החתלה אופנתי מבד קורדורוי עם מקום לכל מה שצריך", category: "gear", subcategory: "diaper-bags", url: "https://mommy-mor.link/v8cgsp" },
  { id: "dbag-02", name: "תיק חיתולים ג'ינס לאמא - עיצוב אופנתי Soboba", description: "תיק החתלה בסגנון ג'ינס עם נפח גדול ותאים מרובים", category: "gear", subcategory: "diaper-bags", url: "https://mommy-mor.link/fg2ulo" },
  { id: "dbag-03", name: "תיק חיתולים בעיצוב נמר - Soboba נפח גדול", description: "תיק החתלה מעוצב בהדפס נמר עם תאים מרובים", category: "gear", subcategory: "diaper-bags", url: "https://mommy-mor.link/858aej" },
  { id: "dbag-04", name: "תיק החתלה שחור אלגנטי עם נפח גדול", description: "תיק החתלה שחור קלאסי מושלם לכל יציאה", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EvMKiW3" },
  { id: "dbag-05", name: "תיק חיתולים Soboba אופנתי עמיד למים", description: "תיק מרובה תפקודים עמיד במים בעיצוב מודרני", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EvHxdSr" },
  { id: "dbag-06", name: "תיק חיתולים מודרני Soboba עמיד למים", description: "תיק טיפוח מודרני ואיכותי עמיד בפני מים", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EwYZ8K7" },
  { id: "dbag-07", name: "תיק חיתולים שחור PU עם נפח גדול ועמידות למים", description: "תיק החתלה מעור PU איכותי בעיצוב חדשני", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EwPA7mn" },
  { id: "dbag-08", name: "תיק גב ורוד עמיד למים Soboba - נפח גדול", description: "תיק גב מרווח בצבע ורוד עם עמידות למים", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EJigThH" },
  { id: "dbag-09", name: "תיק חיתולים שחור מעור חלק Soboba - נפח גדול", description: "תיק אלגנטי מעור חלק עם נפח מרבי ועמידות למים", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_Eywz6h1" },
  { id: "dbag-10", name: "קולקציית תיקי החתלה מגוונת", description: "מבחר תיקי החתלה במגוון עיצובים וסגנונות", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EyuE27z" },
  { id: "dbag-11", name: "תיק חיתולים Soboba חלק עם נפח גדול ועמידות למים", description: "תיק החתלה קלאסי ומרווח עמיד במים", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_Ez5PLSR" },
  { id: "dbag-12", name: "תיק חיתולים PU עמיד במים Soboba - נפח מרבי", description: "תיק מעור PU איכותי עם עמידות גבוהה למים", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_EJXP11d" },
  { id: "dbag-13", name: "תיק לעגלת תינוק Soboba רב-תכליתי", description: "תיק עגלה מתכוונן עם תאים מרובים לחיתולים ואביזרים", category: "gear", subcategory: "diaper-bags", url: "https://mommy-mor.link/YIzj0i" },
  { id: "dbag-14", name: "תיק עגלה ורוד פסים לאמא - נייד ומעוצב", description: "תיק חיתולים ורוד עם פסים בעיצוב אופנתי", category: "gear", subcategory: "diaper-bags", url: "https://mommy-mor.link/KiBzqr" },
  { id: "dbag-15", name: "תיק נסיעות לאמא עמיד למים - רב שימושי", description: "תיק נסיעות גדול ומולטיפונקציונלי עמיד במים", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_omXaOvq" },
  { id: "dbag-16", name: "תיק אחסון תלוי לעגלה עם מחזיק טלפון", description: "תיק תלוי מרווח לעגלה כולל כיס לטלפון נייד", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_omN6aH7" },
  { id: "dbag-17", name: "תיק תלוי לעגלה Sunveno - עמיד, מתקפל וקל", description: "תיק איכותי ועמיד לעגלה שמתקפל בקלות", category: "gear", subcategory: "diaper-bags", url: "https://s.click.aliexpress.com/e/_opWrmYn" },

  // ═══ בייבי נסטים ═══
  { id: "nest-01", name: "בייבי נסט מפנק ונוח לתינוק", description: "קן שינה רך ובטוח שנותן לתינוק תחושת חיבוק", category: "gear", subcategory: "baby-nests", url: "https://s.click.aliexpress.com/e/_okeqRlN" },
  { id: "nest-02", name: "בייבי נסט איכותי לתינוק - עיצוב מקורי", description: "קן שינה מעוצב ונעים מושלם לשנת תינוקות", category: "gear", subcategory: "baby-nests", url: "https://s.click.aliexpress.com/e/_oo0stBs" },
  { id: "nest-03", name: "בייבי נסט מפנק בעיצוב ייחודי", description: "קן תינוק רך ומגן ליצירת סביבת שינה בטוחה", category: "gear", subcategory: "baby-nests", url: "https://mommy-mor.link/jpiivy" },

  // ═══ משטחי פעילות ═══
  { id: "actm-01", name: "משטח פעילות רך ומעוצב לתינוקות", description: "משטח פעילות צבעוני ומרופד לזמן בטן ומשחק", category: "toys", subcategory: "activity-mats", url: "https://s.click.aliexpress.com/e/_opD1Tcg" },

  // ═══ אקססוריז לעגלה ═══
  { id: "strl-01", name: "טיל רוטט מרגיע לעגלת תינוק", description: "צעצוע רוטט שנתלה על העגלה ומרגיע תינוקות", category: "gear", subcategory: "stroller-acc", url: "https://mommy-mor.link/6dtgs7" },
  { id: "strl-02", name: "מחזיק כוסות אוניברסלי לעגלה", description: "מחזיק כוס נוח שמתחבר לכל סוג עגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_oB4oh3N" },
  { id: "strl-03", name: "מחזיק כוסות לעגלה - דגם קלאסי", description: "מחזיק משקאות יציב ואיכותי לעגלת תינוק", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_ok6SKOq" },
  { id: "strl-04", name: "מחזיק כוסות לעגלה - דגם מיוחד", description: "מחזיק כוס מעוצב ויציב לכל סוגי העגלות", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_o2aXvEh" },
  { id: "strl-05", name: "מחזיק טלפון לעגלת תינוק", description: "מעמד טלפון מתכוונן שמתחבר לידית העגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_omIDZF8" },
  { id: "strl-06", name: "שמשיה מתכווננת לעגלת תינוק", description: "שמשיה להגנה מהשמש עם התאמה לכל סוג עגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_oo0WEsj" },
  { id: "strl-07", name: "ריפודית לעגלה תואמת סייבקס", description: "ריפודית איכותית שמתאימה גם לעגלות סייבקס", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_opZ368u" },
  { id: "strl-08", name: "ריפודית מעוצבת לעגלת תינוק", description: "ריפודית רכה ונוחה בעיצוב יפה לעגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_okfmIxA" },
  { id: "strl-09", name: "ריפודית נוחה לעגלה - דגם קלאסי", description: "ריפודית איכותית ומרופדת לנוחות מרבית בעגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_oB5DlNA" },
  { id: "strl-10", name: "ריפודית פרימיום לעגלה", description: "ריפודית יוקרתית ואיכותית לעגלת תינוק", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_ontwH0M" },
  { id: "strl-11", name: "קשת פעילות צבעונית לעגלה", description: "קשת עם צעצועים תלויים שמעסיקה תינוקות בנסיעה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_oD3ilEE" },
  { id: "strl-12", name: "קשת פעילות לעגלה - דגם מיוחד", description: "קשת צעצועים אינטראקטיבית לעגלת תינוק", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_onchEqp" },
  { id: "strl-13", name: "קשת פעילות מגוונת לעגלת תינוק", description: "קשת עם מגוון צעצועים תלויים לבידור בנסיעה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_oDxMFnB" },
  { id: "strl-14", name: "מובייל תלוי לעגלת תינוק", description: "מובייל עם דמויות חמודות שנתלה על העגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_oF5bEib" },
  { id: "strl-15", name: "שאקל גדול לתליית צעצועים על העגלה", description: "שאקל חזק בגודל גדול לחיבור צעצועים לעגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_ooXa4qh" },
  { id: "strl-16", name: "שאקל קטן לתליית אביזרים על העגלה", description: "שאקל קומפקטי ושימושי לעגלת תינוק", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_okGKJh9" },
  { id: "strl-17", name: "קליפס תלייה לעגלת תינוק", description: "קליפס חזק לתליית שקיות ואביזרים על העגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_opUzEMS" },
  { id: "strl-18", name: "שאקל עם סקוץ' לעגלה", description: "שאקל עם סגירת סקוץ' נוחה לחיבור מהיר לעגלה", category: "gear", subcategory: "stroller-acc", url: "https://s.click.aliexpress.com/e/_ooPYEve" },

  // ═══ משחקים לאמבטיה ═══
  { id: "bath-01", name: "סט משחקי אמבטיה כיפיים לתינוקות", description: "מגוון צעצועים צבעוניים להנאה בזמן רחצה", category: "toys", subcategory: "bath-toys", url: "https://mommy-mor.link/i8q497" },
  { id: "bath-02", name: "מכונת גלידה צבעונית לאמבטיה", description: "צעצוע יצירתי בצורת מכונת גלידה למשחק בקצף", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_ok3tDRf" },
  { id: "bath-03", name: "ספינר ואקום צבעוני לאמבטיה", description: "ספינר שנדבק לקיר האמבטיה ומסתובב לבידור", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_oE93Z2d" },
  { id: "bath-04", name: "חיות ספוג מקסימות לאמבטיה", description: "ספוגיות בצורת חיות חמודות לרחצה ומשחק", category: "toys", subcategory: "bath-toys", url: "https://mommy-mor.link/hf77yq" },
  { id: "bath-05", name: "צעצועי אמבטיה צבעוניים לתינוקות", description: "סט צעצועי מים מהנים לזמן הרחצה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_oFEFLBJ" },
  { id: "bath-06", name: "משחקי מים מגוונים לאמבטיה", description: "צעצועים מעוצבים למשחק בזמן אמבטיה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_ootRGSt" },
  { id: "bath-07", name: "צעצועי אמבטיה מקוריים לפעוטות", description: "סט צעצועי מים ייחודיים ומהנים לרחצה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_opc2tmV" },
  { id: "bath-08", name: "ספרים מצפצפים עמידים למים לאמבטיה", description: "ספרי אמבטיה מצפצפים שמתאימים לשימוש במים", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_oDd9WWZ" },
  { id: "bath-09", name: "צעצועי אמבטיה מיוחדים לתינוקות", description: "משחקי מים איכותיים להפוך את הרחצה לחוויה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_olSCSlP" },
  { id: "bath-10", name: "צעצועים שוחים לאמבטיה", description: "דמויות שוחות ומתנועעות במים לבידור בזמן רחצה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_EIte5aZ" },
  { id: "bath-11", name: "תמנון עם טבעות לאמבטיה", description: "משחק השחלת טבעות על תמנון כיפי לאמבטיה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_oprgTtq" },
  { id: "bath-12", name: "רשת דיג עם דגים לאמבטיה", description: "משחק דייג מהנה עם רשת ודמויות ים לאמבטיה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_opnMbNO" },
  { id: "bath-13", name: "סט משחקי אמבטיה מורכב", description: "אוסף צעצועי מים מגוון להנאה מלאה באמבטיה", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_oEd73G1" },
  { id: "bath-14", name: "פרח בועות סבון עם אורות לאמבטיה", description: "פרח מוזיקלי שיוצר בועות ומאיר באורות צבעוניים", category: "toys", subcategory: "bath-toys", url: "https://s.click.aliexpress.com/e/_onPmKqa" },

  // ═══ מדבקות וחותמות שם ═══
  { id: "stk-01", name: "מדבקות שם אישיות לציוד הגן", description: "מדבקות שם עמידות לסימון כל הציוד בגן", category: "personal", subcategory: "name-stickers", url: "https://s.click.aliexpress.com/e/_onykt1d" },
  { id: "stk-02", name: "מדבקות שם בעיצוב מקורי", description: "מדבקות שם צבעוניות ומעוצבות לילדים", category: "personal", subcategory: "name-stickers", url: "https://s.click.aliexpress.com/e/_oEvNxfm" },
  { id: "stk-03", name: "מדבקות שם מעוצבות לגן ולבית ספר", description: "סט מדבקות שם בעיצובים שונים לציוד ילדים", category: "personal", subcategory: "name-stickers", url: "https://s.click.aliexpress.com/e/_oCwvVw8" },
  { id: "stk-04", name: "מדבקות שם עמידות במים לציוד", description: "מדבקות איכותיות שלא נמחקות גם במגע עם מים", category: "personal", subcategory: "name-stickers", url: "https://s.click.aliexpress.com/e/_omPtWdQ" },
  { id: "stk-05", name: "מדבקות שם מותאמות עם תמונה אישית", description: "מדבקות עם הדפסת תמונה אישית של הילד", category: "personal", subcategory: "name-stickers", url: "https://s.click.aliexpress.com/e/_onTkH9E" },
  { id: "stk-06", name: "חותמת שם לסימון בגדים וטטרות בצבעים שונים", description: "חותמת עם דיו עמיד לסימון בגדים, טטרות וחיתולים", category: "personal", subcategory: "name-stickers", url: "https://s.click.aliexpress.com/e/_okCfpjV" },

  // ═══ מנורות לילה ═══
  { id: "nlt-01", name: "מכונת רעש לבן עם מנורת לילה צבעונית", description: "מכונת שינה עם צלילים מרגיעים ותאורת לילה", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_omEgxZx" },
  { id: "nlt-02", name: "מנורת סיליקון נטענת עם 3 עוצמות - אור צהוב ולבן", description: "מנורה רכה נטענת עם אפשרות לאור צהוב או לבן", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oCa14Fm" },
  { id: "nlt-03", name: "מנורת לילה נטענת להאכלות והחלפות לילה", description: "מנורה עם דרגות תאורה מותאמות לטיפול בלילה", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_onJMBoO" },
  { id: "nlt-04", name: "מנורה ניידת נטענת עם אור צהוב-לבן טבעי", description: "מנורה קומפקטית ונטענת עם תאורה טבעית ונעימה", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oobKPPP" },
  { id: "nlt-05", name: "מנורת לילה נטענת עם מספר עוצמות תאורה", description: "מנורה עם אפשרות כוונון עוצמת אור לפי הצורך", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oFxnfgN" },
  { id: "nlt-06", name: "מנורת סיליקון נטענת בעיצוב חמוד", description: "מנורה רכה מסיליקון בטוחה ונעימה למגע", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oolmXtO" },
  { id: "nlt-07", name: "מנורת לילה מותאמת אישית עם שם הילד", description: "מנורה ייחודית עם הדפסת שם הילד בעיצוב אישי", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oDcaZTb" },
  { id: "nlt-08", name: "מנורה עם שם - עיצוב מקורי", description: "מנורת לילה מעוצבת עם שם אישי לחדר ילדים", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_omHh21C" },
  { id: "nlt-09", name: "מנורה מותאמת עם שם - דגם פרימיום", description: "מנורה איכותית עם חריטת שם אישית ועיצוב יוקרתי", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oB9ZOhs" },
  { id: "nlt-10", name: "מנורה עם שם הילד - עיצוב ייחודי", description: "מנורת שם מעוצבת שמוסיפה אווירה לחדר", category: "home", subcategory: "night-lights", url: "https://s.click.aliexpress.com/e/_oEmYeto" },

  // ═══ תיקי גן עם שם ═══
  { id: "kbag-01", name: "תיק קורדורוי מותאם אישית עם שם", description: "תיק גן מקורדורוי עם רקמת שם אישית", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_oFhFmuG" },
  { id: "kbag-02", name: "תיק גב ילדותי עם רקמת שם אישית", description: "תיק גן חמוד עם שם הילד ברקמה", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_olIl9Wc" },
  { id: "kbag-03", name: "תיק ג'ינס מעוצב עם שם אישי", description: "תיק גן בסגנון ג'ינס עם רקמת שם", category: "personal", subcategory: "kinder-bags", url: "https://mommy-mor.link/7TsG7g" },
  { id: "kbag-04", name: "תיק גב PU לנשים עם רקמה אישית", description: "תיק גב אלגנטי מעור PU עם אפשרות רקמת שם", category: "personal", subcategory: "kinder-bags", url: "https://mommy-mor.link/N692Cl" },
  { id: "kbag-05", name: "תיק גב קורדורוי לילדים עם שם אישי", description: "תיק גן מקורדורוי איכותי עם התאמה אישית", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_omMlUqA" },
  { id: "kbag-06", name: "תיק גב ג'ינס עם רקמה אישית לנשים", description: "תיק ג'ינס מעוצב עם אפשרות רקמה מותאמת", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_oB7ZZx0" },
  { id: "kbag-07", name: "תיק גב עם רקמה מותאמת", description: "תיק איכותי עם אפשרות רקמת שם או דמות", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_oFST90B" },
  { id: "kbag-08", name: "תיק גב מעוצב עם רקמה אישית", description: "תיק גב יפה ואיכותי עם רקמת שם מותאמת", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_okC7v2L" },
  { id: "kbag-09", name: "תיק גב ילדים עם רקמת מכונית ושם", description: "תיק גן עם עיצוב מכונית ורקמת שם אישית", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_omNc1sS" },
  { id: "kbag-10", name: "תיק קורדורוי מרופס לילדים - חזרה לגן", description: "תיק גב קורדורוי מותאם אישית מושלם לגן", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_oEPRRuS" },
  { id: "kbag-11", name: "תיק גן עם רקמת תפוח חמודה ושם אישי", description: "תיק גן מקסים עם עיצוב תפוח ורקמת שם", category: "personal", subcategory: "kinder-bags", url: "https://s.click.aliexpress.com/e/_okHeshs" },

  // ═══ מוניטורים ═══
  { id: "mon-01", name: "מוניטור אלחוטי מסתובב לתינוק", description: "מוניטור עם מצלמה מסתובבת למעקב אחר התינוק", category: "gear", subcategory: "monitors", url: "https://s.click.aliexpress.com/e/_ok4GN7Q" },
  { id: "mon-02", name: "זרוע גמישה למוניטור אלחוטי", description: "זרוע מתכווננת לחיבור מוניטור למיטה או לקיר", category: "gear", subcategory: "monitors", url: "https://s.click.aliexpress.com/e/_olPLwnH" },
  { id: "mon-03", name: "מוניטור אלחוטי מסתובב - דגם משודרג", description: "מוניטור עם מצלמה מתקדמת ואיכות תמונה גבוהה", category: "gear", subcategory: "monitors", url: "https://s.click.aliexpress.com/e/_okSRImx" },
  { id: "mon-04", name: "מוניטור אלחוטי איכותי לתינוק", description: "מוניטור עם מסך ומצלמה לשקט נפשי של ההורים", category: "gear", subcategory: "monitors", url: "https://mommy-mor.link/TN36DU" },
  { id: "mon-05", name: "זרוע מתכווננת למוניטור תינוק", description: "זרוע גמישה וחזקה להתקנה קלה של מוניטור", category: "gear", subcategory: "monitors", url: "https://mommy-mor.link/NvKWVc" },

  // ═══ מצלמות רשת ═══
  { id: "cam-01", name: "מצלמת רשת Xiaomi לבית", description: "מצלמה חכמה מבית Xiaomi לצפייה מרחוק בתינוק", category: "gear", subcategory: "cameras", url: "https://s.click.aliexpress.com/e/_onEmZO5" },
  { id: "cam-02", name: "מצלמת רשת עם מוניטור מובנה", description: "מצלמה עם מסך צפייה מובנה למעקב אחר התינוק", category: "gear", subcategory: "cameras", url: "https://s.click.aliexpress.com/e/_onsgHHa" },
  { id: "cam-03", name: "מצלמת רשת עם זרוע מובנית וקליפס", description: "מצלמה שניתן לחבר בקליפס לכל משטח בקלות", category: "gear", subcategory: "cameras", url: "https://s.click.aliexpress.com/e/_onuoF1r" },

  // ═══ מוביילים ═══
  { id: "mob-01", name: "מובייל מסתובב עם חיבור בלוטוס", description: "מובייל חשמלי עם נגינה דרך בלוטוס ועיצוב מרהיב", category: "toys", subcategory: "mobiles", url: "https://s.click.aliexpress.com/e/_ooG4iFa" },
  { id: "mob-02", name: "תיבת נגינה למובייל תינוק", description: "מנגנון נגינה איכותי שמתחבר למובייל קיים", category: "toys", subcategory: "mobiles", url: "https://s.click.aliexpress.com/e/_EvMl5f5" },
  { id: "mob-03", name: "מובייל מעוצב לעריסת תינוק", description: "מובייל עם דמויות חמודות שמסתובב מעל העריסה", category: "toys", subcategory: "mobiles", url: "https://s.click.aliexpress.com/e/_om3umW9" },
  { id: "mob-04", name: "מובייל צבעוני למיטת תינוק", description: "מובייל בצבעים עליזים עם מנגינות מרגיעות", category: "toys", subcategory: "mobiles", url: "https://s.click.aliexpress.com/e/_oDJzhNB" },
  { id: "mob-05", name: "תיבת נגינה למובייל - דגם משודרג", description: "מנגנון נגינה עם מגוון מנגינות למובייל תינוק", category: "toys", subcategory: "mobiles", url: "https://s.click.aliexpress.com/e/_oowPnD0" },
  { id: "mob-06", name: "מובייל מנגן לעריסה בעיצוב ייחודי", description: "מובייל עם דמויות מיוחדות ומנגינות שינה", category: "toys", subcategory: "mobiles", url: "https://s.click.aliexpress.com/e/_olOmRvs" },

  // ═══ אוניברסיטאות ═══
  { id: "gym-01", name: "אוניברסיטת עץ לתינוק", description: "אוניברסיטה מעץ טבעי עם צעצועים תלויים", category: "toys", subcategory: "play-gyms", url: "https://s.click.aliexpress.com/e/_omCCO0y" },
  { id: "gym-02", name: "אוניברסיטה עגולה לתינוקות", description: "אוניברסיטה בצורה עגולה עם פעילויות מגוונות", category: "toys", subcategory: "play-gyms", url: "https://s.click.aliexpress.com/e/_oEprgsZ" },
  { id: "gym-03", name: "אוניברסיטה עם גדר תיחום", description: "אוניברסיטה כוללת תיחום מגן לתינוק", category: "toys", subcategory: "play-gyms", url: "https://s.click.aliexpress.com/e/_oFVQSoD" },
  { id: "gym-04", name: "אוניברסיטה עגולה - דגם משודרג", description: "אוניברסיטה עגולה מורחבת עם יותר פעילויות", category: "toys", subcategory: "play-gyms", url: "https://s.click.aliexpress.com/e/_olS6nRT" },

  // ═══ הנקה ═══
  { id: "bf-01", name: "משאבת חלב אלחוטית ושקטה", description: "משאבה נטענת ושקטה לשאיבת חלב אם בנוחות", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_oDzZvaH" },
  { id: "bf-02", name: "משאבת חלב אלחוטית MAMIJOY כפולה", description: "משאבה כפולה אלחוטית לשאיבה יעילה ומהירה", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_oDxMsBG" },
  { id: "bf-03", name: "חזיית שאיבה נוחה ומעשית", description: "חזייה מיוחדת לשאיבת חלב ללא ידיים", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_o2aw70y" },
  { id: "bf-04", name: "חזיית הנקה נוחה ותומכת", description: "חזיית הנקה איכותית עם פתיחה קלה ותמיכה", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_oFjezNC" },
  { id: "bf-05", name: "חזיית הנקה - דגם פרימיום", description: "חזיית הנקה יוקרתית ונוחה לשימוש יומיומי", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_oo562AO" },
  { id: "bf-06", name: "שקיות אחסון חלב שאוב", description: "שקיות איכותיות לאחסון חלב אם בהקפאה", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_oBG364w" },
  { id: "bf-07", name: "שקיות חלב שאוב - דגם מיוחד", description: "שקיות אחסון חלב עמידות וחזקות למקפיא", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_om4qBO7" },
  { id: "bf-08", name: "שקיות חלב Avent איכותיות", description: "שקיות אחסון חלב מבית Avent - אמינות ואיכותיות", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_on5BpJC" },
  { id: "bf-09", name: "רפידות הנקה Avent סופגות", description: "רפידות הנקה חד-פעמיות סופגות מבית Avent", category: "feeding", subcategory: "breastfeeding", url: "https://s.click.aliexpress.com/e/_ooHJQDX" },

  // ═══ טרמפולינות ═══
  { id: "trmp-01", name: "טרמפולינה לילדים - משלוח מישראל", description: "טרמפולינה איכותית עם שילוח מהיר מישראל", category: "toys", subcategory: "trampolines", url: "https://s.click.aliexpress.com/e/_oEzaKGv" },

  // ═══ האכלת תינוקות ═══
  { id: "feed-01", name: "תיבת אחסון ניידת לאבקת חלב - 4 תאים", description: "מיכל נייד עם 4 תאים נפרדים לאבקת חלב", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_onXGIuf" },
  { id: "feed-02", name: "מיכל אחסון מזון 4 תאים לתינוק", description: "תיבת אחסון מחולקת לאבקת חלב ומזון תינוקות", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_omUS8x9" },
  { id: "feed-03", name: "מתקן אבקת חלב נייד לתינוקות", description: "מתקן נוח לחלוקת מנות אבקת חלב לנסיעות", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oou70Yn" },
  { id: "feed-04", name: "מועך וטוחן מזון לתינוקות", description: "כלי שימושי להכנת מזון רך ומרוסק לתינוקות", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_omkn5t8" },
  { id: "feed-05", name: "קומקום שומר חום לנסיעות", description: "קומקום תרמי לשמירת מים חמים להכנת בקבוק", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oDWZ1JD" },
  { id: "feed-06", name: "סט כלי האכלה מעוצב לתינוק", description: "סט האכלה מלא ומעוצב עם צלחת, כוס וסכו\"ם", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_Eu9kf69" },
  { id: "feed-07", name: "סט האכלה ממותג - עיצוב שובב", description: "סט כלי האכלה בעיצוב ילדותי ומשעשע", category: "feeding", subcategory: "baby-feeding", url: "https://mommy-mor.link/fLtpm7" },
  { id: "feed-08", name: "סט האכלה צבעוני ממותג", description: "סט כלי אוכל איכותי בצבעים עליזים לתינוקות", category: "feeding", subcategory: "baby-feeding", url: "https://mommy-mor.link/Vy8dvX" },
  { id: "feed-09", name: "סט האכלה ממותג - דגם קלאסי", description: "סט כלי האכלה קלאסי ואיכותי לתינוקות", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oE7trcA" },
  { id: "feed-10", name: "סט כלי האכלה ממותג - מהדורה מיוחדת", description: "סט האכלה במהדורה מיוחדת עם עיצוב מקורי", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_omd0sWg" },
  { id: "feed-11", name: "סינר האכלה עם שרוולים ארוכים", description: "סינר מגן עם כיסוי שרוולים להגנה מלאה מלכלוך", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oEmUNHZ" },
  { id: "feed-12", name: "סינר האכלה עם שרוולים - דגם צבעוני", description: "סינר עם שרוולים בעיצוב צבעוני ומשמח", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_o2c1xxV" },
  { id: "feed-13", name: "סינר עם שרוולים ארוכים - דגם מעוצב", description: "סינר מגן מעוצב עם שרוולים ארוכים לפעוטות", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_omOGvuR" },
  { id: "feed-14", name: "סינר האכלה עם שרוולים - הדפסים מקסימים", description: "סינר עם הדפסים חמודים וכיסוי שרוולים מלא", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_ooo6M5N" },
  { id: "feed-15", name: "סינר שרוול ארוך - דגם פרקטי", description: "סינר האכלה מעשי עם שרוולים ארוכים ואטום למים", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oDSy3MR" },
  { id: "feed-16", name: "סינר האכלה רך לתינוקות", description: "סינר רך ונוח שמגן על הבגדים בזמן אכילה", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_onR0z9D" },
  { id: "feed-17", name: "סינר האכלה מעוצב לפעוטות", description: "סינר בעיצוב חמוד עם כיס תחתון לאיסוף שאריות", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_op5IyQP" },
  { id: "feed-18", name: "סינר עם שרוולים קצרים להאכלה", description: "סינר נוח עם שרוולים קצרים לשימוש בימים חמים", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_okDaXr5" },
  { id: "feed-19", name: "כפיות סיליקון רכות לתינוקות", description: "כפיות רכות מסיליקון בטוח ונוח לחניכיים", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oC1xviZ" },
  { id: "feed-20", name: "כפיות סיליקון לתינוק - סט מגוון", description: "סט כפיות סיליקון בצבעים שונים להאכלת תינוק", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_omP0WP0" },
  { id: "feed-21", name: "צלחות סיליקון עם חלוקה לתינוק", description: "צלחות סיליקון מחולקות שנצמדות לשולחן", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_oniXN4i" },
  { id: "feed-22", name: "צלחות סיליקון לתינוק - דגם מיוחד", description: "צלחת סיליקון איכותית עם תאים מופרדים", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_om895BC" },
  { id: "feed-23", name: "סט האכלה נצמד מסיליקון - צלחות וכפיות", description: "סט מלא מסיליקון שנצמד לשולחן עם צלחות וסכו\"ם", category: "feeding", subcategory: "baby-feeding", url: "https://s.click.aliexpress.com/e/_ol0DIUO" },

  // ═══ מנשאים ═══
  { id: "car-01", name: "מנשא ארגונומי Breeze Deluxe רב-שימושי", description: "מנשא ארגונומי מתקדם לנשיאה בטוחה ונוחה", category: "gear", subcategory: "carriers", url: "https://mommy-mor.link/tjfqfs" },
  { id: "car-02", name: "מנשא ארגו איכותי לתינוק", description: "מנשא ארגונומי שתומך בגוף התינוק וההורה", category: "gear", subcategory: "carriers", url: "https://mommy-mor.link/o6LzVa" },
  { id: "car-03", name: "מנשא ארגו - דגם קלאסי", description: "מנשא ארגונומי קלאסי ומומלץ לשימוש יומיומי", category: "gear", subcategory: "carriers", url: "https://s.click.aliexpress.com/e/_oCAhhla" },
  { id: "car-04", name: "מנשא ארגו - דגם ספורטיבי", description: "מנשא ארגונומי קל משקל לטיולים ופעילות", category: "gear", subcategory: "carriers", url: "https://s.click.aliexpress.com/e/_okiyQwN" },
  { id: "car-05", name: "מנשא ארגונומי מאוורר לתינוק", description: "מנשא עם אוורור משופר לנוחות בימים חמים", category: "gear", subcategory: "carriers", url: "https://s.click.aliexpress.com/e/_okiyQwN" },
  { id: "car-06", name: "מנשא One אוורירי מגיל לידה עד 3 שנים", description: "מנשא מאוורר מתאים מלידה (3.5 ק\"ג) ועד גיל 3 (15 ק\"ג)", category: "gear", subcategory: "carriers", url: "https://www.aliexpress.com/item/1005002697159424.html" },

  // ═══ חורף וטיפול ═══
  { id: "wnt-01", name: "מכשיר אינהלציה נטען ושקט לתינוקות", description: "נבולייזר נייד ושקט לטיפול נשימתי בתינוקות", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_opqgken" },
  { id: "wnt-02", name: "שואב נזלת חשמלי לתינוקות", description: "מכשיר יניקה עדין לניקוי אף תינוקות", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_olmJR1p" },
  { id: "wnt-03", name: "שואב נזלת חשמלי מתקדם לתינוקות", description: "מכשיר שאיבת נזלת משודרג עם עוצמות שאיבה שונות", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_oEawkIQ" },
  { id: "wnt-04", name: "אספירטור חשמלי לאף תינוק - שאיבה חזקה", description: "מכשיר שאיבת אף חשמלי עם עוצמה גבוהה ועדינה", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_c4nFtDgP" },
  { id: "wnt-05", name: "נבולייזר נייד Yongrow N7 שקט לילדים ומבוגרים", description: "מכשיר אינהלציה קומפקטי ושקט לשימוש בכל גיל", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_c4E6dG0T" },
  { id: "wnt-06", name: "מדחום אינפרא-אדום ללא מגע לתינוקות", description: "מד חום אלקטרוני מהיר ומדויק ללא צורך במגע", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_ooScvKp" },
  { id: "wnt-07", name: "מדחום מצח Philips Avent ללא מגע", description: "מדחום אינפרא-אדום איכותי מבית פיליפס אוונט", category: "personal", subcategory: "winter-care", url: "https://s.click.aliexpress.com/e/_c3Ee7yuF" },

  // ═══ טטרות ═══
  { id: "tet-01", name: "טטרה גדולה 100x100 ס\"מ", description: "טטרה רכה ואיכותית בגודל גדול לכל שימוש", category: "gear", subcategory: "tetrot", url: "https://s.click.aliexpress.com/e/_oo7gV2K" },
  { id: "tet-02", name: "טטרה קטנה 60x60 ס\"מ", description: "טטרה קומפקטית ושימושית לשימוש יומיומי", category: "gear", subcategory: "tetrot", url: "https://s.click.aliexpress.com/e/_oowIZFV" },
  { id: "tet-03", name: "טטרה גדולה במיוחד 120x100 ס\"מ", description: "טטרה מרווחת במיוחד לעטיפה ושימוש רב-תכליתי", category: "gear", subcategory: "tetrot", url: "https://s.click.aliexpress.com/e/_olOv4NL" },
  { id: "tet-04", name: "טטרה 60x60 מכותנה ובמבוק 70/30", description: "טטרה רכה במיוחד מתערובת כותנה ובמבוק טבעי", category: "gear", subcategory: "tetrot", url: "https://s.click.aliexpress.com/e/_97TDZn" },
  { id: "tet-05", name: "טטרה כותנה-במבוק 60x60 - דגם מיוחד", description: "טטרה איכותית מכותנה ובמבוק בעיצוב ייחודי", category: "gear", subcategory: "tetrot", url: "https://s.click.aliexpress.com/e/_98nBBT" },
  { id: "tet-06", name: "טטרה מומלצת במגוון עיצובים", description: "טטרה איכותית ופופולרית בבחירת עיצובים שונים", category: "gear", subcategory: "tetrot", url: "https://s.click.aliexpress.com/e/_oCXDTnU" },

  // ═══ בקבוקי מים ═══
  { id: "wbt-01", name: "בקבוק מים מעוצב לילדים", description: "בקבוק שתייה צבעוני ונוח לילדים", category: "gear", subcategory: "water-bottles", url: "https://s.click.aliexpress.com/e/_ooYErZ4" },
  { id: "wbt-02", name: "בקבוק מים תרמי לילדים", description: "בקבוק שומר חום/קור לשתייה טרייה כל היום", category: "gear", subcategory: "water-bottles", url: "https://s.click.aliexpress.com/e/_oCDmeTC" },
  { id: "wbt-03", name: "בקבוק תרמי מעוצב - דגם ספורטיבי", description: "בקבוק תרמי איכותי בעיצוב ספורטיבי לילדים", category: "gear", subcategory: "water-bottles", url: "https://s.click.aliexpress.com/e/_okEG2Ee" },
  { id: "wbt-04", name: "בקבוק תרמי לילדים - צבעים מיוחדים", description: "בקבוק שומר טמפרטורה בצבעים עליזים ומיוחדים", category: "gear", subcategory: "water-bottles", url: "https://star.aliexpress.com/share/share.htm?platform=AE&businessType=ProductDetail&shareId=6000285156153" },
  { id: "wbt-05", name: "בקבוק מים תרמי - דגם פרימיום", description: "בקבוק תרמי יוקרתי עם שמירה על טמפרטורה ממושכת", category: "gear", subcategory: "water-bottles", url: "https://s.click.aliexpress.com/e/_oEIhAcy" },

  // ═══ לרכב ═══
  { id: "cra-01", name: "מוניטור עם מצלמה לכסא תינוק ברכב", description: "מצלמת מעקב לצפייה בתינוק בכסא הבטיחות", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_oEI8YOF" },
  { id: "cra-02", name: "מראה רכב לצפייה בתינוק", description: "מראה מיוחדת לצפייה בתינוק בכסא אחורי ברכב", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_oCF2043" },
  { id: "cra-03", name: "מראה לתינוק ברכב עם תאורת LED", description: "מראה עם תאורה מובנית לצפייה בתינוק גם בחושך", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_omICXCE" },
  { id: "cra-04", name: "מאוורר קליפס לרכב", description: "מאוורר קומפקטי שמתחבר בקליפס לאוורור ברכב", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_omrc5NT" },
  { id: "cra-05", name: "מגן שמש לחלון הרכב", description: "מגן שמש שמגן על תינוקות מקרני שמש ישירות", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_olRWYU8" },
  { id: "cra-06", name: "וילונות הצללה לחלונות הרכב", description: "וילונות להגנה מהשמש ויצירת צל נעים ברכב", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_oFmHGLT" },
  { id: "cra-07", name: "וילונות הצללה לרכב - דגם מיוחד", description: "וילונות שמש מעוצבים להגנה ועיצוב חלונות הרכב", category: "gear", subcategory: "car", url: "https://s.click.aliexpress.com/e/_oDunuVJ" },

  // ═══ ארגון וסדר ═══
  { id: "org-01", name: "תיבת אחסון מתקפלת לבגדי תינוק", description: "ארגונית מתקפלת לסידור ואחסון בגדים בשידה", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_c3Bfe0cr" },
  { id: "org-02", name: "ארגוניות מתקפלות לתחתונים וגרביים", description: "תיבות אחסון מחולקות לסידור תחתונים וגרביים", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_c3pRQ1dH" },
  { id: "org-03", name: "סט ארגון מגירות שקוף מאקריליק", description: "קופסאות אקריליק שקופות לסידור מושלם של מגירות", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_c3v60O31" },
  { id: "org-04", name: "מפרידי מגירות מתכווננים שקופים", description: "חוצצים מתכווננים מפלסטיק שקוף לכל סוג מגירה", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_oEZh63c" },
  { id: "org-05", name: "סל ידני מעוצב לתינוק - מתנה מושלמת", description: "סל ארוג ומעוצב מתאים גם כמתנה למסיבת רחם", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_olDii2z" },
  { id: "org-06", name: "תיק אמא נייד רב-שימושי עם חבל כותנה", description: "תיק אחסון מולטיפונקציונלי לנסיעות ולבית", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_c3quajoj" },
  { id: "org-07", name: "סלי אחסון מכותנה בסגנון נורדי", description: "סלים ארוגים מכותנה בעיצוב נורדי מינימליסטי", category: "home", subcategory: "organization", url: "https://s.click.aliexpress.com/e/_c3gKrBMb" },
  // org-08 removed - no URL provided
];

// ─── Main seed function ───
async function seed() {
  console.log("🚀 Starting product seed...\n");

  // 1. Delete existing products
  console.log("🗑️  Clearing existing products...");
  const { error: delProd } = await supabase.from("products").delete().neq("id", "___none___");
  if (delProd) console.error("  Error deleting products:", delProd.message);
  else console.log("  ✅ Products cleared");

  // 2. Delete existing subcategories
  console.log("🗑️  Clearing existing subcategories...");
  const { error: delSub } = await supabase.from("subcategories").delete().neq("id", "___none___");
  if (delSub) console.error("  Error deleting subcategories:", delSub.message);
  else console.log("  ✅ Subcategories cleared");

  // 3. Delete existing categories
  console.log("🗑️  Clearing existing categories...");
  const { error: delCat } = await supabase.from("categories").delete().neq("id", "___none___");
  if (delCat) console.error("  Error deleting categories:", delCat.message);
  else console.log("  ✅ Categories cleared");

  // 4. Insert categories
  console.log("\n📁 Inserting categories...");
  for (const cat of categories) {
    const { error } = await supabase.from("categories").insert(cat);
    if (error) console.error(`  ❌ Category ${cat.id}: ${error.message}`);
    else console.log(`  ✅ ${cat.label}`);
  }

  // 5. Insert subcategories
  console.log("\n📂 Inserting subcategories...");
  for (const sub of subcategories) {
    const { error } = await supabase.from("subcategories").insert(sub);
    if (error) console.error(`  ❌ Subcategory ${sub.id}: ${error.message}`);
    else console.log(`  ✅ ${sub.label}`);
  }

  // 6. Insert products in batches of 20
  console.log(`\n📦 Inserting ${products.length} products...`);
  const validProducts = products.filter((p) => p.url && p.url.length > 0);
  const batchSize = 20;
  let inserted = 0;

  for (let i = 0; i < validProducts.length; i += batchSize) {
    const batch = validProducts.slice(i, i + batchSize).map((p) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      subcategory: p.subcategory || null,
      url: p.url,
      image: null,
      featured: false,
      date_added: today,
    }));

    const { error } = await supabase.from("products").insert(batch);
    if (error) {
      console.error(`  ❌ Batch ${i / batchSize + 1}: ${error.message}`);
      // Try inserting one by one
      for (const p of batch) {
        const { error: singleErr } = await supabase.from("products").insert(p);
        if (singleErr) console.error(`    ❌ ${p.id} (${p.name}): ${singleErr.message}`);
        else inserted++;
      }
    } else {
      inserted += batch.length;
      console.log(`  ✅ Batch ${Math.floor(i / batchSize) + 1}: ${batch.length} products`);
    }
  }

  console.log(`\n🎉 Done! Inserted ${inserted} products out of ${validProducts.length}`);
  console.log(`   Categories: ${categories.length}`);
  console.log(`   Subcategories: ${subcategories.length}`);
}

seed().catch(console.error);
