const { Client, Databases, ID } = require('appwrite');
const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6ae2ea99001accd5eab5');

const db = new Databases(client);

async function test() {
  console.log('Testing client SDK listDocuments on live Appwrite Cloud...');
  const list = await db.listDocuments('yuktop_db', 'cargos');
  console.log('✅ listDocuments muvaffaqiyatli! Hozirgi yuklar soni:', list.total);

  console.log('Testing client SDK createDocument (Yangi yuk yozish)...');
  const doc = await db.createDocument('yuktop_db', 'cargos', ID.unique(), {
    title: '5 tonna Qurilish mollari (Toshkent -> Samarqand)',
    category: 'Qurilish mollari',
    weightKg: 5000,
    volumeM3: 22,
    pickupCity: 'Toshkent',
    pickupAddress: 'Chilonzor tumani, 12-mavze',
    pickupLat: 41.2858,
    pickupLng: 69.2036,
    deliveryCity: 'Samarqand',
    deliveryAddress: 'Registon ko\'chasi, 45-uy',
    deliveryLat: 39.6542,
    deliveryLng: 66.9597,
    pickupDate: '2026-10-30',
    deliveryDate: '2026-10-31',
    priceUzs: 4200000,
    paymentMethod: 'Naqd pul',
    urgency: 'Oddiy',
    hasDocuments: true,
    distanceKm: 310,
    durationMinutes: 270,
    specialNotes: 'Ehtiyotkorlik bilan yuklash zarur',
    status: 'taklif_kutilmoqda',
    bidsCount: 0
  });
  console.log('✅ createDocument muvaffaqiyatli! Hujjat ID:', doc.$id, 'Nomi:', doc.title);

  const listAfter = await db.listDocuments('yuktop_db', 'cargos');
  console.log('✅ Bazadagi yangi yuklar soni:', listAfter.total);
  console.log('🎉 APPWRITE BAZASI 100% ISHLAYAPTI!');
}

test().catch(e => {
  console.error('❌ Xatolik:', e.message);
  process.exit(1);
});
