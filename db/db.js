const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./db/db.json');
const db = low(adapter);

// admin@admin - для того, чтоб попасть на страницу админки (и никто другой под этим именем не зарегистрировался)
db.defaults({ users:
    [{ name: 'admin@admin', password: 'sha1$8f53e4db$1$55f19543380d2775c86c51f6cd1a7e98e3cbc31d' }] }).write();

module.exports = db;
