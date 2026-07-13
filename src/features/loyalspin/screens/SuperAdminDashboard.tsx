import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Switch, ActivityIndicator, Linking } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../context/ThemeContext';
import { Project, UserAccount } from '../../../database/schema';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../../../store/slices/projectsSlice';
import { fetchAdmins, addAdmin, updateAdmin, deleteAdmin } from '../../../store/slices/adminsSlice';
import { selectAllUsers } from '../../../store/slices/usersSlice';
import { selectTotalPageViews, selectTotalShares, selectCallClicks } from '../../../store/slices/analyticsSlice';
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

interface Props {
  t?: any;
  navigation?: any;
}

export const SuperAdminDashboard: React.FC<Props> = ({ t: tProp, navigation }) => {
  const { t: tHook, i18n } = useTranslation();
  const { themeMode, setThemeMode } = useTheme();
  const t = tProp || tHook;
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();
  const projects = useSelector((state: RootState) => state.projects?.items || []);
  const admins = useSelector((state: RootState) => state.admins?.items || []);
  const allUsers = useSelector(selectAllUsers);
  const totalPageViews = useSelector(selectTotalPageViews);
  const totalShares = useSelector(selectTotalShares);
  const callClicks = useSelector(selectCallClicks);

  const [, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'admins' | 'sectors' | 'analytics'>('projects');
  
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
  const [managingTab, setManagingTab] = useState<'details' | 'coupons' | 'roulette' | 'users' | 'stickers' | 'analytics' | 'settings' | 'notes'>('details');

  // Settings tab state (social links editing)
  const [settingsData, setSettingsData] = useState<Partial<any>>({});
  const [settingsSaving, setSettingsSaving] = useState(false);
  const [, setEditingField] = useState<string | null>(null);

  // Notes state
  interface NetworkNote { id: string; network: string; text: string; rating: number; }
  const [globalNote, setGlobalNote] = useState({ text: '', rating: 0 });
  const [networkNotes, setNetworkNotes] = useState<NetworkNote[]>([]);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteData, setEditingNoteData] = useState<NetworkNote | null>(null);
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState({ network: 'Google Maps', text: '', rating: 5 });

  const nextLanguage =
    i18n.language === 'fr' ? 'en' : i18n.language === 'en' ? 'ar' : 'fr';

  const handleToggleTheme = () => {
    setThemeMode(themeMode === 'dark' ? 'light' : 'dark');
  };

  const handleToggleLanguage = () => {
    i18n.changeLanguage(nextLanguage);
  };

  const languageLabel =
    i18n.language === 'ar' ? 'AR' : i18n.language === 'en' ? 'EN' : 'FR';

  const languageNextLabel =
    nextLanguage === 'ar' ? 'AR' : nextLanguage === 'en' ? 'EN' : 'FR';

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
      showToast(tCommon('superadmin.errorAllFieldsRequired', 'Tous les champs obligatoires (nom, admin, email, tel) sont requis'), 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (currentProject.email && !emailRegex.test(currentProject.email)) {
      showToast(tCommon('superadmin.errorInvalidEmailFormat', 'Format email invalide'), 'error');
      return;
    }

    const phoneRegex = /^\+?[0-9\s-]{8,}$/;
    if (currentProject.phone && !phoneRegex.test(currentProject.phone)) {
      showToast(tCommon('superadmin.errorInvalidPhoneFormat', 'Format téléphone invalide'), 'error');
      return;
    }
    
    setSaving(true);
    
    try {
      if (currentProject.id) {
        // ── UPDATE existing project via thunk ──
        const { id, ...updateData } = currentProject as Project;
        await dispatch(updateProject({ id, data: updateData })).unwrap();
        showToast(tCommon('superadmin.successProjectUpdated', 'Projet mis à jour avec succès ✅'), 'success');
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
        showToast(tCommon('superadmin.successProjectCreated', 'Projet créé avec succès ✅'), 'success');
 
        // ── AUTO-CREATE full config for the new project ──
       await createFullProjectConfig(newProject.id, newProject.name);
      }

      setIsEditing(false);
      setCurrentProject({});
    } catch (error: any) {
      console.error('❌ handleSaveProject error:', error);
      showToast(tCommon('superadmin.errorSaveProject', `Erreur: ${error?.message || tCommon('superadmin.errorCouldNotSaveProject', 'Impossible de sauvegarder le projet')}`), 'error');
    } finally {
      setSaving(false);
    }
  };

  /**
   * Creates default sticker config, roulette config, sample coupon,
   * and sample user for a newly created project.
   */
  const createFullProjectConfig = async (projectId: string, projectName: string) => {
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
        subtitle: tCommon('superadmin.defaultStickerSubtitle', 'Scannez pour jouer !'),
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
        wheelName: `${tCommon('superadmin.defaultRouletteName', 'Roulette')} ${projectName}`,
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
            description: tCommon('superadmin.rouletteSegmentDescription10', 'Réduction de 10%'),
            color: '#10B981',
            probability: 30,
            isGift: true,
            giftValue: tCommon('superadmin.rouletteGiftValue10', '10% de réduction'),
          },
          {
            id: 'seg_2',
            label: `🎁 ${tCommon('superadmin.rouletteSegmentGift', 'Cadeau')}`,
            description: tCommon('superadmin.rouletteSegmentDescriptionGift', 'Un cadeau surprise'),
            color: '#3B82F6',
            probability: 10,
            isGift: true,
            giftValue: tCommon('superadmin.rouletteGiftValueSurprise', 'Cadeau surprise'),
          },
          {
            id: 'seg_3',
            label: `😢 ${tCommon('superadmin.rouletteSegmentLost', 'Perdu')}`,
            description: tCommon('superadmin.rouletteSegmentDescriptionLost', 'Pas de chance'),
            color: '#EF4444',
            probability: 30,
            isGift: false,
          },
          {
            id: 'seg_4',
            label: '🍕 -20%',
            description: tCommon('superadmin.rouletteSegmentDescription20', 'Réduction de 20%'),
            color: '#F59E0B',
            probability: 15,
            isGift: true,
            giftValue: tCommon('superadmin.rouletteGiftValue20', '20% de réduction'),
          },
          {
            id: 'seg_5',
            label: `🔄 ${tCommon('superadmin.rouletteSegmentRetry', 'Rejouez')}`,
            description: tCommon('superadmin.rouletteSegmentDescriptionRetry', 'Tentez à nouveau'),
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
        title: tCommon('superadmin.defaultCouponTitle', 'Coupon de bienvenue'),
        description: tCommon('superadmin.defaultCouponDescription', `Coupon de bienvenue pour ${projectName} - 10% de réduction`),
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
        name: tCommon('superadmin.defaultSampleUserName', 'Utilisateur Test'),
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

      showToast(tCommon('superadmin.successProjectFullyConfigured', '🎉 Projet entièrement configuré : sticker, roulette, coupon, utilisateur'), 'success');
    } catch (error: any) {
      console.error('⚠️ Partial config creation error:', error);
      showToast(tCommon('superadmin.warningPartialConfigFailed', 'Projet créé mais certaines configs par défaut ont échoué. Vous pouvez les configurer manuellement.'), 'warning');
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (window.confirm(tCommon('superadmin.confirmDeleteProject', 'Voulez-vous vraiment supprimer ce projet ?'))) {
      setSaving(true);
      try {
        await dispatch(deleteProject(id)).unwrap();
        showToast(tCommon('superadmin.successProjectDeleted', 'Projet supprimé ✅'), 'info');
      } catch (error: any) {
        console.error('❌ handleDeleteProject error:', error);
        showToast(tCommon('superadmin.errorDeleteProject', `Erreur suppression: ${error?.message || tCommon('superadmin.errorFailed', 'Échec')}`), 'error');
      } finally {
        setSaving(false);
      }
    }
  };

  const openProjectPreview = (projectId: string) => {
    const baseUrl = typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'https://loyalspin.app';
    const previewUrl = `${baseUrl}/spin/${projectId}?preview=true`;
    Linking.openURL(previewUrl).catch((error) => console.error('Erreur ouverture preview:', error));
  };

  const userCountsByProject = allUsers.reduce((acc: Record<string, number>, user) => {
    if (!user.projectId) return acc;
    acc[user.projectId] = (acc[user.projectId] || 0) + 1;
    return acc;
  }, {});

  admins.forEach((admin) => {
    if (!admin.projectId) return;
    if (allUsers.some((user) => user.id === admin.id)) return;
    userCountsByProject[admin.projectId] = (userCountsByProject[admin.projectId] || 0) + 1;
  });

  // ────────────────────────────────────────────
  // ADMIN CRUD — using proper thunks + Firebase
  // ────────────────────────────────────────────
  const handleSaveAdmin = async () => {
    if (!currentAdmin.name || !currentAdmin.email) {
      showToast(tCommon('superadmin.errorAdminNameEmailRequired', 'Le nom et l\'email sont requis'), 'error');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentAdmin.email)) {
      showToast(tCommon('superadmin.errorInvalidEmailFormat', 'Format email invalide'), 'error');
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
        showToast(tCommon('superadmin.successAdminUpdated', 'Admin mis à jour avec succès ✅'), 'success');
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
        showToast(tCommon('superadmin.successAdminCreated', 'Admin créé avec succès ✅'), 'success');
      }
      
      setIsEditingAdmin(false);
      setCurrentAdmin({});
    } catch (error: any) {
      console.error('❌ handleSaveAdmin error:', error);
      showToast(tCommon('superadmin.errorSaveAdmin', `Erreur: ${error?.message || tCommon('superadmin.errorCouldNotSaveAdmin', 'Impossible de sauvegarder l\'admin')}`), 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm(tCommon('superadmin.confirmDeleteAdmin', 'Voulez-vous vraiment supprimer cet admin ?'))) {
      setSaving(true);
      try {
        await deleteDoc(doc(db, 'users', id));
        dispatch(deleteAdmin(id));
        showToast(tCommon('superadmin.successAdminDeleted', 'Admin supprimé ✅'), 'info');
      } catch (error: any) {
        console.error('❌ handleDeleteAdmin error:', error);
        showToast(tCommon('superadmin.errorDeleteAdmin', `Erreur suppression: ${error?.message || tCommon('superadmin.errorFailed', 'Échec')}`), 'error');
      } finally {        setSaving(false);
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
      showToast(tCommon('superadmin.successSectorAdded', 'Secteur ajouté'), 'success');
    } else {
      showToast(tCommon('superadmin.errorSectorAlreadyExists', 'Ce secteur existe déjà'), 'error');
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
      showToast(tCommon('superadmin.errorSectorAlreadyExists', 'Ce secteur existe déjà'), 'error');
      return;
    }
    
    setSectors(sectors.map(s => s === editingSectorName ? editSectorValue : s));
    setEditingSectorName(null);
    setEditSectorValue('');
    showToast(tCommon('superadmin.successSectorUpdated', 'Secteur mis à jour'), 'success');
  };
  
  const handleDeleteSector = (sector: string) => {
    setSectors(sectors.filter(s => s !== sector));
    showToast(tCommon('superadmin.successSectorDeleted', 'Secteur supprimé'), 'info');
  };

  // ────────────────────────────────────────────
  // GLOBAL ANALYTICS TAB
  // ────────────────────────────────────────────
  const renderGlobalAnalyticsTab = () => {
    const paidProjectsCount = projects.filter(p => p.paymentStatus === 'paid').length;
    const totalUsersConnected = allUsers.length;
    const monthlyRevenue = paidProjectsCount * 29.99;
    const annualRevenue = monthlyRevenue * 12;

    const sectorStats = projects.reduce<Record<string, { projectCount: number; userCount: number }>>((acc, project) => {
      const sector = project.industry?.trim() || 'Non défini';
      if (!acc[sector]) {
        acc[sector] = { projectCount: 0, userCount: 0 };
      }
      acc[sector].projectCount += 1;
      return acc;
    }, {});

    allUsers.forEach((user) => {
      const project = projects.find((proj) => proj.id === user.projectId);
      const sector = project?.industry?.trim() || 'Non défini';
      if (!sectorStats[sector]) {
        sectorStats[sector] = { projectCount: 0, userCount: 0 };
      }
      sectorStats[sector].userCount += 1;
    });

    const sectorsAnalytics = Object.entries(sectorStats)
      .map(([sector, stats]) => ({ sector, ...stats }))
      .sort((a, b) => b.projectCount - a.projectCount || b.userCount - a.userCount);

    const topSector = sectorsAnalytics[0] || { sector: 'Non défini', projectCount: 0, userCount: 0 };
    const topProjectsByUsers = projects
      .map((project) => ({
        id: project.id,
        name: project.name,
        userCount: userCountsByProject[project.id] || 0,
      }))
      .sort((a, b) => b.userCount - a.userCount)
      .slice(0, 5);

    const statCards = [
      { label: tCommon('superadmin.paidProjectsLabel', 'Projets Payants'), value: paidProjectsCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { label: tCommon('superadmin.totalUsersLabel', 'Total Utilisateurs'), value: totalUsersConnected, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      { label: tCommon('superadmin.monthlyRevenueLabel', 'Revenu Mensuel Est. (€)'), value: monthlyRevenue.toFixed(2), color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
      { label: tCommon('superadmin.annualRevenueLabel', 'Revenu Annuel Est. (€)'), value: annualRevenue.toFixed(2), color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    ];

    return (
      <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow">
        <Text className="text-xl font-bold mb-6 dark:text-white">{tCommon('superadmin.globalAnalyticsTitle', 'Analytiques Globaux')}</Text>
 
        <View className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((card, i) => (
            <View key={i} className={`${card.bg} p-5 rounded-2xl border border-slate-100 dark:border-slate-700`}>
              <Text className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{card.label}</Text>
              <Text className={`text-3xl font-black ${card.color}`}>{card.value}</Text>
            </View>
          ))}
        </View>
 
        <View className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <View className="bg-slate-50 dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Text className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">{tCommon('superadmin.topSectorLabel', 'Secteur le plus enregistré')}</Text>
            <Text className="text-2xl font-black text-slate-900 dark:text-white">{topSector.sector}</Text>
            <Text className="mt-3 text-sm text-slate-600 dark:text-slate-300">{tCommon('superadmin.projectsLabel', 'Projets')}: {topSector.projectCount}</Text>
            <Text className="text-sm text-slate-600 dark:text-slate-300">{tCommon('superadmin.usersLabel', 'Utilisateurs')}: {topSector.userCount}</Text>
          </View>

          <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Text className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">{tCommon('superadmin.usersBySectorTitle', 'Utilisateurs par secteur')}</Text>
            {sectorsAnalytics.length === 0 ? (
              <Text className="text-slate-500 dark:text-slate-400">{tCommon('superadmin.noSectorAvailable', 'Aucun secteur disponible')}</Text>
            ) : (
              sectorsAnalytics.slice(0, 5).map((item) => (
                <View key={item.sector} className="mb-4 last:mb-0">
                  <Text className="font-bold text-slate-700 dark:text-white">{item.sector}</Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">{`${tCommon('superadmin.projectsLabel', 'Projets')}: ${item.projectCount} · ${tCommon('superadmin.usersLabel', 'Utilisateurs')}: ${item.userCount}`}</Text>
                </View>
              ))
            )}
          </View>

          <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
            <Text className="text-sm font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-4">{tCommon('superadmin.topProjectsByUsersTitle', 'Top projets par utilisateurs')}</Text>
            {topProjectsByUsers.length === 0 ? (
              <Text className="text-slate-500 dark:text-slate-400">{tCommon('superadmin.noProjectsAvailable', 'Aucun projet disponible')}</Text>
            ) : (
              topProjectsByUsers.map((project) => (
                <View key={project.id} className="mb-4 last:mb-0">
                  <Text className="font-bold text-slate-700 dark:text-white truncate">{project.name || tCommon('superadmin.unnamedProject', 'Sans nom')}</Text>
                  <Text className="text-xs text-slate-500 dark:text-slate-400">{`${tCommon('superadmin.usersLabel', 'Utilisateurs')}: ${project.userCount}`}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </View>
    );
  };

  const tCommon = (key: string, defaultValue: string) => t ? t(key, { defaultValue }) : defaultValue;

  // ────────────────────────────────────────────
  // SETTINGS TAB — Social links save
  // ────────────────────────────────────────────
  const handleSaveSettings = async () => {
    const proj = projects.find(p => p.id === managingProjectId);
    if (!proj) return;
    setSettingsSaving(true);
    try {
      await dispatch(updateProject({ id: proj.id, data: settingsData })).unwrap();
     showToast(tCommon('superadmin.successSettingsSaved', 'Paramètres sauvegardés ✅'), 'success');
     setEditingField(null);
    } catch (e: any) {
     showToast(tCommon('superadmin.errorSettingsSaveFailed', `Erreur: ${e?.message || tCommon('superadmin.errorSaveFailed', 'Sauvegarde échouée')}`), 'error');
    } finally {
      setSettingsSaving(false);
    }
  };

  // Called when entering settings tab to pre-fill state
  const initSettingsData = useCallback((proj: any) => {
    setSettingsData({
      googleMapsUrl: proj.googleMapsUrl || '',
      tiktokUrl: proj.tiktokUrl || '',
      facebookUrl: proj.facebookUrl || '',
      instagramUrl: proj.instagramUrl || '',
      websiteUrl: proj.websiteUrl || '',
      address: proj.address || '',
    });
  }, []);

  // ────────────────────────────────────────────
  // ANALYTICS TAB
  // ────────────────────────────────────────────
  const renderAnalyticsTab = () => {
    const projectUsers = [
      ...allUsers.filter(u => u.projectId === managingProjectId),
      ...admins.filter(
        (admin) =>
          admin.projectId === managingProjectId &&
          !allUsers.some((user) => user.id === admin.id),
      ),
    ];
    const activeUsers = projectUsers.filter(u => u.status === 'active');
    const blockedUsers = projectUsers.filter(u => u.status === 'blocked');

    const statCards = [
      { label: tCommon('superadmin.projectUsersTotalLabel', 'Utilisateurs Total'), value: projectUsers.length, color: 'text-[#1E3A5F] dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
      { label: tCommon('superadmin.activeUsersLabel', 'Utilisateurs Actifs'), value: activeUsers.length, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
      { label: tCommon('superadmin.blockedUsersLabel', 'Utilisateurs Bloqués'), value: blockedUsers.length, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-900/20' },
      { label: tCommon('superadmin.totalPageViewsLabel', 'Vues Totales'), value: totalPageViews, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' },
      { label: tCommon('superadmin.totalSharesLabel', 'Partages'), value: totalShares, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
      { label: tCommon('superadmin.callClicksLabel', 'Clics Appel'), value: callClicks, color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' },
    ];

    return (
      <View>
        <Text className="text-xl font-black dark:text-white mb-6">{tCommon('superadmin.projectAnalytics', '📊 Statistiques du projet')}</Text>

        {/* Stats cards */}
        <View className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, i) => (
            <View key={i} className={`${card.bg} p-5 rounded-2xl border border-slate-100 dark:border-slate-700`}>
              <Text className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{card.label}</Text>
              <Text className={`text-3xl font-black ${card.color}`}>{card.value}</Text>
            </View>
          ))}
        </View>

        {/* Users list */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden">
          <View className="px-6 py-4 border-b border-slate-100 dark:border-slate-700">
            <Text className="font-black text-slate-800 dark:text-white">{tCommon('superadmin.connectedUsersTitle', '👥 Utilisateurs connectés')} ({projectUsers.length})</Text>
          </View>
          {projectUsers.length === 0 ? (
            <View className="p-8 items-center">
              <Text className="text-slate-400 dark:text-slate-500 text-sm">{tCommon('superadmin.noUsersForProject', 'Aucun utilisateur pour ce projet.')}</Text>
            </View>
          ) : (
            projectUsers.map((user, idx) => (
              <View key={user.id} className={`px-6 py-4 flex-row justify-between items-center ${idx !== projectUsers.length - 1 ? 'border-b border-slate-100 dark:border-slate-700' : ''}`}>
                <View className="flex-1">
                  <Text className="font-bold dark:text-white">{user.name}</Text>
                  <Text className="text-sm text-slate-500 dark:text-slate-400">{user.email}</Text>
                  {user.lastLogin && (
                    <Text className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Dernière connexion: {new Date(user.lastLogin).toLocaleDateString('fr-FR')}</Text>
                  )}
                </View>
                <View className={`px-3 py-1 rounded-full ${
                  user.status === 'active' ? 'bg-emerald-100 dark:bg-emerald-900/30' :
                  user.status === 'blocked' ? 'bg-red-100 dark:bg-red-900/30' : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  <Text className={`text-xs font-bold ${
                    user.status === 'active' ? 'text-emerald-700 dark:text-emerald-400' :
                    user.status === 'blocked' ? 'text-red-700 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'
                  }`}>
                    {user.status === 'active'
                      ? tCommon('superadmin.statusActive', '✅ Actif')
                      : user.status === 'blocked'
                        ? tCommon('superadmin.statusBlocked', '🚫 Bloqué')
                        : tCommon('superadmin.statusPending', '⏳ En attente')}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </View>
    );
  };

  // ────────────────────────────────────────────
  // SETTINGS TAB — Social links + Preview
  // ────────────────────────────────────────────
  const renderSettingsTab = () => {
    const socialLinks = [
      { key: 'googleMapsUrl', label: '🗺️ Google Maps', placeholder: 'https://maps.google.com/...', icon: '🗺️' },
      { key: 'tiktokUrl', label: '🎵 TikTok', placeholder: 'https://www.tiktok.com/@...', icon: '🎵' },
      { key: 'facebookUrl', label: '📘 Facebook', placeholder: 'https://www.facebook.com/...', icon: '📘' },
      { key: 'instagramUrl', label: '📸 Instagram', placeholder: 'https://www.instagram.com/...', icon: '📸' },
      { key: 'websiteUrl', label: '🌐 Site Web', placeholder: 'https://www.monsite.com', icon: '🌐' },
      { key: 'address', label: '📍 Adresse', placeholder: '12 Rue de la Paix, Paris...', icon: '📍' },
    ];

    const configuredLinks = socialLinks.filter(l => (settingsData as Record<string, string>)[l.key]);

    return (
      <View>
        <Text className="text-xl font-black dark:text-white mb-6">{tCommon('superadmin.settingsTitle', '⚙️ Paramètres & Liens')}</Text>
 
        {/* Social links form */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6">
          <Text className="font-black text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase tracking-wider">{tCommon('superadmin.socialLinksHeading', 'Liens & Réseaux Sociaux')}</Text>
          <View className="space-y-4">
            {socialLinks.map(link => (
              <View key={link.key}>
                <Text className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-1">{link.label}</Text>
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    value={(settingsData as any)[link.key] || ''}
                    onChangeText={(text) => setSettingsData(prev => ({ ...prev, [link.key]: text }))}
                    placeholder={link.placeholder}
                    className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white text-sm"
                    autoCapitalize="none"
                    keyboardType="url"
                  />
                  {(settingsData as any)[link.key] ? (
                    <TouchableOpacity
                      onPress={() => setSettingsData(prev => ({ ...prev, [link.key]: '' }))}
                      className="bg-red-100 dark:bg-red-900/30 px-3 py-3 rounded-xl"
                    >
                      <Text className="text-red-600 dark:text-red-400 font-bold text-sm">✕</Text>
                    </TouchableOpacity>
                  ) : null}
                </View>
              </View>
            ))}
          </View>

          <TouchableOpacity
            onPress={handleSaveSettings}
            disabled={settingsSaving}
            className="mt-6 bg-[#1E3A5F] px-6 py-3 rounded-xl flex-row items-center justify-center"
          >
            {settingsSaving && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
            <Text className="text-white font-black">{settingsSaving ? tCommon('superadmin.savingSettings', 'Sauvegarde...') : tCommon('superadmin.saveSettingsButton', '💾 Enregistrer les paramètres')}</Text>
          </TouchableOpacity>
        </View>

        {/* Smart Preview */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
          <Text className="font-black text-slate-700 dark:text-slate-300 mb-4 text-sm uppercase tracking-wider">{tCommon('superadmin.previewTitle', '🔍 Prévisualisation')}</Text>
          <Text className="text-xs text-slate-400 dark:text-slate-500 mb-4">Les réseaux configurés apparaissent ici. Google Maps est toujours affiché par défaut.</Text>

          <View className="space-y-3">
            {/* Google Maps — always shown */}
            <View className="flex-row items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
              <View className="flex-row items-center space-x-3">
                <Text className="text-2xl">🗺️</Text>
                <View>
                  <Text className="font-bold dark:text-white">Google Maps</Text>
                  <Text className="text-xs text-slate-500" numberOfLines={1}>
                      {settingsData.googleMapsUrl || tCommon('superadmin.notConfiguredDefault', 'Non configuré (affiché par défaut)')}
                    </Text>                </View>
              </View>
              <View className={`px-2 py-1 rounded-full ${
                settingsData.googleMapsUrl ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-slate-200 dark:bg-slate-700'
              }`}>
                <Text className={`text-xs font-bold ${
                  settingsData.googleMapsUrl ? 'text-emerald-700 dark:text-emerald-400' : 'text-slate-500'
                }`}>
                  {settingsData.googleMapsUrl ? tCommon('superadmin.statusActive', '✅ Actif') : tCommon('superadmin.statusDefault', '⬜ Défaut')}
                </Text>
              </View>
            </View>

            {/* Other configured networks */}
            {socialLinks.filter(l => l.key !== 'googleMapsUrl' && (settingsData as any)[l.key]).map(link => (
              <View key={link.key} className="flex-row items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-200 dark:border-emerald-800">
                <View className="flex-row items-center space-x-3">
                  <Text className="text-2xl">{link.icon}</Text>
                  <View>
                    <Text className="font-bold dark:text-white">{link.label.replace(/^[^ ]+ /, '')}</Text>
                    <Text className="text-xs text-slate-500" numberOfLines={1}>{(settingsData as any)[link.key]}</Text>
                  </View>
                </View>
                <View className="bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                  <Text className="text-xs font-bold text-emerald-700 dark:text-emerald-400">{tCommon('superadmin.configuredStatus', '✅ Configuré')}</Text>
                </View>
              </View>
            ))}

            {configuredLinks.filter(l => l.key !== 'googleMapsUrl').length === 0 && (
              <View className="p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
                <Text className="text-xs text-amber-700 dark:text-amber-400 font-semibold">{tCommon('superadmin.configureSocialLinksHint', '💡 Configurez des liens sociaux pour les voir apparaître ici.')}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // ────────────────────────────────────────────
  // NOTES TAB — Global + per-network notes
  // ────────────────────────────────────────────
  const renderNotesTab = () => {
    const networks = ['Google Maps', 'Facebook', 'Instagram', 'TikTok', 'Site Web'];

    const StarRating = ({ rating, onRate }: { rating: number; onRate: (r: number) => void }) => (
      <View className="flex-row space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <TouchableOpacity key={star} onPress={() => onRate(star)}>
            <Text className="text-2xl">{star <= rating ? '⭐' : '☆'}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );

    const handleDeleteNote = (id: string) => {
      setNetworkNotes(prev => prev.filter(n => n.id !== id));
      showToast(tCommon('superadmin.successNoteDeleted', 'Note supprimée'), 'info');
    };
 
    const handleSaveEditNote = () => {
      if (!editingNoteData) return;
      setNetworkNotes(prev => prev.map(n => n.id === editingNoteData.id ? editingNoteData : n));
      setEditingNoteId(null);
      setEditingNoteData(null);
      showToast(tCommon('superadmin.successNoteUpdated', 'Note mise à jour ✅'), 'success');
    };
 
    const handleAddNote = () => {
      if (!newNote.text.trim()) return;
      const note: NetworkNote = {
        id: `note_${Date.now()}`,
        network: newNote.network,
        text: newNote.text,
        rating: newNote.rating,
      };
      setNetworkNotes(prev => [...prev, note]);
      setNewNote({ network: 'Google Maps', text: '', rating: 5 });
      setShowAddNote(false);
      showToast(tCommon('superadmin.successNoteAdded', 'Note ajoutée ✅'), 'success');
    };

    const notesByNetwork = (net: string) => networkNotes.filter(n => n.network === net);

    return (
      <View>
        <Text className="text-xl font-black dark:text-white mb-6">{tCommon('superadmin.notesSectionTitle', '📝 Notes du Projet')}</Text>
 
        {/* Global Note */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 mb-6">
          <Text className="font-black text-slate-700 dark:text-slate-300 mb-3 text-sm uppercase tracking-wider">{tCommon('superadmin.globalProjectRatingLabel', '⭐ Note Globale du Projet')}</Text>
          <StarRating rating={globalNote.rating} onRate={(r) => setGlobalNote(prev => ({ ...prev, rating: r }))} />
          <TextInput
            value={globalNote.text}
            onChangeText={(text) => setGlobalNote(prev => ({ ...prev, text }))}
            placeholder={tCommon('superadmin.globalProjectCommentPlaceholder', 'Commentaire général sur ce projet...')}
            multiline
            numberOfLines={3}
            className="mt-3 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white text-sm"
          />
          <TouchableOpacity
            onPress={() => showToast(tCommon('superadmin.successGlobalNoteSaved', 'Note globale enregistrée ✅'), 'success')}
            className="mt-3 bg-[#1E3A5F] px-4 py-2 rounded-lg self-end"
          >
            <Text className="text-white font-bold text-sm">{tCommon('superadmin.save', 'Enregistrer')}</Text>
          </TouchableOpacity>
        </View>
 
        {/* Per-network notes */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden mb-6">
          <View className="px-6 py-4 border-b border-slate-100 dark:border-slate-700 flex-row justify-between items-center">
            <Text className="font-black text-slate-700 dark:text-white">{tCommon('superadmin.notesByNetworkTitle', '📋 Notes par Réseau')}</Text>
            <TouchableOpacity
              onPress={() => setShowAddNote(true)}
              className="bg-[#1E3A5F] px-4 py-2 rounded-lg"
            >
              <Text className="text-white font-bold text-sm">{tCommon('superadmin.addNoteButton', '+ Ajouter')}</Text>
            </TouchableOpacity>
          </View>

          {/* Add note form */}
          {showAddNote && (
            <View className="p-6 bg-blue-50 dark:bg-blue-900/10 border-b border-slate-100 dark:border-slate-700">
              <Text className="font-bold text-slate-700 dark:text-slate-300 mb-2">{tCommon('superadmin.newNoteTitle', 'Nouvelle note')}</Text>
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tCommon('superadmin.networkLabel', 'Réseau')}</Text>
                <View className="flex-row flex-wrap gap-2">
                  {networks.map(net => (
                    <TouchableOpacity
                      key={net}
                      onPress={() => setNewNote(prev => ({ ...prev, network: net }))}
                      className={`px-3 py-1.5 rounded-lg ${newNote.network === net ? 'bg-[#1E3A5F]' : 'bg-slate-200 dark:bg-slate-700'}`}
                    >
                      <Text className={`text-xs font-bold ${newNote.network === net ? 'text-white' : 'text-slate-600 dark:text-slate-300'}`}>{net}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className="mb-3">
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">{tCommon('superadmin.noteLabel', 'Note')}</Text>
                <StarRating rating={newNote.rating} onRate={(r) => setNewNote(prev => ({ ...prev, rating: r }))} />
              </View>
              <TextInput
                value={newNote.text}
                onChangeText={(text) => setNewNote(prev => ({ ...prev, text }))}
                placeholder={tCommon('superadmin.noteCommentPlaceholder', 'Votre commentaire...')}
                multiline
                numberOfLines={2}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white text-sm mb-3"
              />
              <View className="flex-row space-x-3">
                <TouchableOpacity onPress={handleAddNote} className="flex-1 bg-[#1E3A5F] py-2 rounded-lg items-center">
                  <Text className="text-white font-bold">{tCommon('superadmin.addButton', 'Ajouter')}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowAddNote(false)} className="flex-1 bg-slate-200 dark:bg-slate-700 py-2 rounded-lg items-center">
                  <Text className="font-bold text-slate-700 dark:text-white">{tCommon('superadmin.cancel', 'Annuler')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Notes list grouped by network */}
          {networks.map(net => {
            const notes = notesByNetwork(net);
            if (notes.length === 0) return null;
            return (
              <View key={net} className="border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                <View className="px-6 py-3 bg-slate-50 dark:bg-slate-900/50">
                  <Text className="font-black text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">{net}</Text>
                </View>
                {notes.map(note => (
                  <View key={note.id} className="px-6 py-4 border-t border-slate-100 dark:border-slate-700">
                    {editingNoteId === note.id && editingNoteData ? (
                      <View>
                        <StarRating
                          rating={editingNoteData.rating}
                          onRate={(r) => setEditingNoteData(prev => prev ? { ...prev, rating: r } : null)}
                        />
                        <TextInput
                          value={editingNoteData.text}
                          onChangeText={(text) => setEditingNoteData(prev => prev ? { ...prev, text } : null)}
                          multiline
                          numberOfLines={2}
                          className="mt-2 w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 dark:text-white text-sm mb-2"
                        />
                        <View className="flex-row space-x-2">
                          <TouchableOpacity onPress={handleSaveEditNote} className="bg-[#1E3A5F] px-4 py-1.5 rounded-lg">
                            <Text className="text-white font-bold text-sm">{tCommon('superadmin.ok', 'OK')}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => { setEditingNoteId(null); setEditingNoteData(null); }} className="bg-slate-200 dark:bg-slate-700 px-4 py-1.5 rounded-lg">
                            <Text className="font-bold text-sm dark:text-white">{tCommon('superadmin.cancel', 'Annuler')}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View className="flex-row justify-between items-start">
                        <View className="flex-1 mr-4">
                          <View className="flex-row mb-1">
                            {[1,2,3,4,5].map(s => <Text key={s} className="text-sm">{s <= note.rating ? '⭐' : '☆'}</Text>)}
                          </View>
                          <Text className="text-sm dark:text-slate-300 text-slate-700">{note.text}</Text>
                        </View>
                        <View className="flex-row space-x-2">
                          <TouchableOpacity
                            onPress={() => { setEditingNoteId(note.id); setEditingNoteData({ ...note }); }}
                            className="bg-blue-100 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg"
                          >
                            <Text className="text-blue-700 dark:text-blue-400 font-bold text-xs">{tCommon('superadmin.editButtonShort', 'Éditer')}</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleDeleteNote(note.id)}
                            className="bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-lg"
                          >
                            <Text className="text-red-600 dark:text-red-400 font-bold text-xs">{tCommon('superadmin.deleteButtonShort', 'Suppr.')}</Text>
                          </TouchableOpacity>                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            );
          })}

          {networkNotes.length === 0 && !showAddNote && (
            <View className="p-8 items-center">
              <Text className="text-slate-400 dark:text-slate-500 text-sm">{tCommon('superadmin.noNotesYet', 'Aucune note pour le moment. Cliquez sur "+ Ajouter" pour commencer.')}</Text>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderProjectForm = () => (
    <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mt-6">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold dark:text-white">
          {currentProject.id ? tCommon('superadmin.projectDetailsTitle', 'Détails du projet') : tCommon('superadmin.newProjectTitle', 'Nouveau Projet')}
        </Text>
        {currentProject.id && !managingProjectId && (
          <TouchableOpacity onPress={() => setManagingProjectId(currentProject.id as string)} className="bg-emerald-100 dark:bg-emerald-900 px-4 py-2 rounded-lg">
            <Text className="text-emerald-700 dark:text-emerald-300 font-bold">{tCommon('superadmin.manageProjectButton', 'Gérer ce projet')}</Text>
          </TouchableOpacity>
        )}
      </View>
      
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.projectNameLabel', 'Nom du projet')}</Text>
          <TextInput
            value={currentProject.name || ''}
            onChangeText={(text) => setCurrentProject(prev => ({ ...prev, name: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder={tCommon('superadmin.projectNamePlaceholder', 'Nom du projet')}
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.projectDescriptionLabel', 'Description')}</Text>
          <TextInput
            value={currentProject.description || ''}
            onChangeText={(text) => setCurrentProject(prev => ({ ...prev, description: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder={tCommon('superadmin.projectDescriptionPlaceholder', 'Description courte')}
          />
        </View>

        <View className="flex-row space-x-4">
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.contactEmailLabel', 'Email contact')} <Text className="text-red-500">*</Text></Text>
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
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.phoneLabel', 'Téléphone')} <Text className="text-red-500">*</Text></Text>
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
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.industryLabel', "Secteur d'activité")}</Text>
            <View className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden h-12 justify-center mb-2">
              <Picker
                selectedValue={currentProject.industry || ''}
                onValueChange={(val) => setCurrentProject(prev => ({ ...prev, industry: val }))}
                style={{ height: 50, width: '100%', color: 'inherit' }}
              >
                <Picker.Item label={tCommon('superadmin.selectSectorPlaceholder', 'Sélectionner un secteur')} value="" />
                {sectors.map(s => <Picker.Item key={s} label={s} value={s} />)}
              </Picker>
            </View>
            <View className="flex-row space-x-2">
              <TextInput 
                placeholder={tCommon('superadmin.newSectorPlaceholder', 'Nouveau secteur')}
                value={newSectorName}
                onChangeText={setNewSectorName}                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2 dark:text-white"
              />
              <TouchableOpacity onPress={handleAddSector} className="bg-[#1E3A5F] px-4 py-2 rounded-lg justify-center">
                <Text className="text-white font-bold">{tCommon('superadmin.addButton', 'Add')}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.paymentStatusLabel', 'Statut Paiement')}</Text>
            <View className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden h-12 justify-center">
              <Picker
                selectedValue={currentProject.paymentStatus || 'pending'}
                onValueChange={(val) => setCurrentProject(prev => ({ 
                  ...prev, 
                  paymentStatus: val as any 
                }))}
                style={{ height: 50, width: '100%', color: 'inherit' }}
              >
                <Picker.Item label={tCommon('superadmin.paymentStatusPending', 'En attente')} value="pending" />
                <Picker.Item label={tCommon('superadmin.paymentStatusPaid', 'Payé')} value="paid" />
                <Picker.Item label={tCommon('superadmin.paymentStatusExpired', 'Expiré')} value="expired" />
              </Picker>
            </View>
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.adminIdLabel', 'ID de l\'Admin')}</Text>
          <View className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden h-12 justify-center">
            <Picker
              selectedValue={currentProject.adminId || ''}
              onValueChange={(val) => setCurrentProject(prev => ({ ...prev, adminId: val }))}
              style={{ height: 50, width: '100%', color: 'inherit' }}
            >
              <Picker.Item label={tCommon('superadmin.selectAdminPlaceholder', 'Sélectionner un admin')} value="" />
              {admins.map(admin => (
                <Picker.Item key={admin.id} label={`${admin.name} (${admin.email})`} value={admin.id} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">{tCommon('superadmin.projectActiveLabel', 'Projet Actif')}</Text>
          <Switch 
            value={currentProject.isActive !== false}
            onValueChange={(val) => setCurrentProject(prev => ({ ...prev, isActive: val }))}
          />
        </View>

        <View className="flex-row justify-end space-x-4 mt-6">
          <TouchableOpacity onPress={() => { setIsEditing(false); setCurrentProject({}); }} className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700" disabled={saving}>
            <Text className="text-slate-800 dark:text-white font-bold">{tCommon('superadmin.cancel', 'Annuler')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveProject} className="px-6 py-3 rounded-lg bg-[#1E3A5F] flex-row items-center" disabled={saving}>
            {saving && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
            <Text className="text-white font-bold">
              {saving ? tCommon('superadmin.saving', 'Enregistrement...') : tCommon('superadmin.save', 'Enregistrer')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderAdminForm = () => (
    <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg mt-6">
      <Text className="text-xl font-bold mb-4 dark:text-white">
        {currentAdmin.id ? tCommon('superadmin.editAdminTitle', 'Modifier l\'admin') : tCommon('superadmin.newAdminTitle', 'Nouvel Admin')}
      </Text>
      
      <View className="space-y-4">
        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.adminNameLabel', 'Nom')} <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={currentAdmin.name || ''}
            onChangeText={(text) => setCurrentAdmin(prev => ({ ...prev, name: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            placeholder={tCommon('superadmin.adminNamePlaceholder', 'Nom complet')}
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.adminEmailLabel', 'Email')} <Text className="text-red-500">*</Text></Text>
          <TextInput
            value={currentAdmin.email || ''}
            onChangeText={(text) => setCurrentAdmin(prev => ({ ...prev, email: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View>
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{tCommon('superadmin.adminPhoneLabel', 'Téléphone')}</Text>
          <TextInput
            value={currentAdmin.phone || ''}
            onChangeText={(text) => setCurrentAdmin(prev => ({ ...prev, phone: text }))}
            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
            keyboardType="phone-pad"
          />
        </View>

        <View className="flex-row items-center justify-between mt-2">
          <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300">{tCommon('superadmin.adminActiveLabel', 'Admin Actif')}</Text>
          <Switch 
            value={currentAdmin.status !== 'blocked'}
            onValueChange={(val) => setCurrentAdmin(prev => ({ ...prev, status: val ? 'active' : 'blocked' }))}
          />
        </View>

        <View className="flex-row justify-end space-x-4 mt-6">
          <TouchableOpacity onPress={() => setIsEditingAdmin(false)} className="px-6 py-3 rounded-lg bg-slate-200 dark:bg-slate-700" disabled={saving}>
            <Text className="text-slate-800 dark:text-white font-bold">{tCommon('superadmin.cancel', 'Annuler')}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSaveAdmin} className="px-6 py-3 rounded-lg bg-[#1E3A5F] flex-row items-center" disabled={saving}>
            {saving && <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />}
            <Text className="text-white font-bold">
              {saving ? tCommon('superadmin.saving', 'Enregistrement...') : tCommon('superadmin.save', 'Enregistrer')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 w-full bg-slate-50 dark:bg-[#0B0F19]">
      <View className="max-w-7xl mx-auto px-4 sm:px-6 py-10 w-full">
        <View className="flex-row justify-end mb-6 flex-wrap gap-2">
          <TouchableOpacity
            onPress={handleToggleTheme}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
              {themeMode === 'dark'
                ? t('common.themeLight', 'Mode clair')
                : t('common.themeDark', 'Mode sombre')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleToggleLanguage}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
              {t('common.languageSwitcher', 'Lang')}: {languageLabel} → {languageNextLabel}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation?.navigate('Profile')}
            className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-3 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Text className="text-sm font-black text-slate-900 dark:text-slate-100">
              {t('common.viewEditProfile', 'Voir / modifier mon profil')}
            </Text>
          </TouchableOpacity>
        </View>

        {managingProjectId ? (
          <View>
            <TouchableOpacity onPress={() => setManagingProjectId(null)} className="mb-6 self-start bg-slate-200 dark:bg-slate-800 px-4 py-2 rounded-lg">
              <Text className="text-slate-800 dark:text-white font-bold">{tCommon('superadmin.returnDashboardButton', '← Retour au Dashboard')}</Text>
            </TouchableOpacity>
             
            <View className="mb-8">
              <Text className="text-3xl font-black dark:text-white">
                {tCommon('superadmin.manageProjectTitle', 'Gestion du Projet')}: {projects.find(p => p.id === managingProjectId)?.name}
              </Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="border-b border-slate-200 dark:border-slate-800 mb-6">
              <View className="flex-row gap-1 pb-0">
                {[
                  { id: 'details', label: tCommon('superadmin.manageTab.details', '📋 Détails') },
                  { id: 'analytics', label: tCommon('superadmin.manageTab.analytics', '📊 Analytiques') },
                  { id: 'settings', label: tCommon('superadmin.manageTab.settings', '⚙️ Paramètres') },
                  { id: 'notes', label: tCommon('superadmin.manageTab.notes', '📝 Notes') },
                  { id: 'coupons', label: tCommon('superadmin.manageTab.coupons', '🎟️ Coupons') },
                  { id: 'roulette', label: tCommon('superadmin.manageTab.roulette', '🎡 Roulette') },
                  { id: 'users', label: tCommon('superadmin.manageTab.users', '👥 Utilisateurs') },
                  { id: 'stickers', label: tCommon('superadmin.manageTab.stickers', '🏷️ Stickers') },
                ].map(tab => (
                  <TouchableOpacity
                    key={tab.id}
                    className={`pb-3 px-4 border-b-2 ${
                      managingTab === tab.id
                        ? 'border-[#1E3A5F] dark:border-blue-400'
                        : 'border-transparent'
                    }`}
                    onPress={() => {
                      setManagingTab(tab.id as any);
                      if (tab.id === 'settings') {
                        const proj = projects.find(p => p.id === managingProjectId);
                        if (proj) initSettingsData(proj);
                      }
                    }}
                  >
                    <Text className={`font-bold whitespace-nowrap ${
                      managingTab === tab.id
                        ? 'text-[#1E3A5F] dark:text-blue-400'
                        : 'text-slate-500'
                    }`}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

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
            {managingTab === 'analytics' && renderAnalyticsTab()}
            {managingTab === 'settings' && renderSettingsTab()}
            {managingTab === 'notes' && renderNotesTab()}
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
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400">{tCommon('superadmin.activeProjects', 'Active Projects')}</Text>
              <Text className="text-3xl font-black text-[#1E3A5F] dark:text-white">{projects.length}</Text>
            </View>
            <View className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400">{tCommon('superadmin.admins', 'Admins')}</Text>
              <Text className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{admins.length}</Text>
            </View>
            <View className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow">
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400">{tCommon('superadmin.sectors', 'Sectors')}</Text>
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
            <Text className={`font-bold ${activeTab === 'projects' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>{tCommon('superadmin.tabs.projects', 'Project Management')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-4 px-6 ${activeTab === 'admins' ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
            onPress={() => setActiveTab('admins')}
          >
            <Text className={`font-bold ${activeTab === 'admins' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>{tCommon('superadmin.tabs.admins', 'Admin Management')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-4 px-6 ${activeTab === 'sectors' ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
            onPress={() => setActiveTab('sectors')}
          >
            <Text className={`font-bold ${activeTab === 'sectors' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>{tCommon('superadmin.tabs.sectors', 'Sector Management')}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            className={`pb-4 px-6 ${activeTab === 'analytics' ? 'border-b-2 border-[#1E3A5F] dark:border-blue-400' : ''}`}
            onPress={() => setActiveTab('analytics')}
          >
            <Text className={`font-bold ${activeTab === 'analytics' ? 'text-[#1E3A5F] dark:text-blue-400' : 'text-slate-500'}`}>{tCommon('superadmin.tabs.analytics', 'Global Analytics')}</Text>
          </TouchableOpacity>
        </View>

        {activeTab === 'projects' && (
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold dark:text-white">{tCommon('superadmin.projectListTitle', 'Project List')}</Text>
              {!isEditing && (
                <TouchableOpacity 
                  className="bg-[#1E3A5F] px-4 py-2 rounded-lg"
                  onPress={() => { setCurrentProject({}); setIsEditing(true); }}
                >
                  <Text className="text-white font-bold">{tCommon('superadmin.addProjectButton', '+ New Project')}</Text>
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
                      <Text className="text-sm text-slate-500 dark:text-slate-400">{`${tCommon('superadmin.adminLabel', 'Admin')}: ${proj.adminId} · ${tCommon('superadmin.statusLabel', 'Statut')}: ${proj.paymentStatus || tCommon('superadmin.notAvailable', 'N/A')} · ${tCommon('superadmin.usersLabel', 'Utilisateurs')}: ${userCountsByProject[proj.id] || 0}`}</Text>
                    </View>
                    <View className="flex-row space-x-3 items-center">
                      <TouchableOpacity onPress={() => { setManagingProjectId(proj.id); setManagingTab('details'); setCurrentProject(proj); }} className="bg-emerald-100 dark:bg-emerald-900 px-3 py-1.5 rounded-lg">
                        <Text className="text-emerald-700 dark:text-emerald-300 font-bold">{tCommon('superadmin.manageButton', 'Gérer')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => openProjectPreview(proj.id)} className="bg-slate-100 dark:bg-slate-700 px-3 py-1.5 rounded-lg">
                        <Text className="text-slate-700 dark:text-slate-300 font-bold">{tCommon('superadmin.previewButton', 'Prévisualiser')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => { setCurrentProject(proj); setIsEditing(true); }} className="bg-blue-100 dark:bg-blue-900 px-3 py-1.5 rounded-lg">
                        <Text className="text-blue-700 dark:text-blue-300 font-bold">{tCommon('superadmin.editButton', 'Éditer')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteProject(proj.id)} className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg" disabled={saving}>
                        <Text className="text-red-700 dark:text-red-300 font-bold">{tCommon('superadmin.deleteButton', 'Supprimer')}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                {projects.length === 0 && (
                  <View className="p-8 items-center">
                    <Text className="text-slate-500 dark:text-slate-400">{tCommon('superadmin.noProjectsFound', 'Aucun projet trouvé')}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'admins' && (
          <View>
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold dark:text-white">{tCommon('superadmin.adminListTitle', 'Admin List')}</Text>
              {!isEditingAdmin && (
                <TouchableOpacity 
                  className="bg-[#1E3A5F] px-4 py-2 rounded-lg"
                  onPress={() => { setCurrentAdmin({}); setIsEditingAdmin(true); }}
                >
                  <Text className="text-white font-bold">{tCommon('superadmin.addAdminButton', '+ New Admin')}</Text>
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
                        <Text className="text-sm text-slate-500 dark:text-slate-400">{adm.email} | {tCommon('superadmin.statusLabel', 'Status')}: {adm.status || tCommon('superadmin.notAvailable', 'N/A')}</Text>
                        {associatedProject && (
                          <View className="flex-row items-center mt-1">
                            <Text className="text-xs bg-[#1E3A5F] text-white px-2 py-0.5 rounded-full mr-2">
                              {tCommon('superadmin.projectLabel', 'Projet')}: {associatedProject.name}
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
                          <Text className="text-blue-700 dark:text-blue-300 font-bold">{tCommon('superadmin.editButton', 'Edit')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteAdmin(adm.id)} className="bg-red-100 dark:bg-red-900 px-3 py-1.5 rounded-lg" disabled={saving}>
                          <Text className="text-red-700 dark:text-red-300 font-bold">{tCommon('superadmin.deleteButton', 'Delete')}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
                {admins.length === 0 && (
                  <View className="p-8 items-center">
                    <Text className="text-slate-500 dark:text-slate-400">{tCommon('superadmin.noAdmins', 'No admins found')}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {activeTab === 'sectors' && (
          <View className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow">
            <Text className="text-xl font-bold mb-4 dark:text-white">{tCommon('superadmin.sectorListTitle', 'Sector List')}</Text>
              
            <View className="flex-row space-x-3 mb-6">
              <TextInput 
                placeholder={tCommon('superadmin.sectorNamePlaceholder', 'Sector Name')}
                value={newSectorName}
                onChangeText={setNewSectorName}
                className="flex-1 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg px-4 py-3 dark:text-white"
              />
              <TouchableOpacity onPress={handleAddSector} className="bg-[#1E3A5F] px-6 py-3 rounded-lg justify-center">
                <Text className="text-white font-bold">{tCommon('superadmin.addSectorButton', 'Add')}</Text>
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
                          <Text className="text-blue-600 dark:text-blue-400 font-bold">{tCommon('superadmin.editButton', 'Edit')}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleDeleteSector(sector)} className="bg-red-100 dark:bg-red-900/30 px-3 py-1.5 rounded-lg">
                          <Text className="text-red-600 dark:text-red-400 font-bold">{tCommon('superadmin.deleteButton', 'Delete')}</Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              ))}
              {sectors.length === 0 && (
                <View className="p-4 items-center">
                  <Text className="text-slate-500">{tCommon('superadmin.noSectorDefined', 'No sectors defined.')}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {activeTab === 'analytics' && renderGlobalAnalyticsTab()}
      </View>
    )}
    </View>
  </ScrollView>
);
};

export default SuperAdminDashboard;
