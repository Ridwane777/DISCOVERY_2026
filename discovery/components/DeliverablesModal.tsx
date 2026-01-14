// components/AddDeliverableModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, FileText, Calendar, User, Folder } from 'lucide-react';

// Types
interface DeliverableFormData {
  name: string;
  projectId: string;
  format: string;
  deadline: string;
  assignedTo: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  client?: string;
}

interface UserType {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AddDeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deliverableData: DeliverableFormData) => Promise<void> | void;
  loading?: boolean;
  projects: Project[];
  users: UserType[];
  currentUserRole: 'super_admin' | 'admin' | 'user';
}

const AddDeliverableModal: React.FC<AddDeliverableModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  projects = [],
  users = [],
  currentUserRole
}) => {
  const [formData, setFormData] = useState<DeliverableFormData>({
    name: '',
    projectId: '',
    format: '',
    deadline: '',
    assignedTo: '',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof DeliverableFormData, string>>>({});
  const modalRef = useRef<HTMLDivElement>(null);

  // Formats de fichiers disponibles
  const formatOptions = [
    '.pdf', '.docx', '.xlsx', '.pptx', '.jpg', '.png', 
    '.zip', '.fig', '.sketch', '.ai', '.psd', '.mp4',
    '.json', '.xml', '.csv', '.txt', '.md'
  ];

  // Gérer la fermeture en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Filtrer les utilisateurs selon le rôle
  const getAvailableUsers = () => {
    if (currentUserRole === 'super_admin' || currentUserRole === 'admin') {
      // Admins peuvent assigner à tous les utilisateurs
      return users.filter(user => user.role === 'user' || user.role === 'client');
    } else {
      // Les utilisateurs normaux ne peuvent s'assigner qu'à eux-mêmes
      return users.filter(user => user.role === 'user' || user.role === 'client');
    }
  };

  const handleChange = (field: keyof DeliverableFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof DeliverableFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du livrable est requis';
    }

    if (!formData.projectId) {
      newErrors.projectId = 'Un projet doit être sélectionné';
    }

    if (!formData.format) {
      newErrors.format = 'Le format est requis';
    }

    if (!formData.deadline) {
      newErrors.deadline = 'La date limite est requise';
    } else if (new Date(formData.deadline) < new Date()) {
      newErrors.deadline = 'La date limite doit être dans le futur';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Un assignataire doit être sélectionné';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    await onSubmit(formData);
    
    if (!loading) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      projectId: '',
      format: '',
      deadline: '',
      assignedTo: '',
      description: '',
    });
    setErrors({});
    onClose();
  };

  // Empêcher la propagation du clic à l'intérieur du modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (!isOpen) return null;

  const availableUsers = getAvailableUsers();
  const selectedProject = projects.find(p => p.id === formData.projectId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
          onClick={handleModalClick}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Ajouter un livrable</h2>
                  <p className="text-sm text-gray-500">Configurez les détails du nouveau livrable</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Informations de base */}
              <div className="space-y-4">
                {/* Nom du livrable */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom du livrable *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Ex: Rapport de conception"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-1 text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="Décrivez le livrable et ses spécificités..."
                  />
                </div>
              </div>

              {/* Projet et Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Projet */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Projet associé *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Folder className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.projectId}
                      onChange={(e) => handleChange('projectId', e.target.value)}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white ${
                        errors.projectId ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez un projet</option>
                      {projects.map((project) => (
                        <option key={project.id} value={project.id}>
                          {project.name} {project.client && `- ${project.client}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.projectId && (
                    <p className="mt-1 text-xs text-red-600">{errors.projectId}</p>
                  )}
                </div>

                {/* Format */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Format requis *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.format}
                      onChange={(e) => handleChange('format', e.target.value)}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white ${
                        errors.format ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez un format</option>
                      {formatOptions.map((format) => (
                        <option key={format} value={format}>
                          {format}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.format && (
                    <p className="mt-1 text-xs text-red-600">{errors.format}</p>
                  )}
                </div>
              </div>

              {/* Date limite et Assigné à */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date limite */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date limite *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => handleChange('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                        errors.deadline ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                  </div>
                  {errors.deadline && (
                    <p className="mt-1 text-xs text-red-600">{errors.deadline}</p>
                  )}
                </div>

                {/* Assigné à */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigné à *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      value={formData.assignedTo}
                      onChange={(e) => handleChange('assignedTo', e.target.value)}
                      className={`w-full pl-10 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white ${
                        errors.assignedTo ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez un utilisateur</option>
                      {availableUsers.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name} ({user.email}) - {user.role}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.assignedTo && (
                    <p className="mt-1 text-xs text-red-600">{errors.assignedTo}</p>
                  )}
                </div>
              </div>

              {/* Informations supplémentaires */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Informations supplémentaires</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">i</span>
                    </div>
                    <span>Le livrable sera créé avec le statut "En attente"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded flex items-center justify-center">
                      <span className="text-xs font-medium text-blue-700">i</span>
                    </div>
                    <span>Des notifications seront envoyées à l'assignataire</span>
                  </div>
                  {selectedProject && (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-100 rounded flex items-center justify-center">
                        <span className="text-xs font-medium text-green-700">✓</span>
                      </div>
                      <span>Projet sélectionné: <strong>{selectedProject.name}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Création...
                  </>
                ) : (
                  <>
                    <FileText className="w-5 h-5" />
                    Créer le livrable
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddDeliverableModal;
