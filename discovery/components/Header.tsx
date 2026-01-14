import React from 'react';
import { Search, MessageSquare, Bell, User, ChevronDown } from 'lucide-react';

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
}

interface HeaderProps {
  user?: UserInfo;
  onSearchChange?: (query: string) => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  user = { name: 'Marie Dubois', email: 'superadmin@luxdev.lu' },
  onSearchChange,
  notificationCount = 0 
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onSearchChange) {
      onSearchChange(e.target.value);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Rechercher un projet, livrable ou utilisateur..."
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
        
        {/* Right Side Actions */}
        <div className="flex items-center gap-4 ml-6">
          {/* Assistant Button */}
          <button className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors">
            <MessageSquare className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700 font-medium">Assistant</span>
          </button>
          
          {/* Notifications Button */}
          <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          
          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-indigo-600" />
              )}
            </div>
            <div className="flex items-center gap-2">
              <div>
                <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                <div className="text-xs text-gray-500">{user.email}</div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
