import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
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
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [itemToDelete, setItemToDelete] = useState<GalleryItem | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const resetForm = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
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
    e.preventDefault();
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

    const item: GalleryItem = {
      id: editingItem ? editingItem.id : `gal-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim(),
      description: description.trim(),
      imageUri,
      createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
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
    }

    closeGalleryModal();
  };

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setSubtitle(item.subtitle || '');
    setDescription(item.description || '');
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
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="font-black text-3xl">
              {translate('admin.galleryTitle', {
                defaultValue: 'Gérer la galerie',
              })}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {translate('admin.galleryDescription', {
                defaultValue:
                  'Utilisez ce bouton pour ajouter ou modifier les photos de la galerie via une fenêtre modale.',
              })}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setShowGalleryModal(true);
              }}
              className="bg-[#F97316] text-white px-4 py-2 rounded-2xl font-black hover:bg-[#e0630b] transition"
            >
              {translate('admin.addGalleryImage', {
                defaultValue: '+ Ajouter une image',
              })}
            </button>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-6 text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-3xl px-4 py-3 text-sm">
            {statusMessage}
          </div>
        )}
        {errorMessage && !showGalleryModal && (
          <div className="mt-6 text-rose-700 bg-rose-100 border border-rose-200 rounded-3xl px-4 py-3 text-sm">
            {errorMessage}
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h4 className="text-xl font-black">
              {translate('admin.galleryListTitle', {
                defaultValue: 'Liste des images de la galerie',
              })}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {translate('admin.galleryListDescription', {
                defaultValue:
                  'Gérez les visuels qui s’affichent sur la page Galerie.',
              })}
            </p>
          </div>
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {translate('admin.galleryItemsCount', {
              defaultValue: `${items.length} élément${
                items.length === 1 ? '' : 's'
              }`,
            })}
          </span>
        </div>

        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-6 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
            {translate('admin.noGalleryImages', {
              defaultValue: 'Aucune image ajoutée pour le moment.',
            })}
          </div>
        ) : (
          <div className="grid gap-4">
            {items.map(item => (
              <div
                key={item.id}
                className="grid gap-4 md:grid-cols-[150px_1fr_180px] rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 shadow-sm"
              >
                <div className="overflow-hidden rounded-3xl bg-slate-100 dark:bg-slate-800 h-full">
                  <img
                    src={item.imageUri}
                    alt={item.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <div className="font-black text-slate-900 dark:text-slate-100">
                    {item.title}
                  </div>
                  {item.subtitle ? (
                    <div className="text-sm text-slate-500 dark:text-slate-400">
                      {item.subtitle}
                    </div>
                  ) : null}
                  {item.description ? (
                    <div className="text-sm text-slate-600 dark:text-slate-300">
                      {item.description}
                    </div>
                  ) : null}
                  <div className="text-[11px] text-slate-400">
                    {translate('admin.updatedOn', {
                      defaultValue: 'Mis à jour le ',
                    })}
                    {new Date(
                      item.updatedAt || item.createdAt,
                    ).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex flex-col gap-2 justify-between">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="w-full bg-blue-600 text-white rounded-xl px-4 py-3 font-black hover:bg-blue-700 transition"
                  >
                    {translate('admin.editButton', {
                      defaultValue: 'Modifier',
                    })}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteClick(item)}
                    className="w-full bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
                  >
                    {translate('admin.deleteButton', {
                      defaultValue: 'Supprimer',
                    })}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showDeleteConfirm && itemToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {translate('admin.confirmDelete', {
                  defaultValue: 'Confirmer la suppression',
                })}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('admin.confirmDeleteGalleryImage', {
                  defaultValue:
                    'Êtes-vous sûr de vouloir supprimer cette image ? Cette action est irréversible.',
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDelete}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {translate('admin.cancelButton', {
                  defaultValue: 'Annuler',
                })}
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {translate('admin.deleteButton', {
                  defaultValue: 'Supprimer',
                })}
              </button>
            </div>
          </div>
        </div>
      )}

      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-3xl w-full shadow-2xl overflow-hidden relative">
            <button
              type="button"
              onClick={closeGalleryModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingItem
                  ? translate('admin.editGalleryImageTitle', {
                      defaultValue: 'Modifier une image de galerie',
                    })
                  : translate('admin.addGalleryImageTitle', {
                      defaultValue: 'Ajouter une image à la galerie',
                    })}
              </h2>

              {errorMessage && (
                <div className="text-rose-700 bg-rose-100 border border-rose-200 rounded-3xl px-4 py-3 text-sm">
                  {errorMessage}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="space-y-6 text-xs font-semibold"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <input
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder={translate('admin.placeholder.title', {
                      defaultValue: 'Titre',
                    })}
                    required
                    className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  />
                  <input
                    value={subtitle}
                    onChange={e => setSubtitle(e.target.value)}
                    placeholder={translate('admin.placeholder.subtitle', {
                      defaultValue: 'Sous-titre',
                    })}
                    className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                  />
                </div>

                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder={translate('admin.placeholder.description', {
                    defaultValue: 'Description',
                  })}
                  className="w-full min-h-[140px] px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />

                <div className="grid gap-4 md:grid-cols-[1.4fr_0.8fr] items-start">
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Image de la galerie
                    </label>
                    <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
                      <CategoryImageInput
                        imageUri={imageUri || undefined}
                        onImageSelected={setImageUri}
                      />
                    </div>
                  </div>
                  <div className="rounded-3xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 p-4 text-sm text-slate-500 dark:text-slate-400">
                    <p className="font-black text-sm mb-2">
                      {translate('admin.tipTitle', {
                        defaultValue: 'Conseil :',
                      })}
                    </p>
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
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 items-center justify-end pt-4">
                  <button
                    type="button"
                    onClick={closeGalleryModal}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-250 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {translate('admin.cancelButton', {
                      defaultValue: 'Annuler',
                    })}
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-sm transition"
                  >
                    {editingItem
                      ? translate('admin.saveGalleryChanges', {
                          defaultValue: 'Enregistrer les modifications',
                        })
                      : translate('admin.addToGallery', {
                          defaultValue: 'Ajouter à la galerie',
                        })}
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

export default AdminGalleryEditor;
