"use client";

import { FormEvent, useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageContext";
import ScrollFadeIn from "@/components/ScrollFadeIn";

// Instagram Icon Component
function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="text-gray-300"
      aria-hidden="true"
    >
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

interface ContactInfo {
  email: string;
  phone: string;
  address: string;
  addressFa?: string;
  instagram?: string;
}

export default function ContactPage() {
  const { lang } = useLanguage();
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [formState, setFormState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formError, setFormError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/contact");
        const data = await res.json();
        setContactInfo(data);
      } catch (err) {
        console.error("Failed to load contact info:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchContact();
  }, []);
  
  const t = lang === "fa"
    ? {
        title: "تماس با ما",
        description: "خوشحال می‌شویم از شما بشنویم. پیام خود را ارسال کنید تا در اولین فرصت پاسخ دهیم.",
        email: "ایمیل:",
        phone: "تلفن:",
        address: "آدرس:",
        instagram: "اینستاگرام:",
        name: "نام",
        namePlaceholder: "نام شما",
        emailPlaceholder: "you@example.com",
        phoneLabel: "شماره تلفن",
        phonePlaceholder: "09123456789",
        message: "پیام",
        messagePlaceholder: "چگونه می‌توانیم کمک کنیم؟",
        send: "ارسال",
        success: "پیام شما ارسال شد. به‌زودی تماس خواهیم گرفت.",
        error: "ارسال پیام با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
        required: "لطفاً تمام فیلدها را تکمیل کنید.",
      }
    : {
        title: "Contact Us",
        description: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
        email: "Email:",
        phone: "Phone:",
        address: "Address:",
        instagram: "Instagram:",
        name: "Name",
        namePlaceholder: "Your name",
        emailPlaceholder: "you@example.com",
        phoneLabel: "Phone Number",
        phonePlaceholder: "+98 912 345 6789",
        message: "Message",
        messagePlaceholder: "How can we help?",
        send: "Send",
        success: "Thanks for reaching out. We'll be in touch shortly.",
        error: "Something went wrong. Please try again.",
        required: "Please complete all fields.",
      };

  if (loading || !contactInfo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-200">
        <div className="flex items-center gap-3 text-gray-300">
          <span className="h-12 w-12 animate-spin rounded-full border-2 border-gold/40 border-t-gold" />
        </div>
      </div>
    );
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmed = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      message: formData.message.trim(),
    };

    if (!trimmed.name || !trimmed.email || !trimmed.message) {
      setFormError(t.required);
      return;
    }

    setFormState("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmed),
      });

      if (!res.ok) {
        throw new Error("Failed to submit");
      }

      setFormState("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error("Failed to submit contact form:", error);
      setFormState("error");
      setFormError(t.error);
    } finally {
      setTimeout(() => {
        setFormState((current) => (current === "success" ? "idle" : current));
      }, 4000);
    }
  };

  return (
    <div>
      {/* Hero section with fade-in */}
      <section className="relative z-40 flex min-h-[40vh] items-center justify-center overflow-hidden px-6 text-center">
        <div className="max-w-3xl space-y-6 opacity-0 animate-fade-in" style={{ animationDelay: "0.2s", animationFillMode: "both" }}>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl text-gray-200">
            {t.title}
          </h1>
          <p className="text-lg text-gray-300">
            {t.description}
          </p>
        </div>
      </section>

      {/* Content sections with scroll fade-in */}
      <div className="grid gap-10 lg:grid-cols-2 py-8">
        <ScrollFadeIn>
          <div>
            <h2 className="font-display text-2xl font-semibold text-gray-200 mb-4">{t.title}</h2>
            <div className="mt-6 space-y-2 text-sm text-gray-300">
              <p>
                <span className="font-medium">{t.email}</span> {contactInfo.email}
              </p>
              <p>
                <span className="font-medium">{t.phone}</span> {contactInfo.phone}
              </p>
              <p>
                <span className="font-medium">{t.address}</span> {lang === "fa" && contactInfo.addressFa ? contactInfo.addressFa : contactInfo.address}
              </p>
              {contactInfo.instagram && (
                <p className="flex items-center gap-2">
                  <span className="font-medium flex items-center gap-1.5">
                    <InstagramIcon />
                    {t.instagram}
                  </span>
                  <a 
                    href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold hover:text-gold/80 transition-colors"
                  >
                    @{contactInfo.instagram.replace('@', '')}
                  </a>
                </p>
              )}
            </div>
            <div className="mt-8 rounded-lg border border-gold/30 overflow-hidden shadow-lg shadow-black/20">
              <iframe
                title={lang === "fa" ? "موقعیت اوتس" : "UTES Location"}
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3240.1734930448147!2d51.41844647529896!3d35.69734802908929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e01007cc7077d%3A0x480fcea2c60918e5!2zVXRlcyDZgdix2YjYtNqv2KfZhw!5e0!3m2!1sen!2s!4v1762942394236!5m2!1sen!2s"
                width="100%"
                height="360"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              />
            </div>
          </div>
        </ScrollFadeIn>

        <ScrollFadeIn>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="mb-1 block text-sm font-medium text-gray-200">{t.name}</label>
              <input
                id="name"
                name="name"
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gold"
                placeholder={t.namePlaceholder}
                value={formData.name}
                onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                disabled={formState === "submitting"}
                autoComplete="name"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-200">{t.email}</label>
              <input
                id="email"
                name="email"
                type="email"
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gold"
                placeholder={t.emailPlaceholder}
                value={formData.email}
                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                disabled={formState === "submitting"}
                autoComplete="email"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-1 block text-sm font-medium text-gray-200">{t.phoneLabel}</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gold"
                placeholder={t.phonePlaceholder}
                value={formData.phone}
                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                disabled={formState === "submitting"}
                autoComplete="tel"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1 block text-sm font-medium text-gray-200">{t.message}</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                className="w-full rounded-md border border-gold/40 bg-[#1f1f1f] px-3 py-2 text-gray-200 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-gold"
                placeholder={t.messagePlaceholder}
                value={formData.message}
                onChange={(event) => setFormData((prev) => ({ ...prev, message: event.target.value }))}
                disabled={formState === "submitting"}
              />
            </div>
            <div className="space-y-2">
              <button
                type="submit"
                className="btn-3d rounded-md bg-gold px-5 py-2.5 text-black hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                disabled={formState === "submitting"}
              >
                {formState === "submitting" ? "..." : t.send}
              </button>
              <div className="text-sm min-h-[1.25rem]" aria-live="polite">
                {formState === "success" && <span className="text-green-400">{t.success}</span>}
                {formError && <span className="text-red-400">{formError}</span>}
              </div>
            </div>
          </form>
        </ScrollFadeIn>
      </div>
    </div>
  );
}


