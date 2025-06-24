'use client';

import React, { useState } from 'react';
import { usePatients } from '@/hooks/usePatients';
import { Patient, CreatePatientData } from '@/types/patient';
import { Header } from '@/components/Header';
import { PatientTable } from '@/components/PatientTable';
import { PatientForm } from '@/components/PatientForm';
import { DeleteConfirmation } from '@/components/DeleteConfirmation';
import { Modal } from '@/components/ui/Modal';

export function Dashboard() {
  const { patients, isLoading, createPatient, updatePatient, deletePatient } = usePatients();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPatient = () => {
    setEditingPatient(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient);
    setIsModalOpen(true);
  };

  const handleDeletePatient = (patient: Patient) => {
    setDeletingPatient(patient);
  };

  const handleSubmitPatient = async (data: CreatePatientData) => {
    try {
      setIsSubmitting(true);
      
      if (editingPatient) {
        await updatePatient(editingPatient.id, data);
      } else {
        await createPatient(data);
      }
      
      setIsModalOpen(false);
      setEditingPatient(null);
    } catch (error) {
      console.error('Error submitting patient:', error);
      // In a real app, you'd show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPatient) return;
    
    try {
      setIsSubmitting(true);
      await deletePatient(deletingPatient.id);
      setDeletingPatient(null);
    } catch (error) {
      console.error('Error deleting patient:', error);
      // In a real app, you'd show a toast notification here
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPatient(null);
  };

  const handleCancelDelete = () => {
    setDeletingPatient(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <PatientTable
          patients={patients}
          isLoading={isLoading}
          onEdit={handleEditPatient}
          onDelete={handleDeletePatient}
          onAdd={handleAddPatient}
        />
      </main>

      {/* Patient Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingPatient ? 'Edit Patient' : 'Add New Patient'}
        size="lg"
      >
        <PatientForm
          patient={editingPatient ?? undefined}
          onSubmit={handleSubmitPatient}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        patient={deletingPatient}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isSubmitting}
      />
    </div>
  );
}