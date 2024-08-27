const express = require("express");
const axios = require('axios');
const https = require('https');
const { Pool } = require('pg');
const pool = require('../data/db');
const router = express.Router();
const cron = require('node-cron');


const agent = new https.Agent({  
  rejectUnauthorized: false
});

const username = 'apitest';
const password = 'test123';

async function fetchDataAndUpdateDB() {
    try {
        const tokenResponse = await axios.post(
            'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/sessions',
            {},
            {
                httpsAgent: agent,
                headers: {
                    'Authorization': 'Basic ' + Buffer.from(username + ':' + password).toString('base64'),
                    'Content-Type': 'application/json'
                }
            }
        );

        const token = tokenResponse.data.response.token;

        const dataResponse = await axios.patch(
            'https://efatura.etrsoft.com/fmi/data/v1/databases/testdb/layouts/testdb/records/1',
            {
                "fieldData": {},
                "script": "getData"
            },
            {
                httpsAgent: agent,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const data = dataResponse.data.response.scriptResult;
        const fetchedData = JSON.parse(data);

        for (const item of fetchedData) {
            const hesap_kodu = item.hesap_kodu;
            const borc = item.borc === '' ? 0 : parseFloat(item.borc);

            const checkQuery = 'SELECT COUNT(*) FROM data WHERE hesap_kodu = $1';
            const checkResult = await pool.query(checkQuery, [hesap_kodu]);

            if (parseInt(checkResult.rows[0].count) > 0) {
                const updateQuery = 'UPDATE data SET borcu = $1 WHERE hesap_kodu = $2';
                await pool.query(updateQuery, [borc, hesap_kodu]);
            } else {
                const insertQuery = 'INSERT INTO data (hesap_kodu, borcu) VALUES ($1, $2)';
                await pool.query(insertQuery, [hesap_kodu, borc]);
            }
        }
    } catch (error) {
        console.error('Error:', error.message);
    }
}

router.use('/', async (req, res) => {
    try {
        cron.schedule('*/30 * * * *', fetchDataAndUpdateDB);

        const query = `
    SELECT 
        "hesap_kodu","borcu",
        split_part("hesap_kodu", '.', 1) AS level_1,
        split_part("hesap_kodu", '.', 1) || '.' || split_part("hesap_kodu", '.', 2) AS level_2
    FROM 
        data
    ORDER BY 
        "hesap_kodu"
`;

    const result = await pool.query(query);
    res.render('index', { data: result.rows });
    } catch (error) {
        console.error('Veri çekme hatası:', error.message);
        res.status(500).send('Veri çekme işlemi başarısız.');
    }
});

module.exports = router;