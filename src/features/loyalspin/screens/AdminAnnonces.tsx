import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { setActiveTab } from '../../../store/slices/uiSlice';
import {
  addListing,
  updateListing,
  deleteListing,
} from '../../../store/slices/partsSlice';
import { ProductVisual } from '../components/ProductSVGs';

interface AdminAnnoncesProps {
  showToast: any;
  translate: any;
}

export const AdminAnnonces: React.FC<AdminAnnoncesProps> = ({
  showToast,
  translate,
}) => {
  const tCommon = (key: string, defaultValue: string) =>
    translate(key, { defaultValue });
  const dispatch = useDispatch();
  const products = useSelector(
    (state: RootState) => state.parts?.listings || [],
  );
  const reduxCategories = useSelector(
    (state: RootState) => state.categories?.items || [],
  );
  const [showAdminModal, setShowAdminModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any | null>(null);

  const [currentPage, setCurrentPage] = React.useState(1);
  const [itemsPerPage, setItemsPerPage] = React.useState(10);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const [annonceTitle, setAnnonceTitle] = React.useState('');
  const [annonceSubtitle, setAnnonceSubtitle] = React.useState('');
  const [annonceCategory, setAnnonceCategory] = React.useState('Robinetterie');
  const [annoncePrice, setAnnoncePrice] = React.useState(25);
  const [annonceCondition, setAnnonceCondition] = React.useState<
    'comme neuf' | 'bon état' | 'pour pièces'
  >('comme neuf');
  const [annonceDescription, setAnnonceDescription] = React.useState('');
  const [annonceImage, setAnnonceImage] = React.useState('faucet');
  const [annonceIsFeatured, setAnnonceIsFeatured] = React.useState(false);
  const [annonceIsAvailable, setAnnonceIsAvailable] = React.useState(true);
  const [annonceToDelete, setAnnonceToDelete] = React.useState<any | null>(
    null,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const openAddAnnonce = () => {
    setEditingProduct(null);
    setAnnonceTitle('');
    setAnnonceSubtitle('');
    setAnnonceCategory(reduxCategories[0]?.name || 'Robinetterie');
    setAnnoncePrice(25);
    setAnnonceCondition('comme neuf');
    setAnnonceDescription('');
    setAnnonceImage('faucet');
    setAnnonceIsFeatured(false);
    setAnnonceIsAvailable(true);
    setShowAdminModal(true);
  };

  const openEditAnnonce = (prod: any) => {
    setEditingProduct(prod);
    setAnnonceTitle(prod.title);
    setAnnonceSubtitle(prod.subtitle);
    setAnnonceCategory(prod.category);
    setAnnoncePrice(prod.price);
    setAnnonceCondition(prod.condition);
    setAnnonceDescription(prod.description);
    setAnnonceImage(prod.image);
    setAnnonceIsFeatured(!!prod.isFeatured);
    setAnnonceIsAvailable(!!prod.isAvailable);
    setShowAdminModal(true);
  };

  const handleSaveAnnonce = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!annonceTitle || !annonceDescription || annoncePrice <= 0) {
      showToast(
        translate('web.autoText16', {
          defaultValue: "Données d'annonce incomplètes.",
        }),
        'error',
      );
      return;
    }

    if (editingProduct) {
      const updatedItem = {
        ...editingProduct,
        title: annonceTitle,
        subtitle:
          annonceSubtitle.toUpperCase() || annonceCategory.toUpperCase(),
        category: annonceCategory,
        price: Number(annoncePrice),
        condition: annonceCondition,
        description: annonceDescription,
        image: annonceImage,
        isFeatured: annonceIsFeatured,
        isAvailable: annonceIsAvailable,
      };
      dispatch(updateListing(updatedItem));
      showToast(
        translate('web.autoText17', {
          defaultValue: "L'annonce a été modifiée avec succès !",
        }),
        'success',
      );
    } else {
      const newItem = {
        id: 'prod-' + Date.now(),
        title: annonceTitle,
        subtitle:
          annonceSubtitle.toUpperCase() || annonceCategory.toUpperCase(),
        category: annonceCategory,
        price: Number(annoncePrice),
        condition: annonceCondition,
        description: annonceDescription,
        image: annonceImage,
        isFeatured: annonceIsFeatured,
        isAvailable: annonceIsAvailable,
      };
      dispatch(addListing(newItem));
      showToast(
        translate('web.autoText18', {
          defaultValue: 'Nouvelle annonce publiée avec succès !',
        }),
        'success',
      );
      // Go to last page to see the new item
      const newTotalPages = Math.ceil((products.length + 1) / itemsPerPage);
      setCurrentPage(newTotalPages);
    }

    setShowAdminModal(false);
  };

  const handleDeleteAnnonceClick = (id: string) => {
    const product = products.find(p => p.id === id);
    if (product) {
      setAnnonceToDelete(product);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDeleteAnnonce = () => {
    if (!annonceToDelete) return;
    if (editingProduct?.id === annonceToDelete.id) {
      setEditingProduct(null);
      setShowAdminModal(false);
    }

    // Adjust current page if we delete the last item of the current page
    const remainingItemsOnPage = products.filter(
      p => p.id !== annonceToDelete.id,
    ).length;
    const newTotalPages = Math.ceil(remainingItemsOnPage / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }

    dispatch(deleteListing(annonceToDelete.id));
    showToast(
      translate('web.autoText20', {
        defaultValue: 'Annonce supprimée !',
      }),
      'info',
    );
    setShowDeleteConfirm(false);
    setAnnonceToDelete(null);
  };

  const cancelDeleteAnnonce = () => {
    setShowDeleteConfirm(false);
    setAnnonceToDelete(null);
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

      <View className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <View>
          <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
            {tCommon('adminAnnonces.title', 'Gestion des Annonces')}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
            {tCommon(
              'adminAnnonces.description',
              'Créez de nouvelles fiches produits, modifiez les descriptifs et gérez les disponibilités.',
            )}
          </Text>
        </View>

        <TouchableOpacity
          onPress={openAddAnnonce}
          className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition"
        >
          {tCommon('adminAnnonces.addAnnouncement', '+ Ajouter une annonce')}
        </TouchableOpacity>
      </View>

      {/* Listings Admin Table */}
      <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
        {/* Desktop Table View */}
        <View className="hidden lg:block overflow-x-auto w-full">
          <table className="w-full min-w-[800px] text-xs text-left font-semibold">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400 whitespace-nowrap">
              <tr>
                <th className="px-6 py-4">
                  {tCommon('adminAnnonces.columnPiece', 'Pièce')}
                </th>
                <th className="px-6 py-4">
                  {tCommon('adminAnnonces.columnCategory', 'Catégorie')}
                </th>
                <th className="px-6 py-4">
                  {tCommon('adminAnnonces.columnPrice', 'Prix')}
                </th>
                <th className="px-6 py-4">
                  {tCommon('adminAnnonces.columnCondition', 'État')}
                </th>
                <th className="px-6 py-4">
                  {tCommon('adminAnnonces.columnStatus', 'Statut')}
                </th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-slate-700 dark:text-slate-200">
              {paginatedProducts.map(prod => (
                <tr
                  key={prod.id}
                  className="hover:bg-slate-50/55 dark:hover:bg-slate-700/30 transition whitespace-nowrap"
                >
                  <td className="px-6 py-4">
                    <View className="flex flex-row items-center gap-3">
                      <View className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                        <ProductVisual image={prod.image} className="w-6 h-6" />
                      </View>
                      <View>
                        <View className="font-black text-slate-800 dark:text-slate-100">
                          {prod.title}
                        </View>
                        <Text className="text-[10px] text-slate-400 font-semibold dark:text-slate-300">
                          {prod.subtitle}
                        </Text>
                      </View>
                    </View>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {prod.category}
                  </td>
                  <td className="px-6 py-4 font-black">{prod.price} TND</td>
                  <td className="px-6 py-4">
                    <Text className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">
                      {prod.condition}
                    </Text>
                  </td>
                  <td className="px-6 py-4">
                    <Text
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                        prod.isAvailable
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/10'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-500/10'
                      }`}
                    >
                      {prod.isAvailable
                        ? tCommon('adminAnnonces.available', 'Disponible')
                        : tCommon('adminAnnonces.sold', 'Vendu')}
                    </Text>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <View className="flex flex-row justify-center gap-2">
                      <TouchableOpacity
                        onPress={() => openEditAnnonce(prod)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1.5 rounded-lg transition"
                      >
                        {tCommon('adminAnnonces.edit', 'Modifier')}
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteAnnonceClick(prod.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1.5 rounded-lg transition"
                      >
                        {tCommon('adminAnnonces.delete', 'Supprimer')}
                      </TouchableOpacity>
                    </View>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </View>

        {/* Mobile Card View */}
        <View className="flex flex-col lg:hidden divide-y divide-slate-100 dark:divide-slate-700">
          {paginatedProducts.map(prod => (
            <View
              key={prod.id}
              className="p-4 flex flex-col gap-4 hover:bg-slate-50/55 dark:hover:bg-slate-700/30 transition"
            >
              <View className="flex flex-row items-center justify-between gap-2">
                <View className="flex flex-row items-center gap-3 flex-1">
                  <View className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center shrink-0">
                    <ProductVisual image={prod.image} className="w-7 h-7" />
                  </View>
                  <View className="flex-1">
                    <Text className="font-black text-slate-800 dark:text-slate-100 text-[13px]">
                      {prod.title}
                    </Text>
                    <Text className="text-[10px] text-slate-400 font-semibold mt-0.5 dark:text-slate-300">
                      {prod.category} • {prod.subtitle}
                    </Text>
                  </View>
                </View>
                <Text className="font-black text-sm text-right shrink-0 text-slate-900 dark:text-slate-100">
                  {prod.price} TND
                </Text>
              </View>

              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row gap-2">
                  <Text className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-[10px] font-black uppercase text-slate-600 dark:text-slate-300">
                    {prod.condition}
                  </Text>
                  <Text
                    className={`px-2 py-1 rounded text-[10px] font-black uppercase ${
                      prod.isAvailable
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/10'
                        : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-500/10'
                    }`}
                  >
                    {prod.isAvailable
                      ? tCommon('adminAnnonces.available', 'Disponible')
                      : tCommon('adminAnnonces.sold', 'Vendu')}
                  </Text>
                </View>

                <View className="flex flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => openEditAnnonce(prod)}
                    className="bg-blue-600 hover:bg-blue-700 w-8 h-8 flex items-center justify-center rounded-lg transition shadow-sm"
                  >
                    <Text className="text-white text-xs">✏️</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteAnnonceClick(prod.id)}
                    className="bg-rose-600 hover:bg-rose-700 w-8 h-8 flex items-center justify-center rounded-lg transition shadow-sm"
                  >
                    <Text className="text-white text-xs">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {totalPages > 1 || products.length > 5 ? (
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

      {showDeleteConfirm && annonceToDelete && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('web.autoText19', {
                  defaultValue:
                    'Voulez-vous vraiment supprimer cette annonce ?',
                })}
              </Text>
            </View>
            <View className="flex gap-3">
              <TouchableOpacity
                onPress={cancelDeleteAnnonce}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteAnnonce}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('adminAnnonces.delete', 'Supprimer')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showAdminModal && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <TouchableOpacity
              onPress={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </TouchableOpacity>

            <View className="p-6 sm:p-8 space-y-6">
              <Text className="text-xl font-black text-slate-800 dark:text-white">
                {editingProduct
                  ? tCommon(
                      'adminAnnonces.modalEditTitle',
                      "Modifier l'annonce",
                    )
                  : tCommon(
                      'adminAnnonces.modalCreateTitle',
                      '+ Ajouter une annonce',
                    )}
              </Text>

              <View className="space-y-4 text-xs font-semibold">
                <View className="grid grid-cols-2 gap-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                      Titre *
                    </Text>
                    <TextInput
                      placeholder="Ex: Mitigeur évier"
                      value={annonceTitle}
                      onChangeText={setAnnonceTitle}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </View>

                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                      Sous-Titre / Marque
                    </Text>
                    <TextInput
                      placeholder="Ex: GROHE chromé"
                      value={annonceSubtitle}
                      onChangeText={setAnnonceSubtitle}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </View>
                </View>

                <View className="grid grid-cols-3 gap-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                      Catégorie
                    </Text>
                    <select
                      value={annonceCategory}
                      onChange={e => setAnnonceCategory(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      {reduxCategories.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </View>

                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                      Prix (TND) *
                    </Text>
                    <TextInput
                      keyboardType="numeric"
                      value={String(annoncePrice)}
                      onChangeText={text => setAnnoncePrice(Number(text))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
                    />
                  </View>

                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                      État
                    </Text>
                    <select
                      value={annonceCondition}
                      onChange={e => setAnnonceCondition(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="comme neuf">Comme neuf</option>
                      <option value="bon état">Bon état</option>
                      <option value="pour pièces">Pour pièces</option>
                    </select>
                  </View>
                </View>

                <View className="grid grid-cols-2 gap-4">
                  <View className="space-y-2">
                    <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                      Représentation Visuelle
                    </Text>
                    <select
                      value={annonceImage}
                      onChange={e => setAnnonceImage(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="faucet">
                        Haut-de-gamme Robinet (Faucet)
                      </option>
                      <option value="boiler">
                        Chauffe-eau / Chaudière (Boiler)
                      </option>
                      <option value="copper_fittings">
                        Canalisation / Raccords (Pipes)
                      </option>
                    </select>
                  </View>

                  <View className="flex flex-row gap-4 items-center justify-around h-full pt-5">
                    <TouchableOpacity
                      onPress={() => setAnnonceIsFeatured(!annonceIsFeatured)}
                      className="flex flex-row items-center gap-2"
                    >
                      <View
                        className={`w-5 h-5 rounded border ${
                          annonceIsFeatured
                            ? 'bg-[#F97316] border-[#F97316]'
                            : 'border-slate-300 dark:border-slate-700'
                        } flex items-center justify-center`}
                      >
                        {annonceIsFeatured && (
                          <Text className="text-white text-[10px] font-bold">
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        En Vedette
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setAnnonceIsAvailable(!annonceIsAvailable)}
                      className="flex flex-row items-center gap-2"
                    >
                      <View
                        className={`w-5 h-5 rounded border ${
                          annonceIsAvailable
                            ? 'bg-[#F97316] border-[#F97316]'
                            : 'border-slate-300 dark:border-slate-700'
                        } flex items-center justify-center`}
                      >
                        {annonceIsAvailable && (
                          <Text className="text-white text-[10px] font-bold">
                            ✓
                          </Text>
                        )}
                      </View>
                      <Text className="text-xs font-bold text-slate-600 dark:text-slate-300">
                        Disponible
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="space-y-2">
                  <Text className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest dark:text-slate-400">
                    Description technique *
                  </Text>
                  <TextInput
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Détails du produit..."
                    value={annonceDescription}
                    onChangeText={setAnnonceDescription}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-none text-slate-900 dark:text-slate-100"
                  />
                </View>

                <TouchableOpacity
                  onPress={() => handleSaveAnnonce({} as any)}
                  className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
                >
                  {tCommon(
                    'adminAnnonces.modalSubmit',
                    'Enregistrer les modifications',
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default AdminAnnonces;
