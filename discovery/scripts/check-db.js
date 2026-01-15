const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Manuel .env parsing because dotenv might not be installed
try {
    const envPath = path.join(__dirname, '..', '.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const match = line.match(/^([^=]+)=(.*)$/);
            if (match) {
                const key = match[1].trim();
                const value = match[2].trim().replace(/^['"]|['"]$/g, '');
                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
        console.log('✅ Fichier .env chargé');
    } else {
        console.log('ℹ️ Aucun fichier .env trouvé à la racine');
    }
} catch (e) {
    console.log('⚠️ Erreur lors de la lecture du .env:', e.message);
}

async function testConnection() {
    const config = {
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'discovery',
    };

    console.log('--- Diagnostic MySQL ---');
    console.log(`Tentative de connexion à: ${config.host} (utilisateur: ${config.user})`);
    console.log(`Base de données: ${config.database}`);

    try {
        const connection = await mysql.createConnection(config);
        console.log('✅ Connexion réussie !');

        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables trouvées:', rows.map(r => Object.values(r)[0]).join(', ') || 'Aucune table');

        await connection.end();
    } catch (err) {
        console.error('❌ Échec de la connexion');
        console.error('Code d\'erreur:', err.code);
        console.error('Message:', err.message);

        if (err.code === 'ECONNREFUSED') {
            console.log('\nCONSEIL: Le serveur MySQL ne semble pas démarré sur cet hôte/port.');
        } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\nCONSEIL: L\'utilisateur ou le mot de passe est incorrect.');
        } else if (err.code === 'ER_BAD_DB_ERROR') {
            console.log('\nCONSEIL: La base de données "discovery" n\'existe pas. Créez-la avec "CREATE DATABASE discovery;".');
        }
    }
}

testConnection();
