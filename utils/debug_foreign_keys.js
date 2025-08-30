import { pool } from "./server/conexion_db.js";
import fs from 'fs';
import csv from 'csv-parser';

async function debugForeignKeys() {
    const client = await pool.connect();
    
    try {
        // 1. Check which users exist in the database
        const usersResult = await client.query('SELECT id_user FROM learnex.users ORDER BY id_user');
        const existingUsers = usersResult.rows.map(row => row.id_user);
        console.log('👥 Usuarios existentes en DB:', existingUsers.slice(0, 10), '... (total:', existingUsers.length, ')');
        
        // 2. Read the CSV from students _curses
        const studentsFromCSV = [];
        await new Promise((resolve, reject) => {
            fs.createReadStream('server/data/06_students_curses.csv')
                .pipe(csv({ separator: ";" }))
                .on("data", (row) => {
                    studentsFromCSV.push(parseInt(row.id_user));
                })
                .on('end', resolve)
                .on('error', reject);
        });
        
        console.log('📄 IDs de usuario en students_curses CSV:', [...new Set(studentsFromCSV)].sort((a,b) => a-b));
        
        // 3. Finding IDs that don't exist
        const missingUsers = studentsFromCSV.filter(id => !existingUsers.includes(id));
        const uniqueMissing = [...new Set(missingUsers)];
        
        if (uniqueMissing.length > 0) {
            console.log('❌ IDs de usuario que NO existen en la tabla users:', uniqueMissing);
        } else {
            console.log('✅ Todos los IDs de usuario existen en la tabla users');
        }
        
        // 4. Check courses
        const cursesResult = await client.query('SELECT id_curse FROM learnex.curses ORDER BY id_curse');
        const existingCurses = cursesResult.rows.map(row => row.id_curse);
        console.log('📚 Cursos existentes:', existingCurses);
        
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        client.release();
        process.exit(0);
    }
}

debugForeignKeys();