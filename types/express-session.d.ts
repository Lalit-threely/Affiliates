import session from 'express-session';

declare module 'express-session' {
  interface SessionData {
    user: { id: number; name: string; email: string; verified: boolean };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: session.Session & Partial<session.SessionData>;
  }
} 