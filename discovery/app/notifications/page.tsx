'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { 
  Search, 
  Filter, 
  Bell, 
  BellOff,
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Mail,
  FileText,
  UserPlus,
  AlertTriangle,
  ChevronRight,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  Download,
  Check,
  X
} from 'lucide-react';

// Types
interface Notification {
  id: string;
  title: string;
  description: string;
  type: 'deadline' | 'upload' | 'system' | 'user' | 'project';
  priority: 'high' | 'medium' | 'low';
  date: string;
  time: string;
  read: boolean;
  projectId?: string;
  userId?: string;
  deliverableId?: string;
  actionRequired: boolean;
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

// Priority Badge Component
const PriorityBadge: React.FC<{ priority: Notification['priority'] }> = ({ priority }) => {
  const priorityConfig = {
    high: {
      label: 'Haute',
      color: 'bg-red-100 text-red-800',
      icon: <AlertTriangle className="w-3 h-3" />
    },
    medium: {
      label: 'Moyenne',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="w-3 h-3" />
    },
    low: {
      label: 'Basse',
      color: 'bg-blue-100 text-blue-800',
      icon: <Bell className="w-3 h-3" />
    }
  };

  const config = priorityConfig[priority];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Type Badge Component
const TypeBadge: React.FC<{ type: Notification['type'] }> = ({ type }) => {
  const typeConfig = {
    deadline: {
      label: 'Échéance',
      color: 'bg-purple-100 text-purple-800',
      icon: <Calendar className="w-3 h-3" />
    },
    upload: {
      label: 'Upload',
      color: 'bg-green-100 text-green-800',
      icon: <FileText className="w-3 h-3" />
    },
    system: {
      label: 'Système',
      color: 'bg-gray-100 text-gray-800',
      icon: <Bell className="w-3 h-3" />
    },
    user: {
      label: 'Utilisateur',
      color: 'bg-blue-100 text-blue-800',
      icon: <UserPlus className="w-3 h-3" />
    },
    project: {
      label: 'Projet',
      color: 'bg-indigo-100 text-indigo-800',
      icon: <FileText className="w-3 h-3" />
    }
  };

  const config = typeConfig[type];

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Notification Card Component
interface NotificationCardProps {
  notification: Notification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onAction: (id: string) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ 
  notification, 
  onRead, 
  onDelete,
  onAction 
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative bg-white rounded-xl border ${notification.read ? 'border-gray-200' : 'border-indigo-200 bg-indigo-50'} p-4 transition-all hover:shadow-md`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Unread indicator */}
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-600 rounded-l-xl"></div>
      )}

      <div className="flex gap-4">
        {/* Icon */}
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
          notification.priority === 'high' ? 'bg-red-100' :
          notification.priority === 'medium' ? 'bg-yellow-100' :
          'bg-blue-100'
        }`}>
          {notification.type === 'deadline' ? (
            <Calendar className={`w-6 h-6 ${
              notification.priority === 'high' ? 'text-red-600' :
              notification.priority === 'medium' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
          ) : notification.type === 'upload' ? (
            <FileText className={`w-6 h-6 ${
              notification.priority === 'high' ? 'text-red-600' :
              notification.priority === 'medium' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
          ) : notification.type === 'system' ? (
            <Bell className={`w-6 h-6 ${
              notification.priority === 'high' ? 'text-red-600' :
              notification.priority === 'medium' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
          ) : notification.type === 'user' ? (
            <UserPlus className={`w-6 h-6 ${
              notification.priority === 'high' ? 'text-red-600' :
              notification.priority === 'medium' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
          ) : (
            <FileText className={`w-6 h-6 ${
              notification.priority === 'high' ? 'text-red-600' :
              notification.priority === 'medium' ? 'text-yellow-600' :
              'text-blue-600'
            }`} />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className={`font-semibold ${notification.read ? 'text-gray-900' : 'text-gray-900'}`}>
                {notification.title}
              </h3>
              <PriorityBadge priority={notification.priority} />
              <TypeBadge type={notification.type} />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowMenu(!showMenu)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                  {!notification.read ? (
                    <button 
                      onClick={() => { onRead(notification.id); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <Check className="w-4 h-4 text-gray-500" />
                      Marquer comme lu
                    </button>
                  ) : (
                    <button 
                      onClick={() => { onRead(notification.id); setShowMenu(false); }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                    >
                      <EyeOff className="w-4 h-4 text-gray-500" />
                      Marquer comme non lu
                    </button>
                  )}
                  <button 
                    onClick={() => { onDelete(notification.id); setShowMenu(false); }}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3"
                  >
                    <Trash2 className="w-4 h-4" />
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-3">{notification.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {notification.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {notification.time}
              </span>
              {notification.actionRequired && (
                <span className="flex items-center gap-1 text-red-600 font-medium">
                  <AlertCircle className="w-3 h-3" />
                  Action requise
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              {notification.actionRequired && (
                <button 
                  onClick={() => onAction(notification.id)}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 text-sm font-medium transition-colors"
                >
                  Voir détails
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              
              {isHovered && !notification.read && (
                <button 
                  onClick={() => onRead(notification.id)}
                  className="p-1.5 hover:bg-gray-100 rounded-lg"
                  title="Marquer comme lu"
                >
                  <Check className="w-4 h-4 text-gray-500" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Empty State Component
const EmptyNotificationsState: React.FC<{ 
  onMarkAllAsRead?: () => void;
  hasNotifications?: boolean;
}> = ({ onMarkAllAsRead, hasNotifications = false }) => {
  return (
    <div className="bg-white rounded-xl p-12 border border-gray-200">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          {hasNotifications ? (
            <BellOff className="w-10 h-10 text-gray-400" />
          ) : (
            <Bell className="w-10 h-10 text-gray-400" />
          )}
        </div>
        <p className="text-gray-900 font-medium text-lg mb-2">
          {hasNotifications ? 'Aucune notification trouvée' : 'Aucune notification'}
        </p>
        <p className="text-gray-500 mb-6 text-center max-w-md">
          {hasNotifications 
            ? 'Aucune notification ne correspond à vos critères de recherche'
            : 'Vous n\'avez pas encore de notification. Elles apparaîtront ici.'
          }
        </p>
        {onMarkAllAsRead && hasNotifications && (
          <button 
            onClick={onMarkAllAsRead}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium"
          >
            <Check className="w-5 h-5" />
            Tout marquer comme lu
          </button>
        )}
      </div>
    </div>
  );
};

// Main Notifications Page Component
const NotificationsPage: React.FC = () => {
  // État pour les notifications
  const [notifications, setNotifications] = useState<Notification[]>([
    // Exemple de données (commentez pour voir l'état vide)
    // {
    //   id: '1',
    //   title: 'Échéance imminente',
    //   description: 'Le rapport de conception pour "Site E-commerce Luxe" est attendu demain.',
    //   type: 'deadline',
    //   priority: 'high',
    //   date: 'Aujourd\'hui',
    //   time: '10:30',
    //   read: false,
    //   projectId: '1',
    //   deliverableId: '1',
    //   actionRequired: true
    // },
    // {
    //   id: '2',
    //   title: 'Fichier uploadé',
    //   description: 'Jean Dupont a uploadé le fichier "maquette-finale.fig" pour le projet "Application Mobile".',
    //   type: 'upload',
    //   priority: 'medium',
    //   date: 'Hier',
    //   time: '14:45',
    //   read: false,
    //   projectId: '2',
    //   userId: '3',
    //   actionRequired: false
    // },
    // {
    //   id: '3',
    //   title: 'Nouvel utilisateur',
    //   description: 'Thomas Leroy a été ajouté comme client sur la plateforme.',
    //   type: 'user',
    //   priority: 'low',
    //   date: '14/01/2026',
    //   time: '09:15',
    //   read: true,
    //   userId: '4',
    //   actionRequired: false
    // },
    // {
    //   id: '4',
    //   title: 'Projet créé',
    //   description: 'Le projet "Système de Gestion RH" a été créé avec succès.',
    //   type: 'project',
    //   priority: 'medium',
    //   date: '13/01/2026',
    //   time: '16:30',
    //   read: true,
    //   projectId: '4',
    //   actionRequired: false
    // },
    // {
    //   id: '5',
    //   title: 'Maintenance système',
    //   description: 'Une maintenance est prévue ce soir de 22h à 00h.',
    //   type: 'system',
    //   priority: 'low',
    //   date: '12/01/2026',
    //   time: '11:00',
    //   read: true,
    //   actionRequired: false
    // }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [currentUserRole, setCurrentUserRole] = useState<'super_admin' | 'admin' | 'user'>('super_admin');

  const typeOptions: FilterOption[] = [
    { value: 'all', label: 'Tous les types' },
    { value: 'deadline', label: 'Échéances' },
    { value: 'upload', label: 'Uploads' },
    { value: 'system', label: 'Système' },
    { value: 'user', label: 'Utilisateurs' },
    { value: 'project', label: 'Projets' }
  ];

  // Fonctions de gestion
  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: !notification.read }
        : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const handleNotificationAction = (id: string) => {
    console.log('Action sur notification:', id);
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      // Navigation vers la page appropriée
      if (notification.projectId) {
        // Navigation vers le projet
      } else if (notification.deliverableId) {
        // Navigation vers le livrable
      }
    }
  };

  const handleSearch = (query: string) => {
    console.log('Recherche notification:', query);
  };

  // Filtrer les notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = searchQuery === '' || 
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = selectedType === 'all' || 
      notification.type === selectedType;
    
    return matchesSearch && matchesType;
  });

  // Calculer les statistiques
  const totalNotifications = notifications.length;
  const unreadNotifications = notifications.filter(n => !n.read).length;
  const highPriorityNotifications = notifications.filter(n => n.priority === 'high').length;
  const todayNotifications = notifications.filter(n => n.date === 'Aujourd\'hui').length;

  // Données utilisateur simulées pour le Header
  const userData = {
    name: 'Marie Dubois',
    email: 'superadmin@luxdev.lu',
    role: currentUserRole
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeRoute="/notifications" userRole={currentUserRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={userData}
          notificationCount={unreadNotifications}
          onSearchChange={handleSearch}
        />
        
        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-auto p-8">
          {/* Page Header avec Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600 mt-1">
                  {unreadNotifications > 0 
                    ? `${unreadNotifications} notification${unreadNotifications > 1 ? 's' : ''} non lue${unreadNotifications > 1 ? 's' : ''}`
                    : '0 notification non lue'
                  }
                </p>
              </div>
              
              {notifications.length > 0 && unreadNotifications > 0 && (
                <button 
                  onClick={handleMarkAllAsRead}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 transition-colors text-sm font-medium"
                >
                  <Check className="w-4 h-4" />
                  Tout marquer comme lu
                </button>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total"
                value={totalNotifications}
                icon={<Bell className="w-6 h-6 text-indigo-600" />}
                iconBgColor="bg-indigo-50"
                description={`${notifications.length} au total`}
              />
              <StatCard
                title="Non lues"
                value={unreadNotifications}
                icon={<Bell className="w-6 h-6 text-yellow-600" />}
                iconBgColor="bg-yellow-50"
                description={`${unreadNotifications} à lire`}
              />
              <StatCard
                title="Priorité haute"
                value={highPriorityNotifications}
                icon={<AlertTriangle className="w-6 h-6 text-red-600" />}
                iconBgColor="bg-red-50"
                description="Attention requise"
              />
              <StatCard
                title="Aujourd'hui"
                value={todayNotifications}
                icon={<Calendar className="w-6 h-6 text-green-600" />}
                iconBgColor="bg-green-50"
                description="Notifications du jour"
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
                  placeholder="Rechercher une notification..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtre type */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {typeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Info sur les résultats */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-4">
                <span>
                  {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''} trouvée{filteredNotifications.length !== 1 ? 's' : ''}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${unreadNotifications > 0 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {unreadNotifications} non lue{unreadNotifications !== 1 ? 's' : ''}
                </span>
              </div>
              {(searchQuery || selectedType !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          {/* Liste des notifications */}
          {filteredNotifications.length > 0 ? (
            <div className="space-y-4">
              {/* En-tête de section */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">
                    Toutes les notifications
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {filteredNotifications.length}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setNotifications(notifications.filter(n => n.read))}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Supprimer les lues
                  </button>
                  <button 
                    onClick={handleMarkAllAsRead}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Tout marquer comme lu
                  </button>
                </div>
              </div>

              {/* Notifications non lues */}
              {filteredNotifications.filter(n => !n.read).length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-yellow-600" />
                    Non lues ({filteredNotifications.filter(n => !n.read).length})
                  </h3>
                  <div className="space-y-4 mb-6">
                    {filteredNotifications
                      .filter(n => !n.read)
                      .map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onRead={handleMarkAsRead}
                          onDelete={handleDeleteNotification}
                          onAction={handleNotificationAction}
                        />
                      ))}
                  </div>
                </>
              )}

              {/* Notifications lues */}
              {filteredNotifications.filter(n => n.read).length > 0 && (
                <>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Lues ({filteredNotifications.filter(n => n.read).length})
                  </h3>
                  <div className="space-y-4">
                    {filteredNotifications
                      .filter(n => n.read)
                      .map((notification) => (
                        <NotificationCard
                          key={notification.id}
                          notification={notification}
                          onRead={handleMarkAsRead}
                          onDelete={handleDeleteNotification}
                          onAction={handleNotificationAction}
                        />
                      ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <EmptyNotificationsState 
              onMarkAllAsRead={notifications.length > 0 ? handleMarkAllAsRead : undefined}
              hasNotifications={notifications.length > 0}
            />
          )}

          {/* Légende des priorités */}
          {filteredNotifications.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Légende des priorités</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Priorité haute</p>
                    <p className="text-sm text-gray-500">Action immédiate requise</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Priorité moyenne</p>
                    <p className="text-sm text-gray-500">À traiter aujourd'hui</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bell className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Priorité basse</p>
                    <p className="text-sm text-gray-500">Information seulement</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;