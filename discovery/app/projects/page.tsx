'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CreateProjectModal from '@/components/CreateProjectModal';
import {
  Search,
  Filter,
  Plus,
  Folder,
  CheckCircle,
  PauseCircle,
  Clock,
  MoreVertical,
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Users,
  FileText
} from 'lucide-react';

// Types
interface Project {
  id: string;
  name: string;
  description: string;
  sector: string;
  status: 'active' | 'completed' | 'paused';
  deliveryDate: string;
  adminCount: number;
  userCount: number;
  deliverablesCount: number;
  pendingDeliverables: number;
  createdAt: string;
}

interface StatCardProps {
  title: string;
  value: number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
}

interface FilterOption {
  value: string;
  label: string;
}

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  iconBgColor
}) => {
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
          {change && (
            <div className={`text-sm mt-2 font-medium ${changeColor}`}>
              {change}
            </div>
          )}
        </div>
        <div className={`w-14 h-14 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Project Card Component
interface ProjectCardProps {
  project: Project;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView, onEdit, onDelete }) => {
  const statusConfig = {
    active: {
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Actif'
    },
    completed: {
      color: 'bg-blue-100 text-blue-800',
      icon: <CheckCircle className="w-4 h-4" />,
      label: 'Complété'
    },
    paused: {
      color: 'bg-yellow-100 text-yellow-800',
      icon: <PauseCircle className="w-4 h-4" />,
      label: 'En pause'
    },
  };

  const status = statusConfig[project.status];
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center">
            <Folder className="w-6 h-6 text-indigo-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{project.name}</h3>
            <p className="text-sm text-gray-500 line-clamp-2">{project.description}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            onBlur={() => setTimeout(() => setShowMenu(false), 100)}
          >
            <MoreVertical className="w-5 h-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
              <button
                onClick={() => { onView(project.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <Eye className="w-4 h-4 text-gray-500" />
                Voir détails
              </button>
              <button
                onClick={() => { onEdit(project.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <Edit className="w-4 h-4 text-gray-500" />
                Modifier
              </button>
              <button
                onClick={() => { setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
              >
                <Download className="w-4 h-4 text-gray-500" />
                Télécharger rapports
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => { onDelete(project.id); setShowMenu(false); }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
              >
                <Trash2 className="w-4 h-4" />
                Supprimer
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Secteur</p>
          <p className="text-sm font-medium text-gray-900">{project.sector}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Date de livraison</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{project.deliveryDate}</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Administrateurs</p>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{project.adminCount} admin(s)</span>
          </div>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Livrables</p>
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-900">{project.deliverablesCount} total</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 ${status.color}`}>
            {status.icon}
            {status.label}
          </span>
        </div>
        {project.pendingDeliverables > 0 && (
          <span className="flex items-center gap-2 text-sm font-medium text-amber-600">
            <Clock className="w-4 h-4" />
            {project.pendingDeliverables} en attente
          </span>
        )}
      </div>
    </div>
  );
};

// Empty State Component
interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Folder className="w-10 h-10 text-gray-400" />
      </div>
      <p className="text-gray-900 font-medium text-lg mb-2">{title}</p>
      {description && <p className="text-gray-500 mb-6 text-center max-w-md">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Main Projects Page Component
const ProjectsPage: React.FC = () => {
  const { data: projects, mutate } = useSWR<Project[]>('/api/projects', fetcher);
  const { data: usersData } = useSWR<any[]>('/api/users', fetcher);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [userRole] = useState<'super_admin' | 'admin' | 'user'>('super_admin');

  // États pour le modal
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const sectors: FilterOption[] = [
    { value: 'all', label: 'Tous les secteurs' },
    { value: 'E-commerce', label: 'E-commerce' },
    { value: 'Finance', label: 'Finance' },
    { value: 'Corporate', label: 'Corporate' },
    { value: 'RH', label: 'Ressources Humaines' },
    { value: 'Santé', label: 'Santé' },
    { value: 'Éducation', label: 'Éducation' },
    { value: 'Technologie', label: 'Technologie' }
  ];

  const statuses: FilterOption[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'active', label: 'Actifs' },
    { value: 'completed', label: 'Complétés' },
    { value: 'paused', label: 'En pause' }
  ];

  // Map users for the modal
  const availableUsers = React.useMemo(() => {
    if (!Array.isArray(usersData)) return [];
    return usersData.map(u => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role
    }));
  }, [usersData]);

  // Fonctions de gestion
  const handleCreateProject = async (projectData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      await mutate();
      setIsCreateProjectModalOpen(false);
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error);
      alert('Erreur lors de la création');
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewProject = (id: string) => {
    console.log('Voir projet:', id);
  };

  const handleEditProject = (id: string) => {
    console.log('Modifier projet:', id);
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      try {
        const response = await fetch(`/api/projects/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete project');
        await mutate();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleUserSearch = (query: string) => {
    console.log('Recherche utilisateur:', query);
  };

  // Filtrer les projets
  const projectsList = Array.isArray(projects) ? projects : [];

  const filteredProjects = projectsList.filter(project => {
    const matchesSearch = searchQuery === '' ||
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSector = selectedSector === 'all' ||
      project.sector === selectedSector;

    const matchesStatus = selectedStatus === 'all' ||
      project.status === selectedStatus;

    return matchesSearch && matchesSector && matchesStatus;
  });

  // Calculer les statistiques
  const totalProjects = projectsList.length;
  const activeProjects = projectsList.filter(p => p.status === 'active').length;
  const completedProjects = projectsList.filter(p => p.status === 'completed').length;
  const pausedProjects = projectsList.filter(p => p.status === 'paused').length;
  // Données utilisateur simulées pour le Header
  const userData = {
    name: 'Marie Dubois',
    email: 'superadmin@luxdev.lu',
    role: userRole
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeRoute="/projects" userRole={userRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header
          user={userData}
          notificationCount={3}
          onSearchChange={handleUserSearch}
        />

        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-auto p-8">
          {/* Page Header avec Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Projets</h1>
                <p className="text-gray-600 mt-1">Gérez tous vos projets en cours</p>
              </div>
              <button
                onClick={() => setIsCreateProjectModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Nouveau projet</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Projets"
                value={totalProjects}
                change={`+${Math.floor(totalProjects * 0.2)} ce mois`}
                changeType="positive"
                icon={<Folder className="w-6 h-6 text-indigo-600" />}
                iconBgColor="bg-indigo-50"
              />
              <StatCard
                title="Actifs"
                value={activeProjects}
                change={`${totalProjects > 0 ? Math.round((activeProjects / totalProjects) * 100) : 0}% du total`}
                changeType="neutral"
                icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                iconBgColor="bg-green-50"
              />
              <StatCard
                title="Complétés"
                value={completedProjects}
                change="Livraison à temps"
                changeType="positive"
                icon={<CheckCircle className="w-6 h-6 text-blue-600" />}
                iconBgColor="bg-blue-50"
              />
              <StatCard
                title="En pause"
                value={pausedProjects}
                change="À reprendre"
                changeType="neutral"
                icon={<PauseCircle className="w-6 h-6 text-yellow-600" />}
                iconBgColor="bg-yellow-50"
              />
            </div>
          </div>

          {/* Filtres et Recherche */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Barre de recherche */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un projet..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtre secteur */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedSector}
                  onChange={(e) => setSelectedSector(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {sectors.map((sector) => (
                    <option key={sector.value} value={sector.value}>
                      {sector.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Filtre statut */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {statuses.map((status) => (
                    <option key={status.value} value={status.value}>
                      {status.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info sur les résultats */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
              </span>
              {(searchQuery || selectedSector !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSector('all');
                    setSelectedStatus('all');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          {/* Grille de projets */}
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onView={handleViewProject}
                  onEdit={handleEditProject}
                  onDelete={handleDeleteProject}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl p-8 border border-gray-200">
              <EmptyState
                title={projectsList.length === 0 ? "Aucun projet trouvé" : "Aucun résultat pour votre recherche"}
                description={
                  projectsList.length === 0
                    ? "Commencez par créer votre premier projet pour organiser vos livrables et collaborateurs."
                    : "Essayez de modifier vos critères de recherche ou réinitialisez les filtres."
                }
                actionLabel={projectsList.length === 0 ? "Créer mon premier projet" : undefined}
                onAction={projectsList.length === 0 ? () => setIsCreateProjectModalOpen(true) : undefined}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal de création de projet */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={isLoading}
        users={availableUsers}
      />
    </div>
  );
};

export default ProjectsPage;