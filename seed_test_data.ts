import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

// 1. Setup Firebase using exactly the same config
const firebaseConfig = {
  apiKey: "AIzaSyDsj-Kb7vRAZD-TcjxuT6mM1tlWIuNNGhE",
  authDomain: "loyalspin-8988d.firebaseapp.com",
  projectId: "loyalspin-8988d",
  storageBucket: "loyalspin-8988d.firebasestorage.app",
  messagingSenderId: "1020479456298",
  appId: "1:1020479456298:web:b592bf8a05c8d918376f53",
  measurementId: "G-VYDMF71TSM"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

async function seed() {
  try {
    const timestamp = Date.now();
    const projectId = `proj_seed_${timestamp}`;
    const adminId = `admin_seed_${timestamp}`;
    const userId = `user_seed_${timestamp}`;
    const couponId = `coup_seed_${timestamp}`;

    console.log('--- DÉBUT DU TEST CRUD COMPLET ---');

    // 1. Créer un Admin (User avec role admin)
    const adminData = {
      id: adminId,
      name: 'Admin Testeur',
      email: `admin_${timestamp}@loyalspin.app`,
      role: 'admin',
      status: 'active',
      phone: '+33600000000',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', adminId), adminData);
    console.log('✅ Admin créé dans Firebase:', adminId);

    // 2. Créer un Projet
    const projectData = {
      id: projectId,
      name: 'Projet Test Complet',
      slug: `projet-test-${timestamp}`,
      description: 'Un projet généré pour valider le fonctionnement complet',
      email: `contact_${timestamp}@loyalspin.app`,
      phone: '+33611111111',
      adminId: adminId,
      isActive: true,
      paymentStatus: 'paid',
      industry: 'Technologie',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'projects', projectId), projectData);
    console.log('✅ Projet créé dans Firebase:', projectId);

    // 3. Créer un User (Client du projet)
    const userData = {
      id: userId,
      name: 'Client Test',
      email: `client_${timestamp}@test.com`,
      role: 'user',
      projectId: projectId,
      status: 'active',
      phone: '+33622222222',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', userId), userData);
    console.log('✅ Utilisateur créé dans Firebase:', userId);

    // 4. Créer un Coupon
    const couponData = {
      id: couponId,
      projectId: projectId,
      code: `PROMO${String(timestamp).slice(-4)}`,
      title: 'Coupon de lancement',
      type: 'percentage',
      value: 15,
      isActive: true,
      usedQuantity: 0,
      totalQuantity: 50,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'coupons', couponId), couponData);
    console.log('✅ Coupon créé dans Firebase:', couponId);

    // 5. Créer une config Roulette
    const rouletteData = {
      id: `roulette_${projectId}`,
      projectId: projectId,
      wheelName: 'Roulette Chance',
      isActive: true,
      spinLimitType: 'per_user_per_day',
      spinLimitValue: 1,
      primaryColor: '#1E3A5F',
      secondaryColor: '#F59E0B',
      segments: [
        { id: '1', label: '-10%', color: '#10B981', probability: 40, isGift: true },
        { id: '2', label: 'Cadeau', color: '#3B82F6', probability: 10, isGift: true },
        { id: '3', label: 'Perdu', color: '#EF4444', probability: 50, isGift: false }
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'rouletteConfigs', projectId), rouletteData);
    console.log('✅ Roulette Config créée dans Firebase');

    // 6. Créer une config Sticker
    const stickerData = {
      id: `sticker_${projectId}`,
      projectId: projectId,
      isActive: true,
      shape: 'round',
      size: 'medium',
      primaryColor: '#1E3A5F',
      title: 'Scannez et Gagnez',
      qrCodeUrl: `https://loyalspin.app/${projectId}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'stickerConfigs', projectId), stickerData);
    console.log('✅ Sticker Config créé dans Firebase');

    console.log('--- TEST TERMINÉ AVEC SUCCÈS ---');
    console.log('Toutes les entités ont été écrites dans Firebase.');
    console.log(`Vous pouvez ouvrir l'application, et les données seront chargées dans Redux pour le projet ${projectId}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    process.exit(1);
  }
}

seed();
