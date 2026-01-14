'use client';

import { Calendar, Users, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  status: 'active' | 'completed' | 'pending';
  usersCount: number;
  filesCount: number;
  pendingFiles: number;
  overdueFiles: number;
}

export default function ProjectCard({
  name,
  description,
  startDate,
  endDate,
  status,
  usersCount,
  filesCount,
  pendingFiles,
  overdueFiles,
}: ProjectCardProps) {
  const statusColors = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-blue-100 text-blue-800',
    pending: 'bg-yellow-100 text-yellow-800',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      {/* En-tête du projet */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-900">{name}</h3>
          <p className="text-gray-600 text-sm mt-1">{description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
          {status === 'active' ? 'Actif' : status === 'completed' ? 'Terminé' : 'En attente'}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center text-gray-500 text-sm mb-4">
        <Calendar size={16} className="mr-2" />
        <span>
          {format(startDate, 'dd MMM yyyy', { locale: fr })} - {format(endDate, 'dd MMM yyyy', { locale: fr })}
        </span>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center">
          <Users size={18} className="text-gray-400 mr-2" />
          <div>
            <p className="font-semibold">{usersCount}</p>
            <p className="text-xs text-gray-500">Utilisateurs</p>
          </div>
        </div>
        <div className="flex items-center">
          <FileText size={18} className="text-gray-400 mr-2" />
          <div>
            <p className="font-semibold">{filesCount}</p>
            <p className="text-xs text-gray-500">Fichiers</p>
          </div>
        </div>
      </div>

      {/* État des fichiers */}
      <div className="space-y-2">
        {pendingFiles > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <Clock size={16} className="text-amber-500 mr-2" />
              <span className="text-gray-600">En attente</span>
            </div>
            <span className="font-semibold">{pendingFiles}</span>
          </div>
        )}
        
        {overdueFiles > 0 && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <AlertCircle size={16} className="text-red-500 mr-2" />
              <span className="text-gray-600">En retard</span>
            </div>
            <span className="font-semibold text-red-600">{overdueFiles}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3 mt-6">
        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
          Voir détails
        </button>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">
          Éditer
        </button>
      </div>
    </div>
  );
}
