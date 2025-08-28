/* is responsible for loading users into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadusers() {
    const rutaArchivo = path.resolve('server/data/01_users.csv');
    const users = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ";" }))
            .on("data", (fila) => {
                users.push([
                    fila.id_user, 
                    fila.name, 
                    fila.last_name,
                    fila.mail, 
                    fila.password, 
                    fila.rol, 
                    fila.state
                ]);
            })
            .on('end', async () => {
                try {
                    const client = await pool.connect();
                    for (const row of users) {
                        await client.query(
                            'INSERT INTO learnex.users (id_user,name,last_name,mail,password,rol,state) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id_user) DO NOTHING',
                            row
                        );
                    }
                    client.release();
                    console.log(`✅ were inserted ${users.length} users.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting users:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => reject(err));
    });
}
