'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, Folder, Users, FileText, Bell, Settings, LogOut } from 'lucide-react';

interface MenuItem {
  icon: React.ElementType;
  label: string;
  href: string;
  active?: boolean;
}

interface SidebarProps {
  activeRoute?: string;
  defaultCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ activeRoute = '/dashboard', defaultCollapsed = false }) => {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const menuItems: MenuItem[] = [
    { icon: Home, label: 'Dashboard', href: '/dashboard' },
    { icon: Folder, label: 'Projets', href: '/projets' },
    { icon: Users, label: 'Utilisateurs', href: '/utilisateurs' },
    { icon: FileText, label: 'Livrables', href: '/livrables' },
    { icon: Bell, label: 'Notifications', href: '/notifications' },
  ];

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
            <div>
              <div className="font-bold text-lg">LuxDev</div>
              <div className="text-xs text-gray-400">Super Admin</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Collapse Button */}
      <button 
        onClick={toggleSidebar}
        className="mx-4 mt-4 p-2 hover:bg-gray-800 rounded-lg flex items-center justify-center transition-colors"
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
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.href;
            
            return (
              <li key={index}>
                <a
                  href={item.href}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.label : ''}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="p-4 space-y-2 border-t border-gray-800">
        <button 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${
            isCollapsed ? 'justify-center' : ''
          }`}
          title={isCollapsed ? 'Paramètres' : ''}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Paramètres</span>}
        </button>
        <button 
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 transition-colors ${
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
