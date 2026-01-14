// app/dashboard/admin/page.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Folder, 
  Users, 
  FileText, 
  Clock, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  Download,
  Eye,
  ArrowUpRight,
  ChevronRight
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
  assignedUsers: number;
  deliverablesCount: number;
  pendingDeliverables: number;
  deadline: string;
}

interface Deliverable {
  id: string;
  name: string;
  project: string;
  deadline: string;
  status: 'pending' | 'uploaded' | 'late';
  assignedTo: string;
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

// Project Card Component
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  const statusConfig = {
    active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
    completed: { color: 'bg-blue-100 text-blue-800', label: 'Terminé' },
    delayed: { color: 'bg-red-100 text-red-800', label: 'En retard' }
  };

  const status = statusConfig[project.status];

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:border-indigo-300 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Folder className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{project.name}</h4>
            <span className={`text-xs px-2 py-1 rounded-full ${status.color}`}>
              {status.label}
            </span>
          </div>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Livrables</p>
          <p className="font-medium text-gray-900">{project.deliverablesCount}</p>
        </div>
        <div>
          <p className="text-gray-500">En attente</p>
          <p className="font-medium text-gray-900">{project.pendingDeliverables}</p>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{project.deadline}</span>
        </div>
        <span className="text-gray-500">{project.assignedUsers} personnes</span>
      </div>
    </div>
  );
};

// Deliverable Card Component
const DeliverableCard: React.FC<{ deliverable: Deliverable }> = ({ deliverable }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800', icon: <Clock className="w-4 h-4" /> },
    uploaded: { color: 'bg-green-100 text-green-800', icon: <CheckCircle className="w-4 h-4" /> },
    late: { color: 'bg-red-100 text-red-800', icon: <AlertCircle className="w-4 h-4" /> }
  };

  const status = statusConfig[deliverable.status];

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900">{deliverable.name}</h4>
            <p className="text-sm text-gray-500">{deliverable.project}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${status.color}`}>
          {status.icon}
          {deliverable.status === 'pending' ? 'En attente' : 
           deliverable.status === 'uploaded' ? 'Reçu' : 'En retard'}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="text-gray-500">
          Assigné à: <span className="font-medium text-gray-900">{deliverable.assignedTo}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500">
          <Calendar className="w-4 h-4" />
          <span>{deliverable.deadline}</span>
        </div>
      </div>
    </div>
  );
};

// Main Admin Dashboard Component
const AdminDashboardPage: React.FC = () => {
  const [userRole] = useState<'super_admin' | 'admin' | 'user'>('admin');
  
  // Données d'exemple
  const projects: Project[] = [
    {
      id: '1',
      name: 'Site E-commerce',
      status: 'active',
      assignedUsers: 3,
      deliverablesCount: 8,
      pendingDeliverables: 2,
      deadline: '15 Mars 2024'
    },
    {
      id: '2',
      name: 'App Mobile',
      status: 'delayed',
      assignedUsers: 2,
      deliverablesCount: 5,
      pendingDeliverables: 1,
      deadline: '10 Février 2024'
    },
    {
      id: '3',
      name: 'Dashboard Analytics',
      status: 'completed',
      assignedUsers: 1,
      deliverablesCount: 3,
      pendingDeliverables: 0,
      deadline: '20 Janvier 2024'
    }
  ];

  const deliverables: Deliverable[] = [
    {
      id: '1',
      name: 'Rapport de conception',
      project: 'Site E-commerce',
      deadline: 'Aujourd\'hui',
      status: 'pending',
      assignedTo: 'Jean Dupont'
    },
    {
      id: '2',
      name: 'Maquettes UI',
      project: 'App Mobile',
      deadline: 'Hier',
      status: 'late',
      assignedTo: 'Sophie Martin'
    },
    {
      id: '3',
      name: 'Documentation API',
      project: 'Dashboard Analytics',
      deadline: '15 Jan',
      status: 'uploaded',
      assignedTo: 'Thomas Leroy'
    }
  ];

  const userData = {
    name: 'Sophie Martin',
    email: 'admin@luxdev.lu',
    role: userRole
  };

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeRoute="/dashboard" userRole={userRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={userData}
          notificationCount={3}
          onSearchChange={handleSearch}
        />
        
        {/* Dashboard Content */}
        <div className="flex-1 bg-gray-50 overflow-auto">
          <div className="p-8">
            {/* Page Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
                <p className="text-gray-600 mt-1">Vue d'ensemble de vos projets assignés</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Projets assignés"
                value={projects.length}
                change="+1 cette semaine"
                changeType="positive"
                icon={<Folder className="w-6 h-6 text-indigo-600" />}
                iconBgColor="bg-indigo-50"
              />
              <StatCard
                title="Livrables en attente"
                value={deliverables.filter(d => d.status === 'pending').length}
                change="2 à traiter"
                changeType="negative"
                icon={<FileText className="w-6 h-6 text-yellow-600" />}
                iconBgColor="bg-yellow-50"
              />
              <StatCard
                title="Fichiers en retard"
                value={deliverables.filter(d => d.status === 'late').length}
                change="À relancer"
                changeType="negative"
                icon={<Clock className="w-6 h-6 text-red-600" />}
                iconBgColor="bg-red-50"
              />
              <StatCard
                title="Taux de complétion"
                value={75}
                change="+5% cette semaine"
                changeType="positive"
                icon={<TrendingUp className="w-6 h-6 text-green-600" />}
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
                    <p className="text-sm text-gray-500 mt-1">Projets qui vous sont assignés</p>
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
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </div>

              {/* Livrables urgents */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Livrables urgents</h2>
                    <p className="text-sm text-gray-500 mt-1">À traiter en priorité</p>
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
                  {deliverables.map((deliverable) => (
                    <DeliverableCard key={deliverable.id} deliverable={deliverable} />
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Activité récente</h2>
                <p className="text-sm text-gray-500 mt-1">Les dernières actions sur vos projets</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <FileText className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      <span className="font-medium">Jean Dupont</span> a uploadé le fichier "rapport-conception.pdf"
                    </p>
                    <p className="text-sm text-gray-500">Il y a 2 heures • Projet: Site E-commerce</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      Échéance manquée pour "maquettes-ui.fig"
                    </p>
                    <p className="text-sm text-gray-500">Il y a 1 jour • Projet: App Mobile</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">
                      Vous avez été assigné au projet "Dashboard Analytics"
                    </p>
                    <p className="text-sm text-gray-500">Il y a 3 jours</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
