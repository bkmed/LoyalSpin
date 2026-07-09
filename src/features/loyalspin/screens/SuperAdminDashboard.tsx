import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { Project, UserAccount } from '../../../database/schema';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
  selectAllProjects,
} from '../../../store/slices/projectsSlice';
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../../store/slices/adminsSlice';
import { fetchAllUsers, saveNewUser } from '../../../store/slices/usersSlice';
import { createCoupon } from '../../../store/slices/couponsSlice';
import { saveStickerConfig } from '../../../store/slices/stickerConfigSlice';
import { saveRouletteConfig } from '../../../store/slices/rouletteConfigSlice';
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
  const [saving, setSaving] = useState(false);
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
        await dispatch(fetchAllUsers() as any);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  // ────────────────────────────────────────────
  // PROJECT CRUD — using proper thunks
  // ────────────────────────────────────────────
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
    
    setSaving(true);
    
    try {
      if (currentProject.id) {
        // ── UPDATE existing project via thunk ──
        const { id, createdAt, ...updateData } = currentProject as Project;
        await dispatch(updateProject({ id, data: updateData })).unwrap();
        showToast('Projet mis à jour avec succès ✅', 'success');
      } else {
        // ── CREATE new project via thunk ──
        const slug = (currentProject.name || '')
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        const projectData = {
          name: currentProject.name!,
          slug,
          description: currentProject.description || '',
          email: currentProject.email || '',
          phone: currentProject.phone || '',
          adminId: currentProject.adminId || '',
          isActive: currentProject.isActive !== false,
          paymentStatus: currentProject.paymentStatus || 'pending' as const,
          industry: currentProject.industry || '',
          logoUri: currentProject.logoUri,
          bannerUri: currentProject.bannerUri,
          address: currentProject.address,
          googleMapsUrl: currentProject.googleMapsUrl,
          facebookUrl: currentProject.facebookUrl,
          instagramUrl: currentProject.instagramUrl,
          tiktokUrl: currentProject.tiktokUrl,
          websiteUrl: currentProject.websiteUrl,
        };

        const newProject = await dispatch(createProject(projectData as any)).unwrap();
        showToast('Projet créé avec succès ✅', 'success');

        // ── AUTO-CREATE full config for the new project ──
        await createFullProjectConfig(newProject.id, newProject.name, currentProject.adminId || '');
      }

      setIsEditing(false);
      setCurrentProject({});
    } catch (error: any) {
      console.error('❌ handleSaveProject error:', error);
      showToast(`Erreur: ${error?.message || 'Impossible de sauvegarder le projet'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Creates default sticker config, roulette config, sample coupon,
   * and sample user for a newly created project.
   */
  const createFullProjectConfig = async (projectId: string, projectName: string, adminId: string) => {
    try {
      // 1. Default Sticker Config
      await dispatch(saveStickerConfig({
        id: `sticker_${projectId}`,
        projectId,
        isActive: true,
        shape: 'round',
        size: 'medium',
        primaryColor: '#1E3A5F',
        secondaryColor: '#F59E0B',
        textColor: '#FFFFFF',
        title: projectName,
        subtitle: 'Scannez pour jouer !',
        qrCodeUrl: `https://loyalspin.app/${projectId}`,
        qrCodeColor: '#1E3A5F',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })).unwrap();
      console.log('✅ Default sticker config created for project:', projectId);

      // 2. Default Roulette Config with sample segments
      await dispatch(saveRouletteConfig({
        id: `roulette_${projectId}`,
        projectId,
        wheelName: `Roulette ${projectName}`,
        isActive: true,
        spinLimitType: 'per_user_per_day',
        spinLimitValue: 1,
        animationSpeed: 'normal',
        soundEnabled: true,
        primaryColor: '#1E3A5F',
        secondaryColor: '#F59E0B',
        segments: [
          {
            id: 'seg_1',
            label: '🎉 -10%',
            description: 'Réduction de 10%',
            color: '#10B981',
            probability: 30,
            isGift: true,
            giftValue: '10% de réduction',
          },
          {
            id: 'seg_2',
            label: '🎁 Cadeau',
            description: 'Un cadeau surprise',
            color: '#3B82F6',
            probability: 10,
            isGift: true,
            giftValue: 'Cadeau surprise',
          },
          {
            id: 'seg_3',
            label: '😢 Perdu',
            description: 'Pas de chance',
            color: '#EF4444',
            probability: 30,
            isGift: false,
          },
          {
            id: 'seg_4',
            label: '🍕 -20%',
            description: 'Réduction de 20%',
            color: '#F59E0B',
            probability: 15,
            isGift: true,
            giftValue: '20% de réduction',
          },
          {
            id: 'seg_5',
            label: '🔄 Rejouez',
            description: 'Tentez à nouveau',
            color: '#8B5CF6',
            probability: 15,
            isGift: false,
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })).unwrap();
      console.log('✅ Default roulette config created for project:', projectId);

      // 3. Default Coupon
      await dispatch(createCoupon({
        projectId,
        code: `BIENVENUE${Date.now().toString().slice(-4)}`,
        title: 'Coupon de bienvenue',
        description: `Coupon de bienvenue pour ${projectName} - 10% de réduction`,
        type: 'percentage',
        value: 10,
        isActive: true,
        totalQuantity: 100,
        limitPerUser: 1,
      })).unwrap();
      console.log('✅ Default coupon created for project:', projectId);

      // 4. Sample User
      const sampleUserId = `user_${Date.now()}`;
      await dispatch(saveNewUser({
        id: sampleUserId,
        name: 'Utilisateur Test',
        email: `test_${projectId}@loyalspin.app`,
        role: 'user',
        projectId,
        status: 'active',
        phone: '+33600000000',
        preferredLanguage: 'fr',
        emailVerified: true,
        authProvider: 'email',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })).unwrap();
      console.log('✅ Sample user created for project:', projectId);

      showToast('🎉 Projet entièrement configuré : sticker, roulette, coupon, utilisateur', 'success');
    } catch (error: any) {
      console.error('⚠️ Partial config creation error:', error);
      showToast('Projet créé mais certaines configs par défaut ont échoué. Vous pouvez les configurer manuellement.', 'warning');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer ce projet ?')) {
      setSaving(true);
      try {
        await dispatch(deleteProject(id)).unwrap();
        showToast('Projet supprimé ✅', 'info');
      } catch (error: any) {
        console.error('❌ handleDeleteProject error:', error);
        showToast(`Erreur suppression: ${error?.message || 'Échec'}`, 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  // ────────────────────────────────────────────
  // ADMIN CRUD — using proper thunks + Firebase
  // ────────────────────────────────────────────
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

    setSaving(true);
    try {
      if (currentAdmin.id) {
        // UPDATE admin
        const updatedAdmin = {
          ...currentAdmin,
          updatedAt: new Date().toISOString(),
        } as UserAccount;
        
        await updateDoc(doc(db, 'users', currentAdmin.id), updatedAdmin as any);
        dispatch(updateAdmin(updatedAdmin));
        showToast('Admin mis à jour avec succès ✅', 'success');
      } else {
        // CREATE admin
        const id = `admin_${Date.now()}`;
        const newAdmin: UserAccount = {
          id,
          name: currentAdmin.name!,
          email: currentAdmin.email!,
          phone: currentAdmin.phone || '',
          role: 'admin',
          status: (currentAdmin.status as any) || 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        await setDoc(doc(db, 'users', id), newAdmin);
        dispatch(addAdmin(newAdmin));
        showToast('Admin créé avec succès ✅', 'success');
      }
      
      setIsEditingAdmin(false);
      setCurrentAdmin({});
    } catch (error: any) {
      console.error('❌ handleSaveAdmin error:', error);
      showToast(`Erreur: ${error?.message || 'Impossible de sauvegarder l\'admin'}`, 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet admin ?')) {
      setSaving(true);
      try {
        await deleteDoc(doc(db, 'users', id));
        dispatch(deleteAdmin(id));
        showToast('Admin supprimé ✅', 'info');
      } catch (error: any) {
        console.error('❌ handleDeleteAdmin error:', error);
        showToast(`Erreur suppression: ${error?.message || 'Échec'}`, 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  // ────────────────────────────────────────────
  // SECTORS CRUD (local state)
  // ────────────────────────────────────────────
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
          <TouchableOpacity onPress={() => { setIsEditing(false); setCurrentProject({}); }} className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700" disabled={saving}>
            <Text className="text-slate-800 dark:text-white font-bold">Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveProject} className="px-6 py-3 rounded-lg bg-[#1E3A5F] flex-row items-center" disabled={saving}>
            {saving && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
            <Text className="text-white font-bold">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
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
          <TouchableOpacity onPress={() => setIsEditingAdmin(false)} className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700" disabled={saving}>
            <Text className="text-slate-800 dark:text-white font-bold">Annuler</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveAdmin} className="px-6 py-3 rounded-lg bg-[#1E3A5F] flex-row items-center" disabled={saving}>
            {saving && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
            <Text className="text-white font-bold">
              {saving ? 'Enregistrement...' : 'Enregistrer'}
            </Text>
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
            {managingTab === 'users' && <AdminUsers t={t} showToast={showToast} projectId={managingProjectId} isSuperAdmin={true} />}
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
                      <TouchableOpacity onPress={() => handleDeleteProject(proj.id)} className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg" disabled={saving}>
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
                        <TouchableOpacity onPress={() => handleDeleteAdmin(adm.id)} className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg" disabled={saving}>
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
