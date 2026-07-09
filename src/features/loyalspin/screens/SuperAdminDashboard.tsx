import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { projectsService } from '../../../services/projectsService';
import { Project, UserAccount } from '../../../database/schema';
import { upsertProject, removeProject, fetchProjects, updateProject, deleteProject } from '../../../store/slices/projectsSlice';
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../../store/slices/adminsSlice';
import { useToast } from '../../../context/ToastContext';
import { doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../../services/firebaseConfig';
import AdminCoupons from './admin/AdminCoupons';
import AdminRoulette from './AdminRoulette';
import { AdminUsers } from './AdminUsers';
import AdminSticker from './AdminSticker';
import { useTranslation } from 'react-i18next';

interface Props {
  t?: any;
}

export const SuperAdminDashboard: React.FC<Props> = ({ t: tProp }) => {
  const { t: tHook } = useTranslation();
  const t = tProp || tHook;
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const projects = useSelector((state: RootState) => state.projects?.items || []);
  const admins = useSelector((state: RootState) => state.admins?.items || []);

  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'admins' | 'sectors'>('projects');
  
  // Project Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<Partial<Project>>({});

  // Admin Form State
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<Partial<UserAccount>>({});

  // Sector State
  const [sectors, setSectors] = useState<string[]>(['Restauration', 'Mode', 'Technologie', 'Services']);
  const [newSectorName, setNewSectorName] = useState('');
  const [editingSectorName, setEditingSectorName] = useState<string | null>(null);
  const [editSectorValue, setEditSectorValue] = useState('');

  // Managing Project State
  const [managingProjectId, setManagingProjectId] = useState<string | null>(null);
  const [managingTab, setManagingTab] = useState<'details' | 'coupons' | 'roulette' | 'users' | 'stickers'>('details');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await dispatch(fetchProjects() as any);
        await dispatch(fetchAdmins() as any);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const handleSaveProject = async () => {
    if (!currentProject.name || !currentProject.adminId || !currentProject.email || !currentProject.phone) {
      showToast('Tous les champs obligatoires (nom, admin, email, tel) sont requis', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentProject.email && !emailRegex.test(currentProject.email)) {
      showToast('Format email invalide', 'error');
      return;
    }

    const phoneRegex = /^\+?[0-9\s\-]{8,}$/;
    if (currentProject.phone && !phoneRegex.test(currentProject.phone)) {
      showToast('Format téléphone invalide', 'error');
      return;
    }
    
    if (currentProject.id) {
      // 1. Optimistic Redux Update
      const updatedProj = { ...currentProject, updatedAt: new Date().toISOString() } as Project;
      dispatch(upsertProject(updatedProj));
      showToast('Projet mis à jour avec succès', 'success');
      
      // 2. Background Firebase Update
      updateDoc(doc(db, 'projects', updatedProj.id), updatedProj as any).catch(err => {
        console.error('Firebase error updateProject:', err);
      });
    } else {
      const id = `proj_${Date.now()}`;
      const newProj = {
        ...currentProject,
        id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Project;
      
      // 1. Optimistic Redux Update
      dispatch(upsertProject(newProj));
      showToast('Projet créé avec succès', 'success');
      
      // 2. Background Firebase Update
      setDoc(doc(db, 'projects', id), newProj).catch(err => {
        console.error('Firebase error createProject:', err);
      });
    }
    setIsEditing(false);
    setCurrentProject({});
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      // 1. Optimistic Redux Update
      dispatch(removeProject(id));
      showToast('Projet supprimé', 'info');
      
      // 2. Background Firebase Update
      deleteDoc(doc(db, 'projects', id)).catch(err => {
        console.error('Firebase error deleteProject:', err);
      });
    }
  };

  const handleSaveAdmin = async () => {
    if (!currentAdmin.name || !currentAdmin.email) {
      showToast('Le nom et l\'email sont requis', 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentAdmin.email)) {
      showToast('Format email invalide', 'error');
      return;
    }

    if (currentAdmin.id) {
      // 1. Optimistic Redux Update
      dispatch(updateAdmin(currentAdmin as UserAccount));
      showToast('Admin mis à jour avec succès', 'success');
      
      // 2. Background Firebase Update
      updateDoc(doc(db, 'users', currentAdmin.id), currentAdmin as any).catch(err => {
        console.error('Firebase error updateAdmin:', err);
      });
    } else {
      const id = `admin_${Date.now()}`;
      const newAdmin = {
        ...currentAdmin,
        id,
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // 1. Optimistic Redux Update
      dispatch(addAdmin(newAdmin as UserAccount));
      showToast('Admin créé avec succès', 'success');
      
      // 2. Background Firebase Update
      setDoc(doc(db, 'users', id), newAdmin).catch(err => {
        console.error('Firebase error addAdmin:', err);
      });
    }
    
    setIsEditingAdmin(false);
    setCurrentAdmin({});
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet admin ?')) {
      // 1. Optimistic Redux Update
      dispatch(deleteAdmin(id));
      showToast('Admin supprimé', 'info');
      
      // 2. Background Firebase Update
      deleteDoc(doc(db, 'users', id)).catch(err => {
        console.error('Firebase error deleteAdmin:', err);
      });
    }
  };

  const handleAddSector = () => {
    if (!newSectorName.trim()) return;
    if (!sectors.includes(newSectorName)) {
      setSectors([...sectors, newSectorName]);
      showToast('Secteur ajouté', 'success');
    } else {
      showToast('Ce secteur existe déjà', 'error');
    }
    setNewSectorName('');
  };

  const handleEditSector = (oldSector: string) => {
    setEditingSectorName(oldSector);
    setEditSectorValue(oldSector);
  };

  const handleSaveEditSector = () => {
    if (!editSectorValue.trim() || !editingSectorName) return;
    if (editSectorValue !== editingSectorName && sectors.includes(editSectorValue)) {
      showToast('Ce secteur existe déjà', 'error');
      return;
    }
    
    setSectors(sectors.map(s => s === editingSectorName ? editSectorValue : s));
    setEditingSectorName(null);
    setEditSectorValue('');
    showToast('Secteur mis à jour', 'success');
  };
  
  const handleDeleteSector = (sector: string) => {
    setSectors(sectors.filter(s => s !== sector));
    showToast('Secteur supprimé', 'info');
  };

  const tCommon = (key: string, defaultValue: string) => t ? t(key, { defaultValue }) : defaultValue;

  const renderProjectForm = () => (
    <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold dark:text-white">
          {currentProject.id ? 'Détails du projet' : 'Nouveau Projet'}
        </Text>
        {currentProject.id && !managingProjectId && (
          <TouchableOpacity onPress={() => setManagingProjectId(currentProject.id as string)} className="bg-emerald-100 dark:bg-emerald-900 px-4 py-2 rounded-lg">
            <Text className="text-emerald-700 dark:text-emerald-300 font-bold">Gérer ce projet</Text>
          </TouchableOpacity>
        )}
      </View>
      
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
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email contact <Text className="text-red-500">*</Text></Text>
            <TextInput
              value={currentProject.email || ''}
              onChangeText={(text) => setCurrentProject(prev => ({ ...prev, email: text }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
              keyboardType="email-address"
              autoCapitalize="none"
              {...({ required: true, pattern: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$" } as any)}
            />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone <Text className="text-red-500">*</Text></Text>
            <TextInput
              value={currentProject.phone || ''}
              onChangeText={(text) => setCurrentProject(prev => ({ ...prev, phone: text }))}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
              keyboardType="phone-pad"
              {...({ required: true, pattern: "^\\+?[0-9\\s\\-]{8,}$" } as any)}
            />
          </View>
        </View>
        
        <View className="flex-row space-x-4 mt-2">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Secteur d'activité</Text>
            <View className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden h-12 justify-center mb-2">
              <Picker
                selectedValue={currentProject.industry || ''}
                onValueChange={(val) => setCurrentProject(prev => ({ ...prev, industry: val }))}
                style={{ height: 50, width: '100%', color: 'inherit' }}
              >
                <Picker.Item label="Sélectionner un secteur" value="" />
                {sectors.map(s => <Picker.Item key={s} label={s} value={s} />)}
              </Picker>
            </View>
            <View className="flex-row space-x-2">
              <TextInput 
                placeholder="Nouveau secteur"
                value={newSectorName}
                onChangeText={setNewSectorName}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 dark:text-white"
              />
              <TouchableOpacity onPress={handleAddSector} className="bg-[#1E3A5F] px-4 py-2 rounded-lg justify-center">
                <Text className="text-white font-bold">Add</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Statut Paiement</Text>
            <View className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden h-12 justify-center">
              <Picker
                selectedValue={currentProject.paymentStatus || 'pending'}
                onValueChange={(val) => setCurrentProject(prev => ({ 
                  ...prev, 
                  paymentStatus: val as any 
                }))}
                style={{ height: 50, width: '100%', color: 'inherit' }}
              >
                <Picker.Item label="En attente" value="pending" />
                <Picker.Item label="Payé" value="paid" />
                <Picker.Item label="Expiré" value="expired" />
              </Picker>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">ID de l'Admin</Text>
          <View className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden h-12 justify-center">
            <Picker
              selectedValue={currentProject.adminId || ''}
              onValueChange={(val) => setCurrentProject(prev => ({ ...prev, adminId: val }))}
              style={{ height: 50, width: '100%', color: 'inherit' }}
            >
              <Picker.Item label="Sélectionner un admin" value="" />
              {admins.map(admin => (
                <Picker.Item key={admin.id} label={`${admin.name} (${admin.email})`} value={admin.id} />
              ))}
            </Picker>
          </View>
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

  const renderAdminForm = () => (
    <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mt-6">
      <Text className="text-xl font-bold mb-4 dark:text-white">
        {currentAdmin.id ? 'Modifier l\'admin' : 'Nouvel Admin'}
      </Text>
      
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Nom <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={currentAdmin.name || ''}
            onChangeText={(text) => setCurrentAdmin(prev => ({ ...prev, name: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder="Nom complet"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Email <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={currentAdmin.email || ''}
            onChangeText={(text) => setCurrentAdmin(prev => ({ ...prev, email: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Téléphone</Text>
          <TextInput
            value={currentAdmin.phone || ''}
            onChangeText={(text) => setCurrentAdmin(prev => ({ ...prev, phone: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            keyboardType="phone-pad"
          />
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">Admin Actif</Text>
          <Switch 
            value={currentAdmin.status !== 'blocked'}
            onValueChange={(val) => setCurrentAdmin(prev => ({ ...prev, status: val ? 'active' : 'blocked' }))}
          />
        </View>

        <View className="flex-row justify-end space-x-4 mt-6">
          <TouchableOpacity onPress={() => setIsEditingAdmin(false)} className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700">
            <Text className="text-slate-800 dark:text-white font-bold">Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveAdmin} className="px-6 py-3 rounded-lg bg-[#1E3A5F]">
            <Text className="text-white font-bold">Enregistrer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 w-full bg-slate-50 dark:bg-[#0B0F19]">
      <View className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        
        {managingProjectId ? (
          <View>
            <TouchableOpacity onPress={() => setManagingProjectId(null)} className="mb-6 self-start bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-lg">
              <Text className="text-slate-800 dark:text-white font-bold">← Retour au Dashboard</Text>
            </TouchableOpacity>
            
            <View className="mb-8">
              <Text className="text-3xl font-black dark:text-white">
                Gestion du Projet: {projects.find(p => p.id === managingProjectId)?.name}
              </Text>
            </View>

            <View className="flex-row flex-wrap border-b border-slate-200 dark:border-slate-800 mb-6 gap-2">
              {[
                { id: 'details', label: 'Détails' },
                { id: 'coupons', label: 'Coupons' },
                { id: 'roulette', label: 'Roulette' },
                { id: 'users', label: 'Utilisateurs' },
                { id: 'stickers', label: 'Stickers' },
              ].map(tab => (
                <TouchableOpacity 
                  key={tab.id}
                  className={`pb-4 px-4 ${managingTab === tab.id ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
                  onPress={() => setManagingTab(tab.id as any)}
                >
                  <Text className={`font-bold ${managingTab === tab.id ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {managingTab === 'details' && (
              <View>
                {(() => {
                  const proj = projects.find(p => p.id === managingProjectId);
                  if (proj && currentProject.id !== proj.id) {
                    setCurrentProject(proj);
                  }
                  return renderProjectForm();
                })()}
              </View>
            )}
            {managingTab === 'coupons' && <AdminCoupons projectId={managingProjectId} />}
            {managingTab === 'roulette' && <AdminRoulette t={t} projectId={managingProjectId} />}
            {managingTab === 'users' && <AdminUsers t={t} showToast={showToast} projectId={managingProjectId} />}
            {managingTab === 'stickers' && <AdminSticker t={t} projectId={managingProjectId} />}
          </View>
        ) : (
          <View>
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
            <View className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400">Secteurs</Text>
              <Text className="text-3xl font-black text-amber-600 dark:text-amber-400">{sectors.length}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-slate-200 dark:border-slate-800 mb-6 space-x-2">
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
          <TouchableOpacity 
            className={`pb-4 px-6 ${activeTab === 'sectors' ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
            onPress={() => setActiveTab('sectors')}
          >
            <Text className={`font-bold ${activeTab === 'sectors' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>Gestion des Secteurs</Text>
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
                    <View className="flex-row space-x-3 items-center">
                      <TouchableOpacity onPress={() => { setManagingProjectId(proj.id); setManagingTab('details'); setCurrentProject(proj); }} className="bg-emerald-100 dark:bg-emerald-900 px-3 py-1.5 rounded-lg">
                        <Text className="text-emerald-700 dark:text-emerald-300 font-bold">Gérer</Text>
                      </TouchableOpacity>
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
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold dark:text-white">Liste des Admins</Text>
              {!isEditingAdmin && (
                <TouchableOpacity 
                  className="bg-[#1E3A5F] px-4 py-2 rounded-lg"
                  onPress={() => { setCurrentAdmin({}); setIsEditingAdmin(true); }}
                >
                  <Text className="text-white font-bold">+ Nouvel Admin</Text>
                </TouchableOpacity>
              )}
            </View>

            {isEditingAdmin ? (
              renderAdminForm()
            ) : (
              <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
                {admins.map((adm, idx) => {
                  const associatedProject = projects.find(p => p.adminId === adm.id);
                  return (
                    <View key={adm.id} className={`p-4 flex-row justify-between items-center ${idx !== admins.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                      <View>
                        <Text className="font-bold text-lg dark:text-white">{adm.name}</Text>
                        <Text className="text-sm text-slate-500 dark:text-slate-400">{adm.email} | Status: {adm.status || 'N/A'}</Text>
                        {associatedProject && (
                          <View className="flex-row items-center mt-1">
                            <Text className="text-xs bg-[#1E3A5F] text-white px-2 py-0.5 rounded-full mr-2">
                              Projet: {associatedProject.name}
                            </Text>
                            {associatedProject.industry && (
                              <Text className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full">
                                {associatedProject.industry}
                              </Text>
                            )}
                          </View>
                        )}
                      </View>
                      <View className="flex-row space-x-3">
                        <TouchableOpacity onPress={() => { setCurrentAdmin(adm); setIsEditingAdmin(true); }} className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-lg">
                          <Text className="text-blue-700 dark:text-blue-300 font-bold">Éditer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteAdmin(adm.id)} className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg">
                          <Text className="text-red-700 dark:text-red-300 font-bold">Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                {admins.length === 0 && (
                  <View className="p-8 items-center">
                    <Text className="text-slate-500 dark:text-slate-400">Aucun admin trouvé</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'sectors' && (
          <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow">
            <Text className="text-xl font-bold mb-4 dark:text-white">Liste des Secteurs</Text>
            
            <View className="flex-row space-x-3 mb-6">
              <TextInput 
                placeholder="Nom du secteur"
                value={newSectorName}
                onChangeText={setNewSectorName}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
              />
              <TouchableOpacity onPress={handleAddSector} className="bg-[#1E3A5F] px-6 py-3 rounded-lg justify-center">
                <Text className="text-white font-bold">Ajouter</Text>
              </TouchableOpacity>
            </View>

            <View className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
              {sectors.map((sector, idx) => (
                <View key={sector} className={`p-4 flex-row justify-between items-center ${idx !== sectors.length - 1 ? 'border-b border-slate-200 dark:border-slate-700' : ''}`}>
                  {editingSectorName === sector ? (
                    <View className="flex-row flex-1 items-center space-x-2 mr-4">
                      <TextInput 
                        value={editSectorValue}
                        onChangeText={setEditSectorValue}
                        className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 dark:text-white"
                        autoFocus
                      />
                      <TouchableOpacity onPress={handleSaveEditSector} className="bg-[#1E3A5F] px-3 py-2 rounded-lg">
                        <Text className="text-white font-bold">OK</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => setEditingSectorName(null)} className="bg-slate-200 dark:bg-slate-700 px-3 py-2 rounded-lg">
                        <Text className="text-slate-800 dark:text-white font-bold">X</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <>
                      <Text className="font-semibold dark:text-white flex-1">{sector}</Text>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity onPress={() => handleEditSector(sector)} className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg">
                          <Text className="text-blue-600 dark:text-blue-400 font-bold">Éditer</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteSector(sector)} className="bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-lg">
                          <Text className="text-red-600 dark:text-red-400 font-bold">Supprimer</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))}
              {sectors.length === 0 && (
                <View className="p-4 items-center">
                  <Text className="text-slate-500">Aucun secteur défini.</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </View>
    )}
    </View>
  </ScrollView>
);
};

export default SuperAdminDashboard;
