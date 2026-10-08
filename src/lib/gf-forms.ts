/**
 * Field maps for the Gravity Forms the Next site posts to (via /api/enquiry):
 *
 *   - `contact`  → form 3 "Get in touch / Start today not tomorrow!" (About, Contact)
 *   - `interest` → form 7 "Register Your Interest" (every product page)
 *
 * Ids were read from the rendered live forms (2026-10-08) — the GF REST API is not
 * enabled on Hollywood's WordPress, so `GET /wp-json/gf/v2/forms/{id}` could not be
 * used to confirm required flags or the purpose of hidden fields. Re-check against it
 * once the API is on.
 *
 * **Do not renumber.** Notifications/feeds on the WordPress side map by field id.
 */

export type EnquiryFormKey = "contact" | "interest";

/* ------------------------------------------------------------------ */
/* Form 3 — "Get in touch"                                             */
/* ------------------------------------------------------------------ */

export const GF_ENQUIRY_FORM_ID = 3;

export const GF_ENQUIRY = {
  /* page 1 */
  firstName: "input_1.3",
  lastName: "input_1.6",
  phone: "input_4",
  email: "input_5",
  /** Confirm-email sub-input posts with an underscore, not a dot. */
  confirmEmail: "input_5_2",
  city: "input_3.3",
  country: "input_3.6",
  companyName: "input_24",
  helpWith: "input_21",
  /* page 2 */
  describes: "input_20",
  message: "input_12",
  /** Consent checkbox — choice sub-inputs post with an underscore. */
  privacy: "input_18_1",
  /* hidden — the page the form was submitted from */
  sourceUrl: "input_22",
} as const;

/**
 * Choice VALUES GF stores for form 3. They are English on every locale (the live
 * /es/ /de/ /ru/ forms translate only the labels), and GF rejects anything else.
 * Localised labels live in common.json → enquiryForm.
 */
export const GF_ENQUIRY_CHOICES = {
  helpWith: ["I'm Interested in Device & Training", "I Need Customer Support"],
  describes: [
    "Dentist",
    "Dental Hygienist",
    "Dental Nurse/Assistant",
    "Orthodontist",
    "Owner/Practice Manager",
    "Dental Student",
    "Other",
  ],
} as const;

/* ------------------------------------------------------------------ */
/* Form 7 — "Register Your Interest" (product pages)                   */
/* ------------------------------------------------------------------ */

export const GF_INTEREST_FORM_ID = 7;

export const GF_INTEREST = {
  /* page 1 */
  firstName: "input_1.3",
  lastName: "input_1.6",
  phone: "input_2",
  email: "input_3",
  confirmEmail: "input_3_2",
  city: "input_8.3",
  country: "input_8.6",
  /* page 2 */
  describes: "input_13",
  companyName: "input_14",
  howSoon: "input_15",
  /** Text field the live form hides; the plugin fills it from the ad-click URL. */
  gclid: "input_16",
  // Hidden fields 9, 11 and 18 are filled by WordPress-side script whose purpose
  // isn't visible in the rendered form (likely product / lead source / language).
  // Map them once the GF REST API confirms what they hold.
} as const;

export const GF_INTEREST_CHOICES = {
  describes: [
    "Dentist/Orthodontist",
    "Dental Nurse/Assistant/Hygienist",
    "Dental Student",
    "Salon Owner/Manager",
    "Aesthetician",
    "Other",
  ],
  howSoon: ["0 - 3 Months", "3 - 6 Months", "6+ Months", "Just Enquiring"],
} as const;

/** Public reCAPTCHA v2 site key the live forms render (form 3 field 19, form 7 field 12). Public by design. */
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LchmfkUAAAAAFtfH0L212KGtBHgmrAZwkmorO_o";
