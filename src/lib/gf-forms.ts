/**
 * Field map for Gravity Forms **form 3** — "Get in touch / Start today not tomorrow!",
 * the two-page enquiry form embedded on the live /about-us/ page (and its /es/ /de/
 * /ru/ twins).
 *
 * Ids were read from the rendered live form (2026-10-08) — the GF REST API is not
 * enabled on Hollywood's WordPress, so `GET /wp-json/gf/v2/forms/3` could not be
 * used to confirm required flags. Re-check against it once the API is on.
 *
 * **Do not renumber.** Notifications/feeds on the WordPress side map by field id.
 */

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

/** Public reCAPTCHA v2 site key the live form renders (form 3 field 19). Public by design. */
export const RECAPTCHA_SITE_KEY =
  process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LchmfkUAAAAAFtfH0L212KGtBHgmrAZwkmorO_o";
