import { NextRequest } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';
import { database } from '@/lib/database';
import { ApiResponse } from '@/types/patient';

export const GET = requireAuth(async (request: NextRequest, authUser) => {
  try {
    const user = database.getUserById(authUser.userId);
    
    if (!user) {
      return Response.json({
        success: false,
        error: 'User not found',
      } as ApiResponse, { status: 404 });
    }

    return Response.json({
      success: true,
      data: user,
    } as ApiResponse);

  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse, { status: 500 });
  }
});