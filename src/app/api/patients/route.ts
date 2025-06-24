import { NextRequest } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { database } from '@/lib/database';
import { patientSchema } from '@/lib/validation';
import { ApiResponse, Patient } from '@/types/patient';

export const GET = requireAuth(async () => {
  try {
    const patients = database.getAllPatients();
    
    return Response.json({
      success: true,
      data: patients,
    } as ApiResponse<Patient[]>);

  } catch (error) {
    console.error('Get patients error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse, { status: 500 });
  }
});

export const POST = requireAdmin(async (request: NextRequest) => {
  try {
    const body = await request.json();
    
    // Validate input
    const validation = patientSchema.safeParse(body);
    if (!validation.success) {
      return Response.json({
        success: false,
        error: 'Invalid input',
        message: validation.error.errors[0].message,
      } as ApiResponse, { status: 400 });
    }

    // Check if email already exists
    const existingPatients = database.getAllPatients();
    if (existingPatients.some(p => p.email === validation.data.email)) {
      return Response.json({
        success: false,
        error: 'Email already exists',
      } as ApiResponse, { status: 409 });
    }

    const newPatient = database.createPatient(validation.data);
    
    return Response.json({
      success: true,
      data: newPatient,
      message: 'Patient created successfully',
    } as ApiResponse<Patient>, { status: 201 });

  } catch (error) {
    console.error('Create patient error:', error);
    return Response.json({
      success: false,
      error: 'Internal server error',
    } as ApiResponse, { status: 500 });
  }
});