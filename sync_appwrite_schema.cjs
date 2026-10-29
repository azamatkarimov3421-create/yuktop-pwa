const { Client, TablesDB } = require('node-appwrite');

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ae2ea99001accd5eab5';
const DATABASE_ID = 'yuktop_db';
const API_KEY = process.argv[2] || process.env.APPWRITE_API_KEY;

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const tdb = new TablesDB(client);
const wait = ms => new Promise(r => setTimeout(r, ms));

async function createCol(tbl, type, key, size = 255) {
  try {
    if (type === 'string') await tdb.createStringColumn(DATABASE_ID, tbl, key, size, false);
    else if (type === 'float') await tdb.createFloatColumn(DATABASE_ID, tbl, key, false);
    else if (type === 'integer') await tdb.createIntegerColumn(DATABASE_ID, tbl, key, false);
    else if (type === 'boolean') await tdb.createBooleanColumn(DATABASE_ID, tbl, key, false);
    console.log(`✅ [${tbl}] + ${key} (${type})`);
  } catch (err) {
    if (err.code === 409) {
      console.log(`ℹ️ [${tbl}] ${key} mavjud`);
    } else {
      console.error(`⚠️ [${tbl}] ${key}:`, err.message);
    }
  }
  await wait(400);
}

async function run() {
  console.log('--- 1. CARGOS USTUNLARINI TO\'LDIRISH ---');
  await createCol('cargos', 'string', 'loadType', 100);
  await createCol('cargos', 'string', 'pickupTimeWindow', 100);
  await createCol('cargos', 'string', 'deliveryTimeWindow', 100);
  await createCol('cargos', 'string', 'status', 100);
  await createCol('cargos', 'integer', 'bidsCount');

  console.log('\n--- 2. CARRIER_TRIPS USTUNLARINI YARATISH ---');
  const cols = [
    ['driverId', 'string', 255],
    ['driverName', 'string', 255],
    ['driverPhone', 'string', 255],
    ['driverTelegram', 'string', 255],
    ['driverRating', 'float'],
    ['vehicleModel', 'string', 255],
    ['vehiclePlate', 'string', 255],
    ['transportType', 'string', 255],
    ['totalCapacityTon', 'float'],
    ['availableCapacityTon', 'float'],
    ['totalVolumeM3', 'float'],
    ['availableVolumeM3', 'float'],
    ['departureCity', 'string', 255],
    ['departureAddress', 'string', 500],
    ['departureLat', 'float'],
    ['departureLng', 'float'],
    ['destinationCity', 'string', 255],
    ['destinationAddress', 'string', 500],
    ['destinationLat', 'float'],
    ['destinationLng', 'float'],
    ['departureDate', 'string', 255],
    ['departureTimeWindow', 'string', 255],
    ['deliveryDate', 'string', 255],
    ['deliveryTimeWindow', 'string', 255],
    ['pricePerTonUzs', 'integer'],
    ['totalTripPriceUzs', 'integer'],
    ['isConsolidated', 'boolean'],
    ['maxShippersCount', 'integer'],
    ['currentShippersCount', 'integer'],
    ['specialNotes', 'string', 2048],
    ['status', 'string', 100]
  ];

  for (const [key, type, size] of cols) {
    await createCol('carrier_trips', type, key, size);
  }

  console.log('\n🎉 TABRIKLAYMIZ: BARCHA JADVALLAR VA USTUNLAR TO\'LIQ TAYYOR!');
}

run();
