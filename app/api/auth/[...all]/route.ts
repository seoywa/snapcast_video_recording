import aj from "@/lib/arcjet";
import { auth } from "@/lib/auth";
import { ArcjetDecision, slidingWindow, validateEmail } from "@arcjet/next";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import ip from '@arcjet/ip'

//Email validation
const emailValidation = aj.withRule(
  validateEmail({ mode: 'LIVE', block: ['DISPOSABLE', 'INVALID', 'NO_MX_RECORDS']})
)

//Rate limit with a sliding window

const rateLimit = aj.withRule(
  slidingWindow({
    mode: 'LIVE',
    interval: '2m',
    max: 2,
    characteristics: ['fingerprint']
  })
)

const protectedAuth = async (req: NextRequest): Promise<ArcjetDecision> => {
  const session = await auth.api.getSession({ headers: req.headers });

  let userID: string;

  if (session?.user?.id) {
    userID = session.user.id
  } else {
    userID = ip(req) || '127.0.0.1'
  }

  if (req.nextUrl.pathname.startsWith('/api/auth/sign-in')) {
    const body = await req.clone().json();

    if (typeof body.email === 'string') {
      return emailValidation.protect(req, { email: body.email })
    }
  }

  return rateLimit.protect(req, { fingerprint: userID })
}

const authHandler = toNextJsHandler(auth.handler)

export const { GET } = authHandler;

export const POST =  async (req: NextRequest) => {
  const decision = await protectedAuth(req);

  if (decision.isDenied()) {
    if (decision.reason.isEmail()) throw new Error('Email validation failed')
    if (decision.reason.isRateLimit()) throw new Error('Route.ts: Rate limit exceeded')
    if (decision.reason.isShield()) throw new Error('Shield turned on, protected against malicious actions')
  } 

  return authHandler.POST(req);
}