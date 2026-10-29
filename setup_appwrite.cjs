// setup_appwrite.cjs
// Script to automatically create database, collections and attributes if an API Key is provided
const { Client, Databases, Permission, Role } = require('node-appwrite');

const ENDPOINT = 'https://fra.cloud.appwrite.io/v1';
const PROJECT_ID = '6ae2ea99001accd5eab5';
const DATABASE_ID = 'yuktop_db';

const API_KEY = process.env.APPWRITE_API_KEY || process.argv[2];

if (!API_KEY) {
  console.log('Iltimos API Key kiriting: node setup_appwrite.cjs <API_KEY>');
  process.exit(1);
}

const client = new Client()
  .setEndpoint(ENDPOINT)
  .setProject(PROJECT_ID)
  .setKey(API_KEY);

const db = new Databases(client);

async function run() {
  console.log('1. Database yaratilmoqda...');
  try {
    await db.create(DATABASE_ID, 'Yuktop Logistics DB');
    console.log('✅ Database yaratildi: ' + DATABASE_ID);
  } catch (e) {
    if (e.code === 409) {
      console.log('ℹ️ Database allaqachon mavjud.');
    } else {
      console.error('Database xatolik:', e.message);
    }
  }

  const collections = [
    { id: 'cargos', name: 'Cargos' },
    { id: 'bids', name: 'Bids' },
    { id: 'orders', name: 'Orders' },
    { id: 'messages', name: 'Messages' }
  ];

  for (const col of collections) {
    console.log(`2. Collection yaratilmoqda: ${col.id}...`);
    try {
      await db.createCollection(
        DATABASE_ID,
        col.id,
        col.name,
        [
          Permission.read(Role.any()),
          Permission.create(Role.any()),
          Permission.update(Role.any()),
          Permission.delete(Role.any())
        ]
      );
      console.log(`✅ Collection yaratildi: ${col.id}`);
    } catch (e) {
      if (e.code === 409) {
        console.log(`ℹ️ Collection ${col.id} allaqachon mavjud.`);
      } else {
        console.error(`Collection ${col.id} xatolik:`, e.message);
      }
    }
  }

  console.log('🎉 Barcha jadvallar va ruxsatlar tayyor bo\'ldi!');
}

run();
