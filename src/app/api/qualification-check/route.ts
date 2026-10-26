import { handleVerify } from "@/lib/verify";

/**
 * Qualification Check (certificate number): verdict and the certificate's detail line
 * from Hollywood's WordPress, entry logged to Gravity Forms form 1. See lib/verify.ts.
 */
export function POST(req: Request) {
  return handleVerify(req, "qualification");
}
