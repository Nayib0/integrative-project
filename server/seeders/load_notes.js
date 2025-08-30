/* is responsible for loading notes into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

// helper functions for cleaning data
function cleanInt(value) {
    if (!value || value.trim() === "") return null;
    return parseInt(value.toString().replace(/[^0-9]/g, ""), 10);
}

function cleanFloat(value) {
    if (!value || value.trim() === "") return null;
    return parseFloat(value.toString().replace(",", "."));
}

export async function loadnotes() {
    const rutaArchivo = path.resolve('server/data/05_notes.csv');
    const notes = [];
    
    return new Promise((resolve, reject) => {
        fs.createReadStream(rutaArchivo)
            .pipe(csv({ separator: ";" }))
            .on("data", (fila) => {
                if (!isNaN(parseInt(fila.id_note))) {
                notes.push([
                    cleanInt(fila.id_note), 
                    cleanInt(fila.id_student), 
                    cleanInt(fila.id_cst),
                    cleanFloat(fila.calification)
                    ]);    
                }

            })
            .on('end', async () => {
                try {
                    const client = await pool.connect();
                    for (const row of notes) {
                        await client.query(
                            'INSERT INTO learnex.notes (id_note,id_student,id_cst,calification) VALUES ($1,$2,$3,$4) ON CONFLICT (id_note) DO NOTHING',
                            row
                        );
                    }
                    client.release();
                    console.log(`✅ were inserted ${notes.length} notes.`);
                    resolve();
                } catch (error) {
                    console.error('❌ Error inserting notes:', error.message);
                    reject(error);
                }
            })
            .on('error', (err) => reject(err));
    });
}
