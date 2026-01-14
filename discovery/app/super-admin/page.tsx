'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CreateUserModal from '@/components/CreateUserModal';
import CreateProjectModal from '@/components/CreateProjectModal';
import { Folder, Users, FileText, Clock, Plus, TrendingUp } from 'lucide-react';

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
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isCreateProjectModalOpen, setIsCreateProjectModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fonction pour ouvrir le modal de création de projet
  const openCreateProjectModal = () => {
    setIsCreateProjectModalOpen(true);
  };

  // Fonction pour soumettre le formulaire de création de projet
  const handleCreateProjectSubmit = async (projectData: any) => {
    setIsLoading(true);
    try {
      console.log('Création projet:', projectData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsCreateProjectModalOpen(false);
      alert('Projet créé avec succès!');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création du projet');
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction pour ouvrir le modal de création d'utilisateur
  const handleAddUser = () => {
    setIsCreateUserModalOpen(true);
  };

  // Fonction pour soumettre le formulaire de création d'utilisateur
  const handleCreateUser = async (userData: any) => {
    setIsLoading(true);
    try {
      console.log('Création utilisateur:', userData);
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsCreateUserModalOpen(false);
      alert('Utilisateur créé avec succès!');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la création de l\'utilisateur');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    console.log('Recherche:', query);
  };

  // Données utilisateurs simulées
  const users = [
    { id: '1', name: 'Jean Dupont', email: 'client@acme.com', role: 'user' },
    { id: '2', name: 'Sophie Martin', email: 'admin@luxdev.lu', role: 'admin' },
    { id: '3', name: 'Thomas Leroy', email: 'admin2@luxdev.lu', role: 'admin' },
  ];

  return (
    <>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar activeRoute="/dashboard" userRole={'super_admin'} />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header 
            user={{ 
              name: 'Marie Dubois', 
              email: 'superadmin@luxdev.lu' 
            }}
            notificationCount={3}
            onSearchChange={handleSearch}
          />
          
          {/* Dashboard Content */}
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
                    onClick={openCreateProjectModal} // Changé ici
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors"
                  >
                    <Folder className="w-4 h-4" />
                    <span className="font-medium">Nouveau projet</span>
                  </button>
                  <button 
                    onClick={handleAddUser}
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
                  value={0}
                  change="+0% ce mois"
                  changeType="positive"
                  icon={<Folder className="w-6 h-6 text-indigo-600" />}
                  iconBgColor="bg-indigo-50"
                />
                <StatCard
                  title="Utilisateurs"
                  value={3}
                  change="+2 ce mois"
                  changeType="positive"
                  icon={<Users className="w-6 h-6 text-green-600" />}
                  iconBgColor="bg-green-50"
                />
                <StatCard
                  title="Livrables en attente"
                  value={0}
                  change="Aucun ce mois"
                  changeType="neutral"
                  icon={<FileText className="w-6 h-6 text-orange-600" />}
                  iconBgColor="bg-orange-50"
                />
                <StatCard
                  title="Fichiers en retard"
                  value={0}
                  change="Tout OK ce mois"
                  changeType="positive"
                  icon={<Clock className="w-6 h-6 text-red-600" />}
                  iconBgColor="bg-red-50"
                />
              </div>

              {/* Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Projets récents */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Projets récents</h2>
                    <p className="text-sm text-gray-500 mt-1">Aucun projet créé</p>
                  </div>
                  <EmptyState
                    icon={<Folder className="w-8 h-8 text-gray-400" />}
                    title="Aucun projet créé pour le moment"
                    actionLabel="Créer un projet"
                    onAction={openCreateProjectModal} // Changé ici aussi
                  />
                </div>

                {/* Livrables en attente */}
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Livrables en attente</h2>
                    <p className="text-sm text-gray-500 mt-1">Aucune échéance</p>
                  </div>
                  <EmptyState
                    icon={<FileText className="w-8 h-8 text-gray-400" />}
                    title="Aucun livrable en attente"
                  />
                </div>
              </div>

              {/* Activity Chart */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Activité de la plateforme</h2>
                  <p className="text-sm text-gray-500 mt-1">Uploads et activités des 30 derniers jours</p>
                </div>
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-200 rounded-lg">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Graphique d'activité</p>
                  <p className="text-sm text-gray-500">Intégration avec bibliothèque de graphiques</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de création d'utilisateur */}
      <CreateUserModal 
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
        loading={isLoading}
      />
      
      {/* Modal de création de projet */}
      <CreateProjectModal
        isOpen={isCreateProjectModalOpen}
        onClose={() => setIsCreateProjectModalOpen(false)}
        onSubmit={handleCreateProjectSubmit} // Changé ici
        loading={isLoading}
        users={users}
      />
    </>
  );
};

export default DashboardPage;