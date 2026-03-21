import { useEffect, useMemo, useState } from "react";
import { isValidPhoneNumber, type CountryCode } from "libphonenumber-js";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Check, X, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useBookDemoModal } from "@/lib/BookDemoModalContext";
import { useLanguage } from "@/lib/LanguageContext";
import { cn } from "@/lib/utils";
import tripeaxLogo from "@/assets/tripeax-logo-small.png";
import restaurantSectionImg from "@/assets/restaurant-section.png";
import otelSectionImg from "@/assets/otel-section.png";

type BusinessType = "restaurant" | "hotel";

const STEP_COUNT = 5;

const MODAL_COPY = {
  en: {
    leftDescription: "Let's understand your business, and then we'll get you on the calendar.",
    dialogTitle: "Book a demo",
    dialogDescription: "Fill in your information to schedule a discovery call.",
    close: "Close",
    businessTypeQuestion: "What type of business do you run?",
    businessTypeHint: "I run a...",
    selectOne: "Select one",
    restaurantLabel: "Restaurant",
    restaurantDesc: "Restaurant, cafe, bar, or dining venue",
    hotelLabel: "Hotel",
    hotelDesc: "Hotel, resort, boutique property, or hotel group",
    interestsQuestion: "What are you looking for?",
    interestsHint: "I'm interested in",
    selectAll: "Select all that apply",
    restInterests: [
      "24/7 Call Answering",
      "Table Reservations by Phone",
      "Multilingual Guest Support",
      "Dropped Call Recovery",
      "Lead Capture (Groups & Events)",
      "No-Show Follow-Up",
      "Review Requests After Visits",
      "WhatsApp Booking Confirmations",
      "Reservation System Integration",
    ],
    hotelInterests: [
      "24/7 Call Answering",
      "Room Bookings by Phone",
      "Multilingual Guest Support",
      "Dropped Call Recovery",
      "Group & Event Lead Capture",
      "Post-Stay Review Requests",
      "In-Stay Guest Requests",
      "PMS Integration",
      "Upselling (Spa, Upgrades, Transfers)",
    ],
    restLocationsQuestion: "How many locations do you have?",
    restCallsQuestion: "How many calls do you get per day?",
    bestEstimate: "Your best estimate",
    restReservationSystemQuestion: "Do you use a reservation system?",
    selectIfApplicable: "Select one if applicable",
    restLocations: ["1", "2-3", "4-10", "10+"],
    restCallsPerDay: ["Under 20", "20-50", "50-100", "100+", "Not sure"],
    reservationSystems: [
      "TheFork / LaFourchette",
      "Google Reserve",
      "Resy",
      "Check&Place",
      "Rezo",
      "OpenTable",
      "Paper book / phone only",
      "Other",
    ],
    hotelPropertiesQuestion: "How many properties do you manage?",
    hotelRoomsQuestion: "How many rooms across all properties?",
    hotelPmsQuestion: "What PMS do you use?",
    scrollForMore: "Scroll to see more options",
    hotelProperties: ["1", "2-5", "6-20", "20+"],
    hotelRooms: ["Under 30", "30-80", "80-200", "200+"],
    pmsSystems: [
      "Cloudbeds",
      "Mews",
      "Opera Cloud",
      "HotelRunner",
      "Protel",
      "Clock PMS",
      "Little Hotelier",
      "No PMS / manual",
      "Other",
    ],
    firstName: "First Name*",
    firstNamePlaceholder: "Joshua",
    lastName: "Last Name*",
    lastNamePlaceholder: "King",
    email: "Email Address*",
    emailPlaceholder: "joshua@restaurant.com",
    phone: "Phone Number*",
    phonePlaceholder: "6 12 34 56 78",
    phoneInvalid: "Enter a valid phone number for the selected country.",
    businessName: "Business Name*",
    businessNamePlaceholder: "Your restaurant or hotel name",
    notes: "Anything else we should know?",
    notesPlaceholder:
      "e.g. We get a lot of German tourists, we're opening a second location in May, etc.",
    consent: "I agree to the Privacy Policy and commit to attending this call.",
    back: "Back",
    continue: "Continue",
    submit: "Book My Call",
  },
  tr: {
    leftDescription: "Isletmenizi kisaca anlayalim, sonra sizi takvime alalim.",
    dialogTitle: "Demo talep et",
    dialogDescription: "Kesif gorusmesini planlamak icin bilgilerinizi doldurun.",
    close: "Kapat",
    businessTypeQuestion: "Hangi tur isletme yonetiyorsunuz?",
    businessTypeHint: "Benim isletmem...",
    selectOne: "Birini secin",
    restaurantLabel: "Restoran",
    restaurantDesc: "Restoran, kafe, bar veya yeme-icme mekani",
    hotelLabel: "Otel",
    hotelDesc: "Otel, resort, butik otel veya otel grubu",
    interestsQuestion: "Nelerle ilgileniyorsunuz?",
    interestsHint: "Ilgi alanlarim",
    selectAll: "Uyanlarin hepsini secin",
    restInterests: [
      "7/24 Arama Yanitlama",
      "Telefonla Masa Rezervasyonu",
      "Cok Dilli Misafir Destegi",
      "Dusen Arama Kurtarma",
      "Musteri Yakalama (Grup ve Etkinlik)",
      "No-show Takibi",
      "Ziyaret Sonrasi Yorum Istegi",
      "WhatsApp Rezervasyon Onayi",
      "Rezervasyon Sistemi Entegrasyonu",
    ],
    hotelInterests: [
      "7/24 Arama Yanitlama",
      "Telefonla Oda Rezervasyonu",
      "Cok Dilli Misafir Destegi",
      "Dusen Arama Kurtarma",
      "Grup ve Etkinlik Musteri Yakalama",
      "Konaklama Sonrasi Yorum Istegi",
      "Konaklama Sirasinda Misafir Talepleri",
      "PMS Entegrasyonu",
      "Upsell (Spa, Yukseltme, Transfer)",
    ],
    restLocationsQuestion: "Kac lokasyonunuz var?",
    restCallsQuestion: "Gunluk ortalama kac arama aliyorsunuz?",
    bestEstimate: "Tahmini secin",
    restReservationSystemQuestion: "Rezervasyon sistemi kullaniyor musunuz?",
    selectIfApplicable: "Uygunsa birini secin",
    restLocations: ["1", "2-3", "4-10", "10+"],
    restCallsPerDay: ["20'nin altinda", "20-50", "50-100", "100+", "Emin degilim"],
    reservationSystems: [
      "TheFork / LaFourchette",
      "Google Reserve",
      "Resy",
      "Check&Place",
      "Rezo",
      "OpenTable",
      "Defter / sadece telefon",
      "Diger",
    ],
    hotelPropertiesQuestion: "Kac tesis yonetiyorsunuz?",
    hotelRoomsQuestion: "Tum tesislerde toplam kac odaniz var?",
    hotelPmsQuestion: "Hangi PMS'i kullaniyorsunuz?",
    scrollForMore: "Daha fazla secenek icin kaydirin",
    hotelProperties: ["1", "2-5", "6-20", "20+"],
    hotelRooms: ["30'un altinda", "30-80", "80-200", "200+"],
    pmsSystems: [
      "Cloudbeds",
      "Mews",
      "Opera Cloud",
      "HotelRunner",
      "Protel",
      "Clock PMS",
      "Little Hotelier",
      "PMS yok / manuel",
      "Diger",
    ],
    firstName: "Ad*",
    firstNamePlaceholder: "Ahmet",
    lastName: "Soyad*",
    lastNamePlaceholder: "Yılmaz",
    email: "E-posta*",
    emailPlaceholder: "ahmet@isletme.com",
    phone: "Telefon Numarasi*",
    phonePlaceholder: "5XX XXX XX XX",
    phoneInvalid: "Secilen ulke icin gecerli bir telefon numarasi girin.",
    businessName: "Isletme Adi*",
    businessNamePlaceholder: "Restoran veya otel adiniz",
    notes: "Bilmemiz gereken baska bir sey var mi?",
    notesPlaceholder:
      "Orn. Cok sayida Alman turist aliyoruz, Mayis'ta ikinci lokasyonumuzu aciyoruz, vb.",
    consent: "Gizlilik Politikasi'ni kabul ediyor ve bu gorusmeye katilacagimi onayliyorum.",
    back: "Geri",
    continue: "Devam",
    submit: "Gorusmemi Planla",
  },
} as const;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

function isModalPhoneValid(raw: string, isoCountry: string): boolean {
  const s = raw.trim();
  if (!s) return false;
  return isValidPhoneNumber(s, isoCountry as CountryCode);
}

const COUNTRY_CODES: { code: string; dial: string; name: string }[] = [
  { code: "TR", dial: "+90", name: "Turkey" },
  { code: "US", dial: "+1", name: "United States" },
  { code: "GB", dial: "+44", name: "United Kingdom" },
  { code: "DE", dial: "+49", name: "Germany" },
  { code: "FR", dial: "+33", name: "France" },
  { code: "IT", dial: "+39", name: "Italy" },
  { code: "ES", dial: "+34", name: "Spain" },
  { code: "NL", dial: "+31", name: "Netherlands" },
  { code: "BE", dial: "+32", name: "Belgium" },
  { code: "AT", dial: "+43", name: "Austria" },
  { code: "CH", dial: "+41", name: "Switzerland" },
  { code: "PT", dial: "+351", name: "Portugal" },
  { code: "GR", dial: "+30", name: "Greece" },
  { code: "SE", dial: "+46", name: "Sweden" },
  { code: "NO", dial: "+47", name: "Norway" },
  { code: "DK", dial: "+45", name: "Denmark" },
  { code: "FI", dial: "+358", name: "Finland" },
  { code: "PL", dial: "+48", name: "Poland" },
  { code: "CZ", dial: "+420", name: "Czech Republic" },
  { code: "RO", dial: "+40", name: "Romania" },
  { code: "HU", dial: "+36", name: "Hungary" },
  { code: "BG", dial: "+359", name: "Bulgaria" },
  { code: "HR", dial: "+385", name: "Croatia" },
  { code: "RS", dial: "+381", name: "Serbia" },
  { code: "SK", dial: "+421", name: "Slovakia" },
  { code: "SI", dial: "+386", name: "Slovenia" },
  { code: "IE", dial: "+353", name: "Ireland" },
  { code: "LT", dial: "+370", name: "Lithuania" },
  { code: "LV", dial: "+371", name: "Latvia" },
  { code: "EE", dial: "+372", name: "Estonia" },
  { code: "CY", dial: "+357", name: "Cyprus" },
  { code: "MT", dial: "+356", name: "Malta" },
  { code: "LU", dial: "+352", name: "Luxembourg" },
  { code: "IS", dial: "+354", name: "Iceland" },
  { code: "AL", dial: "+355", name: "Albania" },
  { code: "BA", dial: "+387", name: "Bosnia and Herzegovina" },
  { code: "ME", dial: "+382", name: "Montenegro" },
  { code: "MK", dial: "+389", name: "North Macedonia" },
  { code: "MD", dial: "+373", name: "Moldova" },
  { code: "GE", dial: "+995", name: "Georgia" },
  { code: "AM", dial: "+374", name: "Armenia" },
  { code: "AZ", dial: "+994", name: "Azerbaijan" },
  { code: "UA", dial: "+380", name: "Ukraine" },
  { code: "BY", dial: "+375", name: "Belarus" },
  { code: "RU", dial: "+7", name: "Russia" },
  { code: "CA", dial: "+1", name: "Canada" },
  { code: "MX", dial: "+52", name: "Mexico" },
  { code: "BR", dial: "+55", name: "Brazil" },
  { code: "AR", dial: "+54", name: "Argentina" },
  { code: "CL", dial: "+56", name: "Chile" },
  { code: "CO", dial: "+57", name: "Colombia" },
  { code: "PE", dial: "+51", name: "Peru" },
  { code: "VE", dial: "+58", name: "Venezuela" },
  { code: "EC", dial: "+593", name: "Ecuador" },
  { code: "UY", dial: "+598", name: "Uruguay" },
  { code: "PY", dial: "+595", name: "Paraguay" },
  { code: "BO", dial: "+591", name: "Bolivia" },
  { code: "AU", dial: "+61", name: "Australia" },
  { code: "NZ", dial: "+64", name: "New Zealand" },
  { code: "JP", dial: "+81", name: "Japan" },
  { code: "KR", dial: "+82", name: "South Korea" },
  { code: "CN", dial: "+86", name: "China" },
  { code: "IN", dial: "+91", name: "India" },
  { code: "PK", dial: "+92", name: "Pakistan" },
  { code: "BD", dial: "+880", name: "Bangladesh" },
  { code: "ID", dial: "+62", name: "Indonesia" },
  { code: "MY", dial: "+60", name: "Malaysia" },
  { code: "SG", dial: "+65", name: "Singapore" },
  { code: "TH", dial: "+66", name: "Thailand" },
  { code: "VN", dial: "+84", name: "Vietnam" },
  { code: "PH", dial: "+63", name: "Philippines" },
  { code: "TW", dial: "+886", name: "Taiwan" },
  { code: "HK", dial: "+852", name: "Hong Kong" },
  { code: "AE", dial: "+971", name: "United Arab Emirates" },
  { code: "SA", dial: "+966", name: "Saudi Arabia" },
  { code: "QA", dial: "+974", name: "Qatar" },
  { code: "KW", dial: "+965", name: "Kuwait" },
  { code: "BH", dial: "+973", name: "Bahrain" },
  { code: "OM", dial: "+968", name: "Oman" },
  { code: "JO", dial: "+962", name: "Jordan" },
  { code: "LB", dial: "+961", name: "Lebanon" },
  { code: "IL", dial: "+972", name: "Israel" },
  { code: "EG", dial: "+20", name: "Egypt" },
  { code: "MA", dial: "+212", name: "Morocco" },
  { code: "TN", dial: "+216", name: "Tunisia" },
  { code: "DZ", dial: "+213", name: "Algeria" },
  { code: "NG", dial: "+234", name: "Nigeria" },
  { code: "ZA", dial: "+27", name: "South Africa" },
  { code: "KE", dial: "+254", name: "Kenya" },
  { code: "GH", dial: "+233", name: "Ghana" },
  { code: "ET", dial: "+251", name: "Ethiopia" },
  { code: "TZ", dial: "+255", name: "Tanzania" },
  { code: "UG", dial: "+256", name: "Uganda" },
  { code: "SN", dial: "+221", name: "Senegal" },
  { code: "CI", dial: "+225", name: "Ivory Coast" },
  { code: "CM", dial: "+237", name: "Cameroon" },
  { code: "IQ", dial: "+964", name: "Iraq" },
  { code: "IR", dial: "+98", name: "Iran" },
  { code: "AF", dial: "+93", name: "Afghanistan" },
  { code: "LK", dial: "+94", name: "Sri Lanka" },
  { code: "NP", dial: "+977", name: "Nepal" },
  { code: "MM", dial: "+95", name: "Myanmar" },
  { code: "KH", dial: "+855", name: "Cambodia" },
  { code: "LA", dial: "+856", name: "Laos" },
  { code: "MN", dial: "+976", name: "Mongolia" },
  { code: "KZ", dial: "+7", name: "Kazakhstan" },
  { code: "UZ", dial: "+998", name: "Uzbekistan" },
  { code: "CR", dial: "+506", name: "Costa Rica" },
  { code: "PA", dial: "+507", name: "Panama" },
  { code: "DO", dial: "+1", name: "Dominican Republic" },
  { code: "CU", dial: "+53", name: "Cuba" },
  { code: "JM", dial: "+1", name: "Jamaica" },
  { code: "TT", dial: "+1", name: "Trinidad and Tobago" },
  { code: "GT", dial: "+502", name: "Guatemala" },
  { code: "HN", dial: "+504", name: "Honduras" },
  { code: "SV", dial: "+503", name: "El Salvador" },
  { code: "NI", dial: "+505", name: "Nicaragua" },
];

export function BookDemoModal() {
  const { isOpen, closeBookDemo } = useBookDemoModal();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const m = t.bookDemoModal;
  const copy = MODAL_COPY[lang];

  const [step, setStep] = useState(0);
  const [businessType, setBusinessType] = useState<BusinessType | null>(null);

  const [step2Interests, setStep2Interests] = useState<Set<string>>(new Set());

  const [restStep3, setRestStep3] = useState({
    locations: "",
    callsPerDay: "",
    reservationSystem: "",
  });
  const [hotelStep3, setHotelStep3] = useState({
    properties: "",
    rooms: "",
    pms: "",
  });

  const [details, setDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [step5, setStep5] = useState({
    phone: "",
    businessName: "",
    notes: "",
    agreed: false,
  });

  const [countryCode, setCountryCode] = useState(() => (lang === "tr" ? "TR" : "FR"));
  const [phoneTouched, setPhoneTouched] = useState(false);

  const selectedCountry = useMemo(
    () => COUNTRY_CODES.find((c) => c.code === countryCode) ?? COUNTRY_CODES[0],
    [countryCode]
  );

  useEffect(() => {
    if (!isOpen) return;
    setStep(0);
    setBusinessType(null);
    setStep2Interests(new Set());
    setRestStep3({ locations: "", callsPerDay: "", reservationSystem: "" });
    setHotelStep3({ properties: "", rooms: "", pms: "" });
    setDetails({ firstName: "", lastName: "", email: "" });
    setStep5({ phone: "", businessName: "", notes: "", agreed: false });
    setPhoneTouched(false);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    setCountryCode(lang === "tr" ? "TR" : "FR");
  }, [isOpen, lang]);

  const interestOptions =
    businessType === "restaurant" ? copy.restInterests : copy.hotelInterests;

  const toggleInterest = (tag: string) => {
    setStep2Interests((prev) => {
      const next = new Set(prev);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  };

  const restaurantValidStep3 = Boolean(
    restStep3.locations && restStep3.callsPerDay && restStep3.reservationSystem
  );
  const hotelValidStep3 = Boolean(hotelStep3.properties && hotelStep3.rooms && hotelStep3.pms);

  const phoneValid = useMemo(
    () => isModalPhoneValid(step5.phone, countryCode),
    [step5.phone, countryCode]
  );
  const step4RestOk = Boolean(step5.businessName.trim() && step5.agreed);
  const showPhoneError = Boolean(
    step5.phone.trim() && !phoneValid && (phoneTouched || step4RestOk)
  );

  const canContinue = (() => {
    if (step === 0) return businessType !== null;
    if (step === 1) return step2Interests.size > 0;
    if (step === 2) {
      if (businessType === "restaurant") return restaurantValidStep3;
      if (businessType === "hotel") return hotelValidStep3;
      return false;
    }
    if (step === 3) {
      return Boolean(
        details.firstName.trim() &&
          details.lastName.trim() &&
          isValidEmail(details.email)
      );
    }
    // step === 4
    return Boolean(phoneValid && step5.businessName.trim() && step5.agreed === true);
  })();

  const goBack = () => setStep((s) => Math.max(0, s - 1));
  const goContinue = () => {
    if (!canContinue) return;
    if (step < STEP_COUNT - 1) setStep((s) => s + 1);
  };

  const handleSubmit = () => {
    if (!isModalPhoneValid(step5.phone, countryCode)) return;
    const fullPhone = `${selectedCountry.dial} ${step5.phone.trim()}`;
    const payload = {
      businessType,
      interests: Array.from(step2Interests),
      step3:
        businessType === "restaurant"
          ? { ...restStep3 }
          : businessType === "hotel"
            ? { ...hotelStep3 }
            : {},
      details,
      step5: { ...step5, phone: fullPhone },
    };

    closeBookDemo();
    navigate("/book-demo/calendar", { state: payload });
  };

  const StepLabel = (
    <div className="mb-2 flex flex-col gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        {step + 1} / {STEP_COUNT}
      </span>
      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full"
          style={{ width: `${((step + 1) / STEP_COUNT) * 100}%` }}
        />
      </div>
    </div>
  );

  const StepContent = () => {
    if (step === 0) {
      return (
        <div className="flex flex-col">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
            {copy.businessTypeQuestion}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">{copy.businessTypeHint}</p>
          <p className="text-sm text-muted-foreground mb-4">{copy.selectOne}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setBusinessType("restaurant")}
              className={cn(
                "text-left rounded-2xl border p-4 transition-colors",
                businessType === "restaurant"
                  ? "border-accent/70 bg-accent/10"
                  : "border-border hover:border-muted-foreground/40"
              )}
            >
              <div className="flex items-start gap-3">
                <img
                  src={restaurantSectionImg}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-border/50"
                />
                <div>
                  <div className="font-semibold text-foreground">{copy.restaurantLabel}</div>
                  <div className="text-sm text-muted-foreground">
                    {copy.restaurantDesc}
                  </div>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setBusinessType("hotel")}
              className={cn(
                "text-left rounded-2xl border p-4 transition-colors",
                businessType === "hotel"
                  ? "border-accent/70 bg-accent/10"
                  : "border-border hover:border-muted-foreground/40"
              )}
            >
              <div className="flex items-start gap-3">
                <img
                  src={otelSectionImg}
                  alt=""
                  className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-border/50"
                />
                <div>
                  <div className="font-semibold text-foreground">{copy.hotelLabel}</div>
                  <div className="text-sm text-muted-foreground">
                    {copy.hotelDesc}
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="flex flex-col">
          <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
            {copy.interestsQuestion}
          </h3>
          <p className="text-sm text-muted-foreground mb-1">{copy.interestsHint}</p>
          <p className="text-sm text-muted-foreground mb-4">{copy.selectAll}</p>

          <div className="flex flex-wrap gap-2">
            {interestOptions.map((tag) => {
              const active = step2Interests.has(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleInterest(tag)}
                  className={cn(
                    "rounded-full border px-3 py-2 text-sm transition-colors",
                    active
                      ? "border-accent bg-accent/10 text-accent"
                      : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                  )}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (step === 2) {
      if (businessType === "restaurant") {
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-1">{copy.restLocationsQuestion}</h4>
              <p className="text-sm text-muted-foreground mb-3">{copy.selectOne}</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {copy.restLocations.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRestStep3((p) => ({ ...p, locations: opt }))}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-2 text-[13px] transition-colors",
                      restStep3.locations === opt
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">{copy.restCallsQuestion}</h4>
              <p className="text-sm text-muted-foreground mb-3">{copy.bestEstimate}</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {copy.restCallsPerDay.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRestStep3((p) => ({ ...p, callsPerDay: opt }))}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-2 text-[13px] transition-colors",
                      restStep3.callsPerDay === opt
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {copy.restReservationSystemQuestion}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{copy.selectIfApplicable}</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {copy.reservationSystems.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setRestStep3((p) => ({ ...p, reservationSystem: opt }))}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-2 text-[13px] transition-colors",
                      restStep3.reservationSystem === opt
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      if (businessType === "hotel") {
        return (
          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {copy.hotelPropertiesQuestion}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{copy.selectOne}</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {copy.hotelProperties.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHotelStep3((p) => ({ ...p, properties: opt }))}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-2 text-[13px] transition-colors",
                      hotelStep3.properties === opt
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {copy.hotelRoomsQuestion}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{copy.selectOne}</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {copy.hotelRooms.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHotelStep3((p) => ({ ...p, rooms: opt }))}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-2 text-[13px] transition-colors",
                      hotelStep3.rooms === opt
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-1">
                {copy.hotelPmsQuestion}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">{copy.scrollForMore}</p>
              <div className="flex flex-wrap gap-2 pb-1">
                {copy.pmsSystems.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setHotelStep3((p) => ({ ...p, pms: opt }))}
                    className={cn(
                      "whitespace-nowrap rounded-full border px-3 py-2 text-[13px] transition-colors",
                      hotelStep3.pms === opt
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border bg-muted/30 text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );
      }

      return null;
    }

    if (step === 3) {
      return (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              {copy.firstName}
            </label>
            <input
              required
              value={details.firstName}
              onChange={(e) => setDetails((p) => ({ ...p, firstName: e.target.value }))}
              placeholder={copy.firstNamePlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              {copy.lastName}
            </label>
            <input
              required
              value={details.lastName}
              onChange={(e) => setDetails((p) => ({ ...p, lastName: e.target.value }))}
              placeholder={copy.lastNamePlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-[13px] font-semibold text-foreground mb-1.5">
              {copy.email}
            </label>
            <input
              required
              type="email"
              value={details.email}
              onChange={(e) => setDetails((p) => ({ ...p, email: e.target.value }))}
              placeholder={copy.emailPlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      );
    }

    // step === 4
    return (
      <div className="flex flex-col gap-4">
        <div>
          <label className="block text-[13px] font-semibold text-foreground mb-1.5">
            {copy.phone}
          </label>
          <div className="flex gap-2">
            {lang === "tr" ? (
              <div
                className="flex min-w-[4.5rem] shrink-0 items-center justify-center rounded-lg border border-border bg-muted/40 px-3 py-3 text-[14px] font-medium text-foreground tabular-nums"
                aria-hidden
              >
                +90
              </div>
            ) : (
              <select
                value={countryCode}
                onChange={(e) => {
                  setCountryCode(e.target.value);
                  if (step5.phone.trim()) setPhoneTouched(true);
                }}
                className="w-[140px] shrink-0 rounded-lg border border-border bg-background px-2 py-3 text-[14px] text-foreground focus:outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
              >
                {COUNTRY_CODES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} {c.dial}
                  </option>
                ))}
              </select>
            )}
            <input
              required
              type="tel"
              inputMode="tel"
              autoComplete="tel-national"
              value={step5.phone}
              onChange={(e) => setStep5((p) => ({ ...p, phone: e.target.value }))}
              onBlur={() => setPhoneTouched(true)}
              placeholder={copy.phonePlaceholder}
              aria-invalid={showPhoneError}
              className={cn(
                "flex-1 rounded-lg border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2",
                showPhoneError
                  ? "border-destructive focus:ring-destructive/35"
                  : "border-border focus:ring-ring"
              )}
            />
          </div>
          {showPhoneError ? (
            <p className="mt-1.5 text-sm text-destructive" role="alert">
              {copy.phoneInvalid}
            </p>
          ) : null}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-foreground mb-1.5">
            {copy.businessName}
          </label>
          <input
            required
            value={step5.businessName}
            onChange={(e) => setStep5((p) => ({ ...p, businessName: e.target.value }))}
            placeholder={copy.businessNamePlaceholder}
            className="w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-foreground mb-1.5">
            {copy.notes}
          </label>
          <textarea
            value={step5.notes}
            onChange={(e) => setStep5((p) => ({ ...p, notes: e.target.value }))}
            placeholder={copy.notesPlaceholder}
            className="min-h-[100px] w-full rounded-lg border border-border bg-background px-3.5 py-3 text-[15px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={step5.agreed}
            onChange={(e) => setStep5((p) => ({ ...p, agreed: e.target.checked }))}
            className="mt-1 accent-accent"
          />
          <span>
            {copy.consent}
          </span>
        </label>
      </div>
    );
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && closeBookDemo()}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          className={cn(
            "fixed left-[50%] top-[50%] z-50 w-[96vw] max-w-[980px] translate-x-[-50%] translate-y-[-50%]",
            "rounded-2xl border-0 bg-white p-0 shadow-xl",
            "data-[state=open]:animate-in data-[state=closed]:animate-out",
            "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
            "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
            "focus:outline-none"
          )}
          onPointerDownOutside={() => closeBookDemo()}
          onEscapeKeyDown={closeBookDemo}
        >
          <Dialog.Title className="sr-only">{copy.dialogTitle}</Dialog.Title>
          <Dialog.Description className="sr-only">
            {copy.dialogDescription}
          </Dialog.Description>
          <div className="flex flex-col md:flex-row min-h-[400px]">
            {/* Desktop left (40%) */}
            <aside className="hidden md:flex md:w-[40%] flex-col items-start p-6 md:p-8 md:pr-6 border-r border-border/60">
              <img
                src={tripeaxLogo}
                alt="Tripeax"
                className="max-h-[56px] w-auto max-w-[min(100%,280px)] object-contain object-left mb-4 self-start"
              />
              <h2 className="text-[18px] md:text-[20px] font-bold text-foreground leading-tight">
                {m.title}
              </h2>
              <div className="w-12 h-0.5 bg-accent rounded-full my-4" />
              <p className="italic text-sm text-muted-foreground leading-relaxed mb-4">
                {copy.leftDescription}
              </p>
              <ul className="space-y-3 mt-auto pb-2">
                {(m.bullets ?? []).slice(0, 3).map((text: string, i: number) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="h-4 w-4 shrink-0 text-accent mt-0.5" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </aside>

            {/* Mobile top bar: logo + step counter */}
            <div className="md:hidden flex items-center justify-between px-6 pt-5 pb-3 border-b border-border/50">
              <img
                src={tripeaxLogo}
                alt="Tripeax"
                className="max-h-[40px] w-auto max-w-[220px] object-contain object-left"
              />
              <div className="text-sm font-medium text-muted-foreground">
                {step + 1} / {STEP_COUNT}
              </div>
            </div>

            {/* Right side (60%) */}
            <div className="flex flex-col p-6 md:p-10 md:pl-8 flex-1 relative">
              <Dialog.Close
                className="absolute right-6 top-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-label={copy.close}
              >
                <X className="h-5 w-5" />
              </Dialog.Close>

              <div className="hidden md:block">{StepLabel}</div>

              <div className="md:pt-2 flex-1 overflow-auto pr-1">
                {StepContent()}
              </div>

              <div className="mt-auto pt-6 flex justify-center">
                <div className="flex items-center justify-center gap-3">
                  {step > 0 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-7 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/40 transition-colors min-w-[124px] justify-center"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      {copy.back}
                    </button>
                  ) : null}

                  {step < STEP_COUNT - 1 ? (
                    <button
                      type="button"
                      onClick={goContinue}
                      disabled={!canContinue}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg bg-accent px-7 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring min-w-[164px] justify-center",
                        !canContinue && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {copy.continue} <ArrowRight className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canContinue}
                      className={cn(
                        "inline-flex items-center gap-2 rounded-lg bg-accent px-8 py-3 text-sm font-semibold text-accent-foreground hover:bg-accent/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring min-w-[208px] justify-center",
                        !canContinue && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {copy.submit} <ArrowRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
