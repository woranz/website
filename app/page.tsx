"use client";

import Image from "next/image";
import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Instagram,
  Linkedin,
  Twitter,
  User,
  Users,
  Menu,
  X,
  LogIn,
} from "lucide-react";
import { MusicNote03Icon } from "hugeicons-react";
import { CarouselWithHeader } from "@/components/Carousel";

export default function APLanding() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col w-full bg-white">
      {/* Header - Desktop */}
      <header className="hidden md:flex items-center justify-between w-full max-w-[1440px] mx-auto px-[120px] py-5 bg-white sticky top-0 z-50 border-b border-transparent hover:border-gray-100 transition-colors">
        <div className="flex items-center">
          <Logo />
        </div>

        <div className="flex items-center gap-[41px]">
          <nav className="flex items-center gap-9">
            <a
              href="#"
              className="text-[15px] font-medium text-[#1A1A2E] hover:text-[#6B7280] transition-colors"
            >
              Seguros
            </a>
            <a
              href="#"
              className="text-[15px] font-medium text-[#1A1A2E] hover:text-[#6B7280] transition-colors"
            >
              Coberturas
            </a>
            <a
              href="#"
              className="text-[15px] font-medium text-[#1A1A2E] hover:text-[#6B7280] transition-colors"
            >
              Nosotros
            </a>
            <a
              href="#"
              className="text-[15px] font-medium text-[#1A1A2E] hover:text-[#6B7280] transition-colors"
            >
              Contacto
            </a>
          </nav>

          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white border border-[#1a1a2e1a] rounded-lg hover:bg-gray-50 transition-colors">
            <LogIn className="w-4 h-4 text-[#1A1A2E]" />
            <span className="text-sm font-semibold text-[#1A1A2E]">
              Ingresar
            </span>
          </button>
        </div>
      </header>

      {/* Header - Mobile */}
      <header className="flex md:hidden items-center justify-between w-full max-w-[1440px] mx-auto px-5 py-4 bg-white sticky top-0 z-50">
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X className="w-6 h-6 text-[#2E3547]" />
          ) : (
            <Menu className="w-6 h-6 text-[#2E3547]" />
          )}
        </button>
        <Logo size="small" />
        <div className="w-10 h-10 rounded-full bg-[#FBF9F6] flex items-center justify-center">
          <User className="w-5 h-5 text-[#2E3547]" />
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-white z-40 p-6">
          <nav className="flex flex-col gap-6">
            <a href="#" className="text-xl font-medium text-[#1A1A2E]">
              Seguros
            </a>
            <a href="#" className="text-xl font-medium text-[#1A1A2E]">
              Coberturas
            </a>
            <a href="#" className="text-xl font-medium text-[#1A1A2E]">
              Nosotros
            </a>
            <a href="#" className="text-xl font-medium text-[#1A1A2E]">
              Contacto
            </a>
            <button className="mt-4 w-full py-4 bg-[#FFE016] rounded-lg font-semibold">
              Ingresar
            </button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="flex flex-col items-center gap-10 md:gap-[120px] w-full max-w-[1440px] mx-auto px-6 md:px-20 pt-10 md:pt-20 bg-white">
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Badge */}
          <div className="flex items-center justify-center px-4 md:px-5 py-1.5 md:py-2 bg-[#fbf9f7] rounded-full">
            <span className="text-xs md:text-sm font-semibold text-[#1A1A2E]">
              Accidentes personales
            </span>
          </div>

          {/* Headline Group */}
          <div className="flex flex-col items-center gap-4 md:gap-5 w-full">
            <h1 className="text-4xl md:text-[72px] font-bold md:font-extrabold text-center text-[#1A1A2E] leading-[1.1] md:leading-[1.05] tracking-tight font-noe">
              Protección real
              <br />
              para tu día a día.
            </h1>
            <p className="text-[15px] md:text-[19px] text-center text-[#6B7280] leading-[1.6] md:leading-[1.5] max-w-[540px]">
              <span className="hidden md:inline">
                100% online. Individual, familiar, deportiva o escolar.
                <br />
                Vos elegís cómo cuidarte.
              </span>
              <span className="md:hidden">
                Seguro de accidentes personales 100% online. Coberturas
                individual, familiar, deportiva y escolar.
              </span>
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 pt-6 md:pt-8 w-full md:w-auto">
            <button className="flex items-center justify-center w-full md:w-auto px-11 py-3.5 md:py-[18px] bg-[#FFE016] rounded-[10px] md:rounded-lg shadow-sm hover:bg-[#f5d800] active:scale-[0.98] transition-all">
              <span className="text-base font-bold text-[#1A1A2E]">
                Cotizá tu seguro
              </span>
            </button>
            <button className="hidden md:flex items-center justify-center px-11 py-[16.5px] border-[1.5px] border-[#1A1A2E] rounded-lg bg-transparent hover:bg-gray-50 transition-colors">
              <span className="text-base font-medium text-[#1A1A2E]">
                Hablá con nosotros →
              </span>
            </button>
            <button className="md:hidden text-sm font-semibold text-[#1A1A2E]">
              Hablá con nosotros →
            </button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full md:w-[1200px] h-[220px] md:h-[400px] rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-[#FBF9F6] to-[#E5E7EB]">
          <Image
            src="/images/hero.png"
            alt="Grupo de amigos felices"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Quoter Section */}
      <section className="flex flex-col items-center gap-8 md:gap-16 w-full max-w-[1440px] mx-auto px-6 md:px-[120px] py-12 md:py-[120px] md:pb-8 border-t border-[#F0EDE8] md:border-none">
        <div className="flex flex-col items-center gap-8 w-full">
          {/* Section Header */}
          <div className="flex flex-col items-center gap-2 md:gap-0.5 w-full max-w-[800px]">
            <h2 className="text-[28px] md:text-[44px] font-bold text-center text-[#1A1A2E] tracking-tight font-noe">
              Calculá tu precio
            </h2>
            <p className="text-sm md:text-xl text-center text-[#6B7280] leading-[1.5]">
              Elegí tu actividad, la vigencia y cotizá en segundos.
            </p>
          </div>

          {/* Quoter Card */}
          <div className="flex flex-col w-full max-w-[387px] md:max-w-none bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.04)] md:shadow-[0_8px_32px_rgba(0,0,0,0.1)]">
            {/* Mobile Layout */}
            <div className="flex md:hidden flex-col w-full">
              <FormField label="Actividad" value="Albañil" />
              <FormField label="Vigencia" value="Hoy y mañana" />
              <FormField label="Cantidad de personas" value="2 personas" />
              <div className="px-6 py-5 pb-6">
                <button className="flex items-center justify-center w-full py-4 bg-[#FFE016] rounded-[10px] hover:bg-[#f5d800] active:scale-[0.98] transition-all">
                  <span className="text-base font-bold text-[#1A1A2E]">
                    Cotizar ahora →
                  </span>
                </button>
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-end gap-4 w-full p-8 pt-0">
              <div className="flex items-end gap-4 w-full pt-8">
                <DesktopFormField label="Actividad" value="Albañil" />
                <DesktopFormField label="Vigencia" value="Hoy y mañana" />
                <DesktopFormField
                  label="Cantidad de personas"
                  value="2"
                  className="w-[188px] flex-none"
                />
                <button className="flex items-center justify-center h-14 px-8 bg-[#FFE016] rounded-xl flex-1 hover:bg-[#f5d800] active:scale-[0.98] transition-all">
                  <span className="text-lg font-semibold text-[#1A1A2E]">
                    Cotizá ahora →
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works - Desktop Only */}
        <div className="hidden md:flex flex-col items-center gap-5 w-full pt-8 border-t border-[#E4E4E7]">
          <div className="flex items-stretch w-full">
            <Step
              number="01"
              title="Cotizá online"
              description="Elegí tu cobertura y recibí tu precio al instante sin datos personales ni formularios interminables."
            />
            <div className="w-px bg-[#E5E7EB]" />
            <Step
              number="02"
              title="Contratá"
              description="Pagá con Mercado Pago con tarjeta de crédito, débito o transferencia."
              className="px-6"
            />
            <div className="w-px bg-[#E5E7EB]" />
            <Step
              number="03"
              title="Listo, estás cubierto"
              description="Tu plan llega al instante a tu celular. Siempre disponible en tu cuenta de Woranz."
              className="pl-6"
            />
          </div>
        </div>
      </section>

      {/* Other Packages Section */}
      <section className="w-full py-12 md:pt-20">
        <CarouselWithHeader title="Otros paquetes disponibles" fullWidth>
          <PackageCard
            icon="music"
            title="Lollapalooza 2026"
            description="Para festivales, eventos y actividades al aire libre. Vas, disfrutás y estás cubierto."
            descriptionMobile="Cobertura para actividades deportivas y recreativas. Ideal para clubes y asociaciones."
            cta="button"
          />
          <PackageCard
            icon="user"
            title="24 hs"
            description="Te cubrimos las 24 horas, los 365 días. Para vos que no parás nunca."
            descriptionMobile="Protección personal ante accidentes. Ideal para trabajadores independientes y profesionales."
            cta="link"
          />
          <PackageCard
            icon="users"
            title="Laboral e in itinere"
            description="Te cubre en el trabajo y en el camino de ida y vuelta. Así de simple."
            descriptionMobile="Cobertura para toda tu familia. Protegé a los que más querés."
            cta="link"
          />
        </CarouselWithHeader>
      </section>

      {/* FAQ Section */}
      <section className="flex flex-col gap-8 md:gap-[120px] w-full max-w-[1440px] mx-auto px-6 md:px-[120px] py-16 md:py-[120px] bg-white border-t border-[#E4E4E7] md:border-none">
        <div className="flex flex-col gap-8 md:gap-6">
          <h2 className="text-[32px] md:text-[44px] font-bold text-center text-[#1A1A2E] tracking-tight leading-[1.1] font-noe">
            ¿Dudas?
          </h2>

          <div className="flex flex-col w-full max-w-[715px] mx-auto md:mx-0">
            {/* Mobile FAQ items */}
            <div className="flex md:hidden flex-col">
              {[
                { question: "¿Qué cubre el seguro de accidentes personales?", answer: "Cubre gastos médicos, internación, cirugías y rehabilitación por accidentes. También incluye indemnización por fallecimiento o invalidez permanente." },
                { question: "¿Quiénes pueden contratar este seguro?", answer: "Cualquier persona mayor de 18 años residente en Argentina. También podés incluir a tu familia o grupo de trabajo." },
                { question: "¿Cómo hago un reclamo si tengo un accidente?", answer: "Desde tu cuenta en Woranz o por WhatsApp. Te respondemos en menos de 24 horas y te guiamos en todo el proceso." },
                { question: "¿Cuánto tarda en activarse la cobertura?", answer: "Tu cobertura se activa de forma inmediata una vez confirmado el pago. Recibís tu póliza digital al instante." },
              ].map((faq, index) => (
                <div key={index} className="border-b border-[#E4E4E7]">
                  <button
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === index ? null : index)
                    }
                    className="flex items-center justify-between py-5 w-full text-left"
                  >
                    <span className="text-base font-semibold text-[#1A1A2E] max-w-[300px]">
                      {faq.question}
                    </span>
                    <span className="text-xl text-[#9CA3AF]">
                      {openFaqIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <p className="pb-5 text-sm text-[#6B7280] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop FAQ items */}
            <div className="hidden md:flex flex-col">
              {[
                { question: "¿Qué me cubre exactamente?", answer: "Nuestro seguro cubre gastos médicos por accidente, internación, cirugías, rehabilitación y traslados. Además, incluye indemnización por fallecimiento accidental o invalidez total y permanente. Todo respaldado por aseguradoras de primera línea." },
                { question: "¿Quién puede contratarlo?", answer: "Cualquier persona mayor de 18 años residente en Argentina puede contratar este seguro. También ofrecemos planes familiares, corporativos y para grupos específicos como deportistas o estudiantes." },
                { question: "¿Qué hago si tengo un accidente?", answer: "Ingresá a tu cuenta de Woranz o escribinos por WhatsApp. Te respondemos en menos de 24 horas hábiles. Te acompañamos en todo el proceso de reclamo y gestionamos directamente con la aseguradora." },
                { question: "¿Cuándo empiezo a estar cubierto?", answer: "Tu cobertura se activa de forma inmediata una vez confirmado el pago. No hay período de carencia. Recibís tu póliza digital al instante en tu email y en tu cuenta de Woranz." },
                { question: "¿Puedo cancelar cuando quiera?", answer: "Sí, podés cancelar tu seguro en cualquier momento sin penalidades. La cancelación se hace efectiva al finalizar el período ya pagado." },
                { question: "¿Cómo pago?", answer: "Aceptamos tarjetas de crédito, débito y transferencias bancarias a través de Mercado Pago. Podés elegir pago mensual o anual con descuento." },
              ].map((faq, index) => (
                <div key={index} className="border-b border-[#E4E4E7]">
                  <button
                    onClick={() =>
                      setOpenFaqIndex(openFaqIndex === index ? null : index)
                    }
                    className="flex items-center justify-between py-6 w-full text-left hover:bg-gray-50 transition-colors -mx-4 px-4"
                  >
                    <span className="text-2xl font-semibold text-[#1A1A2E]">
                      {faq.question}
                    </span>
                    {openFaqIndex === index ? (
                      <ChevronUp className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[#9CA3AF] flex-shrink-0" />
                    )}
                  </button>
                  {openFaqIndex === index && (
                    <p className="pb-6 -mx-4 px-4 text-base text-[#6B7280] leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Card Section */}
      <section className="w-full max-w-[1440px] mx-auto px-6 md:px-[120px] pb-16 md:pb-0">
        <div className="flex flex-col items-center gap-6 md:gap-8 w-full p-6 py-12 md:p-16 bg-white rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.04)]">
          <div className="flex flex-col items-center gap-4 max-w-[600px]">
            <h2 className="text-[28px] md:text-[44px] font-bold text-center text-[#1A1A2E] tracking-tight leading-[1.1] font-noe">
              <span className="md:hidden">
                Tu tranquilidad
                <br />
                es nuestra prioridad
              </span>
              <span className="hidden md:inline">
                Si tenés dudas,
                <br />
                estamos acá.
              </span>
            </h2>
            <p className="text-sm md:text-[17px] text-center text-[#6B7280] leading-[1.5]">
              No somos un call center. Somos personas reales que te acompañan en
              cada paso.
            </p>
          </div>

          {/* Team Avatars */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-0">
            <div className="flex items-center">
              {[
                "https://images.unsplash.com/photo-1694858840665-cabf47653213?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1633625510483-c177f4308f33?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1769636929130-56648d6e9c6d?w=100&h=100&fit=crop",
                "https://images.unsplash.com/photo-1611566946044-3867cbbf810a?w=100&h=100&fit=crop",
              ].map((src, i) => (
                <div
                  key={i}
                  className="relative w-11 md:w-[52px] h-11 md:h-[52px] rounded-full overflow-hidden border-2 md:border-[3px] border-[#FBF9F6] -ml-2 first:ml-0 bg-gradient-to-br from-[#FBF9F6] to-[#E5E7EB]"
                >
                  <Image
                    src={src}
                    alt={`Team member ${i + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              <div className="flex items-center justify-center w-11 md:w-[52px] h-11 md:h-[52px] bg-[#FFE016] rounded-full border-2 md:border-[3px] border-[#FBF9F6] -ml-2">
                <span className="text-[13px] md:text-base font-bold text-[#1A1A2E]">
                  +9
                </span>
              </div>
            </div>
            <span className="text-[13px] md:text-[15px] font-medium text-[#6B7280] md:pl-6">
              personas cuidando de vos
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col md:flex-row items-center gap-3 md:gap-5 w-full md:w-auto">
            <button className="flex items-center justify-center w-full md:w-auto px-11 py-4 md:py-[18px] bg-[#FFE016] rounded-lg shadow-sm hover:bg-[#f5d800] active:scale-[0.98] transition-all">
              <span className="text-base font-bold text-[#1A1A2E]">
                Empezar ahora
              </span>
            </button>
            <button className="text-[15px] md:text-base font-medium text-[#1A1A2E] hover:text-[#6B7280] transition-colors">
              Hablá con nosotros →
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Section */}
      <section className="w-full py-12 md:py-[120px]">
        <CarouselWithHeader title="Seguros pensados para vos." fullWidth>
          {[
            {
              text: "Cotizá y gestioná todo online, cuando quieras.",
              textMobile: "Cotizá y consultá tus pólizas online 24/7.",
              image: "/images/feature-1.png",
            },
            {
              text: "Siempre cerca tuyo, siempre a un mensaje.",
              textMobile: "Siempre cerca tuyo\nayudandote a avanzar.",
              image: "/images/feature-2.png",
            },
            {
              text: "El mejor precio, el mejor producto. Sin vueltas.",
              textMobile: "El mejor precio, el mejor producto. Sin vueltas.",
              image: "/images/feature-3.png",
            },
            {
              text: "Simple, online y con la mejor experiencia.",
              textMobile: "Simple, online y con la mejor experiencia.",
              image: "/images/feature-4.png",
            },
          ].map((card, i) => (
            <FeatureCard key={i} {...card} />
          ))}
        </CarouselWithHeader>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}

// ============ COMPONENTS ============

function Logo({ className = "", size = "default" }: { className?: string; size?: "small" | "default" }) {
  const dimensions = size === "small" ? { width: 100, height: 16 } : { width: 124, height: 20 };
  return (
    <svg
      className={className}
      width={dimensions.width}
      height={dimensions.height}
      viewBox="0 0 124 20"
      fill="none"
    >
      <path
        d="M20.313 0.27l-1.247 3.148q-0.416 0.7-0.571 1.212l-2.962 8.909-2.909 0-2.494-7.483-2.493 7.483-2.935 0-3.352-10.228q-0.364-1.05-0.546-1.427l-0.804-1.614 0-0.054 6.468 0 0 0.054-0.883 1.534c-0.11933 0.20343-0.14763 0.44766-0.078 0.673l2.571 8.156 1.793-5.383-0.624-1.938c-0.14984-0.48722-0.33191-0.96394-0.545-1.427l-0.805-1.615 0-0.054 6.467 0 0 0.054-0.883 1.534c-0.11933 0.20343-0.14763 0.44766-0.078 0.673l2.598 8.13 1.974-6.057q0.13-0.405 0.104-0.538 0-0.135-0.182-0.485l-1.506-3.257 0-0.054 4.441 0-0.519 0.054z m8.175 1.614q-0.52-1.373-1.585-1.373-1.065 0-1.584 1.346-0.52 1.32-0.52 5.007 0 3.66 0.52 5.033 0.519 1.373 1.584 1.373 1.065 0 1.585-1.346 0.52-1.346 0.52-5.033 0-3.66-0.52-5.007m-1.585 11.87q-3.168 0-5.013-1.75-1.818-1.775-1.818-5.14 0-3.31 1.844-5.088 1.845-1.776 4.987-1.776 3.17 0 5.014 1.776 1.844 1.75 1.844 5.115 0 3.31-1.87 5.087-1.845 1.776-4.988 1.776m17.909-12.866l-1.43 4.226-0.051 0-2.052-2.53q-0.234-0.296-0.468-0.135-0.493 0.377-1.117 1.562l0 7.267q0 0.405 0.39 0.673l2.546 1.534 0 0.054-8.702 0 0-0.054 1.273-1.238q0.233-0.216 0.233-0.646l0-9.313c0.00756-0.24533-0.07537-0.48487-0.233-0.673l-1.273-1.346 0-0.054 5.766 0 0 3.446q0.364-1.59 1.221-2.611 0.858-1.05 2.13-1.05 1.118 0 1.767 0.888m11.81199 4.549q-0.001 0.162-0.026 0.565l0 0.404-0.156 3.822q-0.078 1.561 0.701 1.561 0.495 0 0.727-0.484l0.052 0c0.00559 0.33454-0.0652 0.66594-0.20699 0.969q-0.702 1.48-2.546 1.48-1.17 0-1.974-0.672-0.806-0.7-0.857-1.938-0.39 1.184-1.351 1.91-0.934 0.7-2.182 0.7-1.507 0-2.52-0.995-1.013-1.023-1.013-2.8 0-1.884 1.29901-2.96c0.85511-0.72556 1.94363-1.11764 3.06499-1.104q1.767 0 2.754 0.727l0.052-2.88 0-0.135q0-3.096-1.897-3.096-0.39 0-0.493 0.054-0.079 0.054-0.208 0.27l-2.104 4.037-0.052 0-1.636-3.85q2.752-1.022 5.247-1.022 2.752 0 4.026 1.238 1.299 1.264 1.29901 4.2m-5.196 1.292q-0.987 0-1.558 0.78-0.546 0.781-0.546 1.993 0 1.076 0.416 1.695 0.442 0.592 1.117 0.592 0.883 0 1.48-0.942l0-0.026 0.05301-3.93001c-0.30924-0.10793-0.6345-0.1627-0.96202-0.16199m20.877-1.05q0 0.968-0.052 3.23-0.026 2.233-0.026 2.691 0 0.405 0.234 0.646l1.298 1.238 0 0.054-7.299 0 0-0.054 1.247-1.238c0.15744-0.16686 0.24168-0.38971 0.234-0.619l0.026-2.315q0.052-2.26 0.05201-3.015 0-2.018-0.41601-3.041-0.415-1.023-1.55799-1.023-1.143 0-1.922 1.184l0 8.183q0 0.43 0.233 0.646l1.273 1.238 0 0.054-7.273 0 0-0.054 1.273-1.238q0.234-0.216 0.234-0.646l0-9.313c0.00726-0.24545-0.07603-0.485-0.23401-0.673l-1.273-1.346 0-0.054 5.76699 0 0 2.854q1.064-3.069 4.13001-3.069 1.947 0 2.987 1.453 1.065 1.454 1.065 4.226m13.357 2.019l0.07901 0-0.312 5.841-11.014 0 0-0.054 6.935-12.758-2.337 0q-0.338 0-0.442 0.054-0.104 0.053-0.28601 0.35l-3.11699 4.71-0.104 0 0-5.626 10.93599 0 0 0.054-6.727 12.759 2.46701 0q0.337 0 0.442-0.054 0.103-0.054 0.286-0.35l3.19399-4.926z"
        fill="#2d3547"
      />
    </svg>
  );
}

function FormField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 px-6 pt-5 first:pt-5">
      <label className="text-xs font-semibold text-[#6B7280] tracking-[0.5px] uppercase">
        {label}
      </label>
      <div className="flex items-center justify-between px-4 py-3.5 bg-[#F9F7F4] border border-[#E8E4DF] rounded-lg cursor-pointer hover:border-[#9CA3AF] transition-colors">
        <span className="text-[15px] font-medium text-[#1A1A2E]">{value}</span>
        <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />
      </div>
    </div>
  );
}

function DesktopFormField({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-1.5 flex-1 ${className}`}>
      <label className="text-[13px] font-medium text-[#6B7280]">{label}</label>
      <div className="flex items-center justify-between h-12 px-4 bg-[#F9F7F4] border border-[#E5E7EB] rounded-[10px] cursor-pointer hover:border-[#9CA3AF] transition-colors">
        <span className="text-[15px] text-[#2E3547]">{value}</span>
        <ChevronDown className="w-[18px] h-[18px] text-[#9CA3AF]" />
      </div>
    </div>
  );
}

function Step({
  number,
  title,
  description,
  className = "",
}: {
  number: string;
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={`flex flex-col gap-3 flex-1 ${className}`}>
      <span className="text-5xl font-bold text-[#1a1a2e66] tracking-[-2px] leading-[0.85] font-noe">
        {number}
      </span>
      <span className="text-xl font-bold text-[#2E3547] leading-[1.2]">
        {title}
      </span>
      <p className="text-[15px] text-[#6B7280] leading-[1.5]">{description}</p>
    </div>
  );
}

function PackageCard({
  icon,
  title,
  description,
  descriptionMobile,
  cta,
  bgColor = "bg-[#FBF9F6]",
}: {
  icon?: "music" | "user" | "users";
  title: string;
  description: string;
  descriptionMobile?: string;
  cta: "button" | "link";
  bgColor?: string;
}) {
  return (
    <div
      className={`flex flex-col justify-between w-[280px] md:w-[360px] h-[380px] md:h-[460px] p-7 md:p-10 ${bgColor} rounded-2xl shadow-[0_8px_24px_rgba(0,0,0,0.03)]`}
    >
      <div className="flex flex-col gap-4 md:gap-5">
        {icon === "music" && (
          <MusicNote03Icon className="w-14 h-14 text-[#2E3547]" strokeWidth={1} />
        )}
        {icon === "user" && (
          <User className="w-14 h-14 text-[#2E3547]" strokeWidth={1} />
        )}
        {icon === "users" && (
          <Users className="w-14 h-14 text-[#2E3547]" strokeWidth={1} />
        )}
        <h3 className="text-xl md:text-[26px] font-semibold text-[#2E3547]">
          {title}
        </h3>
        <p className="text-sm md:text-xl text-[#6B7280] leading-[1.5]">
          <span className="hidden md:inline">{description}</span>
          <span className="md:hidden">{descriptionMobile || description}</span>
        </p>
      </div>
      {cta === "button" ? (
        <button className="flex items-center justify-center w-full md:w-auto px-5 md:px-7 py-3 md:py-3.5 bg-[#FFE016] rounded-lg hover:bg-[#f5d800] active:scale-[0.98] transition-all">
          <span className="text-sm md:text-[15px] font-semibold text-[#1A1A2E]">
            Cotizá online
          </span>
        </button>
      ) : (
        <button className="text-left text-sm md:text-[15px] font-semibold text-[#2E3547] hover:text-[#1A1A2E] transition-colors">
          Hablá con nosotros →
        </button>
      )}
    </div>
  );
}

function FeatureCard({
  text,
  textMobile,
  image,
}: {
  text: string;
  textMobile: string;
  image: string;
}) {
  return (
    <div className="relative flex flex-col justify-end w-[260px] md:w-[360px] h-[360px] md:h-[521px] p-4 md:p-5 pb-5 md:pb-6 rounded-xl overflow-hidden bg-gradient-to-br from-[#FBF9F6] to-[#E5E7EB]">
      <Image src={image} alt="" fill className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
      <p className="relative z-10 text-lg md:text-2xl font-bold text-white leading-[1.15] whitespace-pre-line">
        <span className="hidden md:inline">{text}</span>
        <span className="md:hidden">{textMobile}</span>
      </p>
    </div>
  );
}

function Footer() {
  return (
    <footer className="w-full bg-[#FBF9F6]">
      <div className="flex flex-col gap-8 md:gap-10 w-full max-w-[1440px] mx-auto px-6 md:px-20 py-10">
      <div className="md:hidden"><Logo size="small" /></div>
      <div className="hidden md:block"><Logo /></div>

      {/* Links */}
      <div className="flex flex-col md:flex-row md:justify-between gap-8 w-full">
        {/* Mobile: 2 columns */}
        <div className="flex md:hidden gap-8 w-full">
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-[13px] font-bold text-[#1A1A2E]">
              Productos
            </span>
            <a href="#" className="text-xs text-[#6B7280]">
              Caución Alquiler
            </a>
            <a href="#" className="text-xs text-[#6B7280]">
              Accidentes Personales
            </a>
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <span className="text-[13px] font-bold text-[#1A1A2E]">
              Empresa
            </span>
            <a href="#" className="text-xs text-[#6B7280]">
              Nosotros
            </a>
            <a href="#" className="text-xs text-[#6B7280]">
              Contacto
            </a>
          </div>
        </div>

        {/* Desktop: Full links */}
        <div className="hidden md:flex gap-12">
          <FooterColumn
            title="Productos"
            links={[
              "Accidentes Personales",
              "Cauciones",
              "Seguro de Vida",
              "Seguro de Sepelio",
            ]}
          />
          <FooterColumn
            title="Empresa"
            links={["Nosotros", "Blog", "Trabajá con nosotros"]}
          />
          <FooterColumn
            title="Soporte"
            links={["Centro de ayuda", "Contacto", "FAQ"]}
          />
          <FooterColumn
            title="Legal"
            links={["Términos", "Privacidad", "SSN"]}
          />
        </div>
      </div>

      <div className="w-full h-px bg-[#E8E4DF]" />

      {/* Regulatory Notice */}
      <div className="flex justify-between items-start gap-4 md:gap-8 w-full">
        <p className="text-[9px] md:text-[10px] text-[#9CA3AF] flex-1">
          <span className="md:hidden">
            La entidad aseguradora dispone de un Servicio de Atención al
            Asegurado que atenderá las consultas y reclamos que presenten los
            tomadores de seguros, asegurados, beneficiarios y/o
            derechohabientes.
          </span>
          <span className="hidden md:inline">
            La entidad aseguradora dispone de un Servicio de Atención al
            Asegurado que atenderá las consultas y reclamos que presenten los
            tomadores de seguros, asegurados, beneficiarios y/o
            derechohabientes. El Servicio de Atención al Asegurado está
            integrado por: RESPONSABLE: Gonzalo Oyarzabal – Tel.: 0800-266-4240
            SUPLENTE: Anabella Calderan – Tel.: 0800-266-4240. En caso de que el
            reclamo no haya sido resuelto o haya sido desestimado, total o
            parcialmente, o que haya sido denegada su admisión, podrá
            comunicarse con la Superintendencia de Seguros de la Nación por
            teléfono al 0800-666-8400, correo electrónico a denuncias@ssn.gob.ar
            o formulario web a través de www.argentina.gob.ar/ssn
          </span>
        </p>
        <Image
          src="/images/ssn-qr.png"
          alt="SSN QR"
          width={39}
          height={53}
          className="w-[30px] md:w-[39px] h-10 md:h-[53px] flex-shrink-0"
        />
      </div>

      <div className="w-full h-px bg-[#E8E4DF]" />

      {/* Bottom */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 w-full">
        <span className="text-[11px] md:text-xs text-[#C4C4C4] text-center md:text-left">
          © 2026 Woranz. Todos los derechos reservados.
        </span>
        <div className="hidden md:flex items-center gap-4">
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Instagram className="w-4 h-4 text-[#9CA3AF]" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Linkedin className="w-4 h-4 text-[#9CA3AF]" />
          </a>
          <a href="#" className="hover:opacity-70 transition-opacity">
            <Twitter className="w-4 h-4 text-[#9CA3AF]" />
          </a>
        </div>
      </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: string[] }) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-[13px] font-semibold text-[#1A1A2E] tracking-[0.5px]">
        {title}
      </span>
      {links.map((link) => (
        <a
          key={link}
          href="#"
          className="text-[13px] text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
        >
          {link}
        </a>
      ))}
    </div>
  );
}
