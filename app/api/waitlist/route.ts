import { env } from "cloudflare:workers";
import { handleWaitlist } from "../../../lib/waitlist";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  return handleWaitlist(request, env.DB);
}
