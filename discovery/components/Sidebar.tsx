'use client';

import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  FolderKanban, 
  Users, 
  FileText, 
  Bell, 
  Upload,
  Settings, 
  LogOut 
} from 'lucide-react';

import { useRouter } from 'next/navigation';

interface MenuItem {
  id: string;
  icon: React.ElementType;
  label: string;
  href: string;
}

interface SidebarProps {
  activeRoute?: string;
  defaultCollapsed?: boolean;
  userRole: 'super_admin' | 'admin' | 'user';
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeRoute = '/dashboard', 
  defaultCollapsed = false,
  userRole = 'super_admin'
}) => {
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  // Définition des menus par rôle
  const menuConfigs = {
    super_admin: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/super-admin' },
      { id: 'projects', label: 'Projets', icon: FolderKanban, href: '/projects' },
      { id: 'users', label: 'Utilisateurs', icon: Users, href: '/super-admin/users' },
      { id: 'deliverables', label: 'Livrables', icon: FileText, href: '/deliverables' },
      { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    ],
    admin: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/admin' },
      { id: 'projects', label: 'Mes Projets', icon: FolderKanban, href: '/projects' },
      { id: 'deliverables', label: 'Mes Livrables', icon: FileText, href: '/deliverables' },
      { id: 'notifications', label: 'Notifications', icon: Bell, href: '/notifications' },
    ],
    user: [
      { id: 'dashboard', label: 'Dashboard', icon: Home, href: '/user' },
      { id: 'projects', label: 'Mes Projets', icon: FolderKanban, href: '/projects' },
      { id: 'deliverables', label: 'Livrables', icon: FileText, href: '/deliverables' },
      { id: 'uploads', label: 'Mes Uploads', icon: Upload, href: '/uploads' },
    ],
  };

  const menuItems = menuConfigs[userRole];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <aside 
      className={`bg-gray-900 text-white flex flex-col h-screen transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo Section */}
      <div className={`p-6 border-b border-gray-800 ${isCollapsed ? 'px-4' : ''}`}>
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <div className="font-bold text-lg">LuxDev</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Collapse Button */}
      <button 
        onClick={toggleSidebar}
        className="mx-4 mt-4 p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
        aria-label={isCollapsed ? "Ouvrir la sidebar" : "Fermer la sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-5 h-5" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.href;
            
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                  {isActive && !isCollapsed && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2 border-t border-gray-800">
        <button 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Paramètres' : ''}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Paramètres</span>}
        </button>
        <button
          onClick={() => router.push('/')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Déconnexion' : ''}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Déconnexion</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;