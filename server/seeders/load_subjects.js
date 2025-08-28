/* is responsible for loading subjects into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadsubjects() {
    const rutaArchivo = path.resolve('server/data/03_subjects.csv');
    const subjects = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ";" }))
            .on("data", (fila) => {
                subjects.push([
                    fila.id_subjects, 
                    fila.name_subject]);
            })
            .on('end', async () => {
                try {
                    const client = await pool.connect();
                    for (const row of subjects) {
                        await client.query(
                            'INSERT INTO learnex.subjects (id_subjects,name_subject) VALUES ($1,$2) ON CONFLICT (id_subjects) DO NOTHING',
                            row
                        );
                    }
                    client.release();
                    console.log(`✅ were inserted ${subjects.length} subjects.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting subjects:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => reject(err));
    });
}
