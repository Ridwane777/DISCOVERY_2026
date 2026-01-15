'use client';

import React, { useState, useMemo } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CreateUserModal from '@/components/CreateUserModal';
import CreateProjectModal from '@/components/CreateProjectModal';
import { Folder, Users, FileText, Clock, Plus, TrendingUp, AlertCircle } from 'lucide-react';
import useSWR from 'swr';

// Fetcher function
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Types
interface StatCardProps {
  title: string;
  value: number;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBgColor: string;
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

// Empty State Component
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <p className="text-gray-500 mb-4">{title}</p>
      {description && <p className="text-sm text-gray-400 mb-4">{description}</p>}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
        >
          <Folder className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
};

// Main Dashboard Page Component
const DashboardPage: React.FC = () => {
  // Data Fetching
  const { data: usersData, error: usersError, mutate: mutateUsers } = useSWR('/api/users', fetcher);
  const { data: projectsData, error: projectsError, mutate: mutateProjects } = useSWR('/api/projects', fetcher);
  const { data: deliverablesData, error: deliverablesError } = useSWR('/api/deliverables', fetcher);

  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Statistics Calculation
  const stats = useMemo(() => {
    const users = Array.isArray(usersData) ? usersData : [];
    const projects = Array.isArray(projectsData) ? projectsData : [];
    const deliverables = Array.isArray(deliverablesData) ? deliverablesData : [];

    return {
      activeProjects: projects.filter((p: any) => p.status === 'active').length,
      totalUsers: users.length,
      pendingDeliverables: deliverables.filter((d: any) => d.status === 'pending').length,
      lateDeliverables: deliverables.filter((d: any) => d.status === 'late').length,
    };
  }, [usersData, projectsData, deliverablesData]);

  // Transform users for modal
  const availableUsers = useMemo(() => {
    if (!Array.isArray(usersData)) return [];
    return usersData.map((u: any) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role
    }));
  }, [usersData]);

  // Handlers
  const handleCreateProjectSubmit = async (projectData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) throw new Error('Failed to create project');

      await mutateProjects();
      setIsCreateProjectModalOpen(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateUser = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create user');
      }

      await mutateUsers();
      setIsCreateUserModalOpen(false);
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
  };

  if (usersError || projectsError) {
    return (
      <div className="p-8 text-red-600 bg-red-50 h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-6 h-6" />
          <p>Erreur lors du chargement des données. Veuillez vérifier votre connexion base de données.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        <Sidebar activeRoute="/dashboard" userRole={'super_admin'} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            user={{ name: 'Marie Dubois', email: 'superadmin@luxdev.lu', role: 'super_admin' }}
            notificationCount={3}
            onSearchChange={handleSearch}
          />

          <div className="flex-1 bg-gray-50 overflow-auto">
            <div className="p-8">
              {/* Page Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Dashboard Super Admin</h1>
                  <p className="text-gray-600 mt-1">Vue d'ensemble de la plateforme LuxDev</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCreateProjectModalOpen(true)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Folder className="w-4 h-4" />
                    <span className="font-medium">Nouveau projet</span>
                  </button>
                  <button
                    onClick={() => setIsCreateUserModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span className="font-medium">Ajouter utilisateur</span>
                  </button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                  title="Projets actifs"
                  value={stats.activeProjects}
                  change="En temps réel"
                  changeType="neutral"
                  icon={<Folder className="w-6 h-6 text-indigo-600" />}
                  iconBgColor="bg-indigo-50"
                />
                <StatCard
                  title="Utilisateurs"
                  value={stats.totalUsers}
                  change="En temps réel"
                  changeType="positive"
                  icon={<Users className="w-6 h-6 text-green-600" />}
                  iconBgColor="bg-green-50"
                />
                <StatCard
                  title="Livrables en attente"
                  value={stats.pendingDeliverables}
                  change="En temps réel"
                  changeType="neutral"
                  icon={<FileText className="w-6 h-6 text-orange-600" />}
                  iconBgColor="bg-orange-50"
                />
                <StatCard
                  title="Fichiers en retard"
                  value={stats.lateDeliverables}
                  change="En temps réel"
                  changeType="negative"
                  icon={<Clock className="w-6 h-6 text-red-600" />}
                  iconBgColor="bg-red-50"
                />
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Projets récents</h2>
                    <p className="text-sm text-gray-500 mt-1">{stats.activeProjects === 0 ? 'Aucun projet créé' : `${stats.activeProjects} projets en cours`}</p>
                  </div>
                  {stats.activeProjects === 0 ? (
                    <EmptyState
                      icon={<Folder className="w-8 h-8 text-gray-400" />}
                      title="Aucun projet créé pour le moment"
                      actionLabel="Créer un projet"
                      onAction={() => setIsCreateProjectModalOpen(true)}
                    />
                  ) : (
                    <div className="space-y-4">
                      {/* TODO: List recent projects here */}
                      <p className="text-gray-500 italic">Liste des projets (non implémentée dans cette vue)</p>
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Livrables en attente</h2>
                    <p className="text-sm text-gray-500 mt-1">{stats.pendingDeliverables} échéances à venir</p>
                  </div>
                  {stats.pendingDeliverables === 0 ? (
                    <EmptyState
                      icon={<FileText className="w-8 h-8 text-gray-400" />}
                      title="Aucun livrable en attente"
                    />
                  ) : (
                    <div className="space-y-4">
                      <p className="text-gray-500 italic">Liste des livrables (non implémentée dans cette vue)</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Activité de la plateforme</h2>
                  <p className="text-sm text-gray-500 mt-1">Données en temps réel</p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Graphique d'activité</p>
                  <p className="text-sm text-gray-500">Fonctionnalité à venir</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
        loading={isLoading}
      />

      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProjectSubmit}
        loading={isLoading}
        users={availableUsers}
      />
    </>
  );
};

export default DashboardPage;