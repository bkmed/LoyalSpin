import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import {
  addCategory,
  updateCategory,
  deleteCategory,
} from '../../../store/slices/categoriesSlice';
import CategoryImageInput from '../components/CategoryImageInput';

interface AdminCategoriesProps {
  showToast: any;
  translate: any;
}

export const AdminCategories: React.FC<AdminCategoriesProps> = ({
  showToast,
  translate,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    translate(key, { defaultValue });
  const dispatch = useDispatch();
  const reduxCategories = useSelector(
    (state: RootState) => state.categories.items,
  );
  const products = useSelector((state: RootState) => state.parts.listings);
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any | null>(
    null,
  );

  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [editCategoryName, setEditCategoryName] = React.useState('');
  const [newCategoryImage, setNewCategoryImage] = React.useState<string | null>(
    null,
  );
  const [categoryErrorMessage, setCategoryErrorMessage] = React.useState<
    string | null
  >(null);
  const [categoryToDelete, setCategoryToDelete] = React.useState<any | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setEditCategoryName('');
    setCategoryErrorMessage(null);
    setNewCategoryName('');
    setNewCategoryImage(null);
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat: any) => {
    setEditingCategory(cat);
    setEditCategoryName(cat.name);
    setNewCategoryImage(cat.imageUri || null);
    setCategoryErrorMessage(null);
    setShowCategoryModal(true);
  };

  const closeCategoryModal = () => {
    setShowCategoryModal(false);
    setCategoryErrorMessage(null);
    setEditingCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewCategoryImage(null);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryErrorMessage(null);

    const categoryName = editingCategory ? editCategoryName : newCategoryName;
    if (!categoryName.trim()) {
      setCategoryErrorMessage(
        translate('web.autoText21', {
          defaultValue: 'Veuillez saisir un nom de catégorie.',
        }),
      );
      return;
    }

    const normalized = categoryName.trim();
    const duplicate = reduxCategories.find(
      c =>
        c.name.toLowerCase() === normalized.toLowerCase() &&
        c.id !== editingCategory?.id,
    );
    if (duplicate) {
      setCategoryErrorMessage(
        translate('web.autoText22', {
          defaultValue: 'Catégorie déjà existante.',
        }),
      );
      return;
    }

    if (editingCategory) {
      const renamed = {
        ...editingCategory,
        name: normalized,
        imageUri: newCategoryImage || editingCategory.imageUri,
        updatedAt: new Date().toISOString(),
      };
      dispatch(updateCategory(renamed));
      showToast(
        translate('web.autoText25', {
          defaultValue: 'Catégorie modifiée !',
        }),
        'success',
      );
    } else {
      const newCat = {
        id: 'cat-' + Date.now(),
        name: normalized,
        imageUri: newCategoryImage || undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch(addCategory(newCat));
      showToast(
        translate('web.autoText23', {
          defaultValue: 'Catégorie ajoutée avec succès !',
        }),
        'success',
      );
    }

    setEditingCategory(null);
    setNewCategoryName('');
    setEditCategoryName('');
    setNewCategoryImage(null);
    setShowCategoryModal(false);
  };

  const handleDeleteCategoryClick = (id: string, name: string) => {
    setCategoryToDelete({ id, name });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return;
    if (editingCategory?.id === categoryToDelete.id) {
      setEditingCategory(null);
      setEditCategoryName('');
      setNewCategoryImage(null);
    }
    dispatch(deleteCategory(categoryToDelete.id));
    showToast(
      translate('web.autoText27', {
        defaultValue: 'Catégorie supprimée !',
      }),
      'info',
    );
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  const cancelDeleteCategory = () => {
    setShowDeleteConfirm(false);
    setCategoryToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <h1 className="text-3xl font-black tracking-tight">
        {tCommon('adminCategories.title', 'Gestion des Catégories')}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'adminCategories.description',
          'Ajoutez de nouvelles familles de produits et réorganisez le catalogue.',
        )}
      </p>

      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm mt-8">
        <div>
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-450 mb-2">
            {editingCategory
              ? tCommon('adminCategories.editHeading', 'Modifier la catégorie')
              : tCommon(
                  'adminCategories.createHeading',
                  'Créer une nouvelle catégorie',
                )}
          </h3>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
            {tCommon(
              'adminCategories.infoText',
              'Ajoutez de nouvelles catégories via la fenêtre modale. Vous pouvez renommer les catégories existantes depuis le tableau ci-dessous.',
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {editingCategory ? (
            <button
              type="button"
              onClick={() => {
                setEditingCategory(null);
                setEditCategoryName('');
                setNewCategoryImage(null);
                setCategoryErrorMessage(null);
              }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-650 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
            >
              {tCommon('adminCategories.cancelEdit', 'Annuler la modification')}
            </button>
          ) : null}
          <button
            type="button"
            onClick={openAddCategoryModal}
            className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
          >
            {tCommon('adminCategories.addCategory', '+ Ajouter une catégorie')}
          </button>
        </div>
      </div>

      {/* Categories list table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
        <table className="w-full text-xs text-left font-semibold">
          <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
            <tr>
              <th className="px-6 py-4">Nom de la Catégorie</th>
              <th className="px-6 py-4">Nombre d'Articles</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
            {reduxCategories.map(cat => {
              const count = products.filter(
                p => p.category === cat.name,
              ).length;
              return (
                <tr
                  key={cat.id}
                  className="hover:bg-slate-50/50 dark:hover:bg-slate-750/30 transition"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {cat.imageUri ? (
                        <img
                          src={cat.imageUri}
                          alt={cat.name}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-slate-700"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
                      )}
                      <span className="font-black">{cat.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {count} articles
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditCategoryModal(cat)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1 rounded-lg transition"
                      >
                        {tCommon('adminCategories.rename', 'Renommer')}
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteCategoryClick(cat.id, cat.name)
                        }
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1 rounded-lg transition"
                      >
                        Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showDeleteConfirm && categoryToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('web.autoText26', {
                  defaultValue: `Voulez-vous supprimer la catégorie "${categoryToDelete.name}" ?`,
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDeleteCategory}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteCategory}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('admin.deleteButton', 'Supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <button
              onClick={closeCategoryModal}
              className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingCategory
                  ? tCommon(
                      'adminCategories.modalEditTitle',
                      'Modifier la catégorie',
                    )
                  : tCommon(
                      'adminCategories.modalCreateTitle',
                      'Ajouter une catégorie',
                    )}
              </h2>

              {categoryErrorMessage && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-750">
                  {categoryErrorMessage}
                </div>
              )}

              <form
                onSubmit={handleSaveCategory}
                className="space-y-4 text-xs font-semibold"
              >
                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    {tCommon(
                      'adminCategories.categoryNameLabel',
                      'Nom de la catégorie',
                    )}{' '}
                    *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={tCommon(
                      'adminCategories.categoryPlaceholder',
                      'Ex: Pompes et Accessoires',
                    )}
                    value={editingCategory ? editCategoryName : newCategoryName}
                    onChange={e =>
                      editingCategory
                        ? setEditCategoryName(e.target.value)
                        : setNewCategoryName(e.target.value)
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    {tCommon(
                      'adminCategories.imageLabel',
                      'Image de catégorie (optionnel)',
                    )}
                  </label>
                  <CategoryImageInput
                    imageUri={newCategoryImage || undefined}
                    onImageSelected={setNewCategoryImage}
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={closeCategoryModal}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {tCommon('adminCategories.modalCancel', 'Annuler')}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {editingCategory
                      ? tCommon('adminCategories.saveEdit', 'Enregistrer')
                      : tCommon('adminCategories.add', 'Ajouter')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminCategories;
