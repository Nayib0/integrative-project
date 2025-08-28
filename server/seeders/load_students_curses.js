/* is responsible for loading students_curses into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

export async function loadstudentscurses() {
    const rutaArchivo = path.resolve('server/data/06_students_curses.csv');
    const students_curses = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ";" }))
            .on("data", (fila) => {
                students_curses.push([
                    fila.id_student_curse, 
                    fila.id_user, 
                    fila.id_curse]);
            })
            .on('end', async () => {
                try {
                    const client = await pool.connect();
                    for (const row of students_curses) {
                        await client.query(
                            'INSERT INTO learnex.students_curses (id_student_curse,id_user,id_curse) VALUES ($1,$2,$3) ON CONFLICT (id_student_curse) DO NOTHING',
                            row
                        );
                    }
                    client.release();
                    console.log(`✅ were inserted ${students_curses.length} students_curses.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting students_curses:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => reject(err));
    });
}
