'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import ProjectCard from '@/components/ProjectCard';
import { Folder, FileText, Clock, AlertCircle } from 'lucide-react';

const adminStats = [
  {
    title: 'Mes Projets',
    value: 4,
    icon: Folder,
    color: 'blue' as const,
  },
  {
    title: 'Fichiers à Vérifier',
    value: 6,
    icon: FileText,
    color: 'orange' as const,
  },
  {
    title: 'En Attente',
    value: 3,
    icon: Clock,
    color: 'purple' as const,
  },
  {
    title: 'En Retard',
    value: 1,
    icon: AlertCircle,
    color: 'red' as const,
  },
];

const adminProjects = [
  {
    id: '1',
    name: 'Site Web Client A',
    description: 'Développement frontend',
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    status: 'active' as const,
    usersCount: 4,
    filesCount: 12,
    pendingFiles: 2,
    overdueFiles: 0,
  },
  {
    id: '2',
    name: 'Application Mobile',
    description: 'Tests et validation',
    startDate: new Date('2024-02-01'),
    endDate: new Date('2024-08-31'),
    status: 'active' as const,
    usersCount: 3,
    filesCount: 8,
    pendingFiles: 1,
    overdueFiles: 1,
  },
];

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen">
      <Sidebar userRole="admin" />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Tableau de Bord Admin" 
          description="Gestion de vos projets et fichiers assignés" 
        />

        <main className="flex-1 p-6 space-y-6">
          <StatsCards stats={adminStats} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Mes Projets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Mes Projets Assignés</h2>
              <div className="space-y-4">
                {adminProjects.map((project) => (
                  <ProjectCard key={project.id} {...project} />
                ))}
              </div>
            </div>

            {/* Fichiers à Vérifier */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Fichiers à Vérifier</h2>
              <div className="space-y-4">
                {[
                  { name: 'Rapport_Mensuel.pdf', project: 'Site Web Client A', date: '2024-03-28', status: 'pending' },
                  { name: 'Budget.xlsx', project: 'Application Mobile', date: '2024-03-29', status: 'pending' },
                  { name: 'Specs.docx', project: 'Migration Cloud', date: '2024-03-30', status: 'overdue' },
                ].map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        file.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <FileText className={file.status === 'overdue' ? 'text-red-600' : 'text-blue-600'} size={20} />
                      </div>
                      <div>
                        <p className="font-medium">{file.name}</p>
                        <p className="text-sm text-gray-500">Projet: {file.project}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">{file.date}</p>
                      <button className="mt-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        Vérifier
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
