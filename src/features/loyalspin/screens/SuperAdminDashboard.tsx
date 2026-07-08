import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { projectsService } from '../../../services/projectsService';
import { Project } from '../../../database/schema';
import { upsertProject, removeProject, fetchProjects, updateProject, deleteProject } from '../../../store/slices/projectsSlice';
import { useToast } from '../../../context/ToastContext';

interface Props {
  t?: any;
}

export const SuperAdminDashboard: React.FC<Props> = ({ t }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const projects = useSelector((state: RootState) => state.projects?.items || []);
  const admins = useSelector((state: RootState) => state.admins?.items || []);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'admins'>('projects');
  
  // Project Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchProjects() as any);
      } catch (error) {
        console.error('Error fetching projects:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleSaveProject = async () => {
    if (!currentProject.name || !currentProject.adminId) {
      showToast('Le nom et l\'Admin ID sont requis', 'error');
      return;
    }
    
    try {
      if (currentProject.id) {
        dispatch(updateProject({ id: currentProject.id, data: currentProject as Partial<Project> }) as any);
        showToast('Projet mis à jour avec succès', 'success');
      } else {
        const newProj = await projectsService.create(currentProject as Omit<Project, 'id' | 'createdAt' | 'updatedAt'>);
        dispatch(upsertProject(newProj));
        showToast('Projet créé avec succès', 'success');
      }
      setIsEditing(false);
      setCurrentProject({});
    } catch (error) {
      showToast('Erreur lors de la sauvegarde du projet', 'error');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      await projectsService.remove(id);
      dispatch(deleteProject(id));
      showToast('Projet supprimé', 'info');
    }
  };

  const tCommon = (key: string, defaultValue: string) => t ? t(key, { defaultValue }) : defaultValue;

  const renderProjectForm = () => (
    <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mt-6">
      <Text className="text-xl font-bold mb-4 dark:text-white">
        {currentProject.id ? 'Modifier le projet' : 'Nouveau Projet'}
      </Text>
      
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom du projet</Text>
          <TextInput
            value={currentProject.name || ''}
            onChangeText={(text) => setCurrentProject(prev => ({ ...prev, name: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder="Nom du projet"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</Text>
          <TextInput
            value={currentProject.description || ''}
            onChangeText={(text) => setCurrentProject(prev => ({ ...prev, description: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder="Description courte"
          />
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email contact</Text>
            <TextInput
              value={currentProject.email || ''}
              onChangeText={(text) => setCurrentProject(prev => ({ ...prev, email: text }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</Text>
            <TextInput
              value={currentProject.phone || ''}
              onChangeText={(text) => setCurrentProject(prev => ({ ...prev, phone: text }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            />
          </View>
        </View>
        
        <View className="flex-row space-x-4 mt-2">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Secteur d'activité</Text>
            <TextInput
              value={currentProject.industry || ''}
              onChangeText={(text) => setCurrentProject(prev => ({ ...prev, industry: text }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
              placeholder="Ex: Restauration"
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Statut Paiement</Text>
            <TextInput
              value={currentProject.paymentStatus || 'pending'}
              onChangeText={(text) => setCurrentProject(prev => ({ 
                ...prev, 
                paymentStatus: text as any 
              }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
              placeholder="active, pending, expired"
            />
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">ID de l'Admin</Text>
          <TextInput
            value={currentProject.adminId || ''}
            onChangeText={(text) => setCurrentProject(prev => ({ ...prev, adminId: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder="ID Admin"
          />
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">Projet Actif</Text>
          <Switch 
            value={currentProject.isActive !== false}
            onValueChange={(val) => setCurrentProject(prev => ({ ...prev, isActive: val }))}
          />
        </View>

        <View className="flex-row justify-end space-x-4 mt-6">
          <TouchableOpacity onPress={() => setIsEditing(false)} className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700">
            <Text className="text-slate-800 dark:text-white font-bold">Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveProject} className="px-6 py-3 rounded-lg bg-[#1E3A5F]">
            <Text className="text-white font-bold">Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 w-full bg-slate-50 dark:bg-[#0B0F19]">
      <View className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        
        {/* Header Stats */}
        <View className="mb-10">
          <Text className="text-3xl font-black mb-6 dark:text-white">
            {tCommon('superadmin.title', 'Super Admin Dashboard')}
          </Text>
          <View className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <View className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400">Projets Actifs</Text>
              <Text className="text-3xl font-black text-[#1E3A5F] dark:text-white">{projects.length}</Text>
            </View>
            <View className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400">Admins</Text>
              <Text className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{admins.length}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-slate-200 dark:border-slate-800 mb-6">
          <TouchableOpacity 
            className={`pb-4 px-6 ${activeTab === 'projects' ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
            onPress={() => setActiveTab('projects')}
          >
            <Text className={`font-bold ${activeTab === 'projects' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>Gestion des Projets</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-4 px-6 ${activeTab === 'admins' ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
            onPress={() => setActiveTab('admins')}
          >
            <Text className={`font-bold ${activeTab === 'admins' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>Gestion des Admins</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'projects' && (
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold dark:text-white">Liste des Projets</Text>
              {!isEditing && (
                <TouchableOpacity 
                  className="bg-[#1E3A5F] px-4 py-2 rounded-lg"
                  onPress={() => { setCurrentProject({}); setIsEditing(true); }}
                >
                  <Text className="text-white font-bold">+ Nouveau Projet</Text>
                </TouchableOpacity>
              )}
            </View>
            
            {isEditing ? (
              renderProjectForm()
            ) : (
              <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
                {projects.map((proj, idx) => (
                  <View key={proj.id} className={`p-4 flex-row justify-between items-center ${idx !== projects.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                    <View>
                      <Text className="font-bold text-lg dark:text-white">{proj.name}</Text>
                      <Text className="text-sm text-slate-500 dark:text-slate-400">Admin: {proj.adminId} | Status: {proj.paymentStatus || 'N/A'}</Text>
                    </View>
                    <View className="flex-row space-x-3">
                      <TouchableOpacity onPress={() => { setCurrentProject(proj); setIsEditing(true); }} className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-lg">
                        <Text className="text-blue-700 dark:text-blue-300 font-bold">Éditer</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteProject(proj.id)} className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg">
                        <Text className="text-red-700 dark:text-red-300 font-bold">Supprimer</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {projects.length === 0 && (
                  <View className="p-8 items-center">
                    <Text className="text-slate-500 dark:text-slate-400">Aucun projet trouvé</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'admins' && (
          <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow">
            <Text className="text-xl font-bold mb-4 dark:text-white">Liste des Admins</Text>
            <Text className="text-slate-500 dark:text-slate-400 mb-4">La création d'admins se fait via Firebase Auth ou un appel API Cloud Function. Affichage seul pour l'instant.</Text>
            
            {admins.map((adm, idx) => (
              <View key={adm.id} className={`p-4 ${idx !== admins.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                <Text className="font-bold dark:text-white">{adm.name}</Text>
                <Text className="text-sm text-slate-500">{adm.email}</Text>
              </View>
            ))}
            {admins.length === 0 && (
              <Text className="text-slate-500 italic py-4">Aucun admin trouvé.</Text>
            )}
          </View>
        )}

      </View>
    </ScrollView>
  );
};

export default SuperAdminDashboard;
