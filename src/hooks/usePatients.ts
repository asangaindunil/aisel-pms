'use client';

import { useState, useEffect, useCallback } from 'react';
import { Patient, CreatePatientData, ApiResponse } from '@/types/patient';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    };
  };

  const fetchPatients = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/patients', {
        headers: getAuthHeaders(),
      });

      const data: ApiResponse<Patient[]> = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to fetch patients');
      }

      setPatients(data.data || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createPatient = async (patientData: CreatePatientData): Promise<Patient> => {
    const response = await fetch('/api/patients', {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(patientData),
    });

    const data: ApiResponse<Patient> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to create patient');
    }

    if (data.data) {
      // Optimistic update
      setPatients(prev => [...prev, data.data!]);
      return data.data;
    }

    throw new Error('No patient data returned');
  };

  const updatePatient = async (id: number, patientData: Partial<CreatePatientData>): Promise<Patient> => {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(patientData),
    });

    const data: ApiResponse<Patient> = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to update patient');
    }

    if (data.data) {
      // Optimistic update
      setPatients(prev => prev.map(p => p.id === id ? data.data! : p));
      return data.data;
    }

    throw new Error('No patient data returned');
  };

  const deletePatient = async (id: number): Promise<void> => {
    const response = await fetch(`/api/patients/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });

    const data: ApiResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Failed to delete patient');
    }

    // Optimistic update
    setPatients(prev => prev.filter(p => p.id !== id));
  };

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  return {
    patients,
    isLoading,
    error,
    refetch: fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
  };
}