'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Search, Filter, UserPlus, Mail, Phone, Edit, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

// Données mockées des utilisateurs
const mockUsers = [
  {
    id: '1',
    name: 'Alice Dupont',
    email: 'alice@entreprise.com',
    phone: '+33 1 23 45 67 89',
    role: 'Super Admin',
    status: 'active',
    projects: 12,
    joinDate: '2023-01-15',
  },
  {
    id: '2',
    name: 'Bob Martin',
    email: 'bob@entreprise.com',
    phone: '+33 1 23 45 67 90',
    role: 'Admin',
    status: 'active',
    projects: 8,
    joinDate: '2023-03-20',
  },
  {
    id: '3',
    name: 'Client A Corp',
    email: 'contact@client-a.com',
    phone: '+33 1 23 45 67 91',
    role: 'User',
    status: 'active',
    projects: 2,
    joinDate: '2024-01-10',
  },
  {
    id: '4',
    name: 'Client B Ltd',
    email: 'info@client-b.com',
    phone: '+33 1 23 45 67 92',
    role: 'User',
    status: 'inactive',
    projects: 1,
    joinDate: '2024-02-15',
  },
];

export default function UsersPage() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole="super-admin" />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Gestion des Utilisateurs" 
          description="Créez et gérez les comptes administrateurs et clients" 
        />

        <main className="flex-1 p-6 space-y-6">
          {/* Barre de recherche et filtres */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher un utilisateur..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Tous les rôles</option>
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>

                <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  <UserPlus size={20} />
                  <span>Ajouter un Utilisateur</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Projets
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">Inscrit le {user.joinDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail size={14} className="mr-2 text-gray-400" />
                          {user.email}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Phone size={14} className="mr-2 text-gray-400" />
                          {user.phone}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        user.role === 'Super Admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'Admin'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle size={16} className="text-green-500 mr-2" />
                            <span className="text-green-700">Actif</span>
                          </>
                        ) : (
                          <>
                            <XCircle size={16} className="text-red-500 mr-2" />
                            <span className="text-red-700">Inactif</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <span className="font-bold">{user.projects}</span>
                        <div className="text-xs text-gray-500">projets</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit size={18} />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Formulaire d'ajout rapide (simplifié) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Ajouter un Nouvel Utilisateur</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nom complet"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                placeholder="Email"
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">Sélectionner un rôle</option>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin">Admin</option>
                <option value="User">User (Client)</option>
              </select>
              <button className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors font-medium">
                Créer le compte
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
