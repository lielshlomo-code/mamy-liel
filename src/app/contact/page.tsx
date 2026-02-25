import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import PageHeader from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "שיתופי פעולה",
  description: "מעוניינים בשיתוף פעולה? השאירו פרטים ואחזור אליכם",
};

export default function ContactPage() {
  return (
    <div className="pt-24 pb-24">
      <PageHeader
        title="בואו נעבוד ביחד"
        subtitle="מעוניינים בשיתוף פעולה? מלאו את הטופס ואחזור אליכם בהקדם"
        num="03"
      />
      <div className="max-w-2xl mx-auto px-6 md:px-10 pt-12">
        <div className="rounded-3xl border-2 border-black/5 p-8 sm:p-10 bg-white">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
