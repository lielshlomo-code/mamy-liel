import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "שיתופי פעולה",
  description: "מעוניינים בשיתוף פעולה? השאירו פרטים ואחזור אליכם",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-24 relative">
      <PageHeader
        title="בואו נעבוד ביחד"
        subtitle="מעוניינים בשיתוף פעולה? מלאו את הטופס ואחזור אליכם בהקדם"
      />
      <div className="relative overflow-hidden bg-warm-gradient-reverse min-h-[50vh]">
        <div className="absolute inset-0 dot-grid opacity-10 pointer-events-none" />
        <div className="absolute top-10 right-1/4 w-[500px] h-[500px] bg-rose-100/30 rounded-full blur-3xl pointer-events-none animate-float-slow" />
        <div className="absolute bottom-10 left-1/4 w-[400px] h-[400px] bg-warm-200/35 rounded-full blur-3xl pointer-events-none animate-float" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 pt-12">
          <div className="rounded-3xl border border-warm-300/40 p-5 sm:p-8 md:p-10 bg-white/70 backdrop-blur-md shadow-xl shadow-warm-200/25">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
