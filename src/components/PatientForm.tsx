'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Patient, CreatePatientData } from '@/types/patient';
import { patientSchema, PatientFormData } from '@/lib/validation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface PatientFormProps {
  patient?: Patient;
  onSubmit: (data: CreatePatientData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PatientForm({ patient, onSubmit, onCancel, isLoading = false }: PatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: patient ? {
      firstName: patient.firstName,
      lastName: patient.lastName,
      email: patient.email,
      phoneNumber: patient.phoneNumber,
      dob: patient.dob,
    } : undefined,
  });

  const handleFormSubmit = async (data: PatientFormData) => {
    await onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          placeholder="Enter first name"
          {...register('firstName')}
          error={errors.firstName?.message}
        />

        <Input
          label="Last Name"
          placeholder="Enter last name"
          {...register('lastName')}
          error={errors.lastName?.message}
        />
      </div>

      <Input
        label="Email"
        type="email"
        placeholder="Enter email address"
        {...register('email')}
        error={errors.email?.message}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter phone number"
          {...register('phoneNumber')}
          error={errors.phoneNumber?.message}
        />

        <Input
          label="Date of Birth"
          type="date"
          {...register('dob')}
          error={errors.dob?.message}
        />
      </div>

      <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
        >
          {patient ? 'Update Patient' : 'Create Patient'}
        </Button>
      </div>
    </form>
  );
}