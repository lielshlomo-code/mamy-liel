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
        num="03"
      />
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-[0.025] pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-black/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-black/[0.015] rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl mx-auto px-6 md:px-10 pt-12">
          <div className="rounded-3xl border-2 border-black/5 p-5 sm:p-8 md:p-10 bg-white shadow-sm">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
