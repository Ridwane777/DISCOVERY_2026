// app/dashboard/user/page.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Folder, 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  Upload,
  TrendingUp,
  ChevronRight,
  ArrowUpRight,
  FileUp,
  AlertTriangle
} from 'lucide-react';

// Types
interface StatCardProps {
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
}

interface Project {
  id: string;
  name: string;
  status: 'active' | 'completed' | 'delayed';
  deliverablesCount: number;
  pendingDeliverables: number;
  nextDeadline: string;
  adminContact: string;
}

interface Deliverable {
  id: string;
  name: string;
  project: string;
  deadline: string;
  status: 'pending' | 'uploaded' | 'late' | 'upcoming';
  format: string;
  fileSize?: string;
  uploadedAt?: string;
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({ title, value, change, changeType, icon, iconBgColor }) => {
  const changeColor = 
    changeType === 'positive' ? 'text-green-600' : 
    changeType === 'negative' ? 'text-red-600' : 
    'text-gray-600';
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 mb-2">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          <div className={`text-sm mt-2 font-medium ${changeColor}`}>{change}</div>
        </div>
        <div className={`w-14 h-14 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Deliverable Card Component
const DeliverableCard: React.FC<{ 
  deliverable: Deliverable;
  onUpload: (id: string) => void;
}> = ({ deliverable, onUpload }) => {
  const statusConfig = {
    pending: { 
      color: 'bg-yellow-100 text-yellow-800', 
      icon: <Clock className="w-4 h-4" />,
      label: 'En attente',
      action: 'Uploader'
    },
    uploaded: { 
      color: 'bg-green-100 text-green-800', 
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Reçu',
      action: 'Voir'
    },
    late: { 
      color: 'bg-red-100 text-red-800', 
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'En retard',
      action: 'Uploader'
    },
    upcoming: { 
      color: 'bg-blue-100 text-blue-800', 
      icon: <Calendar className="w-4 h-4" />,
      label: 'À venir',
      action: 'Préparer'
    }
  };

  const status = statusConfig[deliverable.status];
  const isUploaded = deliverable.status === 'uploaded';
  const isLate = deliverable.status === 'late';
  const canUpload = deliverable.status === 'pending' || deliverable.status === 'late';

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 ${isLate ? 'bg-red-50' : isUploaded ? 'bg-green-50' : 'bg-gray-50'} rounded-lg flex items-center justify-center`}>
            <FileText className={`w-5 h-5 ${isLate ? 'text-red-600' : isUploaded ? 'text-green-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{deliverable.name}</h4>
            <p className="text-sm text-gray-500">{deliverable.project}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
          {status.icon}
          {status.label}
        </span>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
        <div>
          <p className="text-gray-500">Format</p>
          <p className="font-medium text-gray-900">{deliverable.format}</p>
        </div>
        <div>
          <p className="text-gray-500">Date limite</p>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className={`font-medium ${isLate ? 'text-red-600' : 'text-gray-900'}`}>
              {deliverable.deadline}
            </span>
          </div>
        </div>
      </div>
      
      {deliverable.uploadedAt ? (
        <div className="text-sm text-gray-500 mb-3">
          Uploadé le: <span className="font-medium text-gray-900">{deliverable.uploadedAt}</span>
          {deliverable.fileSize && (
            <span className="ml-2">• {deliverable.fileSize}</span>
          )}
        </div>
      ) : (
        <div className="text-sm text-gray-500 mb-3">
          Aucun fichier uploadé
        </div>
      )}
      
      <div className="flex items-center justify-between">
        {canUpload ? (
          <button 
            onClick={() => onUpload(deliverable.id)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Upload className="w-4 h-4" />
            {status.action}
          </button>
        ) : isUploaded ? (
          <button 
            onClick={() => console.log('Voir fichier')}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            Voir fichier
          </button>
        ) : (
          <button 
            onClick={() => console.log('Préparer')}
            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <Calendar className="w-4 h-4" />
            Préparer
          </button>
        )}
        
        <button className="text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

// Main User Dashboard Component
const UserDashboardPage: React.FC = () => {
  const [userRole] = useState<'super_admin' | 'admin' | 'user'>('user');
  
  // Données d'exemple
  const projects: Project[] = [
    {
      id: '1',
      name: 'Site E-commerce Luxe',
      status: 'active',
      deliverablesCount: 5,
      pendingDeliverables: 2,
      nextDeadline: 'Demain',
      adminContact: 'Sophie Martin'
    },
    {
      id: '2',
      name: 'Application Mobile',
      status: 'active',
      deliverablesCount: 3,
      pendingDeliverables: 1,
      nextDeadline: '15 Mars',
      adminContact: 'Thomas Leroy'
    }
  ];

  const deliverables: Deliverable[] = [
    {
      id: '1',
      name: 'Rapport de conception',
      project: 'Site E-commerce Luxe',
      deadline: 'Aujourd\'hui',
      status: 'pending',
      format: '.pdf'
    },
    {
      id: '2',
      name: 'Maquettes UI/UX',
      project: 'Site E-commerce Luxe',
      deadline: 'Hier',
      status: 'late',
      format: '.fig'
    },
    {
      id: '3',
      name: 'Documentation technique',
      project: 'Application Mobile',
      deadline: '15 Mars',
      status: 'upcoming',
      format: '.docx'
    },
    {
      id: '4',
      name: 'Rapport de test',
      project: 'Site E-commerce Luxe',
      deadline: '10 Février',
      status: 'uploaded',
      format: '.xlsx',
      uploadedAt: '08/02/2024',
      fileSize: '2.1 MB'
    }
  ];

  const userData = {
    name: 'Jean Dupont',
    email: 'client@acme-corp.com',
    role: userRole
  };

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
  };

  const handleUpload = (id: string) => {
    console.log('Upload livrable:', id);
    // Ouvrir modal d'upload
  };

  const pendingDeliverables = deliverables.filter(d => d.status === 'pending').length;
  const lateDeliverables = deliverables.filter(d => d.status === 'late').length;
  const upcomingDeliverables = deliverables.filter(d => d.status === 'upcoming').length;
  const completedDeliverables = deliverables.filter(d => d.status === 'uploaded').length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeRoute="/dashboard" userRole={userRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={userData}
          notificationCount={2}
          onSearchChange={handleSearch}
        />
        
        {/* Dashboard Content */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Tableau de bord Client</h1>
                <p className="text-gray-600 mt-1">Suivez vos livrables et échéances</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Livrables en attente"
                value={pendingDeliverables}
                change="À uploader"
                changeType={pendingDeliverables > 0 ? 'negative' : 'positive'}
                icon={<Clock className="w-6 h-6 text-yellow-600" />}
                iconBgColor="bg-yellow-50"
              />
              <StatCard
                title="En retard"
                value={lateDeliverables}
                change="À régulariser"
                changeType={lateDeliverables > 0 ? 'negative' : 'positive'}
                icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
                iconBgColor="bg-red-50"
              />
              <StatCard
                title="À venir"
                value={upcomingDeliverables}
                change="Prochainement"
                changeType="neutral"
                icon={<Calendar className="w-6 h-6 text-blue-600" />}
                iconBgColor="bg-blue-50"
              />
              <StatCard
                title="Complétés"
                value={completedDeliverables}
                change="Livrés à temps"
                changeType="positive"
                icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                iconBgColor="bg-green-50"
              />
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Mes projets */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Mes projets</h2>
                    <p className="text-sm text-gray-500 mt-1">Projets où vous êtes impliqué</p>
                  </div>
                  <a 
                    href="/projects"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    Voir tout
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                            <Folder className="w-5 h-5 text-indigo-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{project.name}</h4>
                            <span className="text-sm text-gray-500">
                              {project.deliverablesCount} livrable{project.deliverablesCount !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          project.status === 'active' ? 'bg-green-100 text-green-800' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {project.status === 'active' ? 'Actif' : 
                           project.status === 'completed' ? 'Terminé' : 'En retard'}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-500">En attente</p>
                          <p className="font-medium text-gray-900">{project.pendingDeliverables}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Prochaine échéance</p>
                          <p className="font-medium text-gray-900">{project.nextDeadline}</p>
                        </div>
                      </div>
                      
                      <div className="text-sm text-gray-500">
                        Contact: <span className="font-medium text-gray-900">{project.adminContact}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Livrables à traiter */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Livrables à traiter</h2>
                    <p className="text-sm text-gray-500 mt-1">Priorité et actions requises</p>
                  </div>
                  <a 
                    href="/deliverables"
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1"
                  >
                    Voir tout
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                
                <div className="space-y-4">
                  {deliverables
                    .filter(d => d.status !== 'uploaded')
                    .map((deliverable) => (
                      <DeliverableCard 
                        key={deliverable.id} 
                        deliverable={deliverable}
                        onUpload={handleUpload}
                      />
                    ))}
                </div>
              </div>
            </div>

            {/* Upload Instructions */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-6 text-white">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-3">Comment uploader vos fichiers</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium">Sélectionnez</p>
                        <p className="text-sm text-gray-300">Choisissez le livrable</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium">Vérifiez</p>
                        <p className="text-sm text-gray-300">Format et nom du fichier</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium">Upload</p>
                        <p className="text-sm text-gray-300">Déposez votre fichier</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm">
                    <AlertTriangle className="w-4 h-4 inline mr-1" />
                    Même en retard, vous pouvez toujours uploader vos fichiers. Ils seront marqués comme "En retard".
                  </p>
                </div>
                <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardPage;
