import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Manual env loading helper
const loadEnvManually = () => {
    // Only attempt to load if critical env vars are missing, e.g., MYSQL_PASSWORD
    if (process.env.MYSQL_PASSWORD) return;

    try {
        const paths = ['.env.local', '.env'];
        for (const file of paths) {
            const p = path.resolve(process.cwd(), file);
            if (fs.existsSync(p)) {
                const content = fs.readFileSync(p, 'utf8');
                content.split('\n').forEach(line => {
                    const match = line.match(/^([^=]+)=(.*)$/);
                    if (match) {
                        const key = match[1].trim();
                        const val = match[2].trim().replace(/^['"]|['"]$/g, '');
                        // Only set if the environment variable is not already defined
                        if (!process.env[key]) {
                            process.env[key] = val;
                            if (key === 'MYSQL_PASSWORD') {
                                console.log('⚠️ Manual .env load: Found MYSQL_PASSWORD in ' + p);
                            }
                        }
                    }
                });
            }
        }
    } catch (e) {
        console.error('Manual env loading failed:', e);
    }
};

// Attempt to load envs before creating the pool
loadEnvManually();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'discovery',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log('🔌 Database config:', {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    database: process.env.MYSQL_DATABASE || 'discovery',
    port: process.env.MYSQL_PORT || 3306,
    passwordSet: !!process.env.MYSQL_PASSWORD
});

export async function query(sql: string, params?: any[]) {
    const [results] = await pool.execute(sql, params);
    return results;
}

export default pool;
