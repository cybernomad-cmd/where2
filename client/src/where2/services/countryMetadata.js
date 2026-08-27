const COUNTRY_METADATA = {
  KE: {
    currency: "Kenyan Shilling (KES)",
    languages: "English, Swahili",
  },
  UG: {
    currency: "Ugandan Shilling (UGX)",
    languages: "English, Swahili",
  },
  TZ: {
    currency: "Tanzanian Shilling (TZS)",
    languages: "Swahili, English",
  },
  RW: {
    currency: "Rwandan Franc (RWF)",
    languages: "Kinyarwanda, English, French, Swahili",
  },
  ZA: {
    currency: "South African Rand (ZAR)",
    languages: "English and other official languages",
  },
  NG: {
    currency: "Nigerian Naira (NGN)",
    languages: "English",
  },
  GH: {
    currency: "Ghanaian Cedi (GHS)",
    languages: "English",
  },
  EG: {
    currency: "Egyptian Pound (EGP)",
    languages: "Arabic",
  },
  MA: {
    currency: "Moroccan Dirham (MAD)",
    languages: "Arabic, Amazigh",
  },
  ET: {
    currency: "Ethiopian Birr (ETB)",
    languages: "Amharic",
  },
  US: {
    currency: "United States Dollar (USD)",
    languages: "English",
  },
  CA: {
    currency: "Canadian Dollar (CAD)",
    languages: "English, French",
  },
  GB: {
    currency: "British Pound (GBP)",
    languages: "English",
  },
  FR: {
    currency: "Euro (EUR)",
    languages: "French",
  },
  DE: {
    currency: "Euro (EUR)",
    languages: "German",
  },
  IT: {
    currency: "Euro (EUR)",
    languages: "Italian",
  },
  ES: {
    currency: "Euro (EUR)",
    languages: "Spanish",
  },
  PT: {
    currency: "Euro (EUR)",
    languages: "Portuguese",
  },
  NL: {
    currency: "Euro (EUR)",
    languages: "Dutch",
  },
  BE: {
    currency: "Euro (EUR)",
    languages: "Dutch, French, German",
  },
  CH: {
    currency: "Swiss Franc (CHF)",
    languages: "German, French, Italian, Romansh",
  },
  AT: {
    currency: "Euro (EUR)",
    languages: "German",
  },
  IE: {
    currency: "Euro (EUR)",
    languages: "English, Irish",
  },
  JP: {
    currency: "Japanese Yen (JPY)",
    languages: "Japanese",
  },
  CN: {
    currency: "Chinese Yuan (CNY)",
    languages: "Mandarin Chinese",
  },
  IN: {
    currency: "Indian Rupee (INR)",
    languages: "Hindi, English",
  },
  AU: {
    currency: "Australian Dollar (AUD)",
    languages: "English",
  },
  NZ: {
    currency: "New Zealand Dollar (NZD)",
    languages: "English, Māori",
  },
  BR: {
    currency: "Brazilian Real (BRL)",
    languages: "Portuguese",
  },
  MX: {
    currency: "Mexican Peso (MXN)",
    languages: "Spanish",
  },
  AR: {
    currency: "Argentine Peso (ARS)",
    languages: "Spanish",
  },
  CL: {
    currency: "Chilean Peso (CLP)",
    languages: "Spanish",
  },
  AE: {
    currency: "United Arab Emirates Dirham (AED)",
    languages: "Arabic",
  },
  SA: {
    currency: "Saudi Riyal (SAR)",
    languages: "Arabic",
  },
  TR: {
    currency: "Turkish Lira (TRY)",
    languages: "Turkish",
  },
  KR: {
    currency: "South Korean Won (KRW)",
    languages: "Korean",
  },
  SG: {
    currency: "Singapore Dollar (SGD)",
    languages: "English, Malay, Mandarin, Tamil",
  },
};

export function getCountryMetadata(countryCode) {
  const normalizedCode = String(countryCode || "")
    .trim()
    .toUpperCase();

  return (
    COUNTRY_METADATA[normalizedCode] || {
      currency: "Not available",
      languages: "Not available",
    }
  );
}

export function getCountryFlag(countryCode) {
  const normalizedCode = String(countryCode || "")
    .trim()
    .toUpperCase();

  if (!/^[A-Z]{2}$/.test(normalizedCode)) {
    return "";
  }

  return String.fromCodePoint(
    ...[...normalizedCode].map(
      (character) =>
        127397 + character.charCodeAt(0)
    )
  );
}