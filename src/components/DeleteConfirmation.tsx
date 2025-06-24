'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Patient } from '@/types/patient';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';

interface DeleteConfirmationProps {
  patient: Patient | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading: boolean;
}

export function DeleteConfirmation({ patient, onConfirm, onCancel, isLoading }: DeleteConfirmationProps) {
  if (!patient) return null;

  return (
    <Modal
      isOpen={!!patient}
      onClose={onCancel}
      title="Delete Patient"
      size="sm"
    >
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600" />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Are you sure?
        </h3>
        
        <p className="text-sm text-gray-500 mb-6">
          You are about to delete <strong>{patient.firstName} {patient.lastName}</strong>. 
          This action cannot be undone.
        </p>

        <div className="flex justify-center space-x-4">
          <Button
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            Delete Patient
          </Button>
        </div>
      </div>
    </Modal>
  );
}