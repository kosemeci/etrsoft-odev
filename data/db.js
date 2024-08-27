const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',     
    host: 'localhost',           
    database: 'postgis_34_sample',   
    password: '123456',  
    port: 5432,                  
});

pool.on('connect', () => {
    console.log('Veritabanı bağlantısı başarılı.');
});

pool.on('error', (err) => {
    console.error('Veritabanı bağlantı hatası:', err);
});

module.exports = pool;
