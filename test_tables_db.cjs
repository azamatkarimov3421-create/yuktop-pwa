const { Client, TablesDB, Permission, Role } = require('node-appwrite');

const client = new Client()
  .setEndpoint('https://fra.cloud.appwrite.io/v1')
  .setProject('6ae2ea99001accd5eab5')
  .setKey('standard_b6fbf98f870277e0571140246ca6a5b5062b97d022acd115febdcd52f40d64ec998f21b697b7ad44f7d297828bb56422e58ff950eb933c3dbe6359e5a511597d97c60e4661e46dae731841815a65917655d9e2218e2227c4c3428c4b784da22813d51259fea698e89e0ca7ed951f92b984ee40af33d164b5b097885ddd76695e');

const tables = new TablesDB(client);

async function test() {
  try {
    const res = await tables.createTable('yuktop_db', 'cargos', 'Cargos', [
      Permission.read(Role.any()),
      Permission.create(Role.any()),
      Permission.update(Role.any()),
      Permission.delete(Role.any())
    ]);
    console.log('TABLE CARGOS CREATED SUCCESSFULLY!', res);
  } catch (err) {
    console.log('Error:', err.code, err.message);
  }
}

test();
