import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { database } from '@/lib/database';
import { signToken } from '@/lib/jwt';
import { loginSchema } from '@/lib/validation';
import { ApiResponse, AuthResponse } from '@/types/patient';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = loginSchema.safeParse(body);
    console.log('Login request body:', body);
    console.log('Login validation result:', validation);
    if (!validation.success) {
      return Response.json({
        success: false,
        error: 'Invalid input',
        message: validation.error.errors[0].message,
      } as ApiResponse, { status: 400 });
    }

    const { username, password } = validation.data;

    // Find user
    const user = database.getUserByUsername(username);
    if (!user) {
      return Response.json({
        success: false,
        error: 'Invalid credentials',
      } as ApiResponse, { status: 401 });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return Response.json({
        success: false,
        error: 'Invalid credentials',
      } as ApiResponse, { status: 401 });
    }

    // Generate token
    const token = signToken({
      userId: user.id,
      username: user.username,
      role: user.role,
    });

    // Return user without password hash
    const {...userWithoutPassword } = user;

    return Response.json({
      success: true,
      data: {
        token,
        user: userWithoutPassword,
      },
    } as ApiResponse<AuthResponse>);

  } catch (error) {
    console.error('Login error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse, { status: 500 });
  }
}