import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateUser, deleteUser } from '../../../store/slices/usersSlice';
import { setActiveTab } from '../../../store/slices/uiSlice';

interface AdminUsersProps {
  showToast: any;
  t: any;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ showToast, t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const dispatch = useDispatch();
  const usersList = useSelector((state: RootState) => state.users?.items ?? []);
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

  const enrichedUsers = React.useMemo((): any[] => {
    return usersList.map((user: any) => ({
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
  }, [usersList]);

  const visibleEnrichedUsers = React.useMemo(() => {
    // super-admin sees all users; normal admin sees only their managed users
    if (currentRole === 'super-admin') return enrichedUsers;
    if (!sessionUser) return [];
    return enrichedUsers.filter(
      u => u.managerId === sessionUser.id || u.id === sessionUser.id,
    );
  }, [enrichedUsers, currentRole, sessionUser]);

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
    // prevent admins from toggling accounts they don't manage
    if (currentRole !== 'super-admin' && sessionUser) {
      if (
        selectedUser.managerId !== sessionUser.id &&
        selectedUser.id !== sessionUser.id
      ) {
        showToast(
          tCommon('adminUsers.accessDenied', 'Accès refusé : client non géré.'),
          'error',
        );
        return;
      }
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
    dispatch(updateUser(updated));
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

  const handleStartEditUser = (user: any) => {
    // ensure admin can only edit their clients
    if (currentRole !== 'super-admin' && sessionUser) {
      if (user.managerId !== sessionUser.id && user.id !== sessionUser.id) {
        showToast(
          tCommon('adminUsers.accessDenied', 'Accès refusé : client non géré.'),
          'error',
        );
        return;
      }
    }
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPhone(user.phone || '');
    setEditUserRole(user.role === 'admin' ? 'admin' : 'user');
  };

  const handleCancelEditUser = () => {
    setEditingUser(null);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      name: editUserName.trim(),
      email: editUserEmail.trim().toLowerCase(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateUser(updatedUser));
    showToast(
      tCommon('adminUsers.userUpdated', 'Utilisateur mis à jour avec succès !'),
      'success',
    );
    setEditingUser(null);
  };

  const handleDeleteUserClick = (userId: string, role: string) => {
    if (role === 'admin') return;
    const user = usersList.find(u => u.id === userId);
    if (currentRole !== 'super-admin' && sessionUser && user) {
      if (user.managerId !== sessionUser.id && user.id !== sessionUser.id) {
        showToast(
          tCommon(
            'adminUsers.accessDenied',
            'Accès refusé : impossible de supprimer.',
          ),
          'error',
        );
        return;
      }
    }
    if (user) {
      setUserToDelete(user);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    if (editingUser?.id === userToDelete.id) {
      setEditingUser(null);
    }
    dispatch(deleteUser(userToDelete.id));
    showToast(
      tCommon('adminUsers.userDeleted', 'Utilisateur supprimé !'),
      'info',
    );
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleToggleUserRole = (userId: string, currentVal: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;
    if (currentRole !== 'super-admin' && sessionUser) {
      if (target.managerId !== sessionUser.id && target.id !== sessionUser.id) {
        showToast(
          tCommon(
            'adminUsers.accessDenied',
            'Accès refusé : impossible de modifier le rôle.',
          ),
          'error',
        );
        return;
      }
    }
    const updated = {
      ...target,
      role: currentVal === 'admin' ? 'user' : 'admin',
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUser(updated));
    showToast(
      tCommon('adminUsers.roleUpdated', "Rôle de l'utilisateur modifié !"),
      'success',
    );
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;
    if (currentRole !== 'super-admin' && sessionUser) {
      if (target.managerId !== sessionUser.id && target.id !== sessionUser.id) {
        showToast(
          tCommon(
            'adminUsers.accessDenied',
            'Accès refusé : impossible de modifier le statut.',
          ),
          'error',
        );
        return;
      }
    }

    if (
      sessionUser &&
      target.email.toLowerCase() === sessionUser.email.toLowerCase()
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

    const newStatus = (currentStatus === 'active' ? 'rejected' : 'active') as
      | 'active'
      | 'rejected';
    const updated: any = {
      ...target,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUser(updated));
    showToast(
      tCommon(
        currentStatus === 'active'
          ? 'adminUsers.userBlocked'
          : 'adminUsers.userReactivated',
        currentStatus === 'active'
          ? 'Utilisateur bloqué avec succès !'
          : 'Compte réactivé !',
      ),
      'info',
    );
  };

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <TouchableOpacity
        onPress={() => dispatch(setActiveTab('AdminManage'))}
        className="mb-6 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl self-start"
        style={{ alignSelf: 'flex-start' }}
      >
        <Text className="text-xs font-black text-slate-600 dark:text-slate-200">
          {tCommon('adminUsers.backToManage', '← Retour à Manage')}
        </Text>
      </TouchableOpacity>

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

        <View className="w-full sm:w-auto">
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={tCommon(
              'adminUsers.searchPlaceholder',
              'Rechercher un client par nom, email ou téléphone...',
            )}
            className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          />
        </View>
      </View>

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
              <View className="rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-2 text-[11px] font-black text-slate-700 dark:text-slate-200">
                {tCommon('adminUsers.statusActive', 'Actifs')} :{' '}
                {filteredUsers.filter(u => u.status === 'active').length}
              </View>
              <View className="rounded-full bg-rose-100 dark:bg-rose-900/20 px-3 py-2 text-[11px] font-black text-rose-700 dark:text-rose-200">
                {tCommon('adminUsers.statusBlocked', 'Bloqués')} :{' '}
                {filteredUsers.filter(u => u.status !== 'active').length}
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
                          <View className="flex justify-center gap-2">
                            <TouchableOpacity
                              onPress={() => setSelectedUserId(user.id)}
                              className="bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded-2xl text-[11px] font-black text-slate-700 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700 transition"
                            >
                              {tCommon('adminUsers.viewAction', 'Voir')}
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
                    <View className="rounded-full bg-amber-600 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-950">
                      {selectedUser.level} Tier
                    </View>
                    <View className="rounded-full bg-slate-800 px-3 py-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-100">
                      {selectedUser.verified ? 'Verified' : 'Unverified'}
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
                  className="w-full rounded-3xl bg-slate-100 text-slate-900 py-4 font-black text-base hover:bg-slate-200 transition"
                >
                  {tCommon(
                    'adminUsers.sendNotification',
                    'Send Custom Reward Notification',
                  )}
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
              className="text-slate-655 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {tCommon('adminUsers.cancel', 'Annuler')}
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
                className="bg-[#F97316] text-white px-6 py-3 rounded-3xl font-black hover:bg-[#e0630b] transition"
              >
                {tCommon('adminUsers.saveChanges', 'Enregistrer')}
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
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteUser}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('adminUsers.delete', 'Supprimer')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default AdminUsers;
