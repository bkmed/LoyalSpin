import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveTab } from '../../../store/slices/uiSlice';
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
    (state: RootState) => state.categories?.items || [],
  );
  const products = useSelector(
    (state: RootState) => state.parts?.listings || [],
  );
  const [showCategoryModal, setShowCategoryModal] = React.useState(false);
  const [editingCategory, setEditingCategory] = React.useState<any | null>(
    null,
  );

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const totalPages = Math.ceil(reduxCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = reduxCategories.slice(
    startIndex,
    startIndex + itemsPerPage,
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

  const handleSaveCategory = () => {
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
      // Go to last page to see the new item
      const newTotalPages = Math.ceil(
        (reduxCategories.length + 1) / itemsPerPage,
      );
      setCurrentPage(newTotalPages);
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

    // Adjust current page if we delete the last item of the current page
    const remainingItemsOnPage = reduxCategories.filter(
      c => c.id !== categoryToDelete.id,
    ).length;
    const newTotalPages = Math.ceil(remainingItemsOnPage / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
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
    <View className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <TouchableOpacity
        onPress={() => dispatch(setActiveTab('AdminManage'))}
        className="mb-6 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl self-start"
        style={{ alignSelf: 'flex-start' }}
      >
        <Text className="text-xs font-black text-slate-600 dark:text-slate-200">
          {tCommon('adminUsers.backToManage', '← Retour à Manage')}
        </Text>
      </TouchableOpacity>

      <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
        {tCommon('adminCategories.title', 'Gestion des Catégories')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'adminCategories.description',
          'Ajoutez de nouvelles familles de produits et réorganisez le catalogue.',
        )}
      </Text>

      <View className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm mt-8">
        <View>
          <Text className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 dark:text-slate-400">
            {editingCategory
              ? tCommon('adminCategories.editHeading', 'Modifier la catégorie')
              : tCommon(
                  'adminCategories.createHeading',
                  'Créer une nouvelle catégorie',
                )}
          </Text>
          <Text className="text-[11px] text-slate-500 dark:text-slate-400 max-w-xl">
            {tCommon(
              'adminCategories.infoText',
              'Ajoutez de nouvelles catégories via la fenêtre modale. Vous pouvez renommer les catégories existantes depuis le tableau ci-dessous.',
            )}
          </Text>
        </View>
        <View className="flex items-center gap-3">
          {editingCategory ? (
            <TouchableOpacity
              onPress={() => {
                setEditingCategory(null);
                setEditCategoryName('');
                setNewCategoryImage(null);
                setCategoryErrorMessage(null);
              }}
              className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-black px-5 py-3 rounded-xl transition"
            >
              {tCommon('adminCategories.cancelEdit', 'Annuler la modification')}
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            onPress={openAddCategoryModal}
            className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
          >
            {tCommon('adminCategories.addCategory', '+ Ajouter une catégorie')}
          </TouchableOpacity>
        </View>
      </View>

      {/* Categories list (table replaced with Views for RN/Web unified components) */}
      <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
        <View className="w-full">
          {/* Header row */}
          <View className="flex flex-row px-6 py-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
            <Text style={{ flex: 2 }}>
              {tCommon(
                'adminCategories.tableCategoryName',
                'Nom de la Catégorie',
              )}
            </Text>
            <Text style={{ flex: 1 }}>
              {tCommon(
                'adminCategories.tableArticleCount',
                "Nombre d'Articles",
              )}
            </Text>
            <Text style={{ flex: 1, textAlign: 'center' }}>
              {tCommon('adminCategories.tableActions', 'Actions')}
            </Text>
          </View>

          {/* Rows */}
          <View className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
            {paginatedCategories.map(cat => {
              const count = products.filter(
                p => p.category === cat.name,
              ).length;
              return (
                <View
                  key={cat.id}
                  className="flex flex-row items-center px-6 py-4 hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition whitespace-nowrap"
                >
                  <View
                    style={{ flex: 2 }}
                    className="flex flex-row items-center gap-3"
                  >
                    {cat.imageUri ? (
                      <Image
                        source={{ uri: cat.imageUri }}
                        accessibilityLabel={cat.name}
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 12,
                          borderWidth: 1,
                        }}
                      />
                    ) : (
                      <View className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-700" />
                    )}
                    <Text className="font-black text-slate-700 dark:text-slate-200">
                      {cat.name}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text className="text-slate-500 dark:text-slate-400">
                      {count} {tCommon('adminCategories.articles', 'articles')}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }} className="text-center">
                    <View className="flex flex-row justify-center gap-2">
                      <TouchableOpacity
                        onPress={() => openEditCategoryModal(cat)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1 rounded-lg transition"
                      >
                        {tCommon('adminCategories.rename', 'Renommer')}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() =>
                          handleDeleteCategoryClick(cat.id, cat.name)
                        }
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1 rounded-lg transition"
                      >
                        {tCommon('adminCategories.delete', 'Supprimer')}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {totalPages > 1 || reduxCategories.length > 5 ? (
          <View className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 text-slate-700 dark:text-slate-200">
            <View className="flex flex-row items-center gap-2">
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {translate('admin.itemsPerPage', {
                  defaultValue: 'Éléments par page :',
                })}
              </Text>
              <select
                value={itemsPerPage}
                onChange={e => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs font-bold focus:outline-none text-slate-700 dark:text-slate-200"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </View>

            <View className="flex flex-row items-center gap-4">
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {translate('admin.paginationInfo', {
                  defaultValue: 'Page {{page}} sur {{totalPages}}',
                  page: currentPage,
                  totalPages: totalPages || 1,
                })}
              </Text>

              <View className="flex flex-row items-center gap-1">
                <TouchableOpacity
                  disabled={currentPage === 1}
                  onPress={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-black transition ${
                    currentPage === 1
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200/60 dark:border-slate-700/60 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  {translate('admin.prevPage', { defaultValue: 'Précédent' })}
                </TouchableOpacity>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  pageNum => (
                    <TouchableOpacity
                      key={pageNum}
                      onPress={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black transition ${
                        currentPage === pageNum
                          ? 'bg-[#F97316] text-white'
                          : 'bg-white dark:bg-slate-900 text-slate-750 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {pageNum}
                    </TouchableOpacity>
                  ),
                )}

                <TouchableOpacity
                  disabled={currentPage === totalPages || totalPages === 0}
                  onPress={() =>
                    setCurrentPage(prev => Math.min(prev + 1, totalPages))
                  }
                  className={`px-3 py-1.5 rounded-lg border text-xs font-black transition ${
                    currentPage === totalPages || totalPages === 0
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200/60 dark:border-slate-700/60 cursor-not-allowed'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-55 dark:hover:bg-slate-800'
                  }`}
                >
                  {translate('admin.nextPage', { defaultValue: 'Suivant' })}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ) : null}
      </View>

      {showDeleteConfirm && categoryToDelete && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('web.autoText26', {
                  defaultValue: `Voulez-vous supprimer la catégorie "${categoryToDelete.name}" ?`,
                })}
              </Text>
            </View>
            <View className="flex gap-3">
              <TouchableOpacity
                onPress={cancelDeleteCategory}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteCategory}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('admin.deleteButton', 'Supprimer')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showCategoryModal && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <TouchableOpacity
              onPress={closeCategoryModal}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </TouchableOpacity>

            <View className="p-6 sm:p-8 space-y-6">
              <Text className="text-xl font-black text-slate-800 dark:text-white">
                {editingCategory
                  ? tCommon(
                      'adminCategories.modalEditTitle',
                      'Modifier la catégorie',
                    )
                  : tCommon(
                      'adminCategories.modalCreateTitle',
                      'Ajouter une catégorie',
                    )}
              </Text>

              {categoryErrorMessage && (
                <View className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-750">
                  {categoryErrorMessage}
                </View>
              )}

              <View className="space-y-4 text-xs font-semibold">
                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                    {tCommon(
                      'adminCategories.categoryNameLabel',
                      'Nom de la catégorie',
                    )}{' '}
                    *
                  </Text>
                  <TextInput
                    placeholder={tCommon(
                      'adminCategories.categoryPlaceholder',
                      'Ex: Pompes et Accessoires',
                    )}
                    value={editingCategory ? editCategoryName : newCategoryName}
                    onChangeText={text =>
                      editingCategory
                        ? setEditCategoryName(text)
                        : setNewCategoryName(text)
                    }
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
                  />
                </View>

                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                    {tCommon(
                      'adminCategories.imageLabel',
                      'Image de catégorie (optionnel)',
                    )}
                  </Text>
                  <CategoryImageInput
                    imageUri={newCategoryImage || undefined}
                    onImageSelected={setNewCategoryImage}
                  />
                </View>

                <View className="flex justify-end gap-3 pt-4">
                  <TouchableOpacity
                    onPress={closeCategoryModal}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {tCommon('adminCategories.modalCancel', 'Annuler')}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleSaveCategory}
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {editingCategory
                      ? tCommon('adminCategories.saveEdit', 'Enregistrer')
                      : tCommon('adminCategories.add', 'Ajouter')}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default AdminCategories;
