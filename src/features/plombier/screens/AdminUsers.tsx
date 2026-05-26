import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateUser, deleteUser } from '../../../store/slices/usersSlice';

interface AdminUsersProps {
  showToast: any;
  t: any;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ showToast, t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const dispatch = useDispatch();
  const usersList = useSelector((state: RootState) => state.users.items);
  const sessionUser = useSelector(
    (state: RootState) => (state as any).webSession?.sessionUser,
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

  const handleStartEditUser = (user: any) => {
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
    e.preventDefault();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <h1 className="text-3xl font-black tracking-tight">
        {tCommon('adminUsers.title', 'Gestion des Comptes Membres')}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'adminUsers.description',
          'Visualisez la liste des inscrits, modifiez les rôles ou désactivez temporairement des accès.',
        )}
      </p>

      {editingUser && (
        <div className="mt-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-black">
                {tCommon('adminUsers.editUserTitle', 'Modifier un utilisateur')}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {tCommon(
                  'adminUsers.editUserDescription',
                  'Mettez à jour les informations utilisateur puis enregistrez.',
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCancelEditUser}
              className="text-slate-655 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {tCommon('adminUsers.cancel', 'Annuler')}
            </button>
          </div>

          <form
            onSubmit={handleSaveUserEdit}
            className="grid gap-4 mt-6 md:grid-cols-2"
          >
            <input
              value={editUserName}
              onChange={e => setEditUserName(e.target.value)}
              placeholder={tCommon(
                'adminUsers.fullNamePlaceholder',
                'Nom complet',
              )}
              required
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
            <input
              type="email"
              value={editUserEmail}
              onChange={e => setEditUserEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
            <input
              value={editUserPhone}
              onChange={e => setEditUserPhone(e.target.value)}
              placeholder={tCommon('adminUsers.phonePlaceholder', 'Téléphone')}
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />
            <select
              value={editUserRole}
              onChange={e =>
                setEditUserRole(e.target.value as 'admin' | 'user')
              }
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <option value="user">Utilisateur</option>
              <option value="admin">Administrateur</option>
            </select>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button
                type="submit"
                className="bg-[#F97316] text-white px-6 py-3 rounded-3xl font-black hover:bg-[#e0630b] transition"
              >
                {tCommon('adminUsers.saveChanges', 'Enregistrer')}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-semibold">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
              <tr>
                <th className="px-6 py-4">{t.nom_complet}</th>
                <th className="px-6 py-4">Adresse Email</th>
                <th className="px-6 py-4">{t.telephone}</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
              {usersList.map(u => (
                <tr
                  key={u.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition"
                >
                  <td className="px-6 py-4 font-black">{u.name}</td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {u.email}
                  </td>
                  <td className="px-6 py-4">{u.phone || 'N/A'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded text-[9.5px] font-black uppercase ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                        u.status === 'active'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-rose-50 text-rose-600'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-wrap justify-center gap-2">
                      <button
                        onClick={() => handleStartEditUser(u)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-white px-2.5 py-1 rounded transition"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteUserClick(u.id, u.role)}
                        disabled={u.role === 'admin'}
                        className={`px-2.5 py-1 rounded font-black transition ${
                          u.role === 'admin'
                            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                            : 'bg-rose-600 hover:bg-rose-700 text-white'
                        }`}
                      >
                        {u.role === 'admin'
                          ? tCommon(
                              'adminUsers.protectedAdmin',
                              'Admin protégé',
                            )
                          : tCommon('adminUsers.delete', 'Supprimer')}
                      </button>
                      <button
                        onClick={() => handleToggleUserRole(u.id, u.role)}
                        className="bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-650 text-slate-700 dark:text-white px-2.5 py-1 rounded transition"
                      >
                        {u.role === 'admin' ? 'Rétrograder' : 'Promouvoir'}
                      </button>
                      <button
                        onClick={() => handleToggleUserStatus(u.id, u.status)}
                        className={`px-2.5 py-1 rounded text-white transition font-black ${
                          u.status === 'active'
                            ? 'bg-rose-600 hover:bg-rose-700'
                            : 'bg-emerald-600 hover:bg-emerald-700'
                        }`}
                      >
                        {u.status === 'active' ? 'Bloquer' : 'Activer'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {tCommon(
                  'adminUsers.confirmDeleteUser',
                  'Voulez-vous supprimer définitivement cet utilisateur ?',
                )}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDeleteUser}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteUser}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('adminUsers.delete', 'Supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminUsers;
