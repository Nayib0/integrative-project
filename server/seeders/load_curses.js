/* is responsible for loading curses into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadcurses() {
    const rutaArchivo = path.resolve('server/data/02_curses.csv');
    const curses = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ";" }))
            .on("data", (fila) => {
                curses.push([
                    fila.id_curse,
                    fila.grade,
                    fila.school_year]);
            })
            .on('end', async () => {
                try {
                    const client = await pool.connect();
                    for (const row of curses) {
                        await client.query(
                            'INSERT INTO learnex.curses (id_curse,grade,school_year) VALUES ($1,$2,$3) ON CONFLICT (id_curse) DO NOTHING',
                            row
                        );
                    }
                    client.release();
                    console.log(`✅ were inserted ${curses.length} curses.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting curses:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => reject(err));
    });
}
