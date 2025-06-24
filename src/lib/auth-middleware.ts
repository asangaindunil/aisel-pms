import { NextRequest } from 'next/server';
import { verifyToken, extractTokenFromHeader } from '@/lib/jwt';
import { database } from '@/lib/database';
import { JWTPayload } from '@/types/auth';

async function authenticate(request: NextRequest): Promise<JWTPayload | null> {
  const token = extractTokenFromHeader(request.headers.get('authorization'));
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  // Ensure user exists and is active
  const user = await database.getUserById(payload.userId);
  if (!user || user.isDisabled) return null;

  return payload;
}

function withAuth(
  requireAdmin = false
) {
  return <T extends unknown[]>(
    handler: (request: NextRequest, user: JWTPayload, ...args: T) => Promise<Response>
  ) => {
    return async (request: NextRequest, ...args: T) => {
      const user = await authenticate(request);
      if (!user) {
        return Response.json({ success: false, error: 'Unauthorized' }, { status: 401 });
      }
      if (requireAdmin && user.role !== 'admin') {
        return Response.json({ success: false, error: 'Forbidden' }, { status: 403 });
      }
      return handler(request, user, ...args);
    };
  };
}

export const requireAuth = withAuth(false);
export const requireAdmin = withAuth(true);
export { authenticate };
