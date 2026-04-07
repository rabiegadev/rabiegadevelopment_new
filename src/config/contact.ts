/** Dane kontaktowe — edytuj tutaj lub ustaw zmienne NEXT_PUBLIC_* w .env (nadpisują domyślne). */

function env(key: string, fallback: string) {
  const v = process.env[key];
  return v && v.trim().length > 0 ? v.trim() : fallback;
}

export type SocialLink = { label: string; href: string };

export function getContact() {
  const city = env("NEXT_PUBLIC_CONTACT_CITY", "Polska");
  const address = env(
    "NEXT_PUBLIC_CONTACT_ADDRESS",
    "Adres do uzupełnienia — ustaw w pliku src/config/contact.ts lub zmienne środowiskowe.",
  );

  const phoneRaw = env(
    "NEXT_PUBLIC_CONTACT_PHONES",
    "+48 123 456 789",
  );
  const phones = phoneRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);

  const emailRaw = env(
    "NEXT_PUBLIC_CONTACT_EMAILS",
    "kamil@rabiegadevelopment.pl",
  );
  const emails = emailRaw.split(/[,;]/).map((s) => s.trim()).filter(Boolean);

  const social: SocialLink[] = [
    {
      label: "Facebook — Rabiega Development",
      href: env(
        "NEXT_PUBLIC_SOCIAL_FACEBOOK",
        "https://www.facebook.com/",
      ),
    },
    {
      label: "Instagram — @rabiega_development",
      href: env(
        "NEXT_PUBLIC_SOCIAL_INSTAGRAM",
        "https://www.instagram.com/rabiega_development/",
      ),
    },
    {
      label: "YouTube",
      href: env("NEXT_PUBLIC_SOCIAL_YOUTUBE", "https://www.youtube.com/"),
    },
  ];

  const linkedIn = process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim();
  if (linkedIn) {
    social.push({ label: "LinkedIn", href: linkedIn });
  }

  const extra = process.env.NEXT_PUBLIC_SOCIAL_EXTRA?.trim();
  if (extra) {
    try {
      const parsed = JSON.parse(extra) as { label: string; href: string }[];
      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (item?.label && item?.href) social.push({ label: item.label, href: item.href });
        }
      }
    } catch {
      /* ignoruj zły JSON */
    }
  }

  return {
    city,
    address,
    phones,
    emails,
    social,
  };
}
