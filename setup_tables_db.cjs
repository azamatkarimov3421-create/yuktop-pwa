const { Client, TablesDB, Permission, Role } = require('node-appwrite');

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ae2ea99001accd5eab5';
const DATABASE_ID = 'yuktop_db';
const API_KEY = 'standard_b6fbf98f870277e0571140246ca6a5b5062b97d022acd115febdcd52f40d64ec998f21b697b7ad44f7d297828bb56422e58ff950eb933c3dbe6359e5a511597d97c60e4661e46dae731841815a65917655d9e2218e2227c4c3428c4b784da22813d51259fea698e89e0ca7ed951f92b984ee40af33d164b5b097885ddd76695e';

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const tables = new TablesDB(client);

const wait = ms => new Promise(r => setTimeout(r, ms));

const permissions = [
  Permission.read(Role.any()),
  Permission.create(Role.any()),
  Permission.update(Role.any()),
  Permission.delete(Role.any())
];

async function ensureTable(tableId, name) {
  try {
    await tables.createTable(DATABASE_ID, tableId, name, permissions);
    console.log(`✅ Table [${tableId}] yaratildi.`);
  } catch (e) {
    if (e.code === 409) {
      console.log(`ℹ️ Table [${tableId}] mavjud.`);
    } else {
      console.warn(`Table [${tableId}] xatolik:`, e.message);
    }
  }
  await wait(500);
}

async function addCol(tableId, type, key, size = 255) {
  try {
    if (type === 'string') {
      await tables.createStringColumn(DATABASE_ID, tableId, key, size, false);
    } else if (type === 'integer') {
      await tables.createIntegerColumn(DATABASE_ID, tableId, key, false);
    } else if (type === 'float') {
      await tables.createFloatColumn(DATABASE_ID, tableId, key, false);
    } else if (type === 'boolean') {
      await tables.createBooleanColumn(DATABASE_ID, tableId, key, false);
    }
    console.log(`  + [${tableId}] ${key} (${type})`);
  } catch (e) {
    if (e.code === 409) {
      // already exists
    } else {
      console.warn(`  ! Col [${tableId}] ${key}:`, e.message);
    }
  }
  await wait(300);
}

async function main() {
  console.log('--- 1. JADVALLARNI YARATISH ---');
  await ensureTable('cargos', 'Cargos');
  await ensureTable('bids', 'Bids');
  await ensureTable('orders', 'Orders');
  await ensureTable('messages', 'Messages');

  console.log('\n--- 2. CARGOS USTUNLARI ---');
  await addCol('cargos', 'string', 'ownerId', 255);
  await addCol('cargos', 'string', 'ownerName', 255);
  await addCol('cargos', 'string', 'ownerPhone', 255);
  await addCol('cargos', 'string', 'ownerTelegram', 255);
  await addCol('cargos', 'string', 'title', 255);
  await addCol('cargos', 'string', 'category', 255);
  await addCol('cargos', 'string', 'imageUrl', 2048);
  await addCol('cargos', 'float', 'weightKg');
  await addCol('cargos', 'float', 'volumeM3');
  await addCol('cargos', 'string', 'pickupCity', 255);
  await addCol('cargos', 'string', 'pickupAddress', 500);
  await addCol('cargos', 'float', 'pickupLat');
  await addCol('cargos', 'float', 'pickupLng');
  await addCol('cargos', 'string', 'deliveryCity', 255);
  await addCol('cargos', 'string', 'deliveryAddress', 500);
  await addCol('cargos', 'float', 'deliveryLat');
  await addCol('cargos', 'float', 'deliveryLng');
  await addCol('cargos', 'string', 'pickupDate', 255);
  await addCol('cargos', 'string', 'deliveryDate', 255);
  await addCol('cargos', 'integer', 'priceUzs');
  await addCol('cargos', 'string', 'paymentMethod', 255);
  await addCol('cargos', 'string', 'urgency', 255);
  await addCol('cargos', 'boolean', 'hasDocuments');
  await addCol('cargos', 'integer', 'distanceKm');
  await addCol('cargos', 'integer', 'durationMinutes');
  await addCol('cargos', 'string', 'specialNotes', 2048);
  await addCol('cargos', 'string', 'status', 255);
  await addCol('cargos', 'integer', 'bidsCount');

  console.log('\n--- 3. BIDS USTUNLARI ---');
  await addCol('bids', 'string', 'cargoId', 255);
  await addCol('bids', 'string', 'driverId', 255);
  await addCol('bids', 'string', 'driverName', 255);
  await addCol('bids', 'string', 'driverPhone', 255);
  await addCol('bids', 'string', 'driverTelegram', 255);
  await addCol('bids', 'float', 'driverRating');
  await addCol('bids', 'string', 'vehicleModel', 255);
  await addCol('bids', 'string', 'vehiclePlate', 255);
  await addCol('bids', 'string', 'transportType', 255);
  await addCol('bids', 'float', 'vehicleCapacityTon');
  await addCol('bids', 'integer', 'offeredPriceUzs');
  await addCol('bids', 'string', 'proposedDate', 255);
  await addCol('bids', 'integer', 'counterPriceUzs');
  await addCol('bids', 'string', 'counterNote', 2048);
  await addCol('bids', 'string', 'status', 255);

  console.log('\n--- 4. ORDERS USTUNLARI ---');
  await addCol('orders', 'string', 'orderCode', 255);
  await addCol('orders', 'string', 'cargoId', 255);
  await addCol('orders', 'string', 'cargoTitle', 255);
  await addCol('orders', 'string', 'category', 255);
  await addCol('orders', 'float', 'weightKg');
  await addCol('orders', 'float', 'volumeM3');
  await addCol('orders', 'string', 'paymentMethod', 255);
  await addCol('orders', 'string', 'urgency', 255);
  await addCol('orders', 'boolean', 'hasDocuments');
  await addCol('orders', 'string', 'ownerId', 255);
  await addCol('orders', 'string', 'ownerName', 255);
  await addCol('orders', 'string', 'ownerPhone', 255);
  await addCol('orders', 'string', 'driverId', 255);
  await addCol('orders', 'string', 'driverName', 255);
  await addCol('orders', 'string', 'driverPhone', 255);
  await addCol('orders', 'string', 'vehicleModel', 255);
  await addCol('orders', 'string', 'vehiclePlate', 255);
  await addCol('orders', 'string', 'transportType', 255);
  await addCol('orders', 'string', 'pickupCity', 255);
  await addCol('orders', 'string', 'pickupAddress', 500);
  await addCol('orders', 'string', 'deliveryCity', 255);
  await addCol('orders', 'string', 'deliveryAddress', 500);
  await addCol('orders', 'integer', 'agreedPriceUzs');
  await addCol('orders', 'integer', 'distanceKm');
  await addCol('orders', 'string', 'status', 255);
  await addCol('orders', 'float', 'driverLat');
  await addCol('orders', 'float', 'driverLng');
  await addCol('orders', 'integer', 'driverSpeed');

  console.log('\n--- 5. MESSAGES USTUNLARI ---');
  await addCol('messages', 'string', 'orderId', 255);
  await addCol('messages', 'string', 'senderId', 255);
  await addCol('messages', 'string', 'senderRole', 255);
  await addCol('messages', 'string', 'senderName', 255);
  await addCol('messages', 'string', 'text', 4000);
  await addCol('messages', 'boolean', 'isRead');

  console.log('\n🎉 BARCHA JADVALLAR VA USTUNLAR TO\'LIQ VA MUVAFFAQIYATLI YARATILDI!');
}

main().catch(console.error);
