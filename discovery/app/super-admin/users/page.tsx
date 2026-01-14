'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import CreateUserModal from '@/components/CreateUserModal';
import { 
  Search, 
  User, 
  UserCog, 
  Users,
  Shield,
  UserCheck,
  Mail,
  Calendar,
  MoreVertical,
  Edit,
  Key,
  Trash2,
  Filter,
  Plus
} from 'lucide-react';

// Types
interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'admin' | 'user';
  createdAt: string;
  status: 'active' | 'inactive';
  avatarColor: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  description?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

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

// User Role Badge Component
const UserRoleBadge: React.FC<{ role: User['role'] }> = ({ role }) => {
  const roleConfig = {
    super_admin: {
      label: 'Super Admin',
      color: 'bg-purple-100 text-purple-800',
      icon: <Shield className="w-3 h-3" />
    },
    admin: {
      label: 'Admin',
      color: 'bg-blue-100 text-blue-800',
      icon: <UserCog className="w-3 h-3" />
    },
    user: {
      label: 'Client',
      color: 'bg-green-100 text-green-800',
      icon: <UserCheck className="w-3 h-3" />
    }
  };

  const config = roleConfig[role];

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// User Table Component
const UsersTable: React.FC<{ 
  users: User[]; 
  onEdit: (user: User) => void;
  onResetPassword: (user: User) => void;
  onDelete: (user: User) => void;
}> = ({ users, onEdit, onResetPassword, onDelete }) => {
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-4">UTILISATEUR</div>
          <div className="col-span-3">EMAIL</div>
          <div className="col-span-2">RÔLE</div>
          <div className="col-span-2">CRÉÉ LE</div>
          <div className="col-span-1">ACTIONS</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
            onMouseEnter={() => setSelectedUser(user.id)}
            onMouseLeave={() => setSelectedUser(null)}
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Utilisateur */}
              <div className="col-span-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${user.avatarColor} rounded-full flex items-center justify-center text-white font-medium`}>
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      {user.status === 'active' ? 'Actif' : 'Inactif'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="col-span-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{user.email}</span>
                </div>
              </div>

              {/* Rôle */}
              <div className="col-span-2">
                <UserRoleBadge role={user.role} />
              </div>

              {/* Date de création */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{user.createdAt}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="col-span-1">
                <div className="relative">
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
                        onClick={() => { onDelete(user); setSelectedUser(null); }}
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
  // État pour les utilisateurs
  const [users, setUsers] = useState<User[]>([
    // {
    //   id: '1',
    //   name: 'Marie Dubois',
    //   email: 'superadmin@luxdev.lu',
    //   role: 'super_admin',
    //   createdAt: '14/01/2026',
    //   status: 'active',
    //   avatarColor: 'bg-purple-600'
    // },
    // {
    //   id: '2',
    //   name: 'Sophie Martin',
    //   email: 'admin@luxdev.lu',
    //   role: 'admin',
    //   createdAt: '14/01/2026',
    //   status: 'active',
    //   avatarColor: 'bg-blue-600'
    // },
    // {
    //   id: '3',
    //   name: 'Jean Dupont',
    //   email: 'client@acme-corp.com',
    //   role: 'user',
    //   createdAt: '14/01/2026',
    //   status: 'active',
    //   avatarColor: 'bg-green-600'
    // },
    // {
    //   id: '4',
    //   name: 'Thomas Leroy',
    //   email: 'thomas@techcorp.lu',
    //   role: 'user',
    //   createdAt: '13/01/2026',
    //   status: 'active',
    //   avatarColor: 'bg-indigo-600'
    // },
    // {
    //   id: '5',
    //   name: 'Laura Schmidt',
    //   email: 'laura@finance.lu',
    //   role: 'admin',
    //   createdAt: '12/01/2026',
    //   status: 'active',
    //   avatarColor: 'bg-pink-600'
    // }
  ]);

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

  const handleEditUser = (user: User) => {
    console.log('Modifier utilisateur:', user);
    // Logique d'édition
  };

  const handleResetPassword = (user: User) => {
    if (window.confirm(`Réinitialiser le mot de passe de ${user.name} ?`)) {
      console.log('Réinitialiser mot de passe pour:', user);
      // Logique de réinitialisation
    }
  };

  const handleDeleteUser = (user: User) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${user.name} ?`)) {
      setUsers(users.filter(u => u.id !== user.id));
    }
  };

  const handleSearch = (query: string) => {
    console.log('Recherche utilisateur:', query);
  };

  // Filtrer les utilisateurs
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Données utilisateur simulées pour le Header
  const userData = {
    name: 'Marie Dubois',
    email: 'superadmin@luxdev.lu',
    role: currentUserRole
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeRoute="/utilisateurs" userRole={currentUserRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={userData}
          notificationCount={2}
          onSearchChange={handleSearch}
        />
        
        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-auto p-8">
          {/* Page Header avec Stats */}
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

            {/* Stats Grid */}
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

          {/* Filtres et Recherche */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Barre de recherche */}
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

              {/* Filtre rôle */}
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

            {/* Info sur les résultats */}
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

          {/* Tableau des utilisateurs */}
          {filteredUsers.length > 0 ? (
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
