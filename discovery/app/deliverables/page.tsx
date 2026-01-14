'use client';

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AddDeliverableModal from '@/components/DeliverablesModal';
import { 
  Search, 
  Filter, 
  FileText, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Download,
  Eye,
  MoreVertical,
  Upload,
  FileUp,
  FileWarning,
  Plus
} from 'lucide-react';

// Types
interface Deliverable {
  id: string;
  name: string;
  project: string;
  format: string;
  deadline: string;
  status: 'pending' | 'received_ontime' | 'late' | 'upcoming';
  uploadedBy?: string;
  uploadedAt?: string;
  fileSize?: string;
  projectId: string;
  assignedTo: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  iconBgColor: string;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
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
  trend,
  trendType = 'neutral'
}) => {
  const trendColor = 
    trendType === 'positive' ? 'text-green-600' : 
    trendType === 'negative' ? 'text-red-600' : 
    'text-gray-600';
  
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600 mb-2">{title}</div>
          <div className="text-3xl font-bold text-gray-900">{value}</div>
          {trend && (
            <div className={`text-sm mt-2 font-medium ${trendColor}`}>
              {trend}
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

// Status Badge Component
const StatusBadge: React.FC<{ status: Deliverable['status'] }> = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'En attente',
      color: 'bg-yellow-100 text-yellow-800',
      icon: <Clock className="w-3 h-3" />
    },
    received_ontime: {
      label: 'Reçu à temps',
      color: 'bg-green-100 text-green-800',
      icon: <CheckCircle className="w-3 h-3" />
    },
    late: {
      label: 'En retard',
      color: 'bg-red-100 text-red-800',
      icon: <AlertCircle className="w-3 h-3" />
    },
    upcoming: {
      label: 'À venir',
      color: 'bg-blue-100 text-blue-800',
      icon: <Calendar className="w-3 h-3" />
    }
  };

  const config = statusConfig[status];

  return (
    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

// Empty State Component
const EmptyDeliverablesState: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-12 border border-gray-200">
      <div className="flex flex-col items-center justify-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <FileText className="w-10 h-10 text-gray-400" />
        </div>
        <p className="text-gray-900 font-medium text-lg mb-2">Aucun livrable trouvé</p>
        <p className="text-gray-500 mb-6">Aucun livrable n'a été créé pour le moment</p>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Plus className="w-4 h-4" />
            Créez d'abord un projet
          </div>
          <div className="text-gray-300">|</div>
          <div className="flex items-center gap-1">
            <Upload className="w-4 h-4" />
            Ajoutez des livrables
          </div>
        </div>
      </div>
    </div>
  );
};

// Deliverables Table Component
const DeliverablesTable: React.FC<{ 
  deliverables: Deliverable[];
  onView: (id: string) => void;
  onDownload: (id: string) => void;
  onUpload: (id: string) => void;
}> = ({ deliverables, onView, onDownload, onUpload }) => {
  const [selectedDeliverable, setSelectedDeliverable] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <div className="col-span-3">LIVRABLE</div>
          <div className="col-span-2">PROJET</div>
          <div className="col-span-1">FORMAT</div>
          <div className="col-span-2">DATE LIMITE</div>
          <div className="col-span-2">STATUT</div>
          <div className="col-span-2 text-right">ACTIONS</div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-gray-200">
        {deliverables.map((deliverable) => (
          <div 
            key={deliverable.id} 
            className="px-6 py-4 hover:bg-gray-50 transition-colors"
            onMouseEnter={() => setSelectedDeliverable(deliverable.id)}
            onMouseLeave={() => setSelectedDeliverable(null)}
          >
            <div className="grid grid-cols-12 gap-4 items-center">
              {/* Livrable */}
              <div className="col-span-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{deliverable.name}</p>
                    <p className="text-xs text-gray-500">
                      Assigné à: {deliverable.assignedTo}
                    </p>
                  </div>
                </div>
              </div>

              {/* Projet */}
              <div className="col-span-2">
                <span className="font-medium text-gray-900">{deliverable.project}</span>
              </div>

              {/* Format */}
              <div className="col-span-1">
                <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">
                  {deliverable.format}
                </span>
              </div>

              {/* Date limite */}
              <div className="col-span-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{deliverable.deadline}</span>
                </div>
                {deliverable.uploadedAt && (
                  <p className="text-xs text-gray-500 mt-1">
                    Reçu: {deliverable.uploadedAt}
                  </p>
                )}
              </div>

              {/* Statut */}
              <div className="col-span-2">
                <StatusBadge status={deliverable.status} />
              </div>

              {/* Actions */}
              <div className="col-span-2">
                <div className="flex items-center justify-end gap-2">
                  {deliverable.status === 'pending' || deliverable.status === 'upcoming' ? (
                    <button 
                      onClick={() => onUpload(deliverable.id)}
                      className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Upload
                    </button>
                  ) : deliverable.status === 'received_ontime' || deliverable.status === 'late' ? (
                    <button 
                      onClick={() => onDownload(deliverable.id)}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center gap-1.5 text-sm font-medium transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger
                    </button>
                  ) : null}
                  
                  <div className="relative">
                    <button 
                      onClick={() => setSelectedDeliverable(selectedDeliverable === deliverable.id ? null : deliverable.id)}
                      className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-500" />
                    </button>

                    {selectedDeliverable === deliverable.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 py-1">
                        <button 
                          onClick={() => { onView(deliverable.id); setSelectedDeliverable(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Eye className="w-4 h-4 text-gray-500" />
                          Voir détails
                        </button>
                        <button 
                          onClick={() => { onDownload(deliverable.id); setSelectedDeliverable(null); }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                        >
                          <Download className="w-4 h-4 text-gray-500" />
                          Télécharger
                        </button>
                        {deliverable.status === 'pending' || deliverable.status === 'upcoming' && (
                          <button 
                            onClick={() => { onUpload(deliverable.id); setSelectedDeliverable(null); }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                          >
                            <Upload className="w-4 h-4 text-gray-500" />
                            Uploader fichier
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main Deliverables Page Component
const DeliverablesPage: React.FC = () => {
  // État pour les livrables
  const [deliverables, setDeliverables] = useState<Deliverable[]>([
    // Données d'exemple (à supprimer quand vide)
    // {
    //   id: '1',
    //   name: 'Rapport de conception',
    //   project: 'Site E-commerce Luxe',
    //   format: '.pdf',
    //   deadline: '15 Février 2024',
    //   status: 'pending',
    //   assignedTo: 'Jean Dupont',
    //   projectId: '1'
    // },
    // {
    //   id: '2',
    //   name: 'Maquettes UI/UX',
    //   project: 'Application Mobile Banque',
    //   format: '.fig',
    //   deadline: '20 Février 2024',
    //   status: 'upcoming',
    //   uploadedBy: 'Sophie Martin',
    //   uploadedAt: '18/02/2024',
    //   fileSize: '4.2 MB',
    //   assignedTo: 'Thomas Leroy',
    //   projectId: '2'
    // },
    // {
    //   id: '3',
    //   name: 'Documentation API',
    //   project: 'Système de Gestion RH',
    //   format: '.docx',
    //   deadline: '10 Janvier 2024',
    //   status: 'received_ontime',
    //   uploadedBy: 'Jean Dupont',
    //   uploadedAt: '08/01/2024',
    //   fileSize: '2.1 MB',
    //   assignedTo: 'Laura Schmidt',
    //   projectId: '4'
    // },
    // {
    //   id: '4',
    //   name: 'Rapport de test',
    //   project: 'Refonte Site Corporate',
    //   format: '.xlsx',
    //   deadline: '05 Février 2024',
    //   status: 'late',
    //   uploadedBy: 'Thomas Leroy',
    //   uploadedAt: '07/02/2024',
    //   fileSize: '3.5 MB',
    //   assignedTo: 'Sophie Martin',
    //   projectId: '3'
    // }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentUserRole, setCurrentUserRole] = useState<'super_admin' | 'admin' | 'user'>('super_admin');
  const [isAddDeliverableModalOpen, setIsAddDeliverableModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const projectOptions: FilterOption[] = [
    { value: 'all', label: 'Tous les projets' },
    { value: '1', label: 'Site E-commerce Luxe' },
    { value: '2', label: 'Application Mobile Banque' },
    { value: '3', label: 'Refonte Site Corporate' },
    { value: '4', label: 'Système de Gestion RH' }
  ];

  const statusOptions: FilterOption[] = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'received_ontime', label: 'Reçus à temps' },
    { value: 'late', label: 'En retard' },
    { value: 'upcoming', label: 'À venir' }
  ];

  const availableProjects = [
    { id: '1', name: 'Site E-commerce Luxe', client: 'ACME Corp' },
    { id: '2', name: 'Application Mobile Banque', client: 'Banque Luxembourg' },
    { id: '3', name: 'Refonte Site Corporate', client: 'Tech Solutions' },
    { id: '4', name: 'Système de Gestion RH', client: 'HR Partners' }
  ];

  const availableUsers = [
    { id: '1', name: 'Jean Dupont', email: 'jean@acme.com', role: 'client' },
    { id: '2', name: 'Sophie Martin', email: 'sophie@banque.lu', role: 'client' },
    { id: '3', name: 'Thomas Leroy', email: 'thomas@tech.com', role: 'client' },
    { id: '4', name: 'Laura Schmidt', email: 'laura@hr.com', role: 'client' },
    { id: '5', name: 'Pierre Lambert', email: 'pierre@consulting.fr', role: 'user' }
  ];

  const handleAddDeliverable = async (deliverableData: any) => {
    setIsLoading(true);
    try {
      console.log('Données du livrable:', deliverableData);
      
      // Ici, vous feriez appel à votre API
      // const response = await fetch('/api/deliverables', {
      //   method: 'POST',
      //   body: JSON.stringify(deliverableData),
      //   headers: { 'Content-Type': 'application/json' }
      // });
      
      // Simuler un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Ajouter le nouveau livrable à la liste (exemple)
      const newDeliverable = {
        id: Date.now().toString(),
        name: deliverableData.name,
        project: availableProjects.find(p => p.id === deliverableData.projectId)?.name || 'Projet inconnu',
        format: deliverableData.format,
        deadline: new Date(deliverableData.deadline).toLocaleDateString('fr-FR'),
        status: 'pending',
        assignedTo: availableUsers.find(u => u.id === deliverableData.assignedTo)?.name || 'Inconnu',
        uploadedAt: undefined,
        fileSize: undefined,
        projectId: deliverableData.projectId
      };
      
      setDeliverables(prev => [newDeliverable, ...prev]);
      setIsAddDeliverableModalOpen(false);
      
      // Afficher un message de succès (vous pouvez utiliser un toast)
      console.log('Livrable créé avec succès!');
      
    } catch (error) {
      console.error('Erreur lors de la création du livrable:', error);
      // Gérer l'erreur (afficher un message)
    } finally {
      setIsLoading(false);
    }
  };

  // Fonctions de gestion
  const handleViewDeliverable = (id: string) => {
    console.log('Voir livrable:', id);
    // Navigation vers les détails
  };

  const handleDownloadDeliverable = (id: string) => {
    console.log('Télécharger livrable:', id);
    // Logique de téléchargement
  };

  const handleUploadDeliverable = (id: string) => {
    console.log('Upload livrable:', id);
    // Ouverture modal d'upload
  };

  const handleSearch = (query: string) => {
    console.log('Recherche livrable:', query);
  };

  // Filtrer les livrables
  const filteredDeliverables = deliverables.filter(deliverable => {
    const matchesSearch = searchQuery === '' || 
      deliverable.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deliverable.project.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesProject = selectedProject === 'all' || 
      deliverable.projectId === selectedProject;
    
    const matchesStatus = selectedStatus === 'all' || 
      deliverable.status === selectedStatus;
    
    return matchesSearch && matchesProject && matchesStatus;
  });

  // Calculer les statistiques
  const totalDeliverables = deliverables.length;
  const pendingDeliverables = deliverables.filter(d => d.status === 'pending').length;
  const onTimeDeliverables = deliverables.filter(d => d.status === 'received_ontime').length;
  const lateDeliverables = deliverables.filter(d => d.status === 'late').length;
  const upcomingDeliverables = deliverables.filter(d => d.status === 'upcoming').length;

  // Données utilisateur simulées pour le Header
  const userData = {
    name: 'Marie Dubois',
    email: 'superadmin@luxdev.lu',
    role: currentUserRole
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar activeRoute="/livrables" userRole={currentUserRole} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          user={userData}
          notificationCount={5}
          onSearchChange={handleSearch}
        />
        
        {/* Content */}
        <div className="flex-1 bg-gray-50 overflow-auto p-8">
          {/* Page Header avec Stats */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Livrables</h1>
                <p className="text-gray-600 mt-1">Suivez tous vos livrables et leurs échéances</p>
              </div>
              <button 
                onClick={() => setIsAddDeliverableModalOpen(true)}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2 transition-colors font-medium shadow-sm hover:shadow-md"
              >
                <Plus className="w-5 h-5" />
                <span>Ajouter un livrable</span>
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Livrables"
                value={totalDeliverables}
                trend={`${pendingDeliverables} en attente`}
                trendType="neutral"
                icon={<FileText className="w-6 h-6 text-indigo-600" />}
                iconBgColor="bg-indigo-50"
              />
              <StatCard
                title="En attente"
                value={pendingDeliverables}
                trend="À traiter"
                trendType="neutral"
                icon={<Clock className="w-6 h-6 text-yellow-600" />}
                iconBgColor="bg-yellow-50"
              />
              <StatCard
                title="Reçus à temps"
                value={onTimeDeliverables}
                trend="Conforme"
                trendType="positive"
                icon={<CheckCircle className="w-6 h-6 text-green-600" />}
                iconBgColor="bg-green-50"
              />
              <StatCard
                title="En retard"
                value={lateDeliverables}
                trend="Attention"
                trendType="negative"
                icon={<AlertCircle className="w-6 h-6 text-red-600" />}
                iconBgColor="bg-red-50"
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
                  placeholder="Rechercher un livrable..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Filtre projet */}
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                >
                  {projectOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
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
                  {statusOptions.map((option) => (
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
                {filteredDeliverables.length} livrable{filteredDeliverables.length !== 1 ? 's' : ''} trouvé{filteredDeliverables.length !== 1 ? 's' : ''}
              </span>
              {(searchQuery || selectedProject !== 'all' || selectedStatus !== 'all') && (
                <button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedProject('all');
                    setSelectedStatus('all');
                  }}
                  className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                  Réinitialiser les filtres
                </button>
              )}
            </div>
          </div>

          {/* Tableau des livrables */}
          {filteredDeliverables.length > 0 ? (
            <>
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  Affichage de {filteredDeliverables.length} livrable{filteredDeliverables.length !== 1 ? 's' : ''}
                </p>
              </div>
              <DeliverablesTable 
                deliverables={filteredDeliverables}
                onView={handleViewDeliverable}
                onDownload={handleDownloadDeliverable}
                onUpload={handleUploadDeliverable}
              />
            </>
          ) : (
            <EmptyDeliverablesState />
          )}

          {/* Légende des statuts */}
          {filteredDeliverables.length > 0 && (
            <div className="mt-8 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Légende des statuts</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">En attente</p>
                    <p className="text-sm text-gray-500">Fichier non uploadé</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Reçu à temps</p>
                    <p className="text-sm text-gray-500">Livraison dans les délais</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">En retard</p>
                    <p className="text-sm text-gray-500">Livraison après échéance</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">À venir</p>
                    <p className="text-sm text-gray-500">Échéance future</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section d'instructions pour les clients */}
          {currentUserRole === 'user' && (
            <div className="mt-8 bg-indigo-50 rounded-xl p-6 border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileUp className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Comment uploader vos livrables</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">1</div>
                      <span>Sélectionnez le livrable dans le tableau</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">2</div>
                      <span>Cliquez sur le bouton "Upload"</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">3</div>
                      <span>Vérifiez le format et le nom du fichier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center text-xs font-bold text-indigo-600 mt-0.5">4</div>
                      <span>Déposez ou sélectionnez votre fichier</span>
                    </li>
                  </ul>
                  <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FileWarning className="w-4 h-4 text-yellow-500" />
                      <span>Les fichiers en retard seront marqués comme "En retard" mais peuvent toujours être uploadés.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AddDeliverableModal
        isOpen={isAddDeliverableModalOpen}
        onClose={() => setIsAddDeliverableModalOpen(false)}
        onSubmit={handleAddDeliverable}
        loading={isLoading}
        projects={availableProjects}
        users={availableUsers}
        currentUserRole={currentUserRole}
      />
    </div>
  );
};

export default DeliverablesPage;