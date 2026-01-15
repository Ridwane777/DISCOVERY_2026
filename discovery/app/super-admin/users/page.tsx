'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CreateUserModal from '@/components/CreateUserModal';
import useSWR from 'swr';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  Mail,
  Calendar,
  Trash2,
  Edit,
  Key,
  CheckCircle,
  AlertCircle,
  Plus,
  UserCog,
  UserCheck
} from 'lucide-react';

// Types
interface User {
  id: string;
  firstName: string;
  lastName: string;
  name?: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  createdAt?: string;
  avatarColor?: string;
  status?: 'active' | 'inactive';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  iconBgColor: string;
  description: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Stat Card Component
const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  iconBgColor,
  description
}) => {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 mb-2">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {description && (
            <div className="text-sm text-gray-500 mt-2">{description}</div>
          )}
        </div>
        <div className={`w-14 h-14 ${iconBgColor} rounded-lg flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// User Table Component
const UsersTable: React.FC<{
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  onResetPassword: (user: User) => void;
}> = ({ users, onEdit, onDelete, onResetPassword }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const getRoleBadge = (role: string) => {
    const configs: Record<string, { label: string; color: string; icon: any }> = {
      super_admin: { label: 'Super Admin', color: 'bg-purple-100 text-purple-700', icon: Shield },
      admin: { label: 'Admin', color: 'bg-indigo-100 text-indigo-700', icon: Users },
      user: { label: 'Client', color: 'bg-blue-100 text-blue-700', icon: Users }
    };
    const config = configs[role] || configs.user;
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const avatarColors = ['bg-blue-500', 'bg-purple-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'];

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4 text-left">UTILISATEUR</div>
          <div className="col-span-3 text-left">EMAIL</div>
          <div className="col-span-2 text-left">RÔLE</div>
          <div className="col-span-2 text-left">CRÉÉ LE</div>
          <div className="col-span-1 text-right">ACTIONS</div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <div
            key={user.id}
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Utilisateur */}
              <div className="col-span-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${user.avatarColor || avatarColors[index % avatarColors.length]} rounded-full flex items-center justify-center text-white font-medium`}>
                    {user.firstName ? user.firstName[0] : ''}{user.lastName ? user.lastName[0] : ''}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">
                      {user.status === 'inactive' ? 'Inactif' : 'Actif'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900 truncate">{user.email}</span>
                </div>
              </div>

              {/* Rôle */}
              <div className="col-span-2">
                {getRoleBadge(user.role)}
              </div>

              {/* Date de création */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1 text-right">
                <div className="relative inline-block text-left">
                  <button
                    onClick={() => setSelectedUser(selectedUser === user.id ? null : user.id)}
                    className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                  </button>

                  {selectedUser === user.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                      <button
                        onClick={() => { onEdit(user); setSelectedUser(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Edit className="w-4 h-4 text-gray-500" />
                        Modifier
                      </button>
                      <button
                        onClick={() => { onResetPassword(user); setSelectedUser(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                      >
                        <Key className="w-4 h-4 text-gray-500" />
                        Réinitialiser mot de passe
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => { onDelete(user.id); setSelectedUser(null); }}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                      >
                        <Trash2 className="w-4 h-4" />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Empty State Component
const EmptyUsersState: React.FC<{ onAddUser: () => void }> = ({ onAddUser }) => {
  return (
    <div className="bg-white rounded-xl p-12 border border-gray-200">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-900 font-medium text-lg mb-2">Aucun utilisateur trouvé</p>
        <p className="text-gray-500 mb-6">Commencez par ajouter votre premier utilisateur</p>
        <button
          onClick={onAddUser}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Ajouter un utilisateur
        </button>
      </div>
    </div>
  );
};

// Main Users Page Component
const UsersPage: React.FC = () => {
  const { data: usersData, error, mutate } = useSWR<User[]>('/api/users', fetcher);

  const users = React.useMemo(() => {
    if (!Array.isArray(usersData)) return [];
    return usersData.map(u => ({
      ...u,
      name: `${u.firstName} ${u.lastName}`
    }));
  }, [usersData]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [currentUserRole, setCurrentUserRole] = useState<'super_admin' | 'admin' | 'user'>('super_admin');
  const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const roleOptions: FilterOption[] = [
    { value: 'all', label: 'Tous les rôles' },
    { value: 'super_admin', label: 'Super Admin' },
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'Client' }
  ];

  // Fonctions de gestion
  const handleAddUser = () => {
    setIsCreateUserModalOpen(true);
  };

  const handleCreateUser = async (newUserData: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUserData),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create user');
      }

      const createdUser = await response.json();

      // Mise à jour optimiste de SWR
      await mutate();

      setIsCreateUserModalOpen(false);
    } catch (error: any) {
      console.error('Erreur:', error);
      alert(`Erreur: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    console.log('Modifier utilisateur:', user);
  };

  const handleResetPassword = (user: User) => {
    if (window.confirm(`Réinitialiser le mot de passe de ${user.name} ?`)) {
      console.log('Réinitialiser mot de passe pour:', user);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer cet utilisateur ?`)) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });
        if (!response.ok) throw new Error('Failed to delete user');

        // Rafraîchir les données
        await mutate();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' ||
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' ||
      user.role === selectedRole;

    return matchesSearch && matchesRole;
  });

  // Calculer les statistiques
  const totalUsers = users.length;
  const adminUsers = users.filter(u => u.role === 'admin').length;
  const superAdminUsers = users.filter(u => u.role === 'super_admin').length;
  const clientUsers = users.filter(u => u.role === 'user').length;

  const userData = {
    name: 'Marie Dubois',
    email: 'superadmin@luxdev.lu',
    role: currentUserRole
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRoute="/utilisateurs" userRole={currentUserRole} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={userData}
          notificationCount={2}
          onSearchChange={handleSearch}
        />

        <div className="flex-1 bg-gray-50 overflow-auto p-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
                <p className="text-gray-600 mt-1">Gérez les utilisateurs de la plateforme</p>
              </div>
              <button
                onClick={handleAddUser}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un utilisateur</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Utilisateurs"
                value={totalUsers}
                icon={<Users className="w-6 h-6 text-indigo-600" />}
                iconBgColor="bg-indigo-50"
                description={`${totalUsers} utilisateurs actifs`}
              />
              <StatCard
                title="Super Admins"
                value={superAdminUsers}
                icon={<Shield className="w-6 h-6 text-purple-600" />}
                iconBgColor="bg-purple-50"
                description="Accès complet"
              />
              <StatCard
                title="Admins"
                value={adminUsers}
                icon={<UserCog className="w-6 h-6 text-blue-600" />}
                iconBgColor="bg-blue-50"
                description="Gestion de projets"
              />
              <StatCard
                title="Clients"
                value={clientUsers}
                icon={<UserCheck className="w-6 h-6 text-green-600" />}
                iconBgColor="bg-green-50"
                description="Upload de fichiers"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {roleOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>
                {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
              </span>
              {(searchQuery || selectedRole !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedRole('all');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          {error || (usersData && !Array.isArray(usersData)) ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8 flex items-center gap-3">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-semibold">Erreur lors du chargement des données</p>
                <p className="text-sm opacity-90">{error?.message || (usersData as any)?.error || 'Une erreur inconnue est survenue'}</p>
                <p className="text-xs mt-1 font-mono">Assurez-vous que votre base de données MySQL est active et que les variables d'environnement sont correctes.</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Affichage de {filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}
                </p>
              </div>
              <UsersTable
                users={filteredUsers}
                onEdit={handleEditUser}
                onResetPassword={handleResetPassword}
                onDelete={handleDeleteUser}
              />
            </>
          ) : (
            <EmptyUsersState onAddUser={handleAddUser} />
          )}
        </div>
      </div>
      <CreateUserModal
        isOpen={isCreateUserModalOpen}
        onClose={() => setIsCreateUserModalOpen(false)}
        onSubmit={handleCreateUser}
        loading={isLoading}
      />
    </div>
  );
};

export default UsersPage;
