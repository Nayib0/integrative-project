/* is responsible for loading curse_subject_teacher into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadcst() {
    const rutaArchivo = path.resolve('server/data/04_curse_subject_teacher.csv');
    const curse_s_t = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ";" }))
            .on("data", (fila) => {
                curse_s_t.push([
                    fila.id_cst,
                    fila.id_curse, 
                    fila.id_subject.replace(/[^0-9]/g, ""), //  extracts only the number, 
                    fila.id_teacher]);
            })
            .on('end', async () => {
                try {
                    const client = await pool.connect();
                    for (const row of curse_s_t) {
                        await client.query(
                            'INSERT INTO learnex.curse_subject_teacher (id_cst,id_curse,id_subject,id_teacher) VALUES ($1,$2,$3,$4) ON CONFLICT (id_cst) DO NOTHING',
                            row
                        );
                    }
                    client.release();
                    console.log(`✅ were inserted ${curse_s_t.length} curse_subject_teacher.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting curse_subject_teacher:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => reject(err));
    });
}
