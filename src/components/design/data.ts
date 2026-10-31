/** Comet 2™ and training facts shared by the review concepts; sourced from src/content/en. */
import { getHomeContent } from "@/lib/content";
import { PACKAGES } from "@/lib/site";

const packages = getHomeContent("en").packages;

export const COMET = PACKAGES.find((p) => p.slug === "comet-2")!;

export const SPECS = [
  { label: "Display", value: "5-inch colour touchscreen" },
  { label: "Light output", value: "Blue, Red, Blue + Red + Purple, Blue + Purple" },
  { label: "Power output", value: "Three-stage selection, to suit the customer’s condition" },
  { label: "Treatment time", value: "1–30 minutes" },
  { label: "Frame", value: "Aluminium, with adjustable angles and height" },
  { label: "Standby", value: "Auto sleep after 60 seconds not in use" },
  { label: "Hygiene", value: "Disposable sheath, to help prevent cross-infection" },
  { label: "Voltage", value: "AC 100V–240V" },
  { label: "Machine box", value: "46 × 67 × 20 cm, 11 kg" },
  { label: "Material box", value: "30 × 15 × 25 cm, 4 kg" },
];

export const LIGHTS = [
  { name: "Blue", range: "450–510 nm", power: "4–5 W/pc", color: "#4d7cff" },
  { name: "Red", range: "620–640 nm", power: "2–3 W/pc", color: "#e5484d" },
  { name: "Purple", range: "380–420 nm", power: "1 W/pc", color: "#8e4ec6" },
];

export const COMPARE = [
  { label: "Use", values: ["Great mobility", "Mobile and fixed", "Fixed only"] },
  { label: "Treatments included", values: PACKAGES.map((p) => packages.items[p.slug].treatments.replace(" Treatments Inc", "")) },
  { label: "Wavelengths", values: ["Single", "Triple", "Single"] },
  { label: "Maintenance", values: ["None", "None", "High"] },
  { label: "Results", values: PACKAGES.map((p) => `${p.results}/10`) },
  { label: "Rating", values: PACKAGES.map((p) => p.rating.toFixed(2)) },
];

export const SYLLABUS = [
  "How to determine teeth type and shades, and how the technology works",
  "What dentists and non-dentists cannot do in certain jurisdictions",
  "Health and safety of teeth whitening",
  "Consultation and medical information",
  "Treatment plan and techniques",
  "Who can be treated",
  "Hands-on practical",
  "The legality of a teeth whitening business",
  "Sales and marketing",
  "Pre-treatment communications",
  "Key points during and after treatment",
  "Contraindications",
  "Hollywood Whitening™ approved certification",
];

/** Training page comparison; score is the result out of 5. */
export const FORMULA = [
  { machine: true, gel: true, training: true, result: "Greatest Hollywood Whitening results", score: 5 },
  { machine: false, gel: true, training: true, result: "Good results", score: 4 },
  { machine: true, gel: true, training: false, result: "OK results", score: 3 },
  { machine: true, gel: false, training: false, result: "Very poor results", score: 2 },
  { machine: false, gel: false, training: false, result: "Next to no results", score: 1 },
];

export const TRAINING_FAQS = [
  "Who can be trained for teeth whitening?",
  "How long is the training?",
  "Does online Teeth Whitening Training mean we get less of an experience?",
  "Do I need insurance?",
  "I have trained with another company but I am not happy, what can you offer me?",
  "How do I go ahead?",
];

export const TRAINING_NOTE =
  "Methods and distribution vary depending on your country and professional status. You must not offer anything that may be considered dentistry if you are not a dentist. Non-dentists in the EU have guidelines and protocols to follow, which are explained during training.";
