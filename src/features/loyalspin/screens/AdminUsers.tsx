import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { updateUserInFirebase, deleteUserFromFirebase, saveNewUser } from '../../../store/slices/usersSlice';
import { addAdmin, updateAdmin, deleteAdmin } from '../../../store/slices/adminsSlice';
import { setActiveTab } from '../../../store/slices/uiSlice';

interface AdminUsersProps {
  showToast: any;
  t: any;
  projectId?: string | null;
  isSuperAdmin?: boolean;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ showToast, t, projectId, isSuperAdmin }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const dispatch = useDispatch<AppDispatch>();
  const usersList = useSelector((state: RootState) => state.users?.items ?? []);
  const adminsList = useSelector((state: RootState) => state.admins?.items ?? []);
  const sessionUser = useSelector(
    (state: RootState) => (state as any).webSession?.sessionUser,
  );
  const currentRole = useSelector(
    (state: RootState) => (state as any).webSession?.currentRole,
  );
  const [editingUser, setEditingUser] = React.useState<any | null>(null);
  const [editUserName, setEditUserName] = React.useState('');
  const [editUserEmail, setEditUserEmail] = React.useState('');
  const [editUserPhone, setEditUserPhone] = React.useState('');
  const [editUserRole, setEditUserRole] = React.useState<'admin' | 'user'>(
    'user',
  );
  const [userToDelete, setUserToDelete] = React.useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedUserId, setSelectedUserId] = React.useState<string | null>(
    null,
  );

  // Create user form state
  const [showCreateUser, setShowCreateUser] = React.useState(false);
  const [newUserName, setNewUserName] = React.useState('');
  const [newUserEmail, setNewUserEmail] = React.useState('');
  const [newUserPhone, setNewUserPhone] = React.useState('');
  const [newUserRole, setNewUserRole] = React.useState<'admin' | 'user'>('user');
  const [newUserStatus, setNewUserStatus] = React.useState<'active' | 'blocked' | 'pending'>('active');
  const [createUserErrors, setCreateUserErrors] = React.useState<Record<string, string>>({});

  const enrichedUsers = React.useMemo((): any[] => {
    const baseUsers = projectId
      ? [
          ...usersList.filter((user: any) => user.projectId === projectId),
          ...adminsList
            .filter(
              (admin: any) =>
                admin.projectId === projectId &&
                !usersList.some((user: any) => user.id === admin.id),
            ),
        ]
      : usersList;

    return baseUsers.map((user: any) => ({
      ...user,
      level:
        user.level ||
        (user.role === 'admin'
          ? 'Gold'
          : user.role === 'user'
          ? 'Silver'
          : 'Bronze'),
      visits: user.visits ?? Math.max(1, Math.floor(Math.random() * 48) + 2),
      couponsUsed: user.couponsUsed ?? Math.floor(Math.random() * 12),
      lastVisit: user.lastVisit || 'Il y a 2h',
      loyaltyPoints:
        user.loyaltyPoints ?? Math.floor(Math.random() * 12000) + 450,
      revenue:
        user.revenue ?? parseFloat((Math.random() * 2400 + 120).toFixed(2)),
      verified: user.verified ?? user.status === 'active',
      avatarUrl:
        user.avatarUrl ||
        `https://api.dicebear.com/6.x/identicon/svg?seed=${encodeURIComponent(
          user.email || user.name || user.id,
        )}`,
    }));
  }, [usersList, adminsList, projectId]);

  const canManageUser = React.useCallback((user: any) => {
    if (isSuperAdmin || currentRole === 'super-admin') return true;
    if (!sessionUser) return false;
    if (projectId && user.projectId === projectId) return true;
    if (user.managerId === sessionUser.id) return true;
    if (user.id === sessionUser.id) return true;
    return false;
  }, [isSuperAdmin, currentRole, sessionUser, projectId]);

  const visibleEnrichedUsers = React.useMemo(() => {
    let baseUsers = enrichedUsers;
    if (projectId) {
      baseUsers = baseUsers.filter(u => u.projectId === projectId);
    }
    if (isSuperAdmin || currentRole === 'super-admin') return baseUsers;
    if (!sessionUser) return [];
    return baseUsers.filter(u => canManageUser(u));
  }, [enrichedUsers, currentRole, sessionUser, canManageUser, projectId, isSuperAdmin]);

  const filteredUsers = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return visibleEnrichedUsers.filter(user => {
      if (!query) return true;
      return [user.name, user.email, user.phone, user.level]
        .filter(Boolean)
        .some(value => value.toLowerCase().includes(query));
    });
  }, [visibleEnrichedUsers, searchQuery]);

  const selectedUser = React.useMemo(() => {
    if (selectedUserId) {
      return enrichedUsers.find(user => user.id === selectedUserId) ?? null;
    }
    return filteredUsers[0] ?? null;
  }, [selectedUserId, enrichedUsers, filteredUsers]);

  React.useEffect(() => {
    if (!selectedUserId && filteredUsers.length > 0) {
      setSelectedUserId(filteredUsers[0].id);
    }
    if (filteredUsers.length === 0) {
      setSelectedUserId(null);
    }
  }, [filteredUsers, selectedUserId]);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
  };

  const handleToggleAccountAccess = () => {
    if (!selectedUser) return;
    if (!canManageUser(selectedUser)) {
      showToast(
        tCommon('adminUsers.accessDenied', 'Accès refusé : client non géré.'),
        'error',
      );
      return;
    }
    if (
      sessionUser &&
      selectedUser.email.toLowerCase() === sessionUser.email.toLowerCase()
    ) {
      showToast(
        tCommon(
          'adminUsers.cannotBlockSelf',
          'Impossible de bloquer votre propre compte admin !',
        ),
        'error',
      );
      return;
    }
    const updated: any = {
      ...selectedUser,
      status: selectedUser.status === 'active' ? 'blocked' : 'active',
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUserInFirebase(updated))
      .unwrap()
      .then(() => {
        if (updated.role === 'admin') {
          if (adminsList.some((admin: any) => admin.id === updated.id)) {
            dispatch(updateAdmin(updated));
          } else {
            dispatch(addAdmin(updated));
          }
        }
        showToast(
          tCommon(
            selectedUser.status === 'active'
              ? 'adminUsers.userBlocked'
              : 'adminUsers.userReactivated',
            selectedUser.status === 'active'
              ? 'Utilisateur bloqué avec succès !'
              : 'Compte réactivé !',
          ),
          'info',
        );
      })
      .catch(() => {
        showToast(
          tCommon('adminUsers.userUpdateFailed', 'Impossible de mettre à jour l utilisateur.'),
          'error',
        );
      });
  };

  const handleSendNotification = () => {
    if (!selectedUser) return;
    showToast(
      tCommon(
        'adminUsers.notificationSent',
        `Notification envoyée à ${selectedUser.name} !`,
      ),
      'success',
    );
  };

  const handleCancelEditUser = () => {
    setEditingUser(null);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editingUser) return;
    if (!canManageUser(editingUser)) {
      showToast(
        tCommon('adminUsers.accessDenied', 'Accès refusé : client non géré.'),
        'error',
      );
      return;
    }
    const updatedUser = {
      ...editingUser,
      name: editUserName.trim(),
      email: editUserEmail.trim().toLowerCase(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUserInFirebase(updatedUser))
      .unwrap()
      .then(() => {
        if (updatedUser.role === 'admin') {
          if (adminsList.some((admin: any) => admin.id === updatedUser.id)) {
            dispatch(updateAdmin(updatedUser));
          } else {
            dispatch(addAdmin(updatedUser));
          }
        } else if (editingUser?.role === 'admin') {
          dispatch(deleteAdmin(updatedUser.id));
        }
        showToast(
          tCommon('adminUsers.userUpdated', 'Utilisateur mis à jour avec succès !'),
          'success',
        );
        setEditingUser(null);
      })
      .catch(() => {
        showToast(
          tCommon('adminUsers.userUpdateFailed', 'Impossible de mettre à jour l utilisateur.'),
          'error',
        );
      });
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    if (!canManageUser(userToDelete)) {
      showToast(
        tCommon('adminUsers.accessDenied', 'Accès refusé : client non géré.'),
        'error',
      );
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      return;
    }
    if (editingUser?.id === userToDelete.id) {
      setEditingUser(null);
    }
    dispatch(deleteUserFromFirebase(userToDelete.id))
      .unwrap()
      .then(() => {
        if (userToDelete.role === 'admin') {
          dispatch(deleteAdmin(userToDelete.id));
        }
        showToast(
          tCommon('adminUsers.userDeleted', 'Utilisateur supprimé !'),
          'info',
        );
      })
      .catch(() => {
        showToast(
          tCommon('adminUsers.userDeleteFailed', 'Impossible de supprimer l utilisateur.'),
          'error',
        );
      });
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleCreateUser = () => {
    const errors: Record<string, string> = {};
    if (!newUserName.trim() || newUserName.trim().length < 2)
      errors.name = 'Le nom est requis (minimum 2 caractères).';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const cleanEmail = newUserEmail.trim().toLowerCase();
    
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      errors.email = 'Un email valide est requis.';
    } else {
      const emailExists = usersList.some((u: any) => u.email.toLowerCase() === cleanEmail);
      if (emailExists) {
        errors.email = 'Cet email est déjà utilisé par un autre compte.';
      }
    }
    
    if (newUserPhone.trim()) {
      const phoneExists = usersList.some((u: any) => u.phone === newUserPhone.trim());
      if (phoneExists) {
        errors.phone = 'Ce numéro de téléphone est déjà utilisé.';
      }
    }

    setCreateUserErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const newUser: any = {
      id: `user_${Date.now()}`,
      name: newUserName.trim(),
      email: newUserEmail.trim().toLowerCase(),
      phone: newUserPhone.trim() || undefined,
      role: newUserRole,
      status: newUserStatus,
      projectId: projectId || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    dispatch(saveNewUser(newUser))
      .unwrap()
      .then(() => {
        if (newUser.role === 'admin') {
          dispatch(addAdmin(newUser));
        }
        showToast(
          tCommon('adminUsers.userCreated', 'Utilisateur créé avec succès !'),
          'success',
        );
        setShowCreateUser(false);
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPhone('');
        setNewUserRole('user');
        setNewUserStatus('active');
        setCreateUserErrors({});
      })
      .catch(() => {
        showToast("Erreur lors de la création de l'utilisateur.", 'error');
      });
  };

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      {!projectId && (
        <TouchableOpacity
          onPress={() => dispatch(setActiveTab('AdminManage'))}
          className="mb-6 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl self-start"
          style={{ alignSelf: 'flex-start' }}
        >
          <Text className="text-xs font-black text-slate-600 dark:text-slate-200">
            {tCommon('adminUsers.backToManage', '← Retour à Manage')}
          </Text>
        </TouchableOpacity>
      )}

      <View className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <View>
          <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {tCommon('adminUsers.title', 'Gestion des Comptes Membres')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold max-w-2xl">
            {tCommon(
              'adminUsers.description',
              'Visualisez la liste des inscrits, modifiez les rôles ou désactivez temporairement des accès.',
            )}
          </Text>
        </View>

        <View className="flex flex-row items-center gap-3 w-full sm:w-auto">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={tCommon(
              'adminUsers.searchPlaceholder',
              'Rechercher un client...',
            )}
            className="flex-1 px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
          <TouchableOpacity
            onPress={() => { setShowCreateUser((v: boolean) => !v); setCreateUserErrors({}); }}
            className="bg-[#F97316] px-4 py-3 rounded-3xl"
            style={{ flexShrink: 0 }}
          >
            <Text className="text-white font-black text-sm">{showCreateUser ? 'X Annuler' : '+ Nouvel Utilisateur'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showCreateUser && (
        <View className="mt-6 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <Text className="text-xl font-black text-slate-900 dark:text-slate-100 mb-4">
            {tCommon('adminUsers.createUserTitle', 'Creer un utilisateur')}
          </Text>
          <View className="grid gap-4 md:grid-cols-2">
            <View>
              <TextInput
                value={newUserName}
                onChangeText={(v: string) => { setNewUserName(v); setCreateUserErrors((e: Record<string,string>) => ({...e, name: ''})); }}
                placeholder={tCommon('adminUsers.fullNamePlaceholder', 'Nom complet *')}
                className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
              {!!createUserErrors.name && <Text className="text-rose-500 text-xs mt-1 ml-2">{createUserErrors.name}</Text>}
            </View>
            <View>
              <TextInput
                value={newUserEmail}
                onChangeText={(v: string) => { setNewUserEmail(v); setCreateUserErrors((e: Record<string,string>) => ({...e, email: ''})); }}
                placeholder="Email *"
                keyboardType="email-address"
                autoCapitalize="none"
                className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
              {!!createUserErrors.email && <Text className="text-rose-500 text-xs mt-1 ml-2">{createUserErrors.email}</Text>}
            </View>
            <View>
              <TextInput
                value={newUserPhone}
                onChangeText={setNewUserPhone}
                placeholder={tCommon('adminUsers.phonePlaceholder', 'Telephone (optionnel)')}
                keyboardType="phone-pad"
                className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100"
              />
            </View>
            <View className="w-full border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden bg-white dark:bg-slate-950">
              <Picker
                selectedValue={newUserRole}
                onValueChange={(val: any) => setNewUserRole(val)}
                style={{ height: 50 }}
              >
                <Picker.Item label={tCommon('adminUsers.roleUser', 'Utilisateur')} value="user" />
                <Picker.Item label={tCommon('adminUsers.roleAdmin', 'Administrateur')} value="admin" />
              </Picker>
            </View>
            <View className="w-full border border-slate-300 dark:border-slate-700 rounded-3xl overflow-hidden bg-white dark:bg-slate-950">
              <Picker
                selectedValue={newUserStatus}
                onValueChange={(val: any) => setNewUserStatus(val)}
                style={{ height: 50 }}
              >
                <Picker.Item label="Actif" value="active" />
                <Picker.Item label="Bloque" value="blocked" />
                <Picker.Item label="En attente" value="pending" />
              </Picker>
            </View>
            <View className="md:col-span-2 flex flex-row justify-end gap-3 mt-2">
              <TouchableOpacity
                onPress={() => { setShowCreateUser(false); setCreateUserErrors({}); }}
                className="bg-slate-200 dark:bg-slate-700 px-6 py-3 rounded-3xl"
              >
                <Text className="font-black text-slate-700 dark:text-slate-200">{tCommon('adminUsers.cancel', 'Annuler')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleCreateUser}
                className="bg-[#F97316] px-6 py-3 rounded-3xl"
              >
                <Text className="font-black text-white">{tCommon('adminUsers.createUser', 'Creer l utilisateur')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View className="grid gap-8 xl:grid-cols-[1.8fr_1fr] mt-8">
        <View className="space-y-6">
          <View className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <View>
              <Text className="text-lg font-black text-slate-900 dark:text-slate-100">
                {tCommon('adminUsers.clientListHeading', 'Liste des Clients')}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                {filteredUsers.length}{' '}
                {tCommon('adminUsers.clientCount', 'clients trouvés')}
              </Text>
            </View>
            <View className="flex flex-wrap gap-2">
              <View className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2">
                <Text className="text-[11px] font-black text-slate-700 dark:text-slate-200">
                  {tCommon('adminUsers.statusActive', 'Actifs')} :{' '}
                  {filteredUsers.filter(u => u.status === 'active').length}
                </Text>
              </View>
              <View className="rounded-full bg-rose-100 dark:bg-rose-900/20 px-3 py-2">
                <Text className="text-[11px] font-black text-rose-700 dark:text-rose-200">
                  {tCommon('adminUsers.statusBlocked', 'Bloqués')} :{' '}
                  {filteredUsers.filter(u => u.status !== 'active').length}
                </Text>
              </View>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
            <View className="overflow-x-auto">
              <table className="w-full text-xs text-left font-semibold">
                <thead className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 uppercase tracking-widest text-[9.5px] text-slate-400">
                  <tr>
                    <th className="px-6 py-4">
                      {tCommon('adminUsers.tableClient', 'Client')}
                    </th>
                    <th className="px-6 py-4">
                      {tCommon('adminUsers.tableContact', 'Contact')}
                    </th>
                    <th className="px-6 py-4">
                      {tCommon('adminUsers.tableLevel', 'Niveau')}
                    </th>
                    <th className="px-6 py-4">
                      {tCommon('adminUsers.tableVisits', 'Visites')}
                    </th>
                    <th className="px-6 py-4">
                      {tCommon('adminUsers.tableCoupons', 'Coupons')}
                    </th>
                    <th className="px-6 py-4">
                      {tCommon('adminUsers.tableStatus', 'Statut')}
                    </th>
                    <th className="px-6 py-4 text-center">
                      {tCommon('adminUsers.tableActions', 'Actions')}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                  {filteredUsers.map(user => {
                    const isActive = user.id === selectedUser?.id;
                    return (
                      <tr
                        key={user.id}
                        className={`transition ${
                          isActive
                            ? 'bg-slate-50 dark:bg-slate-800'
                            : 'hover:bg-slate-50/60 dark:hover:bg-slate-800/70'
                        }`}
                        onClick={() => handleSelectUser(user.id)}
                      >
                        <td className="px-6 py-4 font-black flex items-center gap-3">
                          <View className="w-9 h-9 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
                            <Image
                              source={{ uri: user.avatarUrl }}
                              className="w-full h-full"
                            />
                          </View>
                          <View>
                            <Text>{user.name}</Text>
                            <Text className="text-[11px] text-slate-500 dark:text-slate-400">
                              {user.lastVisit}
                            </Text>
                          </View>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          <Text>{user.email}</Text>
                          <Text className="text-[11px] text-slate-400">
                            {user.phone || 'N/A'}
                          </Text>
                        </td>
                        <td className="px-6 py-4">
                          <Text className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-100">
                            {user.level}
                          </Text>
                        </td>
                        <td className="px-6 py-4">{user.visits}</td>
                        <td className="px-6 py-4">{user.couponsUsed} Used</td>
                        <td className="px-6 py-4">
                          <Text
                            className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                              user.status === 'active'
                                ? 'bg-emerald-50 text-emerald-600'
                                : 'bg-rose-50 text-rose-600'
                            }`}
                          >
                            {user.status === 'active' ? 'Active' : 'Blocked'}
                          </Text>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <View className="flex flex-row justify-center gap-2">
                            <TouchableOpacity
                              onPress={() => setSelectedUserId(user.id)}
                              className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                              <Text className="text-[11px] font-black text-slate-700 dark:text-slate-100">
                                {tCommon('adminUsers.viewAction', 'Voir')}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setEditingUser(user);
                                setEditUserName(user.name);
                                setEditUserEmail(user.email);
                                setEditUserPhone(user.phone || '');
                                setEditUserRole(user.role || 'user');
                              }}
                              className="bg-amber-100 dark:bg-amber-900/40 px-3 py-2 rounded-2xl transition"
                            >
                              <Text className="text-[11px] font-black text-amber-700 dark:text-amber-400">
                                {tCommon('adminUsers.edit', 'Edit')}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => {
                                setUserToDelete(user);
                                setShowDeleteConfirm(true);
                              }}
                              className="bg-rose-100 dark:bg-rose-900/40 px-3 py-2 rounded-2xl transition"
                            >
                              <Text className="text-[11px] font-black text-rose-700 dark:text-rose-400">
                                {tCommon('adminUsers.delete', 'Del')}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </View>
          </View>
        </View>

        <View className="space-y-6">
          <View className="bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
            {selectedUser ? (
              <>
                <View className="flex flex-col items-center gap-4 text-center">
                  <View className="w-28 h-28 rounded-[30px] overflow-hidden border border-slate-700 shadow-lg">
                    <Image
                      source={{ uri: selectedUser.avatarUrl }}
                      className="w-full h-full"
                    />
                  </View>
                  <Text className="text-2xl font-black">
                    {selectedUser.name}
                  </Text>
                  <Text className="text-slate-400 text-sm">
                    {tCommon(
                      'adminUsers.memberSince',
                      'Membre depuis Jan 12, 2023',
                    )}
                  </Text>
                  <View className="flex flex-wrap items-center justify-center gap-2">
                    <View className="rounded-full bg-amber-600 px-3 py-1">
                      <Text className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-950">
                        {selectedUser.level} Tier
                      </Text>
                    </View>
                    <View className="rounded-full bg-slate-800 px-3 py-1">
                      <Text className="text-[11px] font-black uppercase tracking-[0.12em] text-slate-100">
                        {selectedUser.verified ? 'Verified' : 'Unverified'}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="grid grid-cols-2 gap-3 mt-6">
                  <View className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4">
                    <Text className="text-[11px] uppercase tracking-widest text-slate-400">
                      {tCommon('adminUsers.totalRevenue', 'Total Revenue')}
                    </Text>
                    <Text className="text-2xl font-black text-white mt-2">
                      ${selectedUser.revenue.toFixed(2)}
                    </Text>
                  </View>
                  <View className="rounded-3xl bg-slate-900/80 border border-slate-800 p-4">
                    <Text className="text-[11px] uppercase tracking-widest text-slate-400">
                      {tCommon('adminUsers.loyaltyPoints', 'Loyalty Points')}
                    </Text>
                    <Text className="text-2xl font-black text-amber-400 mt-2">
                      {selectedUser.loyaltyPoints}
                    </Text>
                  </View>
                </View>

                <View className="mt-6">
                  <View className="flex items-center justify-between">
                    <Text className="text-sm font-black uppercase tracking-[0.18em] text-slate-400">
                      {tCommon(
                        'adminUsers.recentHistory',
                        'Historique des Achats',
                      )}
                    </Text>
                    <Text className="text-xs text-slate-500 hover:text-white transition cursor-pointer">
                      {tCommon('adminUsers.viewAll', 'Voir Tout')}
                    </Text>
                  </View>

                  <View className="mt-4 space-y-3">
                    <View className="rounded-3xl bg-slate-900/70 p-4 border border-slate-800">
                      <Text className="text-sm font-black text-white">
                        Double Espresso
                      </Text>
                      <Text className="text-[11px] text-slate-500 mt-1">
                        Nov 24, 2024 • Midtown Branch
                      </Text>
                      <Text className="text-right text-sm font-black text-emerald-300 mt-2">
                        $4.50
                      </Text>
                    </View>
                    <View className="rounded-3xl bg-slate-900/70 p-4 border border-slate-800">
                      <Text className="text-sm font-black text-white">
                        Pastry Combo
                      </Text>
                      <Text className="text-[11px] text-slate-500 mt-1">
                        Nov 22, 2024 • Downtown Branch
                      </Text>
                      <Text className="text-right text-sm font-black text-slate-300 mt-2">
                        FREE
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-6 rounded-3xl border border-rose-600/30 bg-rose-950/80 p-4">
                  <View className="flex items-center justify-between gap-3">
                    <View>
                      <Text className="font-black text-sm text-white">
                        {tCommon('adminUsers.accountAccess', 'Account Access')}
                      </Text>
                      <Text className="text-xs text-slate-400 mt-1">
                        {tCommon(
                          'adminUsers.accountAccessHint',
                          'Prevent client from spinning or login',
                        )}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={handleToggleAccountAccess}
                      className={`w-14 h-8 rounded-full flex items-center justify-center transition ${
                        selectedUser.status === 'active'
                          ? 'bg-emerald-500'
                          : 'bg-rose-500'
                      }`}
                    >
                      <Text className="text-[11px] font-black text-slate-950">
                        {selectedUser.status === 'active' ? 'ON' : 'OFF'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  onPress={handleSendNotification}
                  className="w-full rounded-3xl bg-slate-100 py-4 hover:bg-slate-200 transition"
                >
                  <Text className="text-slate-900 font-black text-base text-center">
                    {tCommon(
                      'adminUsers.sendNotification',
                      'Send Custom Reward Notification',
                    )}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <View className="py-16 text-center">
                <Text className="text-slate-300 text-lg font-black">
                  {tCommon(
                    'adminUsers.noUserSelected',
                    'Sélectionnez un client pour afficher le profil.',
                  )}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {editingUser && (
        <View className="mt-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <View className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-slate-100">
                {tCommon('adminUsers.editUserTitle', 'Modifier un utilisateur')}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {tCommon(
                  'adminUsers.editUserDescription',
                  'Mettez à jour les informations utilisateur puis enregistrez.',
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCancelEditUser}
              className="bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition flex items-center justify-center"
            >
              <Text className="text-slate-600 dark:text-slate-300 font-semibold">
                {tCommon('adminUsers.cancel', 'Annuler')}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="grid gap-4 mt-6 md:grid-cols-2">
            <TextInput
              value={editUserName}
              onChangeText={setEditUserName}
              placeholder={tCommon(
                'adminUsers.fullNamePlaceholder',
                'Nom complet',
              )}
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <TextInput
              keyboardType="email-address"
              value={editUserEmail}
              onChangeText={setEditUserEmail}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <TextInput
              value={editUserPhone}
              onChangeText={setEditUserPhone}
              placeholder={tCommon('adminUsers.phonePlaceholder', 'Téléphone')}
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <View className="w-full">
              <Picker
                selectedValue={editUserRole}
                onValueChange={(value: 'admin' | 'user') =>
                  setEditUserRole(value)
                }
              >
                <Picker.Item
                  label={tCommon('adminUsers.roleUser', 'Utilisateur')}
                  value="user"
                />
                <Picker.Item
                  label={tCommon('adminUsers.roleAdmin', 'Administrateur')}
                  value="admin"
                />
              </Picker>
            </View>
            <View className="md:col-span-2 flex justify-end gap-3">
              <TouchableOpacity
                onPress={() => handleSaveUserEdit({} as any)}
                className="bg-[#F97316] px-6 py-3 rounded-3xl hover:bg-[#e0630b] transition flex items-center justify-center"
              >
                <Text className="text-white font-black">
                  {tCommon('adminUsers.saveChanges', 'Enregistrer')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showDeleteConfirm && userToDelete && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {tCommon(
                  'adminUsers.confirmDeleteUser',
                  'Voulez-vous supprimer définitivement cet utilisateur ?',
                )}
              </Text>
            </View>
            <View className="flex gap-3">
              <TouchableOpacity
                onPress={cancelDeleteUser}
                className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-xl px-4 py-3 hover:bg-slate-300 dark:hover:bg-slate-600 transition flex items-center justify-center"
              >
                <Text className="text-slate-700 dark:text-slate-200 font-black">
                  {tCommon('admin.cancelButton', 'Annuler')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteUser}
                className="flex-1 bg-rose-600 rounded-xl px-4 py-3 hover:bg-rose-700 transition flex items-center justify-center"
              >
                <Text className="text-white font-black">
                  {tCommon('adminUsers.delete', 'Supprimer')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default AdminUsers;
