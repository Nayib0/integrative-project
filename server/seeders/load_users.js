/* This script is responsible for loading users into the database */
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { pool } from "../conexion_db.js";

/**
 * Loads user data from a CSV file into the database.
 * @returns {Promise<void>} A promise that resolves when the data has been loaded.
 */
export async function loadusers() {
    const rutaArchivo = path.resolve('server/data/01_users.csv');
    const users = [];

    const client = await pool.connect();
    
    try {
        // Step 1: Clean the 'users' table and related dependencies.
        // This ensures the database is in a clean state before seeding.
        // The `CASCADE` option removes dependent foreign key constraints.
        await client.query('TRUNCATE TABLE learnex.users RESTART IDENTITY CASCADE');
        console.log("✅ The 'users' table has been successfully cleaned.");
        
        // Step 2: Read data from the CSV file.
        await new Promise((resolve, reject) => {
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
                .on('end', resolve)
                .on('error', reject);
        });

        // Step 3: Insert each row into the 'users' table.
        // The `ON CONFLICT DO NOTHING` clause is no longer strictly necessary
        // because the table is truncated, but it's a good practice for resilience.
        for (const row of users) {
            await client.query(
                'INSERT INTO learnex.users (id_user, name, last_name, mail, password, rol, state) VALUES ($1, $2, $3, $4, $5, $6, $7) ON CONFLICT (mail) DO NOTHING',
                row
            );
        }

        console.log(`✅ ${users.length} users were successfully inserted.`);

    } catch (error) {
        console.error('❌ Error executing seeders:', error.message);
        throw error;
    } finally {
        // Always release the client to the pool.
        client.release();
    }
}