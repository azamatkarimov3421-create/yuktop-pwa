const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ae2ea99001accd5eab5';
const DATABASE_ID = 'yuktop_db';

const wait = ms => new Promise(r => setTimeout(r, ms));

async function setupWithKey(apiKey) {
  const client = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID)
    .setKey(apiKey);

  const db = new Databases(client);

  console.log('--- 1. COLLECTIONS YARATILMOQDA ---');
  const collections = [
    { id: 'cargos', name: 'Cargos' },
    { id: 'bids', name: 'Bids' },
    { id: 'orders', name: 'Orders' },
    { id: 'messages', name: 'Messages' }
  ];

  const permissions = [
    Permission.read(Role.any()),
    Permission.create(Role.any()),
    Permission.update(Role.any()),
    Permission.delete(Role.any())
  ];

  for (const c of collections) {
    try {
      await db.createCollection(DATABASE_ID, c.id, c.name, permissions);
      console.log(`✅ Collection [${c.id}] muvaffaqiyatli yaratildi.`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`ℹ️ Collection [${c.id}] allaqachon mavjud.`);
        try {
          await db.updateCollection(DATABASE_ID, c.id, c.name, permissions);
          console.log(`✅ Collection [${c.id}] ruxsatlari yangilandi.`);
        } catch (err) {}
      } else {
        console.error(`Collection [${c.id}] xatolik:`, e.message);
      }
    }
    await wait(600);
  }

  async function createAttr(colId, type, key, size = 255, required = false) {
    try {
      if (type === 'string') {
        await db.createStringAttribute(DATABASE_ID, colId, key, size, required);
      } else if (type === 'integer') {
        await db.createIntegerAttribute(DATABASE_ID, colId, key, required);
      } else if (type === 'float') {
        await db.createFloatAttribute(DATABASE_ID, colId, key, required);
      } else if (type === 'boolean') {
        await db.createBooleanAttribute(DATABASE_ID, colId, key, required);
      }
      console.log(`  + Attr [${colId}] ${key} (${type})`);
    } catch (e) {
      if (e.code === 409) {
        // already exists
      } else {
        console.warn(`  ! Attr [${colId}] ${key}:`, e.message);
      }
    }
    await wait(400);
  }

  console.log('\n--- 2. CARGOS ATTRIBUTES ---');
  await createAttr('cargos', 'string', 'ownerId', 255);
  await createAttr('cargos', 'string', 'ownerName', 255);
  await createAttr('cargos', 'string', 'ownerPhone', 255);
  await createAttr('cargos', 'string', 'ownerTelegram', 255);
  await createAttr('cargos', 'string', 'title', 255);
  await createAttr('cargos', 'string', 'category', 255);
  await createAttr('cargos', 'string', 'imageUrl', 2048);
  await createAttr('cargos', 'float', 'weightKg');
  await createAttr('cargos', 'float', 'volumeM3');
  await createAttr('cargos', 'string', 'pickupCity', 255);
  await createAttr('cargos', 'string', 'pickupAddress', 500);
  await createAttr('cargos', 'float', 'pickupLat');
  await createAttr('cargos', 'float', 'pickupLng');
  await createAttr('cargos', 'string', 'deliveryCity', 255);
  await createAttr('cargos', 'string', 'deliveryAddress', 500);
  await createAttr('cargos', 'float', 'deliveryLat');
  await createAttr('cargos', 'float', 'deliveryLng');
  await createAttr('cargos', 'string', 'pickupDate', 255);
  await createAttr('cargos', 'string', 'deliveryDate', 255);
  await createAttr('cargos', 'integer', 'priceUzs');
  await createAttr('cargos', 'string', 'paymentMethod', 255);
  await createAttr('cargos', 'string', 'urgency', 255);
  await createAttr('cargos', 'boolean', 'hasDocuments');
  await createAttr('cargos', 'integer', 'distanceKm');
  await createAttr('cargos', 'integer', 'durationMinutes');
  await createAttr('cargos', 'string', 'specialNotes', 2048);
  await createAttr('cargos', 'string', 'status', 255);
  await createAttr('cargos', 'integer', 'bidsCount');

  console.log('\n--- 3. BIDS ATTRIBUTES ---');
  await createAttr('bids', 'string', 'cargoId', 255);
  await createAttr('bids', 'string', 'driverId', 255);
  await createAttr('bids', 'string', 'driverName', 255);
  await createAttr('bids', 'string', 'driverPhone', 255);
  await createAttr('bids', 'string', 'driverTelegram', 255);
  await createAttr('bids', 'float', 'driverRating');
  await createAttr('bids', 'string', 'vehicleModel', 255);
  await createAttr('bids', 'string', 'vehiclePlate', 255);
  await createAttr('bids', 'string', 'transportType', 255);
  await createAttr('bids', 'float', 'vehicleCapacityTon');
  await createAttr('bids', 'integer', 'offeredPriceUzs');
  await createAttr('bids', 'string', 'proposedDate', 255);
  await createAttr('bids', 'integer', 'counterPriceUzs');
  await createAttr('bids', 'string', 'counterNote', 2048);
  await createAttr('bids', 'string', 'status', 255);

  console.log('\n--- 4. ORDERS ATTRIBUTES ---');
  await createAttr('orders', 'string', 'orderCode', 255);
  await createAttr('orders', 'string', 'cargoId', 255);
  await createAttr('orders', 'string', 'cargoTitle', 255);
  await createAttr('orders', 'string', 'category', 255);
  await createAttr('orders', 'float', 'weightKg');
  await createAttr('orders', 'float', 'volumeM3');
  await createAttr('orders', 'string', 'paymentMethod', 255);
  await createAttr('orders', 'string', 'urgency', 255);
  await createAttr('orders', 'boolean', 'hasDocuments');
  await createAttr('orders', 'string', 'ownerId', 255);
  await createAttr('orders', 'string', 'ownerName', 255);
  await createAttr('orders', 'string', 'ownerPhone', 255);
  await createAttr('orders', 'string', 'driverId', 255);
  await createAttr('orders', 'string', 'driverName', 255);
  await createAttr('orders', 'string', 'driverPhone', 255);
  await createAttr('orders', 'string', 'vehicleModel', 255);
  await createAttr('orders', 'string', 'vehiclePlate', 255);
  await createAttr('orders', 'string', 'transportType', 255);
  await createAttr('orders', 'string', 'pickupCity', 255);
  await createAttr('orders', 'string', 'pickupAddress', 500);
  await createAttr('orders', 'string', 'deliveryCity', 255);
  await createAttr('orders', 'string', 'deliveryAddress', 500);
  await createAttr('orders', 'integer', 'agreedPriceUzs');
  await createAttr('orders', 'integer', 'distanceKm');
  await createAttr('orders', 'string', 'status', 255);
  await createAttr('orders', 'float', 'driverLat');
  await createAttr('orders', 'float', 'driverLng');
  await createAttr('orders', 'integer', 'driverSpeed');

  console.log('\n--- 5. MESSAGES ATTRIBUTES ---');
  await createAttr('messages', 'string', 'orderId', 255);
  await createAttr('messages', 'string', 'senderId', 255);
  await createAttr('messages', 'string', 'senderRole', 255);
  await createAttr('messages', 'string', 'senderName', 255);
  await createAttr('messages', 'string', 'text', 4000);
  await createAttr('messages', 'boolean', 'isRead');

  console.log('\n🎉 TABRIKLAYMIZ! BARCHA JADVALLAR VA USTUNLAR TO\'LIQ YARATILDI!');
}

const key = process.argv[2] || process.env.APPWRITE_API_KEY;
if (key) {
  setupWithKey(key);
} else {
  console.log('Usage: node setup_complete_appwrite.cjs <API_KEY>');
}
