import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
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
  const products = useSelector((state: RootState) => state.parts.listings);
  const reduxCategories = useSelector(
    (state: RootState) => state.categories.items,
  );
  const [showAdminModal, setShowAdminModal] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<any | null>(null);

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
    e.preventDefault();
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            {tCommon('adminAnnonces.title', 'Gestion des Annonces')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
            {tCommon(
              'adminAnnonces.description',
              'Créez de nouvelles fiches produits, modifiez les descriptifs et gérez les disponibilités.',
            )}
          </p>
        </div>

        <button
          onClick={openAddAnnonce}
          className="bg-[#F97316] hover:bg-[#e0630b] text-white text-xs font-black px-5 py-3 rounded-xl shadow-md transition"
        >
          {tCommon('adminAnnonces.addAnnouncement', '+ Ajouter une annonce')}
        </button>
      </div>

      {/* Listings Admin Table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left font-semibold">
            <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 uppercase tracking-widest text-[9.5px] text-slate-400">
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
            <tbody className="divide-y divide-slate-100 dark:divide-slate-750 text-slate-700 dark:text-slate-200">
              {products.map(prod => (
                <tr
                  key={prod.id}
                  className="hover:bg-slate-50/55 dark:hover:bg-slate-750/30 transition"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center">
                      <ProductVisual image={prod.image} className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="font-black text-slate-850 dark:text-slate-100">
                        {prod.title}
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {prod.subtitle}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {prod.category}
                  </td>
                  <td className="px-6 py-4 font-black">{prod.price} TND</td>
                  <td className="px-6 py-4">
                    <span className="bg-slate-150 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-black uppercase text-slate-600 dark:text-slate-350">
                      {prod.condition}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                        prod.isAvailable
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 border border-emerald-500/10'
                          : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 border border-rose-500/10'
                      }`}
                    >
                      {prod.isAvailable
                        ? tCommon('adminAnnonces.available', 'Disponible')
                        : tCommon('adminAnnonces.sold', 'Vendu')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditAnnonce(prod)}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-black px-3 py-1.5 rounded-lg transition"
                      >
                        {tCommon('adminAnnonces.edit', 'Modifier')}
                      </button>
                      <button
                        onClick={() => handleDeleteAnnonceClick(prod.id)}
                        className="bg-rose-600 hover:bg-rose-700 text-white font-black px-3 py-1.5 rounded-lg transition"
                      >
                        {tCommon('adminAnnonces.delete', 'Supprimer')}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showDeleteConfirm && annonceToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('web.autoText19', {
                  defaultValue:
                    'Voulez-vous vraiment supprimer cette annonce ?',
                })}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={cancelDeleteAnnonce}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </button>
              <button
                type="button"
                onClick={confirmDeleteAnnonce}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('adminAnnonces.delete', 'Supprimer')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showAdminModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-lg w-full shadow-2xl overflow-hidden relative">
            <button
              onClick={() => setShowAdminModal(false)}
              className="absolute top-4 right-4 z-10 w-8.5 h-8.5 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingProduct
                  ? tCommon(
                      'adminAnnonces.modalEditTitle',
                      "Modifier l'annonce",
                    )
                  : tCommon(
                      'adminAnnonces.modalCreateTitle',
                      '+ Ajouter une annonce',
                    )}
              </h2>

              <form
                onSubmit={handleSaveAnnonce}
                className="space-y-4 text-xs font-semibold"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Titre *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Mitigeur évier"
                      value={annonceTitle}
                      onChange={e => setAnnonceTitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Sous-Titre / Marque
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: GROHE chromé"
                      value={annonceSubtitle}
                      onChange={e => setAnnonceSubtitle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Catégorie
                    </label>
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
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Prix (TND) *
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={annoncePrice}
                      onChange={e => setAnnoncePrice(Number(e.target.value))}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      État
                    </label>
                    <select
                      value={annonceCondition}
                      onChange={e => setAnnonceCondition(e.target.value as any)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-3 text-xs font-bold focus:outline-none"
                    >
                      <option value="comme neuf">Comme neuf</option>
                      <option value="bon état">Bon état</option>
                      <option value="pour pièces">Pour pièces</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                      Représentation Visuelle
                    </label>
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
                  </div>

                  <div className="flex gap-4 items-center justify-around h-full pt-5">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-750 dark:text-slate-350">
                      <input
                        type="checkbox"
                        checked={annonceIsFeatured}
                        onChange={e => setAnnonceIsFeatured(e.target.checked)}
                        className="accent-[#F97316] w-4.5 h-4.5"
                      />
                      <span>En Vedette</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-750 dark:text-slate-350">
                      <input
                        type="checkbox"
                        checked={annonceIsAvailable}
                        onChange={e => setAnnonceIsAvailable(e.target.checked)}
                        className="accent-[#F97316] w-4.5 h-4.5"
                      />
                      <span>Disponible</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[10px] font-bold text-slate-450 uppercase tracking-widest">
                    Description technique *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Détails du produit..."
                    value={annonceDescription}
                    onChange={e => setAnnonceDescription(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4.5 py-3 text-xs font-semibold focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#1E3A5F] hover:bg-[#152a47] text-white text-xs font-black py-4 rounded-xl transition shadow-md uppercase tracking-wider"
                >
                  {tCommon(
                    'adminAnnonces.modalSubmit',
                    'Enregistrer les modifications',
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default AdminAnnonces;
