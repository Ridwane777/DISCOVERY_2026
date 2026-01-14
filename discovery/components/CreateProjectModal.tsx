// components/CreateProjectModal.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, UserPlus, Search, User, UserCheck } from 'lucide-react';

// Types
interface Participant {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarColor?: string;
}

interface ProjectFormData {
  name: string;
  description: string;
  sector: string;
  startDate: string;
  endDate: string;
  participants: string[]; // IDs des participants
  status: string;
}

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (projectData: ProjectFormData) => Promise<void> | void;
  loading?: boolean;
  users: Array<{ id: string; name: string; email: string; role: string }>;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit,
  loading = false,
  users = []
}) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    name: '',
    description: '',
    sector: '',
    startDate: '',
    endDate: '',
    participants: [], // IDs des participants sélectionnés
    status: 'Actif',
  });

  const [showNewSector, setShowNewSector] = useState(false);
  const [newSector, setNewSector] = useState('');

  const [allParticipants, setAllParticipants] = useState<Participant[]>([
    { id: '1', name: 'Marie Dubois', email: 'superadmin@luxdev.lu', role: 'super-admin', avatarColor: 'bg-purple-100 text-purple-700' },
    { id: '2', name: 'Sophie Martin', email: 'admin@luxdev.lu', role: 'admin', avatarColor: 'bg-blue-100 text-blue-700' },
    { id: '3', name: 'Jean Dupont', email: 'client@acme-corp.com', role: 'client', avatarColor: 'bg-green-100 text-green-700' },
    { id: '4', name: 'Pierre Lambert', email: 'pierre@techcorp.com', role: 'client', avatarColor: 'bg-yellow-100 text-yellow-700' },
    { id: '5', name: 'Lucie Bernard', email: 'lucie@designstudio.com', role: 'client', avatarColor: 'bg-pink-100 text-pink-700' },
    { id: '6', name: 'Thomas Moreau', email: 'thomas@consulting.fr', role: 'client', avatarColor: 'bg-indigo-100 text-indigo-700' },
  ]);

  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    role: 'client',
  });

  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showParticipantDropdown, setShowParticipantDropdown] = useState(false);

  const [errors, setErrors] = useState<Partial<Record<keyof ProjectFormData, string>>>({});

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (users.length > 0) {
      const userParticipants = users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatarColor: getAvatarColor(user.role)
      }));
      setAllParticipants(prev => [...userParticipants, ...prev.filter(p => !userParticipants.some(up => up.id === p.id))]);
    }
  }, [users]);

  // Gérer la fermeture en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden'; // Empêche le scroll
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset'; // Réactive le scroll
    };
  }, [isOpen]);

  const getAvatarColor = (role: string): string => {
    switch (role) {
      case 'super-admin':
        return 'bg-purple-100 text-purple-700';
      case 'admin':
        return 'bg-blue-100 text-blue-700';
      case 'client':
      default:
        return 'bg-green-100 text-green-700';
    }
  };

  const handleChange = (field: keyof ProjectFormData, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddParticipant = () => {
    if (!newParticipant.name.trim() || !newParticipant.email.trim()) {
      return;
    }

    const newId = Date.now().toString();
    const participant: Participant = {
      id: newId,
      name: newParticipant.name.trim(),
      email: newParticipant.email.trim(),
      role: newParticipant.role,
      avatarColor: getAvatarColor(newParticipant.role)
    };

    setAllParticipants(prev => [...prev, participant]);
    handleChange('participants', [...formData.participants, newId]);
    
    setNewParticipant({
      name: '',
      email: '',
      role: 'client',
    });
    setShowAddParticipant(false);
  };

  const handleToggleParticipant = (participantId: string) => {
    const newParticipants = formData.participants.includes(participantId)
      ? formData.participants.filter(id => id !== participantId)
      : [...formData.participants, participantId];
    
    handleChange('participants', newParticipants);
  };

  const handleRemoveParticipant = (participantId: string) => {
    handleChange('participants', formData.participants.filter(id => id !== participantId));
  };

  const handleAddSector = () => {
    if (newSector.trim()) {
      handleChange('sector', newSector.trim());
      setNewSector('');
      setShowNewSector(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProjectFormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du projet est requis';
    }

    if (!formData.startDate) {
      newErrors.startDate = 'La date de début est requise';
    }

    if (!formData.endDate) {
      newErrors.endDate = 'La date de fin est requise';
    } else if (formData.startDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      newErrors.endDate = 'La date de fin doit être après la date de début';
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
      description: '',
      sector: '',
      startDate: '',
      endDate: '',
      participants: [],
      status: 'Actif',
    });
    setNewSector('');
    setShowNewSector(false);
    setNewParticipant({
      name: '',
      email: '',
      role: 'client',
    });
    setShowAddParticipant(false);
    setSearchQuery('');
    setShowParticipantDropdown(false);
    setErrors({});
    onClose();
  };

  // Empêcher la propagation du clic à l'intérieur du modal
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  const sectors = [
    'E-commerce',
    'Finance',
    'Santé',
    'Éducation',
    'Technologie',
    'Immobilier',
    'Transport',
    'Tourisme',
    'Agroalimentaire',
    'Manufacturing'
  ];

  const statusOptions = ['Actif', 'Inactif', 'En pause', 'Terminé', 'Annulé'];

  const roleOptions = ['client', 'admin', 'super-admin', 'collaborator'];

  const filteredParticipants = allParticipants.filter(participant =>
    participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    participant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedParticipants = allParticipants.filter(p => 
    formData.participants.includes(p.id)
  );

  const availableParticipants = allParticipants.filter(p => 
    !formData.participants.includes(p.id)
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-opacity-30 backdrop-blur-sm transition-opacity"
        onClick={handleClose} // Ferme au clic sur le backdrop
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          ref={modalRef}
          className="relative w-full max-w-2xl transform overflow-hidden rounded-xl bg-white shadow-xl transition-all"
          onClick={handleModalClick} // Empêche la propagation du clic
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Nouveau projet</h2>
              <button
                type="button" // Important: spécifier type="button" pour éviter la soumission du formulaire
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
              {/* Nom du projet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom du projet *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: Refonte site web"
                />
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
                  placeholder="Description du projet..."
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Date de début */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de début *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.startDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.startDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.startDate}</p>
                  )}
                </div>

                {/* Date de fin */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de fin *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${
                      errors.endDate ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.endDate && (
                    <p className="mt-1 text-xs text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>

              {/* Secteur d'activité */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Secteur d'activité
                </label>
                <div className="space-y-3">
                  <select
                    value={formData.sector}
                    onChange={(e) => {
                      if (e.target.value === 'nouveau') {
                        setShowNewSector(true);
                      } else {
                        handleChange('sector', e.target.value);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  >
                    <option value="">Aucun secteur</option>
                    {sectors.map((sector) => (
                      <option key={sector} value={sector}>{sector}</option>
                    ))}
                    <option value="nouveau">+ Nouveau secteur</option>
                  </select>
                  
                  {showNewSector && (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newSector}
                        onChange={(e) => setNewSector(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Nom du nouveau secteur"
                      />
                      <button
                        type="button"
                        onClick={handleAddSector}
                        className="px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        Ajouter
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Participants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Participants
                </label>
                
                {/* Participants sélectionnés */}
                <div className="space-y-2 mb-4">
                  {selectedParticipants.map((participant) => (
                    <div
                      key={participant.id}
                      className="p-3 border border-gray-200 rounded-lg flex items-center justify-between bg-gray-50"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${participant.avatarColor}`}>
                          <span className="text-sm font-medium">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{participant.name}</p>
                          <p className="text-sm text-gray-500">
                            {participant.email} • {participant.role}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-red-500"
                        onClick={() => handleRemoveParticipant(participant.id)}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Ajouter un participant */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setShowParticipantDropdown(true);
                        }}
                        onFocus={() => setShowParticipantDropdown(true)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Rechercher un participant..."
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddParticipant(true)}
                      className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2"
                    >
                      <UserPlus className="w-4 h-4" />
                      Nouveau
                    </button>
                  </div>

                  {/* Dropdown de participants disponibles */}
                  {showParticipantDropdown && searchQuery && availableParticipants.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredParticipants
                        .filter(p => !formData.participants.includes(p.id))
                        .map((participant) => (
                          <div
                            key={participant.id}
                            onClick={() => {
                              handleToggleParticipant(participant.id);
                              setSearchQuery('');
                              setShowParticipantDropdown(false);
                            }}
                            className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${participant.avatarColor}`}>
                                <span className="text-sm font-medium">
                                  {participant.name.split(' ').map(n => n[0]).join('')}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{participant.name}</p>
                                <p className="text-sm text-gray-500">
                                  {participant.email} • {participant.role}
                                </p>
                              </div>
                            </div>
                            <button
                              type="button"
                              className="text-gray-400 hover:text-indigo-600"
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                    </div>
                  )}
                </div>

                {/* Formulaire nouveau participant */}
                {showAddParticipant && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h4 className="text-sm font-medium text-gray-900 mb-3">Ajouter un nouveau participant</h4>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Nom
                          </label>
                          <input
                            type="text"
                            value={newParticipant.name}
                            onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Nom complet"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <input
                            type="email"
                            value={newParticipant.email}
                            onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="email@exemple.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Rôle
                        </label>
                        <select
                          value={newParticipant.role}
                          onChange={(e) => setNewParticipant(prev => ({ ...prev, role: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        >
                          {roleOptions.map((role) => (
                            <option key={role} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleAddParticipant}
                          disabled={!newParticipant.name.trim() || !newParticipant.email.trim()}
                          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                        >
                          Ajouter le participant
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowAddParticipant(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Statut */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button" // Important: spécifier type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                disabled={loading}
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Création...' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProjectModal;
