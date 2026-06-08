import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveTab } from '../../../store/slices/uiSlice';
import CategoryImageInput from '../components/CategoryImageInput';
import {
  addGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  selectGalleryItems,
  GalleryItem,
} from '../../../store/slices/gallerySlice';
import { RootState } from '../../../store';

const AdminGalleryEditor = () => {
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();
  const items = useSelector((state: RootState) =>
    selectGalleryItems(state),
  ) as GalleryItem[];
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  // Arabic translations
  const [titleAr, setTitleAr] = useState('');
  const [subtitleAr, setSubtitleAr] = useState('');
  const [descriptionAr, setDescriptionAr] = useState('');
  // Active language tab in modal: 'fr' | 'ar'
  const [langTab, setLangTab] = useState<'fr' | 'ar'>('fr');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedItems = items.slice(startIndex, startIndex + itemsPerPage);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setTitleAr('');
    setSubtitleAr('');
    setDescriptionAr('');
    setLangTab('fr');
    setImageUri(null);
    setEditingItem(null);
    setErrorMessage(null);
  };

  const closeGalleryModal = () => {
    resetForm();
    setShowGalleryModal(false);
    setErrorMessage(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);

    if (!title.trim()) {
      setErrorMessage(
        translate('admin.galleryTitleRequired', {
          defaultValue: 'Le titre est requis.',
        }),
      );
      return;
    }

    if (!imageUri) {
      setErrorMessage(
        translate('admin.galleryImageRequired', {
          defaultValue: 'Veuillez sélectionner une image.',
        }),
      );
      return;
    }

    const arTranslation: { title?: string; subtitle?: string; description?: string } = {};
    if (titleAr.trim()) arTranslation.title = titleAr.trim();
    if (subtitleAr.trim()) arTranslation.subtitle = subtitleAr.trim();
    if (descriptionAr.trim()) arTranslation.description = descriptionAr.trim();

    const item: GalleryItem = {
      id: editingItem ? editingItem.id : `gal-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      imageUri,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      translations:
        Object.keys(arTranslation).length > 0
          ? { ...editingItem?.translations, ar: arTranslation }
          : editingItem?.translations,
    };

    if (editingItem) {
      dispatch(updateGalleryItem(item));
      setStatusMessage(
        translate('admin.galleryUpdated', {
          defaultValue: 'Image de la galerie mise à jour.',
        }),
      );
    } else {
      dispatch(addGalleryItem(item));
      setStatusMessage(
        translate('admin.galleryAdded', {
          defaultValue: 'Image ajoutée à la galerie.',
        }),
      );
      // Go to last page to see new item if added
      const newTotalPages = Math.ceil((items.length + 1) / itemsPerPage);
      setCurrentPage(newTotalPages);
    }

    closeGalleryModal();
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSubtitle(item.subtitle || '');
    setDescription(item.description || '');
    // Pre-fill Arabic translations if they exist
    setTitleAr(item.translations?.ar?.title || '');
    setSubtitleAr(item.translations?.ar?.subtitle || '');
    setDescriptionAr(item.translations?.ar?.description || '');
    setLangTab('fr');
    setImageUri(item.imageUri);
    setErrorMessage(null);
    setStatusMessage(null);
    setShowGalleryModal(true);
  };

  const handleDeleteClick = (item: GalleryItem) => {
    setItemToDelete(item);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    // Adjust current page if we delete the last item of the current page
    const remainingItemsOnPage = items.filter(
      i => i.id !== itemToDelete.id,
    ).length;
    const newTotalPages = Math.ceil(remainingItemsOnPage / itemsPerPage);
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages);
    } else if (newTotalPages === 0) {
      setCurrentPage(1);
    }

    dispatch(deleteGalleryItem(itemToDelete.id));
    if (editingItem?.id === itemToDelete.id) {
      resetForm();
    }
    setStatusMessage(
      translate('admin.galleryDeleted', {
        defaultValue: 'Image supprimée de la galerie.',
      }),
    );
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setItemToDelete(null);
  };

  return (
    <View className="space-y-8">
      <TouchableOpacity
        onPress={() => dispatch(setActiveTab('AdminManage'))}
        className="mb-6 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl self-start"
        style={{ alignSelf: 'flex-start' }}
      >
        <Text className="text-xs font-black text-slate-600 dark:text-slate-200">
          {translate('adminUsers.backToManage', {
            defaultValue: '← Retour à Manage',
          })}
        </Text>
      </TouchableOpacity>

      <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <View className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <View>
            <Text className="font-black text-3xl text-slate-900 dark:text-slate-100">
              {translate('admin.galleryTitle', {
                defaultValue: 'Gérer la galerie',
              })}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {translate('admin.galleryDescription', {
                defaultValue:
                  'Utilisez ce bouton pour ajouter ou modifier les photos de la galerie via une fenêtre modale.',
              })}
            </Text>
          </View>
          <View className="flex gap-3 flex-wrap">
            <TouchableOpacity
              onPress={() => {
                resetForm();
                setShowGalleryModal(true);
              }}
              className="bg-[#F97316] text-white px-4 py-2 rounded-2xl font-black hover:bg-[#e0630b] transition"
            >
              {translate('admin.addGalleryImage', {
                defaultValue: '+ Ajouter une image',
              })}
            </TouchableOpacity>
          </View>
        </View>

        {statusMessage && (
          <View className="mt-6 text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-3xl px-4 py-3 text-sm">
            {statusMessage}
          </View>
        )}
        {errorMessage && !showGalleryModal && (
          <View className="mt-6 text-rose-700 bg-rose-100 border border-rose-200 rounded-3xl px-4 py-3 text-sm">
            {errorMessage}
          </View>
        )}
      </View>

      <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <View className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <View>
            <Text className="text-xl font-black text-slate-900 dark:text-slate-100">
              {translate('admin.galleryListTitle', {
                defaultValue: 'Liste des images de la galerie',
              })}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400">
              {translate('admin.galleryListDescription', {
                defaultValue:
                  'Gérez les visuels qui s’affichent sur la page Galerie.',
              })}
            </Text>
          </View>
          <Text className="text-sm text-slate-500 dark:text-slate-400">
            {translate('admin.galleryItemsCount', {
              defaultValue: `${items.length} élément${
                items.length === 1 ? '' : 's'
              }`,
            })}
          </Text>
        </View>

        {items.length === 0 ? (
          <View className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            {translate('admin.noGalleryImages', {
              defaultValue: 'Aucune image ajoutée pour le moment.',
            })}
          </View>
        ) : (
          <>
            <View className="grid gap-4">
              {paginatedItems.map(item => (
                <View
                  key={item.id}
                  className="grid gap-4 md:grid-cols-[150px_1fr_180px] rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 shadow-sm"
                >
                  <View className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 h-full">
                    <img
                      src={item.imageUri}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  </View>
                  <View className="space-y-2">
                    <View className="font-black text-slate-900 dark:text-slate-100">
                      {item.title}
                    </View>
                    {item.subtitle ? (
                      <View className="text-sm text-slate-500 dark:text-slate-400">
                        {item.subtitle}
                      </View>
                    ) : null}
                    {item.description ? (
                      <View className="text-sm text-slate-600 dark:text-slate-300">
                        {item.description}
                      </View>
                    ) : null}
                    <View className="text-[11px] text-slate-400">
                      {translate('admin.updatedOn', {
                        defaultValue: 'Mis à jour le ',
                      })}
                      {new Date(
                        item.updatedAt || item.createdAt,
                      ).toLocaleDateString()}
                    </View>
                  </View>
                  <View className="flex flex-col gap-2 justify-between">
                    <TouchableOpacity
                      onPress={() => handleEdit(item)}
                      className="w-full bg-blue-600 text-white rounded-xl px-4 py-3 font-black hover:bg-blue-700 transition"
                    >
                      {translate('admin.editButton', {
                        defaultValue: 'Modifier',
                      })}
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDeleteClick(item)}
                      className="w-full bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
                    >
                      {translate('admin.deleteButton', {
                        defaultValue: 'Supprimer',
                      })}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {totalPages > 1 || items.length > 5 ? (
              <View className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200">
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
                      onPress={() =>
                        setCurrentPage(prev => Math.max(prev - 1, 1))
                      }
                      className={`px-3 py-1.5 rounded-lg border text-xs font-black transition ${
                        currentPage === 1
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 border-slate-200/60 dark:border-slate-700/60 cursor-not-allowed'
                          : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {translate('admin.prevPage', {
                        defaultValue: 'Précédent',
                      })}
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
          </>
        )}
      </View>

      {showDeleteConfirm && itemToDelete && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {translate('admin.confirmDelete', {
                  defaultValue: 'Confirmer la suppression',
                })}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('admin.confirmDeleteGalleryImage', {
                  defaultValue:
                    'Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.',
                })}
              </Text>
            </View>
            <View className="flex gap-3">
              <TouchableOpacity
                onPress={cancelDelete}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {translate('admin.cancelButton', {
                  defaultValue: 'Annuler',
                })}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {translate('admin.deleteButton', {
                  defaultValue: 'Supprimer',
                })}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {showGalleryModal && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-3xl w-full shadow-2xl overflow-hidden relative">
            <TouchableOpacity
              onPress={closeGalleryModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </TouchableOpacity>

            <View className="p-6 sm:p-8 space-y-6">
              <Text className="text-xl font-black text-slate-800 dark:text-white">
                {editingItem
                  ? translate('admin.editGalleryImageTitle', {
                      defaultValue: 'Modifier une image de galerie',
                    })
                  : translate('admin.addGalleryImageTitle', {
                      defaultValue: 'Ajouter une image à la galerie',
                    })}
              </Text>

              {errorMessage && (
                <View className="text-rose-700 bg-rose-100 border border-rose-200 rounded-3xl px-4 py-3 text-sm">
                  {errorMessage}
                </View>
              )}

              <View className="space-y-6 text-xs font-semibold">
                {/* Language tabs */}
                <View className="flex flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => setLangTab('fr')}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition ${
                      langTab === 'fr'
                        ? 'bg-[#F97316] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🇫🇷 Français
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setLangTab('ar')}
                    className={`px-4 py-2 rounded-xl font-black text-xs transition ${
                      langTab === 'ar'
                        ? 'bg-[#F97316] text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    🇸🇦 العربية
                  </TouchableOpacity>
                </View>

                {langTab === 'fr' ? (
                  <>
                    <View className="grid gap-4 md:grid-cols-2">
                      <TextInput
                        value={title}
                        onChangeText={setTitle}
                        placeholder={translate('admin.placeholder.title', {
                          defaultValue: 'Titre (FR)',
                        })}
                        className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      />
                      <TextInput
                        value={subtitle}
                        onChangeText={setSubtitle}
                        placeholder={translate('admin.placeholder.subtitle', {
                          defaultValue: 'Sous-titre (FR)',
                        })}
                        className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      />
                    </View>
                    <TextInput
                      multiline={true}
                      value={description}
                      onChangeText={setDescription}
                      placeholder={translate('admin.placeholder.description', {
                        defaultValue: 'Description (FR)',
                      })}
                      className="w-full min-h-[140px] px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    />
                  </>
                ) : (
                  <>
                    <View className="grid gap-4 md:grid-cols-2">
                      <TextInput
                        value={titleAr}
                        onChangeText={setTitleAr}
                        placeholder="العنوان (AR)"
                        textAlign="right"
                        className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      />
                      <TextInput
                        value={subtitleAr}
                        onChangeText={setSubtitleAr}
                        placeholder="العنوان الفرعي (AR)"
                        textAlign="right"
                        className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                      />
                    </View>
                    <TextInput
                      multiline={true}
                      value={descriptionAr}
                      onChangeText={setDescriptionAr}
                      placeholder="الوصف (AR)"
                      textAlign="right"
                      className="w-full min-h-[140px] px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                    />
                  </>
                )}

                <View className="grid gap-4 md:grid-cols-[1.4fr_0.8fr] items-start">
                  <View>
                    <Text className="block text-sm font-semibold mb-2 text-slate-900 dark:text-slate-100">
                      {translate('admin.galleryImageLabel', { defaultValue: 'Image de la galerie' })}
                    </Text>
                    <View className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                      <CategoryImageInput
                        imageUri={imageUri || undefined}
                        onImageSelected={setImageUri}
                      />
                    </View>
                  </View>
                  <View className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-500 dark:text-slate-400">
                    <Text className="font-black text-sm mb-2 text-slate-500 dark:text-slate-400">
                      {translate('admin.tipTitle', {
                        defaultValue: 'Conseil :',
                      })}
                    </Text>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>
                        {translate('admin.tip.chooseImage', {
                          defaultValue:
                            'Choisissez une image claire et représentative.',
                        })}
                      </li>
                      <li>
                        {translate('admin.tip.addTitle', {
                          defaultValue:
                            'Ajoutez un titre court et un sous-titre pertinent.',
                        })}
                      </li>
                      <li>
                        {translate('admin.tip.descriptionHelp', {
                          defaultValue:
                            'La description aide vos clients à comprendre la réalisation.',
                        })}
                      </li>
                    </ul>
                  </View>
                </View>

                <View className="flex flex-wrap gap-3 items-center justify-end pt-4">
                  <TouchableOpacity
                    onPress={closeGalleryModal}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {translate('admin.cancelButton', {
                      defaultValue: 'Annuler',
                    })}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSubmit({} as any)}
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {editingItem
                      ? translate('admin.saveGalleryChanges', {
                          defaultValue: 'Enregistrer les modifications',
                        })
                      : translate('admin.addToGallery', {
                          defaultValue: 'Ajouter à la galerie',
                        })}
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

export default AdminGalleryEditor;
