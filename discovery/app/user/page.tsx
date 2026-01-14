'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import { Upload, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useState } from 'react';

const userStats = [
  {
    title: 'Fichiers Uploadés',
    value: 8,
    icon: Upload,
    color: 'green' as const,
  },
  {
    title: 'À Uploader',
    value: 3,
    icon: FileText,
    color: 'orange' as const,
  },
  {
    title: 'Approuvés',
    value: 6,
    icon: CheckCircle,
    color: 'blue' as const,
  },
  {
    title: 'En Retard',
    value: 1,
    icon: AlertCircle,
    color: 'red' as const,
  },
];

export default function UserDashboard() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole="user" />
      
      <div className="flex-1 flex flex-col">
        <Header 
          title="Mon Tableau de Bord" 
          description="Suivi de vos fichiers et projets" 
        />

        <main className="flex-1 p-6 space-y-6">
          <StatsCards stats={userStats} />

          {/* Zone d'upload */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Uploader un Fichier</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-500 transition-colors">
              <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="font-medium mb-2">Glissez-déposez votre fichier ici</p>
              <p className="text-sm text-gray-500 mb-4">Formats acceptés: .pdf, .docx, .xlsx (Max 10MB)</p>
              
              <div className="flex items-center justify-center space-x-4">
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                >
                  Sélectionner un fichier
                </label>
                {selectedFile && (
                  <span className="text-sm text-gray-600">
                    {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">Prêt à uploader</p>
                    <p className="text-sm text-gray-600">
                      Vérifiez que le nom du fichier respecte le format requis
                    </p>
                  </div>
                  <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                    Uploader
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Fichiers à uploader */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Fichiers À Soumettre</h2>
            
            <div className="space-y-4">
              {[
                { 
                  name: 'Rapport_Financier_Q1_2024.pdf', 
                  dueDate: '2024-04-15', 
                  format: '.pdf', 
                  status: 'pending',
                  project: 'Site Web Client A'
                },
                { 
                  name: 'Feuille_Temps_Mars.xlsx', 
                  dueDate: '2024-04-05', 
                  format: '.xlsx', 
                  status: 'overdue',
                  project: 'Application Mobile'
                },
                { 
                  name: 'Specifications.docx', 
                  dueDate: '2024-04-20', 
                  format: '.docx', 
                  status: 'pending',
                  project: 'Migration Cloud'
                },
              ].map((file, index) => (
                <div key={index} className={`p-4 rounded-lg border ${
                  file.status === 'overdue' 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200 hover:bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        file.status === 'overdue' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <FileText className={file.status === 'overdue' ? 'text-red-600' : 'text-blue-600'} size={24} />
                      </div>
                      <div>
                        <p className="font-semibold">{file.name}</p>
                        <p className="text-sm text-gray-600">
                          Projet: {file.project} • Format: {file.format}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className={`font-medium ${
                        file.status === 'overdue' ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        Échéance: {file.dueDate}
                      </p>
                      {file.status === 'overdue' && (
                        <p className="text-sm text-red-600 mt-1">⚠️ En retard</p>
                      )}
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Uploader
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
