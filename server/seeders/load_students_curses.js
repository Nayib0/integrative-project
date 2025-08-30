/* This script is responsible for loading students_curses into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

/**
 * Loads students_curses data from a CSV file into the database.
 * @returns {Promise<void>} A promise that resolves when the data has been loaded.
 */
export async function loadstudentscurses() {
    const rutaArchivo = path.resolve('server/data/06_students_curses.csv');
    const students_curses = [];
    const client = await pool.connect();
    
    try {
        // Step 1: Clean the 'students_curses' table and related dependencies.
        await client.query('TRUNCATE TABLE learnex.students_curses RESTART IDENTITY CASCADE');
        console.log("✅ The 'students_curses' table has been successfully cleaned.");

        // Step 2: Read data from the CSV file.
        await new Promise((resolve, reject) => {
            fs.createReadStream(rutaArchivo)
                .pipe(csv({ separator: ";" }))
                .on("data", (fila) => {
                    students_curses.push([
                        fila.id_student_curse, 
                        fila.id_user, 
                        fila.id_curse
                    ]);
                })
                .on('end', resolve)
                .on('error', reject);
        });

        // Step 3: Insert each row into the 'students_curses' table.
        for (const row of students_curses) {
            await client.query(
                'INSERT INTO learnex.students_curses (id_student_curse, id_user, id_curse) VALUES ($1, $2, $3) ON CONFLICT (id_student_curse) DO NOTHING',
                row
            );
        }

        console.log(`✅ ${students_curses.length} students_curses were successfully inserted.`);

    } catch (error) {
        console.error('❌ Error inserting students_curses:', error.message);
        throw error;
    } finally {
        client.release();
    }
}