import { handleVerify } from "@/lib/verify";

/**
 * Machine Authentication (serial check): verdict from Hollywood's WordPress, entry
 * logged to Gravity Forms form 2. See lib/verify.ts.
 */
export function POST(req: Request) {
  return handleVerify(req, "machine");
}
