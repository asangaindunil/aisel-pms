import { NextRequest } from 'next/server';
import { requireAuth, requireAdmin } from '@/lib/auth-middleware';
import { database } from '@/lib/database';
import { patientSchema } from '@/lib/validation';
import { ApiResponse, Patient } from '@/types/patient';

interface RouteParams {
  params: { id: string };
}

function parsePatientId(params: RouteParams['params']): number | null {
  if (!params || typeof params.id !== 'string') return null;
  const id = parseInt(params.id, 10);
  return isNaN(id) || id <= 0 ? null : id;
}

function jsonError(error: string, status = 400, extra: object = {}) {
  return Response.json({ success: false, error, ...extra }, { status });
}

export const GET = requireAuth(async (_req: NextRequest, _user, { params }: RouteParams) => {
  const patientId = parsePatientId(params);
  if (!patientId) return jsonError('Invalid patient ID');
  let patient: Patient | null = null;
  try {
    patient = database.getPatientById(patientId);
  } catch (e) {
    return jsonError('Database error', 500, { details: (e as Error).message });
  }
  if (!patient) return jsonError('Patient not found', 404);
  return Response.json({ success: true, data: patient } as ApiResponse<Patient>);
});

export const PUT = requireAdmin(async (request: NextRequest, _user, { params }: RouteParams) => {
  const patientId = parsePatientId(params);
  if (!patientId) return jsonError('Invalid patient ID');
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError('Invalid JSON body', 400);
  }
  if (!body || typeof body !== 'object') {
    return jsonError('Request body must be an object', 400);
  }
  const validation = patientSchema.partial().safeParse(body);
  if (!validation.success) {
    return jsonError('Invalid input', 400, { message: validation.error.errors[0]?.message || 'Validation failed' });
  }
  if (Object.keys(validation.data).length === 0) {
    return jsonError('No fields to update', 400);
  }
  if (validation.data.email) {
    const exists = database.getAllPatients().some(
      p => p.email === validation.data.email && p.id !== patientId
    );
    if (exists) return jsonError('Email already exists', 409);
  }
  let updated: Patient | null = null;
  try {
    updated = database.updatePatient(patientId, validation.data);
  } catch (e) {
    return jsonError('Database error', 500, { details: (e as Error).message });
  }
  if (!updated) return jsonError('Patient not found', 404);
  return Response.json({
    success: true,
    data: updated,
    message: 'Patient updated successfully',
  } as ApiResponse<Patient>);
});

export const DELETE = requireAdmin(async (_req: NextRequest, _user, { params }: RouteParams) => {
  const patientId = parsePatientId(params);
  if (!patientId) return jsonError('Invalid patient ID');
  let deleted: boolean = false;
  try {
    deleted = database.deletePatient(patientId);
  } catch (e) {
    return jsonError('Database error', 500, { details: (e as Error).message });
  }
  if (!deleted) return jsonError('Patient not found', 404);
  return Response.json({ success: true, message: 'Patient deleted successfully' } as ApiResponse);
});
